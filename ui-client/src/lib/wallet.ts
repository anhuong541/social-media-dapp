export function normalizeWallet(walletAddress: string): string {
  return walletAddress.trim().toLowerCase();
}

export function walletsEqual(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  return normalizeWallet(a) === normalizeWallet(b);
}
