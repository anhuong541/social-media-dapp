"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMutation } from "convex/react";
import { useAccount } from "wagmi";

import { api } from "@/lib/convexApi";
import {
  isConvexConfigured,
  SIWE_SESSION_STORAGE_KEY,
} from "@/constants/convex";
import { decryptPrivateKey, encryptPrivateKey } from "@/lib/enCodePrivateKey";
import { getPublicKeyByPrivate } from "@/lib/encodeMsg";
import {
  getStoredChatKey,
  hasStoredChatKey,
  migrateLegacyLocalStorageKey,
  saveStoredChatKey,
} from "@/lib/idb/chatKeys";
import { normalizeWallet } from "@/lib/wallet";
import { useSiwe } from "@/providers/SiweProvider";

type ChatKeyContextValue = {
  walletAddress: string | undefined;
  hasStoredKey: boolean;
  isUnlocked: boolean;
  privateKey: string | null;
  publicKey: string | null;
  isBusy: boolean;
  error: string | null;
  refreshStoredKeyState: () => Promise<void>;
  saveAndRegisterKey: (
    privateKeyPlain: string,
    password: string
  ) => Promise<boolean>;
  unlockKey: (password: string) => Promise<boolean>;
  lockKey: () => void;
};

const ChatKeyContext = createContext<ChatKeyContextValue | null>(null);

function readSessionTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SIWE_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      sessionToken: string;
      expiresAt: number;
    };
    if (parsed.expiresAt < Date.now()) return null;
    return parsed.sessionToken;
  } catch {
    return null;
  }
}

export function ChatKeyProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { sessionToken, signIn } = useSiwe();
  const walletAddress = address ? normalizeWallet(address) : undefined;
  const upsertPublicKey = useMutation(api.users.upsertPublicKey);

  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lockKey = useCallback(() => {
    setPrivateKey(null);
    setPublicKey(null);
    setError(null);
  }, []);

  const refreshStoredKeyState = useCallback(async () => {
    if (!walletAddress) {
      setHasStoredKey(false);
      return;
    }
    await migrateLegacyLocalStorageKey(walletAddress);
    setHasStoredKey(await hasStoredChatKey(walletAddress));
  }, [walletAddress]);

  useEffect(() => {
    lockKey();
    void refreshStoredKeyState();
  }, [walletAddress, lockKey, refreshStoredKeyState]);

  const ensureSessionToken = useCallback(async () => {
    if (sessionToken) return sessionToken;
    const ok = await signIn();
    if (!ok) return null;
    return readSessionTokenFromStorage();
  }, [sessionToken, signIn]);

  const registerPublicKey = useCallback(
    async (derivedPublicKey: string) => {
      if (!isConvexConfigured || !walletAddress) return true;
      const token = await ensureSessionToken();
      if (!token) {
        setError("SIWE sign-in required before registering public key");
        return false;
      }
      await upsertPublicKey({
        sessionToken: token,
        walletAddress,
        publicKey: derivedPublicKey,
      });
      return true;
    },
    [ensureSessionToken, upsertPublicKey, walletAddress]
  );

  const saveAndRegisterKey = useCallback(
    async (privateKeyPlain: string, password: string) => {
      if (!walletAddress) {
        setError("Connect a wallet first");
        return false;
      }
      setIsBusy(true);
      setError(null);
      try {
        const trimmed = privateKeyPlain.trim();
        const derivedPublicKey = getPublicKeyByPrivate(trimmed);
        const encryptedPrivateKey = String(
          encryptPrivateKey(trimmed, password)
        );

        await saveStoredChatKey(
          walletAddress,
          encryptedPrivateKey,
          derivedPublicKey
        );

        const registered = await registerPublicKey(derivedPublicKey);
        if (!registered) return false;

        setHasStoredKey(true);
        setPrivateKey(trimmed);
        setPublicKey(derivedPublicKey);
        return true;
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to save private key"
        );
        return false;
      } finally {
        setIsBusy(false);
      }
    },
    [registerPublicKey, walletAddress]
  );

  const unlockKey = useCallback(
    async (password: string) => {
      if (!walletAddress) {
        setError("Connect a wallet first");
        return false;
      }
      setIsBusy(true);
      setError(null);
      try {
        const record = await getStoredChatKey(walletAddress);
        if (!record?.encryptedPrivateKey) {
          setError("No private key stored for this wallet");
          return false;
        }

        const decrypted = decryptPrivateKey(
          record.encryptedPrivateKey,
          password
        );
        if (decrypted[0].status !== "success" || !decrypted[0].message) {
          setError("Incorrect password");
          return false;
        }

        const plain = decrypted[0].message as string;
        const derivedPublicKey = getPublicKeyByPrivate(plain);

        if (!record.publicKey) {
          await saveStoredChatKey(
            walletAddress,
            record.encryptedPrivateKey,
            derivedPublicKey
          );
        }

        const registered = await registerPublicKey(derivedPublicKey);
        if (!registered) return false;

        setPrivateKey(plain);
        setPublicKey(derivedPublicKey);
        setHasStoredKey(true);
        return true;
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to unlock private key"
        );
        return false;
      } finally {
        setIsBusy(false);
      }
    },
    [registerPublicKey, walletAddress]
  );

  const value = useMemo<ChatKeyContextValue>(
    () => ({
      walletAddress,
      hasStoredKey,
      isUnlocked: Boolean(privateKey),
      privateKey,
      publicKey,
      isBusy,
      error,
      refreshStoredKeyState,
      saveAndRegisterKey,
      unlockKey,
      lockKey,
    }),
    [
      walletAddress,
      hasStoredKey,
      privateKey,
      publicKey,
      isBusy,
      error,
      refreshStoredKeyState,
      saveAndRegisterKey,
      unlockKey,
      lockKey,
    ]
  );

  return (
    <ChatKeyContext.Provider value={value}>{children}</ChatKeyContext.Provider>
  );
}

export function useChatKey(): ChatKeyContextValue {
  const ctx = useContext(ChatKeyContext);
  if (!ctx) {
    throw new Error("useChatKey must be used within ChatKeyProvider");
  }
  return ctx;
}
