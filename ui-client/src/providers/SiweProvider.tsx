"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useAction, useMutation } from "convex/react";
import { getAddress } from "viem";

import { api } from "@/lib/convexApi";
import { ACTIVE_CHAIN_ID, DAPP_NAME } from "@/constants/app";
import {
  isConvexConfigured,
  SIWE_SESSION_STORAGE_KEY,
  SIWE_STATEMENT,
} from "@/constants/convex";
import { buildSiweMessage } from "@/lib/siweMessage";
import { normalizeWallet } from "@/lib/wallet";

type SiweContextValue = {
  sessionToken: string | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  error: string | null;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
};

const SiweContext = createContext<SiweContextValue | null>(null);

function readStoredSession(wallet?: string): string | null {
  if (typeof window === "undefined" || !wallet) return null;
  try {
    const raw = sessionStorage.getItem(SIWE_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      walletAddress: string;
      sessionToken: string;
      expiresAt: number;
    };
    if (normalizeWallet(parsed.walletAddress) !== normalizeWallet(wallet)) {
      return null;
    }
    if (parsed.expiresAt < Date.now()) return null;
    return parsed.sessionToken;
  } catch {
    return null;
  }
}

function storeSession(
  wallet: string,
  sessionToken: string,
  expiresAt: number
) {
  sessionStorage.setItem(
    SIWE_SESSION_STORAGE_KEY,
    JSON.stringify({
      walletAddress: normalizeWallet(wallet),
      sessionToken,
      expiresAt,
    })
  );
}

function clearStoredSession() {
  sessionStorage.removeItem(SIWE_SESSION_STORAGE_KEY);
}

export function SiweProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const issueNonce = useMutation(api.auth.issueNonce);
  const logout = useMutation(api.auth.logout);
  const verifyLogin = useAction(api.authActions.verifyLogin);

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoTriedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!address) {
      setSessionToken(null);
      autoTriedFor.current = null;
      return;
    }
    setSessionToken(readStoredSession(address));
  }, [address]);

  const signOut = useCallback(async () => {
    if (address && sessionToken && isConvexConfigured) {
      try {
        await logout({ sessionToken, walletAddress: address });
      } catch (err) {
        console.error(err);
      }
    }
    clearStoredSession();
    setSessionToken(null);
  }, [address, logout, sessionToken]);

  const signIn = useCallback(async () => {
    if (!isConvexConfigured) {
      setError("Convex is not configured");
      return false;
    }
    if (!address || !isConnected) {
      setError("Connect a wallet first");
      return false;
    }

    setIsAuthenticating(true);
    setError(null);
    try {
      const checksum = getAddress(address);
      const { nonce } = await issueNonce({ walletAddress: checksum });
      const domain =
        typeof window !== "undefined" ? window.location.host : DAPP_NAME;
      const uri =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost";
      const issuedAt = new Date().toISOString();
      const message = buildSiweMessage({
        domain,
        address: checksum,
        statement: SIWE_STATEMENT,
        uri,
        version: "1",
        chainId: ACTIVE_CHAIN_ID,
        nonce,
        issuedAt,
      });

      const signature = await signMessageAsync({ message });
      const session = await verifyLogin({
        walletAddress: checksum,
        signature,
        nonce,
        domain,
        uri,
        chainId: ACTIVE_CHAIN_ID,
        issuedAt,
        statement: SIWE_STATEMENT,
      });

      storeSession(checksum, session.sessionToken, session.expiresAt);
      setSessionToken(session.sessionToken);
      return true;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "SIWE sign-in failed");
      setSessionToken(null);
      clearStoredSession();
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [address, isConnected, issueNonce, signMessageAsync, verifyLogin]);

  useEffect(() => {
    if (
      !isConvexConfigured ||
      !address ||
      !isConnected ||
      sessionToken ||
      isAuthenticating
    ) {
      return;
    }
    if (autoTriedFor.current === normalizeWallet(address)) return;
    autoTriedFor.current = normalizeWallet(address);
    void signIn();
  }, [address, isAuthenticating, isConnected, sessionToken, signIn]);

  useEffect(() => {
    if (!isConnected) {
      clearStoredSession();
      setSessionToken(null);
      autoTriedFor.current = null;
    }
  }, [isConnected]);

  const value = useMemo<SiweContextValue>(
    () => ({
      sessionToken,
      isAuthenticated: Boolean(sessionToken),
      isAuthenticating,
      error,
      signIn,
      signOut,
    }),
    [sessionToken, isAuthenticating, error, signIn, signOut]
  );

  return <SiweContext.Provider value={value}>{children}</SiweContext.Provider>;
}

export function useSiwe(): SiweContextValue {
  const ctx = useContext(SiweContext);
  if (!ctx) {
    throw new Error("useSiwe must be used within SiweProvider");
  }
  return ctx;
}
