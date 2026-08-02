import type { MutationCtx, QueryCtx } from "../_generated/server";
import { normalizeWallet } from "../lib";

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateSessionToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return bytesToHex(arr);
}

export function generateNonce(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return bytesToHex(arr);
}

export async function hashSessionToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(digest));
}

/**
 * Validates a SIWE session token for the claimed wallet.
 */
export async function requireSiweSession(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string,
  claimedWallet: string
): Promise<string> {
  const walletAddress = normalizeWallet(claimedWallet);
  if (!sessionToken || !walletAddress) {
    throw new Error("SIWE session required");
  }

  const tokenHash = await hashSessionToken(sessionToken);
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
    .unique();

  if (!session) {
    throw new Error("Invalid SIWE session");
  }
  if (session.expiresAt < Date.now()) {
    throw new Error("SIWE session expired");
  }
  if (session.walletAddress !== walletAddress) {
    throw new Error("SIWE session wallet mismatch");
  }

  return walletAddress;
}
