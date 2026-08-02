"use client";

import { useCallback } from "react";
import {
  isConvexConfigured,
  SIWE_SESSION_STORAGE_KEY,
} from "@/constants/convex";
import { useSiwe } from "@/providers/SiweProvider";

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

/** Ensures a SIWE session token exists (signs in when needed). */
export function useRequireSiweSession() {
  const { sessionToken, signIn, isAuthenticated } = useSiwe();

  const requireSessionToken = useCallback(async () => {
    if (!isConvexConfigured) {
      throw new Error("Convex is not configured");
    }
    if (sessionToken) return sessionToken;
    const stored = readSessionTokenFromStorage();
    if (stored) return stored;
    const ok = await signIn();
    if (!ok) {
      throw new Error("SIWE sign-in required");
    }
    return readSessionTokenFromStorage();
  }, [sessionToken, signIn]);

  return {
    sessionToken,
    isAuthenticated,
    requireSessionToken,
    signIn,
  };
}
