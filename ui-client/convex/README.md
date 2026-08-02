# Convex backend (chat + SIWE)

Off-chain chat: public keys, friend requests, friendships, encrypted messages,
and SIWE sessions.

## Setup

1. From `ui-client`: `npx convex dev`
2. Copy `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOYMENT` into `.env.local`
3. Commit regenerated `convex/_generated/` from your deployment

## Auth (SIWE)

1. Client calls `auth.issueNonce`
2. Wallet signs an EIP-4361-style message
3. `authActions.verifyLogin` (Node action + viem) verifies the signature
4. Internal `auth.createSession` issues a session token
5. Chat mutations require `sessionToken` + matching wallet

Session tokens are stored in `sessionStorage` (`chat:siwe-session`).
