import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { BigNumber } from "ethers";
import { formatTime, truncateAddress } from "@/lib/utils";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";

type EventCardProps = {
  walletAddress: string;
  newStatus: string;
  timeStamp: BigNumber;
};

export default function EventCard(props: EventCardProps) {
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
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
              alt="user Avatar"
            />
            <AvatarFallback>AH</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {truncateAddress(props.walletAddress)}
            </CardTitle>
            <CardDescription>{date.toLocaleString()}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{props.newStatus}</p>
        {/* <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2"></div>
        </div> */}
      </CardContent>
    </Card>
  );
}
