import { useState } from "react";
import Link from "next/link";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { FaUserFriends } from "react-icons/fa";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CHAT_CONTRACT_ADDRESS } from "../constants/addresses";
import { DirectWalletType } from "@/pages/room";
import Lottie from "lottie-react";
import loadingLottie from "@/lib/loadingLottie.json";
import MessageContent from "./MessageContent";
import { FriendsChat } from ".";

export type chatFeedsFormatType = {
  sender: string;
  receiver: string;
  timestamp: {
    type: number;
    _hex: string;
  };
  message: string;
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
  const [message, setMessage] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("Type a message...");
  const { contract } = useContract(CHAT_CONTRACT_ADDRESS);

  const { data: chatFeeds, isLoading: isLoadingChatFeeds } = useContractRead(
    contract,
    "getAllChatMessagesWithInfo",
    [address, directWallet]
  );

  const { mutateAsync: sendMessage, isLoading: isLoadingSendMessage } =
    useContractWrite(contract, "sendMessage");

  const callSendMessage = async () => {
    if (message !== "") {
      try {
        const data = await sendMessage({ args: [directWallet, message] });
        // console.info("contract call successs", data);
      } catch (err) {
        console.error("contract call failure", err);
      } finally {
        setMessage("");
      }
    } else {
      setInputPlaceholder("You need to typing your message!!!");
    }
  };

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

  if (isLoadingChatFeeds) {
    return (
      <div className="xl:col-span-2 border-r h-full">
        <Lottie
          animationData={loadingLottie}
          loop={true}
          className="w-24 h-24 mx-auto"
        />
      </div>
    );
  }

  const chatFeedsFormat = chatFeeds
    .map((array: any, dataIndex: number) => {
      return {
        sender: array[0],
        receiver: array[1],
        timestamp: array[2],
        message: array[3],
        dataIndex: dataIndex,
      };
    })
    .sort((a: chatFeedsFormatType, b: chatFeedsFormatType) => {
      const decimalA = parseInt(a.timestamp._hex, 16);
      const decimalB = parseInt(b.timestamp._hex, 16);
      return decimalB - decimalA;
    });

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
        <div className="flex flex-col w-full h-full overflow-y-auto">
          <MessageContent
            userAddress={address}
            chatFeedsFormat={chatFeedsFormat}
          />
        </div>
        <div className="flex items-center p-3 border-t border-gray-300 w-full">
          {/* need emoji */}
          <Input
            className="flex-1"
            value={message}
            placeholder={inputPlaceholder}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            className="ml-2"
            onClick={callSendMessage}
            disabled={isLoadingSendMessage}
          >
            {!isLoadingSendMessage ? (
              "Send"
            ) : (
              <ReloadIcon className="animate-spin" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
