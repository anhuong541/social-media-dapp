# Convex backend (chat)

Off-chain chat: public keys, friend requests, friendships, and encrypted messages.

## Setup

1. From `ui-client`: `npx convex dev`
2. Copy `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOYMENT` into `.env.local`
3. Commit the regenerated `convex/_generated/` files Convex writes for your deployment

## Auth

Phase 1 does not use SIWE / Convex auth. Mutations take a wallet address from the
client. TODO: gate mutations with signed wallet identity.
