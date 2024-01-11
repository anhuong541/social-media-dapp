import { useState } from "react";
import Link from "next/link";
import {
  useAddress,
  useContract,
  useContractEvents,
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
import { MdInterpreterMode } from "react-icons/md";
import { alice, encryptMsg, johnny } from "@/lib/encodeMsg";

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
  const [message, setMessage] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("Type a message...");
  const { contract } = useContract(CHAT_CONTRACT_ADDRESS);

  // You can get a specific event
  const {
    data: eventChatRequestAccepted,
    isLoading: isLoadingChatRequestAccepted,
  } = useContractEvents(contract, "ChatRequestAccepted");

  const eventChatRequestUserisChatting =
    !isLoadingChatRequestAccepted &&
    eventChatRequestAccepted &&
    eventChatRequestAccepted
      ?.map((item) => item.data)
      .filter(
        (item) =>
          (item.sender === address && item.receiver === directWallet) ||
          (item.sender === directWallet && item.receiver === address)
      );

  // console.log({ eventChatRequestUserisChatting });

  const { mutateAsync: sendMessage, isLoading: isLoadingSendMessage } =
    useContractWrite(contract, "sendMessage");

  const callSendMessage = async () => {
    if (message !== "") {
      try {
        if (
          !isLoadingChatRequestAccepted &&
          eventChatRequestAccepted &&
          eventChatRequestUserisChatting
        ) {
          const messageEnvryptReceiver = await encryptMsg(
            eventChatRequestUserisChatting[0].publicKeyReceiver,
            message
          );
          const messageEnvryptSender = await encryptMsg(
            eventChatRequestUserisChatting[0].publicKeySender,
            message
          );
          // nó éo nhận op jẹt
          // console.log({ messageEnvryptReceiver, messageEnvryptSender });
          const data = await sendMessage({
            args: [
              directWallet,
              JSON.stringify(messageEnvryptReceiver),
              JSON.stringify(messageEnvryptSender),
            ],
          });
          // console.info("contract call successs", data);
        }
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
          <MessageContent userAddress={address} directWallet={directWallet} />
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
