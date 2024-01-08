import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Web3Button,
  useAddress,
  useContract,
  useContractEvents,
  useContractWrite,
} from "@thirdweb-dev/react";

import { CHAT_CONTRACT_ADDRESS } from "../constants/addresses";
import { truncateAddress } from "@/lib/utils";
import Lottie from "lottie-react";
import loadingLottie from "@/lib/loadingLottie.json";
import AddFriend from "./AddFriend";

type FriendsChatType = {
  addressSelected: string;
  onChangeAddress: (value: string) => void;
};

export default function FriendsChat(props: FriendsChatType) {
  const address = useAddress();

  const { contract } = useContract(CHAT_CONTRACT_ADDRESS);
  // You can get a specific event
  const { data: eventChatRequestSent, isLoading: isLoadingChatRequestSent } =
    useContractEvents(contract, "ChatRequestSent");

  // You can get a specific event
  const {
    data: eventChatRequestAccepted,
    isLoading: isLoadingChatRequestAccepted,
  } = useContractEvents(contract, "ChatRequestAccepted");

  const {
    mutateAsync: acceptChatRequest,
    isLoading: isLoadingAcceptChatRequest,
  } = useContractWrite(contract, "acceptChatRequest");

  const callAcceptChatRequest = async (sender: string) => {
    try {
      const data = await acceptChatRequest({ args: [sender] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  if (!address) {
    return (
      <div className="h-full w-full px-4 py-4 text-sm text-center text-red-500">
        You did not connected your wallet yet!
      </div>
    );
  }

  if (isLoadingChatRequestSent || isLoadingChatRequestAccepted) {
    return (
      <Lottie
        animationData={loadingLottie}
        loop={true}
        className="w-24 h-24 mx-auto"
      />
    );
  }

  const friendListItems: any =
    !isLoadingChatRequestAccepted &&
    eventChatRequestAccepted &&
    eventChatRequestAccepted
      .map((item) => item?.data)
      .map((data) => {
        if (data.sender === address) {
          return { address: data.receiver };
        } else if (data.receiver === address) {
          return { address: data.sender };
        }
        return { address: undefined };
      })
      .filter((item) => item?.address !== undefined);

  const friendRequestListItem =
    !isLoadingChatRequestSent &&
    eventChatRequestSent &&
    eventChatRequestSent
      .map((item) => item?.data)
      .filter((data) => data.receiver === address)
      .map((data) => {
        let addressIsAlreadyAdded = false;
        for (let i = 0; i < friendListItems.length; i++) {
          if (friendListItems[i].address === data.sender) {
            addressIsAlreadyAdded = true;
          }
        }
        if (!addressIsAlreadyAdded) {
          return { address: data.sender };
        }
      })
      .filter((item) => item?.address !== undefined);

  const formateventChatRequestSent = eventChatRequestSent
    ?.map((item) => item.data)
    .filter((data) => data.receiver === address)
    .map((data) => {
      let addressIsAlreadyAdded = false;
      for (let i = 0; i < friendListItems.length; i++) {
        if (friendListItems[i].address === data.sender) {
          addressIsAlreadyAdded = true;
        }
      }
      if (!addressIsAlreadyAdded) {
        return { address: data.sender };
      }
    });

  // console.log({
  //   friendRequestListItem,
  //   friendListItems,
  //   formateventChatRequestSent,
  // });

  return (
    <div className="flex-col h-full w-full">
      <AddFriend />
      <div className="flex flex-col py-2 gap-4">
        {!isLoadingChatRequestAccepted &&
          !isLoadingChatRequestSent &&
          eventChatRequestAccepted &&
          eventChatRequestSent &&
          friendRequestListItem!.length > 0 && (
            <div className="flex flex-col gap-2 px-1">
              <h2 className="font-medium text-sm px-3">
                You have {friendRequestListItem?.length} chat request
              </h2>
              {friendRequestListItem?.map((item: any, index: number) => {
                return (
                  <div
                    className="flex items-center justify-between gap-2 px-3 py-4 rounded-lg bg-green-600 text-white"
                    key={index}
                  >
                    {/* <Avatar>
                          <AvatarImage src={item?.img} alt="user Avatar" />
                          <AvatarFallback>AH</AvatarFallback>
                        </Avatar> */}
                    <div>
                      {/* <p className="font-medium">{item?.data.title}</p> */}
                      <p className="font-medium text-sm">
                        {truncateAddress(item?.address)}
                      </p>
                    </div>
                    <div
                      className="text-green-800 cursor-pointer rounded-full p-1 bg-white hover:text-white hover:bg-green-500"
                      onClick={async () => callAcceptChatRequest(item?.address)}
                    >
                      {!isLoadingAcceptChatRequest ? (
                        <FaCheck className="w-5 h-5" />
                      ) : (
                        <ReloadIcon className="animate-spin" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        <div className="flex flex-col gap-2 px-1">
          <h2 className="font-medium text-sm px-3">Friends List:</h2>
          <div className="flex flex-col">
            {!isLoadingChatRequestAccepted &&
              eventChatRequestAccepted &&
              friendListItems?.map((item: any, index: number) => {
                return (
                  <div
                    className={`flex items-center gap-2 px-3 py-4 rounded-lg hover:bg-green-500 hover:text-white cursor-pointer ${
                      props?.addressSelected === item?.address &&
                      "bg-green-600 text-white"
                    }`}
                    onClick={() => props.onChangeAddress(item?.address)}
                    key={index}
                  >
                    {/* <Avatar>
                  <AvatarImage src={item?.img} alt="user Avatar" />
                  <AvatarFallback>AH</AvatarFallback>
                </Avatar> */}
                    <div>
                      {/* <p className="font-medium">{item?.data.title}</p> */}
                      <p className="font-medium text-sm">
                        {truncateAddress(item?.address)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
