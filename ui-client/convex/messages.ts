import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { conversationIdFor, normalizeWallet, sortedWalletPair } from "./lib";
import { requireSiweSession } from "./lib/siweSession";

export const sendMessage = mutation({
  args: {
    sessionToken: v.string(),
    senderWallet: v.string(),
    receiverWallet: v.string(),
    ciphertextForReceiver: v.string(),
    ciphertextForSender: v.string(),
  },
  handler: async (ctx, args) => {
    const senderWallet = await requireSiweSession(
      ctx,
      args.sessionToken,
      args.senderWallet
    );
    const receiverWallet = normalizeWallet(args.receiverWallet);

    if (!senderWallet || !receiverWallet) {
      throw new Error("senderWallet and receiverWallet are required");
    }
    if (senderWallet === receiverWallet) {
      throw new Error("Cannot message yourself");
    }
    if (!args.ciphertextForReceiver || !args.ciphertextForSender) {
      throw new Error("Ciphertext payloads are required");
    }

    const pair = sortedWalletPair(senderWallet, receiverWallet);
    const friendship = await ctx.db
      .query("friendships")
      .withIndex("by_pair", (q) =>
        q.eq("walletA", pair.walletA).eq("walletB", pair.walletB)
      )
      .unique();

    if (!friendship) {
      throw new Error("Friendship required before messaging");
    }

    const conversationId = conversationIdFor(senderWallet, receiverWallet);
    return await ctx.db.insert("messages", {
      conversationId,
      senderWallet,
      receiverWallet,
      ciphertextForReceiver: args.ciphertextForReceiver,
      ciphertextForSender: args.ciphertextForSender,
      createdAt: Date.now(),
    });
  },
});

export const listByConversation = query({
  args: {
    walletA: v.string(),
    walletB: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const conversationId = conversationIdFor(args.walletA, args.walletB);
    const limit = args.limit ?? 100;

    const rows = await ctx.db
      .query("messages")
      .withIndex("by_conversation_createdAt", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("desc")
      .take(limit);

    return rows;
  },
});
