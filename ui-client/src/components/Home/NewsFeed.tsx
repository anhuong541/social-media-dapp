import { useEffect, useState } from "react";
import { useContract, useContractEvents } from "@thirdweb-dev/react";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import loadingLottie from "@/lib/loadingLottie.json";
import Lottie from "lottie-react";
import styles from "@/styles/Home.module.css";
import EventCard from "./EventCard";
import UserStatus from "./user-status";

export default function NewsFeed() {
  const [isLoading, setIsLoading] = useState(true);

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
    }, 5000);

    // Cleanup the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="col-span-2">
        <div className={styles.sectionLoading}>
          <Lottie animationData={loadingLottie} loop={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 col-span-2 space-y-4">
      <UserStatus />
      <div className="flex flex-col gap-3">
        {!isStatusEventsLoading &&
          statusEvents &&
          statusEvents
            .slice(0, 30)
            .map((event, index) => (
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
