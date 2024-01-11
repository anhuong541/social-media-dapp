import { formatDateTimeHex, truncateAddress } from "@/lib/utils";
import { chatFeedsFormatType } from "./ChatFeed";
import { decryptPrivateKey } from "@/lib/enCodePrivateKey";
import { useEffect, useMemo, useState } from "react";
import { decryptMsg } from "@/lib/encodeMsg";
import Lottie from "lottie-react";
import loadingLottie from "@/lib/loadingLottie.json";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { CHAT_CONTRACT_ADDRESS } from "../constants/addresses";

export default function MessageContent({ userAddress, directWallet }: any) {
  const [messageContentRender, setMessageContentRender] = useState([]);
  const encryptedPrivateKey = localStorage.getItem(userAddress);
  const userPrivateKey =
    encryptedPrivateKey && decryptPrivateKey(encryptedPrivateKey, "123123");

  const { contract } = useContract(CHAT_CONTRACT_ADDRESS);
  const { data: chatFeeds, isLoading: isLoadingChatFeeds } = useContractRead(
    contract,
    "getAllChatMessagesWithInfo",
    [userAddress, directWallet]
  );

  const chatFeedsFormat =
    !isLoadingChatFeeds &&
    chatFeeds
      .map((array: chatFeedsFormatType[], dataIndex: number) => {
        return {
          sender: array[0],
          receiver: array[1],
          timestamp: array[2],
          message1: array[3],
          message2: array[4],
          dataIndex: dataIndex,
        };
      })
      .sort((a: chatFeedsFormatType, b: chatFeedsFormatType) => {
        const decimalA = parseInt(a.timestamp._hex, 16);
        const decimalB = parseInt(b.timestamp._hex, 16);
        return decimalB - decimalA;
      });

  const messageContentFormatDataArr = useMemo(async () => {
    if (!isLoadingChatFeeds) {
      return Promise.all(
        chatFeedsFormat.map(async (item: chatFeedsFormatType) => {
          const decryptedMessage1 = await decryptMsg(
            userPrivateKey[0].message,
            JSON.parse(item.message1)
          );
          const decryptedMessage2 = await decryptMsg(
            userPrivateKey[0].message,
            JSON.parse(item.message2)
          );

          return {
            sender: item.sender,
            receiver: item.receiver,
            timestamp: item.timestamp,
            message1: decryptedMessage1,
            message2: decryptedMessage2,
            dataIndex: item.dataIndex,
          };
        })
      ).then((value: any) => setMessageContentRender(value));
    }
  }, [userAddress, chatFeedsFormat.length]);

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
  // console.log({ userPrivateKey });

  if (userPrivateKey[0].status === "success")
    return (
      <div className="flex-grow flex flex-col-reverse gap-4 px-6 py-4">
        {messageContentRender.map(
          (item: chatFeedsFormatType, index: number) => {
            if (item.sender === userAddress) {
              return (
                <div className="flex items-start space-x-3 ml-auto" key={index}>
                  <div className="bg-green-600 text-white rounded-lg p-3 w-[fit-content]">
                    <p className="font-medium text-sm">You</p>
                    <p className="break-all">{item.message1}</p>
                    <p className="break-all">{item.message2}</p>
                    <p className="text-xs text-white mt-2">
                      {formatDateTimeHex(item.timestamp._hex)}
                    </p>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="flex items-start space-x-3" key={index}>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 w-[fit-content]">
                    <p className="font-medium text-sm">
                      {truncateAddress(item.sender)}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 break-all">
                      {item.message1}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 break-all">
                      {item.message2}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDateTimeHex(item.timestamp._hex)}
                    </p>
                  </div>
                </div>
              );
            }
          }
        )}
      </div>
    );
}
