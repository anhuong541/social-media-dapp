"use client";

import { useState } from "react";

import { FEED_PAGE_SIZE, SOCIAL_COPY } from "@/constants/social";
import { isStatusContractConfigured } from "@/constants/addresses";
import { filterStatusID } from "@/lib/utils";
import { useStatusUpdatedEvents } from "@/hooks/useStatusUpdatedEvents";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EventCardItem from "./eventCardItem";

export default function StatusEvents() {
  const [countFeed, setCountFeed] = useState<number>(FEED_PAGE_SIZE);
  const { events, isLoading, error } = useStatusUpdatedEvents();

  if (!isStatusContractConfigured) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertTitle>Status contract not configured</AlertTitle>
          <AlertDescription>
            Set NEXT_PUBLIC_STATUS_CONTRACT_ADDRESS after deploying SocialMedia
            to Polygon Amoy.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-3">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Failed to load feed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const filterListStatus = filterStatusID(events)
    .slice()
    .sort((a, b) => Number(b.timestamp - a.timestamp))
    .slice(0, countFeed);

  if (filterListStatus.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="max-w-sm border-dashed shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-base">
              {SOCIAL_COPY.emptyFeedTitle}
            </CardTitle>
            <CardDescription>
              {SOCIAL_COPY.emptyFeedDescription}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col gap-3 pb-4">
        {filterListStatus.map((event) => (
          <EventCardItem
            key={`${event.user}-${event.statusId.toString()}-${event.transactionHash ?? ""}-${event.logIndex ?? 0}`}
            walletAddress={event.user}
            newStatus={event.newStatus}
            timeStamp={event.timestamp}
            statusId={event.statusId}
          />
        ))}

        {countFeed < filterStatusID(events).length && (
          <Button
            onClick={() => setCountFeed((prev) => prev + FEED_PAGE_SIZE)}
            variant="secondary"
            className="w-full"
          >
            {SOCIAL_COPY.loadMore}
          </Button>
        )}
      </div>
    </ScrollArea>
  );
}
