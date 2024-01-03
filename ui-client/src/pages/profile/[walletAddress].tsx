import { useContract, useContractEvents } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

import Lottie from "lottie-react";
import loadingLottie from "@/lib/loadingLottie.json";
import { useEffect, useState } from "react";
import { STATUS_CONTRACT_ADDRESS } from "@/components/constants/addresses";
import EventCard from "@/components/Home/EventCard";

export default function AcountFeed() {
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
  }

  return (
    <div className="flex flex-col gap-4 pt-4 w-full">
      <h1 className="font-medium text-xl text-black px-4">
        Account: {walletAddress}
      </h1>
      <div className="px-4 flex flex-col gap-2">
        <h3>Latest Post:</h3>
        {!isUserEventsLoading &&
          userEvents &&
          userEvents.map((event, index) => (
            <EventCard
              key={index}
              walletAddress={event.data.user}
              newStatus={event.data.newStatus}
              timeStamp={event.data.timestamp}
            />
          ))}
      </div>
    </div>
  );
}
