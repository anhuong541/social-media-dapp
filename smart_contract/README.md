# Smart contracts (Hardhat + Polygon / Alchemy)

On-chain social feed: **`SocialMediaV6`** in `contracts/SocialMediaV6.sol`
(posts, likes, comments, tips).

Chat is **off-chain** (Convex). Legacy chat / older Solidity lives under
`legacy/` and is **not** compiled.

Stack: Hardhat 2 + `@nomicfoundation/hardhat-ethers` + `hardhat-verify`.
Deploy target: **Polygon Amoy** (chainId `80002`) via Alchemy.

## Setup

```bash
cd smart_contract
yarn
cp .env.example .env
```

Fill `.env`:

| Variable | Where to get it |
| --- | --- |
| `ALCHEMY_API_KEY` | [Alchemy dashboard](https://dashboard.alchemy.com) — Polygon Amoy app |
| `DEPLOYER_PRIVATE_KEY` | Deployer wallet private key — **never commit**; fund with Amoy POL |
| `POLYGONSCAN_API_KEY` | Optional — verify on Amoy/Polygonscan |

`.env` is gitignored.

## Compile

```bash
yarn compile
```

Artifacts land in `artifacts/` (gitignored).

## Deploy SocialMediaV6 (Amoy)

```bash
yarn deploy:amoy
```

The script (`scripts/deploy-status.js`) prints the address. Copy into
`ui-client/.env.local` as `NEXT_PUBLIC_STATUS_CONTRACT_ADDRESS`.

Mainnet (only when explicitly needed):

```bash
yarn deploy:polygon
```

## Wire the UI

In `ui-client/.env.local`:

```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=<same Alchemy key>
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<from https://cloud.walletconnect.com>
NEXT_PUBLIC_STATUS_CONTRACT_ADDRESS=<address from yarn deploy:amoy>
NEXT_PUBLIC_CONVEX_URL=<from npx convex dev>
CONVEX_DEPLOYMENT=<from npx convex dev>
```

## Verify (optional)

```bash
npx hardhat verify --network polygonAmoy <CONTRACT_ADDRESS>
```

## Notes

- Tip token / gas: **POL**
- `tipUser` sends `msg.value` to the recipient (no recipient-balance check)
- `editStatus` / `deleteStatus` require `msg.sender == _user`
- Amoy faucet: use any Polygon Amoy POL faucet
