"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { useMutation } from "convex/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/convexApi";
import { CHAT_COPY, WALLET_ADDRESS_MIN_LENGTH } from "@/constants/chat";
import { isConvexConfigured } from "@/constants/convex";
import { useChatKey } from "@/providers/ChatKeyProvider";
import { useRequireSiweSession } from "@/hooks/useRequireSiweSession";

export default function AddFriend() {
  const { walletAddress, isUnlocked } = useChatKey();
  const { requireSessionToken } = useRequireSiweSession();
  const [typeAddress, setTypeAddress] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    CHAT_COPY.requestFailed
  );
  const [isLoading, setIsLoading] = useState(false);
  const sendRequest = useMutation(api.chatRequests.sendRequest);

  const callChatRequest = async () => {
    if (!isConvexConfigured) {
      setIsError(true);
      setErrorMessage(CHAT_COPY.convexMissingDescription);
      return;
    }
    if (!walletAddress || !isUnlocked) {
      setIsError(true);
      setErrorMessage(CHAT_COPY.unlockRequired);
      return;
    }

    setIsLoading(true);
    try {
      const sessionToken = await requireSessionToken();
      if (!sessionToken) throw new Error("SIWE session missing");
      await sendRequest({
        sessionToken,
        fromWallet: walletAddress,
        toWallet: typeAddress.trim(),
      });
      setIsError(false);
    } catch (err) {
      console.error("chat request failure", err);
      setIsError(true);
      setErrorMessage(
        err instanceof Error ? err.message : CHAT_COPY.requestFailed
      );
    } finally {
      setTypeAddress("");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          value={typeAddress}
          onChange={(e) => setTypeAddress(e.target.value)}
          placeholder={CHAT_COPY.addFriendPlaceholder}
          disabled={isLoading}
          className="h-9"
        />
        <Button
          size="sm"
          onClick={() => void callChatRequest()}
          disabled={
            typeAddress.trim().length < WALLET_ADDRESS_MIN_LENGTH || isLoading
          }
          className="shrink-0 gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UserPlus className="size-4" />
          )}
          {CHAT_COPY.sendRequest}
        </Button>
      </div>
      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
