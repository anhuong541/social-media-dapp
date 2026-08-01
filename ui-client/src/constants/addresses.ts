/**
 * Deployed contract addresses on Polygon (Amoy / mainnet).
 * Override via env after `npx hardhat run ... --network polygonAmoy`.
 */

const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000" as const;

export const STATUS_CONTRACT_ADDRESS = (process.env
  .NEXT_PUBLIC_STATUS_CONTRACT_ADDRESS?.trim() ||
  ZERO_ADDRESS) as `0x${string}`;

export const isStatusContractConfigured =
  STATUS_CONTRACT_ADDRESS.toLowerCase() !== ZERO_ADDRESS.toLowerCase();

/** Legacy BSC chat contract — chat now lives on Convex. Kept for reference only. */
export const CHAT_CONTRACT_ADDRESS =
  "0x313229bD59Ff71Ce5D65bee98fead75bF65fa63F" as const;

export const STATUS_CONTRACT_EVENTS_URL =
  "https://amoy.polygonscan.com" as const;
