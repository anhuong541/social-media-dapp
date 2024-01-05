import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { useContract, useContractEvents } from "@thirdweb-dev/react";

import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import loadingLottie from "@/lib/loadingLottie.json";
import { filterStatusID, formatHexToDecimal } from "@/lib/utils";
import EventCard from "./EventCard";
import UserStatus from "./user-status";

export default function NewsFeed() {
  const [isLoading, setIsLoading] = useState(true);
  const [countFeed, setCountFeed] = useState(10);
  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);
  const { data: statusEvents, isLoading: isStatusEventsLoading } =
    useContractEvents(contract, "StatusUpdated", {
      subscribe: true,
    });

  console.log({ statusEvents, isStatusEventsLoading });

  useEffect(() => {
    // Set a timeout for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Cleanup the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="col-span-2">
        <Lottie
          animationData={loadingLottie}
          loop={true}
          className="w-24 h-24 mx-auto"
        />
      </div>
    );
  } else {
    const statusFeeds =
      !isStatusEventsLoading && statusEvents && filterStatusID(statusEvents);

    return (
      <div className="flex-grow p-4 lg:col-span-2 col-span-3 space-y-4">
        <UserStatus />
        <div className="flex flex-col gap-3 overflow-y-auto h-[80vh] w-full">
          {!isStatusEventsLoading &&
            statusEvents &&
            statusFeeds
              .slice(0, countFeed)
              .map((event: any, index: number) => (
                <EventCard
                  key={formatHexToDecimal(event.data.statusId._hex)}
                  walletAddress={event.data.user}
                  newStatus={event.data.newStatus}
                  timeStamp={event.data.timestamp}
                  statusId={event.data.statusId}
                />
              ))}
          {!isStatusEventsLoading &&
            statusEvents &&
            countFeed < statusEvents?.length && (
              <button onClick={() => setCountFeed(() => countFeed + 10)}>
                more
              </button>
            )}
        </div>
      </div>
    );
  }
}
