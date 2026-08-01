"use client";

import { useParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";

import {
  isStatusContractConfigured,
  STATUS_CONTRACT_ADDRESS,
} from "@/constants/addresses";
import { SOCIAL_COPY } from "@/constants/social";
import { statusContractAbi } from "@/abi/statusContract";
import { filterStatusID, truncateAddress } from "@/lib/utils";
import { walletsEqual } from "@/lib/wallet";
import { useStatusUpdatedEvents } from "@/hooks/useStatusUpdatedEvents";
import EventCardItem from "@/components/Home/NewFeed/eventCardItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CopyAddress from "@/components/copyAddress";
import { WalletAvatar } from "@/components/Chat/wallet-avatar";

export default function ProfilePage() {
  const params = useParams<{ walletAddress: string }>();
  const walletAddress = params.walletAddress;
  const { events, isLoading: isUserEventsLoading } = useStatusUpdatedEvents();

  const { data: totalTiped, isLoading: isLoadingTiped } = useReadContract({
    address: STATUS_CONTRACT_ADDRESS,
    abi: statusContractAbi,
    functionName: "getTotalTipsReceived",
    args: walletAddress
      ? [walletAddress as `0x${string}`]
      : undefined,
    query: {
      enabled: Boolean(walletAddress) && isStatusContractConfigured,
    },
  });

  const userStatusFeeds = filterStatusID(events)
    .filter((item) => walletsEqual(item.user, walletAddress))
    .sort((a, b) => Number(b.statusId - a.statusId));

  const tipInWei =
    totalTiped !== undefined ? formatEther(totalTiped as bigint) : null;

  if (!isStatusContractConfigured) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Alert className="max-w-md">
          <AlertTitle>Status contract not configured</AlertTitle>
          <AlertDescription>
            Set NEXT_PUBLIC_STATUS_CONTRACT_ADDRESS after deploying to Polygon
            Amoy.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden px-4 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <WalletAvatar address={walletAddress} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-base font-semibold">
                {truncateAddress(walletAddress)}
              </h1>
              {walletAddress && <CopyAddress textToCopy={walletAddress} />}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {walletAddress}
            </p>
          </div>
        </div>
        {!isLoadingTiped && tipInWei !== null ? (
          <div className="rounded-xl border bg-card px-3 py-2 text-right shadow-xs">
            <p className="text-xs text-muted-foreground">
              {SOCIAL_COPY.profileTipsReceived}
            </p>
            <p className="text-sm font-semibold">{tipInWei}</p>
          </div>
        ) : (
          <Skeleton className="h-12 w-40 rounded-xl" />
        )}
      </div>

      <Separator />

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          {SOCIAL_COPY.profileLatestPosts}
        </h2>
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-4 pb-4">
            {isUserEventsLoading && (
              <>
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
              </>
            )}
            {!isUserEventsLoading && userStatusFeeds.length === 0 && (
              <Card className="border-dashed shadow-none">
                <CardHeader>
                  <CardTitle className="text-base">
                    {SOCIAL_COPY.profileEmptyTitle}
                  </CardTitle>
                  <CardDescription>
                    {SOCIAL_COPY.profileEmptyDescription}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {!isUserEventsLoading &&
              userStatusFeeds.map((event) => (
                <EventCardItem
                  key={`${event.statusId.toString()}-${event.transactionHash ?? ""}-${event.logIndex ?? 0}`}
                  walletAddress={event.user}
                  newStatus={event.newStatus}
                  timeStamp={event.timestamp}
                  statusId={event.statusId}
                />
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
