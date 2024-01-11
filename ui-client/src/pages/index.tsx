import FollowBar from "@/components/Home/Followbar";
import NewsFeed from "@/components/Home/NewsFeed";

import { useState } from "react";
import loadingLottie from "@/lib/loadingLottie.json";
import Lottie from "lottie-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   // Set a timeout for 2 seconds
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);

  //   // Cleanup the timer when the component is unmounted
  //   return () => clearTimeout(timer);
  // }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[90vh]">
        <Lottie
          animationData={loadingLottie}
          loop={true}
          className="w-24 h-24 mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 flex-grow">
      <NewsFeed />
      <FollowBar />
    </div>
  );
}
