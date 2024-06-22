import { useRouter } from "next/router";
import {
  useContract,
  useContractEvents,
  useContractRead,
} from "@thirdweb-dev/react";
import { utils } from "ethers";

import { STATUS_CONTRACT_ADDRESS } from "@/constants/addresses";
import { filterStatusID, formatHexToDecimal } from "@/lib/utils";
import EventCardItem from "@/components/Home/NewFeed/eventCardItem";

export default function AccountFeed() {
  const router = useRouter();
  const { walletAddress } = router.query;
  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);

  const { data: userEvents, isLoading: isUserEventsLoading } =
    useContractEvents(contract, "StatusUpdated", {
      subscribe: true,
    });

  const { data: totalTiped, isLoading: isLoadingTiped } = useContractRead(
    contract,
    "getTotalTipsReceived",
    [walletAddress]
  );

  const userStatusFeeds =
    !isUserEventsLoading &&
    userEvents &&
    filterStatusID(userEvents)
      .sort(
        (a: any, b: any) =>
          formatHexToDecimal(b.data.statusId._hex) -
          formatHexToDecimal(a.data.statusId._hex)
      )
      .filter((item: any) => item.data.user == walletAddress);

  const tipInWei =
    totalTiped &&
    utils.formatUnits(formatHexToDecimal(totalTiped._hex).toString(), "ether");

  return (
    <div className="flex flex-col gap-4 pt-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-black px-4">
          Account: {walletAddress}
        </h1>
        {!isLoadingTiped && totalTiped && (
          <h2 className="pr-4">He/She got tipped {tipInWei} MATIC</h2>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="px-4">Latest Post:</h3>
        <div className="flex flex-col gap-4 px-4 py-2 border-y rounded-lg overflow-y-auto h-[80vh]">
          {!isUserEventsLoading &&
            userEvents &&
            userStatusFeeds.map((event: any, index: number) => (
              <EventCardItem
                key={index}
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
