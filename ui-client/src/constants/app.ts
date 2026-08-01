/**
 * Chain / Alchemy / WalletConnect settings for the wagmi stack.
 * Fill API keys in `.env.local` (see `.env.example`).
 */

export const ACTIVE_CHAIN_ID = 80002 as const; // Polygon Amoy

export const TIP_TOKEN_SYMBOL = "POL" as const;

export const ALCHEMY_API_KEY_ENV = "NEXT_PUBLIC_ALCHEMY_API_KEY" as const;
export const WALLETCONNECT_PROJECT_ID_ENV =
  "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID" as const;

export const ALCHEMY_API_KEY =
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY?.trim() ?? "";

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() ?? "";

export const isAlchemyConfigured = Boolean(ALCHEMY_API_KEY);
export const isWalletConnectConfigured = Boolean(WALLETCONNECT_PROJECT_ID);

/** RainbowKit / WalletConnect require a project id; placeholder avoids crash before env is filled. */
export const WALLETCONNECT_PROJECT_ID_OR_PLACEHOLDER =
  WALLETCONNECT_PROJECT_ID || "00000000000000000000000000000000";

export const ALCHEMY_POLYGON_AMOY_HTTP = ALCHEMY_API_KEY
  ? `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  : "https://rpc-amoy.polygon.technology";

export const ALCHEMY_POLYGON_MAINNET_HTTP = ALCHEMY_API_KEY
  ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  : "https://polygon-rpc.com";

export const DAPP_NAME = "Social Media DApp" as const;

/** Temporary passphrase used by legacy local private-key encrypt flow (social DM migrate). */
export const LOCAL_KEY_PASSPHRASE = "123123" as const;

export const LOCAL_KEY_PASS_STORAGE_KEY = "passs" as const;

export const WALLET_ADDRESS_MIN_LENGTH = 24 as const;

export const DEFAULT_AVATAR_SRC = "/PepeNoHappy.gif" as const;

/** @deprecated Prefer ACTIVE_CHAIN_ID + wagmi chains. Kept for any leftover string refs. */
export const ACTIVE_CHAIN = "polygon-amoy" as const;
