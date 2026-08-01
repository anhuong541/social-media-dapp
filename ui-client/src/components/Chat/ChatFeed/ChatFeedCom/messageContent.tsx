"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import type { Encrypted } from "eth-crypto";

import { formatDateTimeDecimal } from "@/lib/utils";
import { decryptMsg } from "@/lib/encodeMsg";
import { CHAT_COPY } from "@/constants/chat";
import {
  CHAT_MESSAGE_LIST_LIMIT,
  isConvexConfigured,
} from "@/constants/convex";
import { api } from "@/lib/convexApi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletAvatar } from "../../wallet-avatar";
import { cn } from "@/lib/utils";
import { normalizeWallet, walletsEqual } from "@/lib/wallet";
import { useChatKey } from "@/providers/ChatKeyProvider";

type DecryptedMessage = {
  id: string;
  sender: string;
  receiver: string;
  createdAt: number;
  text: string;
};

function parseCiphertext(raw: string): Encrypted | null {
  try {
    return JSON.parse(raw) as Encrypted;
  } catch {
    return null;
  }
}

export default function MessageContent({
  userAddress,
  directWallet,
}: {
  userAddress: string | undefined;
  directWallet: string;
}) {
  const { isUnlocked, privateKey } = useChatKey();
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);

  const rows = useQuery(
    api.messages.listByConversation,
    isConvexConfigured && userAddress && directWallet
      ? {
          walletA: userAddress,
          walletB: directWallet,
          limit: CHAT_MESSAGE_LIST_LIMIT,
        }
      : "skip"
  );

  useEffect(() => {
    if (!rows || !privateKey || !userAddress) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    const me = normalizeWallet(userAddress);

    Promise.all(
      rows.map(
        async (row: {
          _id: string;
          senderWallet: string;
          receiverWallet: string;
          ciphertextForSender: string;
          ciphertextForReceiver: string;
          createdAt: number;
        }) => {
        const isSender = walletsEqual(row.senderWallet, me);
        const payload = parseCiphertext(
          isSender ? row.ciphertextForSender : row.ciphertextForReceiver
        );
        let text = "";
        if (payload) {
          const decrypted = await decryptMsg(privateKey, payload);
          text = typeof decrypted === "string" ? decrypted : "";
        }
        return {
          id: row._id,
          sender: row.senderWallet,
          receiver: row.receiverWallet,
          createdAt: row.createdAt,
          text,
        } satisfies DecryptedMessage;
      })
    )
      .then((value) => {
        if (!cancelled) setMessages(value);
      })
      .catch((err) => {
        console.error("Failed to decrypt chat messages", err);
        if (!cancelled) setMessages([]);
      });

    return () => {
      cancelled = true;
    };
  }, [rows, privateKey, userAddress]);

  if (!userAddress) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>{CHAT_COPY.walletRequiredTitle}</AlertTitle>
          <AlertDescription>
            {CHAT_COPY.walletRequiredDescription}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isConvexConfigured) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Alert className="max-w-md">
          <AlertTitle>{CHAT_COPY.convexMissingTitle}</AlertTitle>
          <AlertDescription>
            {CHAT_COPY.convexMissingDescription}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isUnlocked || !privateKey) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Alert className="max-w-md">
          <AlertTitle>Private key required</AlertTitle>
          <AlertDescription>
            {CHAT_COPY.privateKeyRequiredDescription}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (rows === undefined) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Skeleton className="h-14 w-2/3 rounded-2xl" />
        <Skeleton className="ml-auto h-14 w-1/2 rounded-2xl" />
        <Skeleton className="h-14 w-3/5 rounded-2xl" />
        <Skeleton className="ml-auto h-14 w-2/5 rounded-2xl" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="max-w-sm border-dashed shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-base">
              {CHAT_COPY.emptyMessagesTitle}
            </CardTitle>
            <CardDescription>
              {CHAT_COPY.emptyMessagesDescription}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col-reverse gap-3 px-4 py-4">
        {messages.map((item) => {
          const isMine = walletsEqual(item.sender, userAddress);
          return (
            <div
              key={item.id}
              className={cn(
                "flex max-w-[85%] items-end gap-2 sm:max-w-[75%]",
                isMine ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <WalletAvatar address={item.sender} size="sm" />
              <div
                className={cn(
                  "rounded-2xl px-3.5 py-2.5 shadow-xs",
                  isMine
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-muted text-foreground"
                )}
              >
                <p className="text-[11px] font-medium opacity-70">
                  {isMine ? CHAT_COPY.youLabel : undefined}
                </p>
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {item.text}
                </p>
                <p
                  className={cn(
                    "mt-1.5 text-[10px]",
                    isMine
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDateTimeDecimal(item.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
