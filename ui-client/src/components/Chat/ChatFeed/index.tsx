import { useState } from "react";
import Link from "next/link";
import { useAddress } from "@thirdweb-dev/react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { FaUserFriends } from "react-icons/fa";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DirectWalletType } from "@/pages/room";
import { MessageContent, SendMessage } from "./ChatFeedCom";
import FriendsChat from "../FriendsChat";

export type chatFeedsFormatType = {
  sender: string;
  receiver: string;
  timestamp: {
    type: number;
    _hex: string;
  };
  message1: string;
  message2: string;
  dataIndex: number;
};

export default function ChatFeed({
  directWallet,
  onChangeAddress,
}: {
  directWallet: DirectWalletType;
  onChangeAddress: (value: string) => void;
}) {
  const address = useAddress();
  const [isOpenEmoji, setIsOpenEmoji] = useState<boolean>(false);

  if (directWallet == "unselected_wallet_@") {
    return (
      <div className="xl:col-span-2 border-r h-full">
        <div className="py-3 px-6 border-b flex justify-between items-center w-full">
          <div className="text-sm font-medium">Address: </div>
          <Sheet>
            <SheetTrigger className="xl:hidden">
              <FaUserFriends className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent>
              <FriendsChat
                onChangeAddress={onChangeAddress}
                addressSelected={directWallet}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center xl:col-span-2 border-r h-full">
      <div className="py-3 px-6 border-b flex justify-between items-center w-full">
        <div className="text-sm font-medium">
          Address:{" "}
          <Link
            href={`/profile/${directWallet}`}
            className="hover:underline hover:font-semibold"
          >
            {directWallet}
          </Link>
        </div>
        <Sheet>
          <SheetTrigger className="xl:hidden">
            <FaUserFriends className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent>
            <FriendsChat
              onChangeAddress={onChangeAddress}
              addressSelected={directWallet}
            />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-col justify-between items-center flex-grow h-[80vh] w-full">
        <MessageContent userAddress={address} directWallet={directWallet} />
        <SendMessage address={address} directWallet={directWallet} />
      </div>
    </div>
  );
}
