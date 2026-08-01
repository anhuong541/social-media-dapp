export function normalizeWallet(walletAddress: string): string {
  return walletAddress.trim().toLowerCase();
}

export function conversationIdFor(walletA: string, walletB: string): string {
  const pair = [normalizeWallet(walletA), normalizeWallet(walletB)].sort();
  return `${pair[0]}:${pair[1]}`;
}

export function sortedWalletPair(
  walletA: string,
  walletB: string
): { walletA: string; walletB: string } {
  const pair = [normalizeWallet(walletA), normalizeWallet(walletB)].sort();
  return { walletA: pair[0], walletB: pair[1] };
}
