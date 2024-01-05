import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Web3Button,
  useAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import Lottie from "lottie-react";
import loadingLottie from "@/lib/loadingLottie.json";
import { STATUS_CONTRACT_ADDRESS } from "@/components/constants/addresses";
import { formatHexToDecimal, truncateAddress } from "@/lib/utils";
import Link from "next/link";
import { PiHandshakeFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type CommentType = {
  status: string;
  walletAddress: string;
  statusId: {
    type: string;
    _hex: string;
  };
};

export default function CommentSection({
  status,
  walletAddress,
  statusId,
}: CommentType) {
  const address = useAddress();
  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);
  const statusIdDeciaml = formatHexToDecimal(statusId._hex);
  const [comment, setComment] = useState("");

  const { data: myCommenst, isLoading: isMyStatusLoading } = useContractRead(
    contract,
    "getComments",
    [statusIdDeciaml]
  );

  console.log({ myCommenst, statusIdDeciaml, status });

  if (!address) {
    return (
      <div className="text-red-500">
        Your did not connected your wallet yet!
      </div>
    );
  }

  if (isMyStatusLoading) {
    return (
      <Lottie
        animationData={loadingLottie}
        loop={true}
        className="w-24 h-24 mx-auto"
      />
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-sm">
          <div className="flex items-center gap-3">
            <Link
              href={`/profile/${walletAddress}`}
              className="hover:underline"
            >
              {truncateAddress(walletAddress)}
            </Link>
          </div>
        </DialogTitle>
        <DialogDescription>{status}</DialogDescription>
        <div className="flex flex-col gap-2 border-t py-2">
          <h4 className="font-medium">Comments:</h4>

          <div className="flex flex-col gap-4 border py-2 px-4 rounded-lg h-[50vh] overflow-y-auto">
            {myCommenst.map((item) => {
              return <div key={item}>{item}</div>;
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Input
            className="flex-grow"
            placeholder="say something!!"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <Web3Button
            className="cursor-pointer rounded-xl text-sm hover:opacity-80"
            style={{
              backgroundColor: "#2c9f41",
              color: "white",
              height: "0px",
            }}
            contractAddress={STATUS_CONTRACT_ADDRESS}
            action={(contract) =>
              contract.call("addComment", [statusIdDeciaml, comment])
            }
            onSuccess={() => {
              setComment("");
            }}
          >
            Add Comment
          </Web3Button>
        </div>
      </DialogHeader>
    </DialogContent>
  );
}
