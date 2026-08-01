/** Public Convex deployment URL (client). Fill via `.env.local`. */
export const CONVEX_URL_ENV_KEY = "NEXT_PUBLIC_CONVEX_URL" as const;

/** Convex CLI deployment name (server/dev). Fill via `.env.local`. */
export const CONVEX_DEPLOYMENT_ENV_KEY = "CONVEX_DEPLOYMENT" as const;

export const isConvexConfigured = Boolean(
  process.env.NEXT_PUBLIC_CONVEX_URL?.trim()
);

export const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL?.trim() ?? "";

/** IndexedDB database name for chat key material. */
export const CHAT_IDB_DATABASE = "social-media-dapp-chat" as const;

/** idb-keyval key prefix for encrypted private keys. */
export const CHAT_IDB_PRIVATE_KEY_PREFIX = "chat:private-key:" as const;

/** Optional public-key cache in IndexedDB. */
export const CHAT_IDB_PUBLIC_KEY_PREFIX = "chat:public-key:" as const;

/** Max messages fetched per conversation query. */
export const CHAT_MESSAGE_LIST_LIMIT = 100 as const;

/**
 * TODO(SIWE): Gate Convex mutations with wallet signature / Convex auth.
 * Phase 1 trusts the wallet address from the connected client.
 */
export const CHAT_AUTH_MODE = "wallet-address-unauthenticated" as const;
