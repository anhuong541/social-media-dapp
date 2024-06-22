import { Button } from "../../../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "../../../ui/input";
import { useState } from "react";
import {
  useContract,
  useContractEvents,
  useContractWrite,
} from "@thirdweb-dev/react";
import { CHAT_CONTRACT_ADDRESS } from "../../../../constants/addresses";
import { DirectWalletType } from "@/pages/room";
import { encryptMsg } from "@/lib/encodeMsg";

export default function SendMessage({
  address,
  directWallet,
}: {
  address: string | undefined;
  directWallet: DirectWalletType;
}) {
  const [inputPlaceholder, setInputPlaceholder] = useState("Type a message...");
  const [message, setMessage] = useState("");

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

  return (
    <div className="flex items-center justify-between gap-2 p-3 border-t border-gray-300 w-full relative">
      {/* need emoji */}
      <Input
        className="flex-1 rounded-lg h-10 py-2"
        value={message}
        placeholder={inputPlaceholder}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!address}
      />
      {/* <div
            className="flex justify-center items-center px-2 h-full"
            onClick={() => setIsOpenEmoji(!isOpenEmoji)}
          >
            <Image src="/emoji.svg" alt="" width={25} height={25} />
            <div
              className={`absolute bottom-20 right-5 ${
                isOpenEmoji ? "block" : "hidden"
              }`}
            >
              <EmojiPicker
                onEmojiClick={(emojiData: EmojiClickData) => {
                  console.log({ emojiData });
                  setMessage(message + " " + emojiData.emoji);
                }}
              />
            </div>
          </div> */}
      <Button
        onClick={callSendMessage}
        disabled={!address && isLoadingSendMessage}
        className="rounded-lg"
      >
        {!isLoadingSendMessage ? (
          "Send"
        ) : (
          <ReloadIcon className="animate-spin" />
        )}
      </Button>
    </div>
  );
}
