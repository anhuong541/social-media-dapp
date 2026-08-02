"use node";

import { v } from "convex/values";
import { verifyMessage } from "viem";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { buildSiweMessage } from "./lib/siweMessage";
import { normalizeWallet } from "./lib";

/**
 * Verifies a personal_sign SIWE message, then issues a Convex session token.
 */
export const verifyLogin = action({
  args: {
    walletAddress: v.string(),
    signature: v.string(),
    nonce: v.string(),
    domain: v.string(),
    uri: v.string(),
    chainId: v.number(),
    issuedAt: v.string(),
    statement: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ sessionToken: string; expiresAt: number }> => {
    const walletAddress = normalizeWallet(args.walletAddress);
    const message = buildSiweMessage({
      domain: args.domain,
      address: args.walletAddress,
      statement: args.statement,
      uri: args.uri,
      version: "1",
      chainId: args.chainId,
      nonce: args.nonce,
      issuedAt: args.issuedAt,
    });

    const valid = await verifyMessage({
      address: args.walletAddress as `0x${string}`,
      message,
      signature: args.signature as `0x${string}`,
    });

    if (!valid) {
      throw new Error("Invalid SIWE signature");
    }

    return await ctx.runMutation(internal.auth.createSession, {
      walletAddress,
      nonce: args.nonce,
    });
  },
});