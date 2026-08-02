"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { ACTIVE_CHAIN_ID } from "@/constants/app";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/**
 * Prompts the user to switch to Polygon Amoy when connected to another chain.
 */
export function NetworkGuard() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === ACTIVE_CHAIN_ID) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl px-3 pt-3">
      <Alert variant="destructive">
        <AlertTitle>Wrong network</AlertTitle>
        <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
          <span>
            This app uses Polygon Amoy (chain {ACTIVE_CHAIN_ID}). Switch network
            to continue on-chain actions.
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={isPending || !switchChain}
            onClick={() => switchChain?.({ chainId: polygonAmoy.id })}
          >
            {isPending ? "Switching..." : "Switch to Amoy"}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
