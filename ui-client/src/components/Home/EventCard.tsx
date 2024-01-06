import Lottie from "lottie-react";
import Link from "next/link";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";

import {
  BiUpvote,
  BiDotsVerticalRounded,
  BiMessageRounded,
} from "react-icons/bi";
import { FaRegComments } from "react-icons/fa";
import { PiHandshakeFill } from "react-icons/pi";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import {
  formatDateTimeDecimal,
  formatHexToDecimal,
  truncateAddress,
} from "@/lib/utils";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import loadingLottie from "@/lib/loadingLottie.json";
import {
  ChangeStatusSection,
  CommentSection,
  TipsSection,
} from "./PopupSection";
import { useState } from "react";

type EventCardProps = {
  walletAddress: string;
  newStatus: string;
  timeStamp: {
    type: string;
    _hex: string;
  };
  statusId: {
    type: string;
    _hex: string;
  };
};

export type SuccesType = {
  state: boolean;
  title: string;
};

export default function EventCard(props: EventCardProps) {
  const address = useAddress();
  const [changeContentSuccess, setChangeContentSuccess] = useState<SuccesType>({
    state: false,
    title: "Edit",
  });
  const statusIdDeciaml = formatHexToDecimal(props.statusId._hex);
  const date = formatDateTimeDecimal(
    formatHexToDecimal(props.timeStamp._hex) * 1000
  );
  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);

  const { data: statusState, isLoading: isMyStatusLoading } = useContractRead(
    contract,
    "getStatus",
    [props.walletAddress, statusIdDeciaml]
  );

  const { mutateAsync: addLike, isLoading: isLikeLoading } = useContractWrite(
    contract,
    "addLike"
  );

  const callLike = async () => {
    try {
      const data = await addLike({
        args: [props.walletAddress, statusIdDeciaml],
      });
      // console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                // src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
                // src="/nekocat_a_thanos.gif"
                // src="/PepeScared.png"
                src="/PepeNoHappy.gif"
                alt="user Avatar"
              />
              <AvatarFallback>AH</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/profile/${props.walletAddress}`}
                    className="hover:underline"
                  >
                    {truncateAddress(props.walletAddress)}
                  </Link>
                  {/* {address !== props.walletAddress && (
                    <Dialog>
                      <DialogTrigger className="flex gap-1 items-center hover:text-green-700 cursor-pointer font-medium">
                        <PiHandshakeFill className="w-5 h-5" />
                      </DialogTrigger>
                      <TipsSection
                        status={props.newStatus}
                        walletAddress={props.walletAddress}
                        statusId={props.statusId}
                      />
                    </Dialog>
                  )} */}
                </div>
              </CardTitle>
              <CardDescription>
                {date.toLocaleString()}
                {/* - {formatHexToDecimal(props.statusId._hex)} */}
              </CardDescription>
            </div>
          </div>
          <Dialog>
            <DialogTrigger
              className={`${address !== props.walletAddress && "hidden"}`}
              onClick={() =>
                setChangeContentSuccess({ state: false, title: "" })
              }
            >
              <BiDotsVerticalRounded className="w-5 h-5" />
            </DialogTrigger>
            <ChangeStatusSection
              success={changeContentSuccess}
              onChangeSuccess={setChangeContentSuccess}
              status={props.newStatus}
              walletAddress={props.walletAddress}
              statusId={props.statusId}
            />
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <p>{props.newStatus}</p>
        <div className="flex justify-end items-center gap-3 mt-1 font-medium">
          {/* DM  */}
          {address !== props.walletAddress && (
            <div className="flex gap-1 items-center text-sm hover:text-green-700 cursor-pointer">
              <FaRegComments className="w-5 h-5" />
              DM
            </div>
          )}
          {/* like  */}
          <div
            className={`flex gap-1 items-center ${
              !address ? "opacity-50" : "cursor-pointer hover:text-green-700"
            }`}
            onClick={() => {
              if (address) {
                callLike();
              }
            }}
          >
            <BiUpvote className="w-5 h-5" />
            {isMyStatusLoading ? (
              <Lottie
                animationData={loadingLottie}
                loop={true}
                className="w-10 h-10 p-0"
              />
            ) : (
              formatHexToDecimal(statusState[1]._hex)
            )}
          </div>
          {/* comment  */}
          <Dialog>
            <DialogTrigger>
              <div className="flex gap-1 items-center hover:text-green-700 cursor-pointer">
                <BiMessageRounded className="w-5 h-5" />
                {isMyStatusLoading ? (
                  <Lottie
                    animationData={loadingLottie}
                    loop={true}
                    className="w-10 h-10 p-0"
                  />
                ) : (
                  formatHexToDecimal(statusState[2]._hex)
                )}
              </div>
            </DialogTrigger>
            <CommentSection
              status={props.newStatus}
              walletAddress={props.walletAddress}
              statusId={props.statusId}
            />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
