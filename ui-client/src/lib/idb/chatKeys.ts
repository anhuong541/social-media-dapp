"use client";

import { createStore, del, get, set } from "idb-keyval";
import {
  CHAT_IDB_DATABASE,
  CHAT_IDB_PRIVATE_KEY_PREFIX,
  CHAT_IDB_PUBLIC_KEY_PREFIX,
} from "@/constants/convex";
import { normalizeWallet } from "@/lib/wallet";

const chatKeyStore = createStore(CHAT_IDB_DATABASE, "keys");

function privateKeyIdbKey(walletAddress: string): string {
  return `${CHAT_IDB_PRIVATE_KEY_PREFIX}${normalizeWallet(walletAddress)}`;
}

function publicKeyIdbKey(walletAddress: string): string {
  return `${CHAT_IDB_PUBLIC_KEY_PREFIX}${normalizeWallet(walletAddress)}`;
}

export type StoredChatKeyRecord = {
  walletAddress: string;
  /** sjcl ciphertext JSON string */
  encryptedPrivateKey: string;
  publicKey: string;
  updatedAt: number;
};

export async function getStoredChatKey(
  walletAddress: string
): Promise<StoredChatKeyRecord | null> {
  if (!walletAddress) return null;
  const value = await get<StoredChatKeyRecord>(
    privateKeyIdbKey(walletAddress),
    chatKeyStore
  );
  return value ?? null;
}

export async function hasStoredChatKey(walletAddress: string): Promise<boolean> {
  const record = await getStoredChatKey(walletAddress);
  return Boolean(record?.encryptedPrivateKey);
}

export async function saveStoredChatKey(
  walletAddress: string,
  encryptedPrivateKey: string,
  publicKey: string
): Promise<StoredChatKeyRecord> {
  const record: StoredChatKeyRecord = {
    walletAddress: normalizeWallet(walletAddress),
    encryptedPrivateKey,
    publicKey: publicKey.trim(),
    updatedAt: Date.now(),
  };
  await set(privateKeyIdbKey(walletAddress), record, chatKeyStore);
  await set(publicKeyIdbKey(walletAddress), record.publicKey, chatKeyStore);
  return record;
}

export async function getCachedPublicKey(
  walletAddress: string
): Promise<string | null> {
  const value = await get<string>(publicKeyIdbKey(walletAddress), chatKeyStore);
  if (value) return value;
  const record = await getStoredChatKey(walletAddress);
  return record?.publicKey ?? null;
}

export async function clearStoredChatKey(walletAddress: string): Promise<void> {
  await del(privateKeyIdbKey(walletAddress), chatKeyStore);
  await del(publicKeyIdbKey(walletAddress), chatKeyStore);
}

/**
 * One-time migrate of the legacy localStorage encrypted private key into IndexedDB.
 * Does not register the public key on Convex — caller should upsert after unlock/save.
 */
export async function migrateLegacyLocalStorageKey(
  walletAddress: string
): Promise<string | null> {
  if (typeof window === "undefined" || !walletAddress) return null;

  const existing = await getStoredChatKey(walletAddress);
  if (existing?.encryptedPrivateKey) return existing.encryptedPrivateKey;

  const legacy =
    localStorage.getItem(walletAddress) ??
    localStorage.getItem(normalizeWallet(walletAddress));
  if (!legacy) return null;

  // Public key unknown until unlock; store ciphertext only.
  await saveStoredChatKey(walletAddress, legacy, "");
  return legacy;
}
