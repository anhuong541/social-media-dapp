import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { useContract, useContractEvents } from "@thirdweb-dev/react";

import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import loadingLottie from "@/lib/loadingLottie.json";
import { filterStatusID, formatHexToDecimal } from "@/lib/utils";
import EventCard from "./EventCard";
import UserStatus from "./user-status";
import { Button } from "../ui/button";

export default function NewsFeed() {
  const [isLoading, setIsLoading] = useState(false);
  const [countFeed, setCountFeed] = useState(10);
  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);
  const {
    data: statusEvents,
    isLoading: isStatusEventsLoading,
    refetch: refetchStatusEvent,
  } = useContractEvents(contract, "StatusUpdated", {
    subscribe: true,
  });

  // console.log({ statusEvents, isStatusEventsLoading });

  // useEffect(() => {
  //   // Set a timeout for 2 seconds
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);

  //   // Cleanup the timer when the component is unmounted
  //   return () => clearTimeout(timer);
  // }, []);

  if (isLoading || isStatusEventsLoading || statusEvents == undefined) {
    return (
      <div className="col-span-2 h-[90vh]">
        <Lottie
          animationData={loadingLottie}
          loop={true}
          className="w-24 h-24 mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="flex-grow py-4 lg:col-span-2 col-span-3 space-y-4">
      <UserStatus />
      <div className="flex flex-col gap-3 overflow-y-auto h-[80vh] px-4 w-full app_scroll_bar">
        {!isStatusEventsLoading &&
          statusEvents &&
          filterStatusID(statusEvents)
            .slice(0, countFeed)
            .sort((a: any, b: any) => {
              const decimalA = parseInt(a.data.timestamp._hex, 16);
              const decimalB = parseInt(b.data.timestamp._hex, 16);
              return decimalB - decimalA;
            })
            .map((event: any, index: number) => (
              <EventCard
                key={index}
                walletAddress={event.data.user}
                newStatus={event.data.newStatus}
                timeStamp={event.data.timestamp}
                statusId={event.data.statusId}
              />
            ))}
        {!isStatusEventsLoading &&
          statusEvents &&
          countFeed < statusEvents?.length && (
            <Button
              onClick={() => setCountFeed(() => countFeed + 10)}
              className="h-10 opacity-70 hover:opacity-100"
            >
              more
            </Button>
          )}
      </div>
    </div>
  );
}
