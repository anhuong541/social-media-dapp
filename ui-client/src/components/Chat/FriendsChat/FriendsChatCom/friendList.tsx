"use client";

import { Check, X } from "lucide-react";
import { useMutation, useQuery } from "convex/react";

import { truncateAddress } from "@/lib/utils";
import { CHAT_COPY } from "@/constants/chat";
import { isConvexConfigured } from "@/constants/convex";
import { api } from "@/lib/convexApi";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { walletsEqual } from "@/lib/wallet";
import { useChatKey } from "@/providers/ChatKeyProvider";
import { WalletAvatar } from "../../wallet-avatar";
import { FriendsChatType } from "..";

export default function FriendList({
  props,
  address,
}: {
  props: FriendsChatType;
  address: string;
}) {
  const { isUnlocked } = useChatKey();
  const friends = useQuery(
    api.chatRequests.listFriends,
    isConvexConfigured && address ? { walletAddress: address } : "skip"
  );
  const pending = useQuery(
    api.chatRequests.listPendingForWallet,
    isConvexConfigured && address ? { walletAddress: address } : "skip"
  );
  const acceptRequest = useMutation(api.chatRequests.acceptRequest);
  const rejectRequest = useMutation(api.chatRequests.rejectRequest);

  const callAccept = async (requestId: string) => {
    try {
      await acceptRequest({
        requestId: requestId as never,
        toWallet: address,
      });
    } catch (err) {
      console.error("accept request failure", err);
    }
  };

  const callReject = async (requestId: string) => {
    try {
      await rejectRequest({
        requestId: requestId as never,
        toWallet: address,
      });
    } catch (err) {
      console.error("reject request failure", err);
    }
  };

  if (!isConvexConfigured) {
    return (
      <div className="p-4">
        <Alert>
          <AlertTitle>{CHAT_COPY.convexMissingTitle}</AlertTitle>
          <AlertDescription>
            {CHAT_COPY.convexMissingDescription}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (friends === undefined || pending === undefined) {
    return (
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="p-4">
        <Alert>
          <AlertDescription>
            {CHAT_COPY.privateKeyRequiredDescription}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-3">
      {pending.length > 0 && (
        <section className="px-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {CHAT_COPY.requestsTitle}
            </h2>
            <Badge variant="secondary">{pending.length}</Badge>
          </div>
          <div className="flex flex-col gap-2">
            {pending.map((item: { _id: string; fromWallet: string }) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <WalletAvatar address={item.fromWallet} />
                  <p className="truncate text-sm font-medium">
                    {truncateAddress(item.fromWallet)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="icon-sm"
                    variant="default"
                    className="rounded-full"
                    onClick={() => void callAccept(item._id)}
                    aria-label="Accept chat request"
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => void callReject(item._id)}
                    aria-label="Reject chat request"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-2">
        <h2 className="mb-2 px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {CHAT_COPY.friendsTitle}
        </h2>
        {friends.length > 0 ? (
          <div className="flex flex-col gap-1">
            {friends.map((friendWallet: string) => {
              const selected = walletsEqual(
                props?.addressSelected,
                friendWallet
              );
              return (
                <button
                  type="button"
                  key={friendWallet}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={() => props.onChangeAddress(friendWallet)}
                >
                  <WalletAvatar address={friendWallet} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {truncateAddress(friendWallet)}
                    </p>
                    <p
                      className={cn(
                        "truncate text-xs",
                        selected
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {friendWallet}
                    </p>
                  </div>
                  {selected && (
                    <Badge
                      variant="secondary"
                      className="shrink-0 bg-primary-foreground/15 text-primary-foreground"
                    >
                      {CHAT_COPY.activeBadge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <Card className="mx-1 border-dashed shadow-none">
            <CardHeader className="py-4">
              <CardTitle className="text-sm">
                {CHAT_COPY.emptyFriendsTitle}
              </CardTitle>
              <CardDescription>
                {CHAT_COPY.emptyFriendsDescription}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </section>
    </div>
  );
}
