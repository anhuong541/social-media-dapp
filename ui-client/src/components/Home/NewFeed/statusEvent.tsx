import { useState } from "react";
import Lottie from "lottie-react";
import { useContract, useContractEvents } from "@thirdweb-dev/react";

import { STATUS_CONTRACT_ADDRESS } from "../../../constants/addresses";
import loadingLottie from "@/lib/loadingLottie.json";
import { filterStatusID } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import EventCardItem from "./eventCardItem";
import VirtualList from "@/components/Virtuallist";

export default function StatusEvents() {
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

  if (isStatusEventsLoading || statusEvents == undefined) {
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

  const filterListStatus = filterStatusID(statusEvents)
    .slice(0, countFeed)
    .sort((a: any, b: any) => {
      const decimalA = parseInt(a.data.timestamp._hex, 16);
      const decimalB = parseInt(b.data.timestamp._hex, 16);
      return decimalB - decimalA;
    });

  return (
    <div className="flex flex-col gap-3 overflow-y-auto h-[80vh] px-4 w-full app_scroll_bar">
      {!isStatusEventsLoading && statusEvents && (
        <VirtualList
          itemCount={filterListStatus?.length}
          height={document.documentElement.clientHeight * 0.8}
          width={400}
        >
          {filterListStatus.map((event: any, index: number) => (
            <EventCardItem
              key={index}
              walletAddress={event.data.user}
              newStatus={event.data.newStatus}
              timeStamp={event.data.timestamp}
              statusId={event.data.statusId}
            />
          ))}
        </VirtualList>
      )}

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
  );
}
