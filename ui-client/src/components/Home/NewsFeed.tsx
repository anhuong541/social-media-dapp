import { useEffect, useState } from "react";
import { useContract, useContractEvents } from "@thirdweb-dev/react";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import loadingLottie from "./../../../public/loadingLottie.json";
import styles from "@/styles/Home.module.css";
import EventCard from "./EventCard";

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
      <div className={styles.sectionLoading}>
        <Lottie animationData={loadingLottie} loop={true} />
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 col-span-2 space-y-4">
      <div className="flex space-x-2">
        <Avatar>
          <AvatarImage
            src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
            alt="user Avatar"
          />
          <AvatarFallback>AH</AvatarFallback>
        </Avatar>
        <Input className="flex-grow" placeholder="What's happening?" />
        <Button variant="default">Post</Button>
      </div>
      <div>
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
