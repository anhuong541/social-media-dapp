# Smart contracts (Hardhat + Polygon)

On-chain status feed contract: **SocialMediaV6** in `contracts/Contract.sol`.

Stack: Hardhat 2 + `@nomicfoundation/hardhat-toolbox` + OpenZeppelin 4.9. Deploy target: **Polygon Amoy** (chainId `80002`) via Alchemy. No thirdweb / zkSync.

The same Solidity file also contains legacy `ChatPrivate` (ERC721). Chat in the app is off-chain (Convex); only `SocialMediaV6` is deployed by the status script.

## Setup

```bash
cd smart_contract
yarn
cp .env.example .env
```

Fill `.env`:

| Variable | Where to get it |
| --- | --- |
| `ALCHEMY_API_KEY` | [Alchemy dashboard](https://dashboard.alchemy.com) — create an app for Polygon Amoy |
| `DEPLOYER_PRIVATE_KEY` | MetaMask (or other) account private key — **never commit**; fund with Amoy POL from a faucet |

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

The script (`scripts/deploy-status.js`) prints:

```text
SocialMediaV6 deployed to: 0x...
Set NEXT_PUBLIC_STATUS_CONTRACT_ADDRESS=0x... in ui-client/.env.local
```

Copy that address into `ui-client/.env.local` as `NEXT_PUBLIC_STATUS_CONTRACT_ADDRESS`.

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

# Chat (Convex) — already set if you ran `npx convex dev`
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
CONVEX_DEPLOYMENT=dev:<deployment>
```

Then:

```bash
cd ui-client
yarn dev
```

Smoke test: MetaMask on **Polygon Amoy** → connect → post / like / comment / tip → feed & profile update from `StatusUpdated` events.

## Optional: verify on Polygonscan

`@nomicfoundation/hardhat-verify` is already a toolbox peer. To enable verification yourself:

1. Get an API key at [Polygonscan](https://polygonscan.com/apis) (works for Amoy too).
2. Add to `.env`:

   ```bash
   POLYGONSCAN_API_KEY=
   ```

3. In `hardhat.config.js`, add (toolbox already loads the plugin):

   ```js
   const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

   module.exports = {
     // ...existing solidity / networks...
     etherscan: {
       apiKey: POLYGONSCAN_API_KEY,
     },
   };
   ```

4. After deploy:

   ```bash
   npx hardhat verify --network polygonAmoy <CONTRACT_ADDRESS>
   ```

`SocialMediaV6` has a no-arg constructor, so no constructor arguments are needed.

## Scripts

| Script | Command |
| --- | --- |
| Compile | `yarn compile` |
| Deploy Amoy | `yarn deploy:amoy` |
| Deploy Polygon mainnet | `yarn deploy:polygon` |

## Notes / TODOs (out of scope here)

- `tipUser` has a questionable balance check before transfer — fix separately if tips fail for empty wallets.
- Do not migrate chat back on-chain unless requested.
- Do not deploy mainnet unless explicitly requested.
