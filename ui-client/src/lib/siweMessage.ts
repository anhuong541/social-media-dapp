export function buildSiweMessage(args: {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
}): string {
  const header = `${args.domain} wants you to sign in with your Ethereum account:`;
  return [
    header,
    args.address,
    "",
    args.statement,
    "",
    `URI: ${args.uri}`,
    `Version: ${args.version}`,
    `Chain ID: ${args.chainId}`,
    `Nonce: ${args.nonce}`,
    `Issued At: ${args.issuedAt}`,
  ].join("\n");
}
