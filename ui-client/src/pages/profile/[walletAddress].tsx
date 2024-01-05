import { useContract, useContractEvents } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

import Lottie from "lottie-react";
import loadingLottie from "@/lib/loadingLottie.json";
import { useEffect, useState } from "react";
import { STATUS_CONTRACT_ADDRESS } from "@/components/constants/addresses";
import EventCard from "@/components/Home/EventCard";
import { filterStatusID, formatHexToDecimal } from "@/lib/utils";

export default function AccountFeed() {
  const router = useRouter();
  const { walletAddress } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);

  const { data: userEvents, isLoading: isUserEventsLoading } =
    useContractEvents(contract, "StatusUpdated", {
      subscribe: true,
      queryFilter: {
        filters: {
          user: walletAddress,
        },
      },
    });

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
      <div className="w-full">
        <Lottie
          animationData={loadingLottie}
          loop={true}
          className="w-24 h-24 mx-auto"
        />
      </div>
    );
  } else {
    const userStatusFeeds =
      !isUserEventsLoading &&
      userEvents &&
      filterStatusID(userEvents).sort(
        (a: any, b: any) =>
          formatHexToDecimal(b.data.statusId._hex) -
          formatHexToDecimal(a.data.statusId._hex)
      );

    return (
      <div className="flex flex-col gap-4 pt-4 w-full">
        <h1 className="font-semibold text-black px-4">
          Account: {walletAddress}
        </h1>
        <div className="px-4 flex flex-col gap-2">
          <h3>Latest Post:</h3>
          <div className="flex flex-col gap-4 border-y rounded-lg overflow-y-auto h-[78vh]">
            {!isUserEventsLoading &&
              userEvents &&
              userStatusFeeds.map((event: any, index: number) => (
                <EventCard
                  key={formatHexToDecimal(event.data.statusId._hex)}
                  walletAddress={event.data.user}
                  newStatus={event.data.newStatus}
                  timeStamp={event.data.timestamp}
                  statusId={event.data.statusId}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}
