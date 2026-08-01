"use client";

import { useAccount } from "wagmi";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CHAT_COPY } from "@/constants/chat";
import { isConvexConfigured } from "@/constants/convex";
import { normalizeWallet } from "@/lib/wallet";
import { AddFriend, AddPrivateKey, FriendList } from "./FriendsChatCom";

export type FriendsChatType = {
  addressSelected: string;
  onChangeAddress: (value: string) => void;
};

export default function FriendsChat(props: FriendsChatType) {
  const { address } = useAccount();
  const walletAddress = address ? normalizeWallet(address) : undefined;

  if (!walletAddress) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <Alert variant="destructive">
          <AlertTitle>{CHAT_COPY.walletRequiredTitle}</AlertTitle>
          <AlertDescription>
            {CHAT_COPY.walletRequiredDescription}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-semibold">{CHAT_COPY.messagesTitle}</p>
          <p className="text-xs text-muted-foreground">{CHAT_COPY.friendsTitle}</p>
        </div>
        <AddPrivateKey address={walletAddress} />
      </div>
      {!isConvexConfigured && (
        <>
          <Separator />
          <div className="px-3 py-3">
            <Alert>
              <AlertTitle>{CHAT_COPY.convexMissingTitle}</AlertTitle>
              <AlertDescription>
                {CHAT_COPY.convexMissingDescription}
              </AlertDescription>
            </Alert>
          </div>
        </>
      )}
      <Separator />
      <div className="px-3 py-3">
        <AddFriend />
      </div>
      <Separator />
      <ScrollArea className="min-h-0 flex-1">
        <FriendList address={walletAddress} props={props} />
      </ScrollArea>
    </div>
  );
}
