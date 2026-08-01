"use client";

import { KeyboardEvent, useState } from "react";
import { Loader2, SendHorizontal } from "lucide-react";
import { useMutation, useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/convexApi";
import { CHAT_COPY } from "@/constants/chat";
import { isConvexConfigured } from "@/constants/convex";
import { DirectWalletType } from "@/constants/navigation";
import { encryptMsg } from "@/lib/encodeMsg";
import { normalizeWallet } from "@/lib/wallet";
import { useChatKey } from "@/providers/ChatKeyProvider";

export default function SendMessage({
  address,
  directWallet,
}: {
  address: string | undefined;
  directWallet: DirectWalletType;
}) {
  const { isUnlocked, publicKey: myPublicKey } = useChatKey();
  const [placeholder, setPlaceholder] = useState<string>(CHAT_COPY.composerPlaceholder);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const peerUser = useQuery(
    api.users.getByWallet,
    isConvexConfigured && directWallet
      ? { walletAddress: directWallet }
      : "skip"
  );
  const sendMessage = useMutation(api.messages.sendMessage);

  const callSendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      setPlaceholder(CHAT_COPY.composerEmptyHint);
      return;
    }
    if (!isConvexConfigured) {
      setError(CHAT_COPY.convexMissingDescription);
      return;
    }
    if (!address || !isUnlocked || !myPublicKey) {
      setError(CHAT_COPY.unlockRequired);
      return;
    }
    if (!peerUser?.publicKey) {
      setError("Peer has not registered a public key yet");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const ciphertextForReceiver = await encryptMsg(
        peerUser.publicKey,
        trimmed
      );
      const ciphertextForSender = await encryptMsg(myPublicKey, trimmed);

      await sendMessage({
        senderWallet: normalizeWallet(address),
        receiverWallet: normalizeWallet(directWallet),
        ciphertextForReceiver: JSON.stringify(ciphertextForReceiver),
        ciphertextForSender: JSON.stringify(ciphertextForSender),
      });
      setMessage("");
      setPlaceholder(CHAT_COPY.composerPlaceholder);
    } catch (err) {
      console.error("send message failure", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && address) {
        void callSendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-background p-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-end gap-2">
        <Textarea
          value={message}
          placeholder={placeholder}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!address || isLoading || !isUnlocked}
          rows={1}
          className="max-h-32 min-h-10 flex-1 resize-none py-2.5"
        />
        <Button
          size="icon"
          onClick={() => void callSendMessage()}
          disabled={
            !address || isLoading || !message.trim() || !isUnlocked
          }
          aria-label="Send message"
          className="shrink-0"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <SendHorizontal className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
