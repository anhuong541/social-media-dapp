import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    walletAddress: v.string(),
    publicKey: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_wallet", ["walletAddress"]),

  chatRequests: defineTable({
    fromWallet: v.string(),
    toWallet: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_to_status", ["toWallet", "status"])
    .index("by_from_status", ["fromWallet", "status"])
    .index("by_pair", ["fromWallet", "toWallet"]),

  friendships: defineTable({
    walletA: v.string(),
    walletB: v.string(),
    createdAt: v.number(),
  })
    .index("by_wallet_a", ["walletA"])
    .index("by_wallet_b", ["walletB"])
    .index("by_pair", ["walletA", "walletB"]),

  messages: defineTable({
    conversationId: v.string(),
    senderWallet: v.string(),
    receiverWallet: v.string(),
    ciphertextForReceiver: v.string(),
    ciphertextForSender: v.string(),
    createdAt: v.number(),
  }).index("by_conversation_createdAt", ["conversationId", "createdAt"]),

  siweNonces: defineTable({
    walletAddress: v.string(),
    nonce: v.string(),
    expiresAt: v.number(),
  }).index("by_wallet", ["walletAddress"]),

  sessions: defineTable({
    walletAddress: v.string(),
    tokenHash: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token_hash", ["tokenHash"])
    .index("by_wallet", ["walletAddress"]),
});
