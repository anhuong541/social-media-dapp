import { BigNumber } from "ethers";
import { formatTime, truncateAddress } from "@/lib/utils";
import { BiUpvote } from "react-icons/bi";
import { FaRegComments } from "react-icons/fa";
import { PiHandshakeFill } from "react-icons/pi";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAddress } from "@thirdweb-dev/react";

type EventCardProps = {
  walletAddress: string;
  newStatus: string;
  timeStamp: BigNumber;
};

export default function EventCard(props: EventCardProps) {
  const address = useAddress();
  const date = formatTime(props.timeStamp.toNumber() * 1000);

  //   return (
  //     <div className={styles.eventCard}>
  //       <div className={styles.eventHeader}>
  //         <Link href={`account/${props.walletAddress}`} className="text-white">
  //           <p className={styles.connectedAddress}>
  //             {truncateAddress(props.walletAddress)}
  //           </p>
  //         </Link>
  //         <p style={{ fontSize: "0.75rem" }}>{date.toLocaleString()}</p>
  //       </div>
  //       <p style={{ fontSize: "16px" }}>{props.newStatus}</p>
  //     </div>
  //   );

  //   href={`account/${props.walletAddress}`}

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
              alt="user Avatar"
            />
            <AvatarFallback>AH</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              <div className="flex items-center gap-3">
                <Link
                  href={`/profile/${props.walletAddress}`}
                  className="hover:underline"
                >
                  {truncateAddress(props.walletAddress)}
                </Link>
                {address !== props.walletAddress && (
                  <div className="flex gap-1 items-center hover:text-green-700 cursor-pointer font-medium">
                    <PiHandshakeFill className="w-5 h-5" />
                  </div>
                )}
              </div>
            </CardTitle>
            <CardDescription>{date.toLocaleString()}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{props.newStatus}</p>
        <div className="flex justify-end items-center gap-3 mt-1">
          <div className="flex gap-1 items-center hover:text-green-700 cursor-pointer">
            <BiUpvote className="w-5 h-5" />
            13
          </div>
          <div className="flex gap-1 items-center hover:text-green-700 cursor-pointer">
            <FaRegComments className="w-5 h-5" />3
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
