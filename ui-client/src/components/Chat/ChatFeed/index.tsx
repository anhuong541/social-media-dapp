"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { MessageSquarePlus, Users } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CopyAddress from "@/components/copyAddress";
import { DirectWalletType, UNSELECTED_WALLET } from "@/constants/navigation";
import { CHAT_COPY } from "@/constants/chat";
import { truncateAddress } from "@/lib/utils";
import { MessageContent, SendMessage } from "./ChatFeedCom";
import FriendsChat from "../FriendsChat";
import { WalletAvatar } from "../wallet-avatar";

export type chatFeedsFormatType = {
  sender: string;
  receiver: string;
  timestamp: {
    type: number;
    _hex: string;
  };
  message1: string;
  message2: string;
  dataIndex: number;
};

export default function ChatFeed({
  directWallet,
  onChangeAddress,
}: {
  directWallet: DirectWalletType;
  onChangeAddress: (value: string) => void;
}) {
  const { address } = useAccount();
  const hasConversation = directWallet !== UNSELECTED_WALLET;

  const friendsSheet = (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="xl:hidden"
          aria-label={CHAT_COPY.openFriends}
        >
          <Users className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-3 text-left">
          <SheetTitle>{CHAT_COPY.messagesTitle}</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-hidden">
          <FriendsChat
            onChangeAddress={onChangeAddress}
            addressSelected={directWallet}
          />
        </div>
      </SheetContent>
    </Sheet>
  );

  if (!hasConversation) {
    return (
      <div className="flex h-full min-h-0 flex-col border-r bg-background">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">{CHAT_COPY.messagesTitle}</p>
            <p className="text-xs text-muted-foreground">
              {CHAT_COPY.selectConversationHint}
            </p>
          </div>
          {friendsSheet}
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <Card className="max-w-md border-dashed shadow-none">
            <CardHeader className="items-center text-center">
              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageSquarePlus className="size-6" />
              </div>
              <CardTitle className="text-base">
                {CHAT_COPY.emptyConversationTitle}
              </CardTitle>
              <CardDescription>
                {CHAT_COPY.emptyConversationDescription}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col border-r bg-background">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <WalletAvatar address={directWallet} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/profile/${directWallet}`}
                className="truncate text-sm font-semibold hover:underline"
              >
                {truncateAddress(directWallet)}
              </Link>
              <CopyAddress textToCopy={directWallet} />
            </div>
            <Link
              href={`/profile/${directWallet}`}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {CHAT_COPY.viewProfile}
            </Link>
          </div>
        </div>
        {friendsSheet}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <MessageContent userAddress={address} directWallet={directWallet} />
        <Separator />
        <SendMessage address={address} directWallet={directWallet} />
      </div>
    </div>
  );
}
