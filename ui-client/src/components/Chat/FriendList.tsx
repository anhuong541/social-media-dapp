import { FaCheck } from "react-icons/fa6";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  useContract,
  useContractEvents,
  useContractWrite,
} from "@thirdweb-dev/react";
import Lottie from "lottie-react";

import { truncateAddress } from "@/lib/utils";
import { getPublicKeyByPrivate } from "@/lib/encodeMsg";
import { decryptPrivateKey } from "@/lib/enCodePrivateKey";
import { CHAT_CONTRACT_ADDRESS } from "../constants/addresses";
import loadingLottie from "@/lib/loadingLottie.json";
import { FriendsChatType } from "./FriendsChat";

export default function FriendList({
  props,
  address,
}: {
  props: FriendsChatType;
  address: string;
}) {
  const encryptedPrivateKey = address && localStorage.getItem(address);
  const userPrivateKey = decryptPrivateKey(encryptedPrivateKey!, "123123");

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
      if (userPrivateKey[0].status === "success") {
        const publicKey = getPublicKeyByPrivate(userPrivateKey[0].message);
        const data = await acceptChatRequest({ args: [sender, publicKey] });
        console.info("contract call successs", data);
      }
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

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

  // const formateventChatRequestSent = eventChatRequestSent
  //   ?.map((item) => item.data)
  //   .filter((data) => data.receiver === address)
  //   .map((data) => {
  //     let addressIsAlreadyAdded = false;
  //     for (let i = 0; i < friendListItems.length; i++) {
  //       if (friendListItems[i].address === data.sender) {
  //         addressIsAlreadyAdded = true;
  //       }
  //     }
  //     if (!addressIsAlreadyAdded) {
  //       return { address: data.sender };
  //     }
  //   });

  // console.log({
  //   friendRequestListItem,
  //   friendListItems,
  //   // formateventChatRequestSent,
  // });

  return (
    <div className="flex flex-col py-2 gap-4">
      {!isLoadingChatRequestAccepted &&
        !isLoadingChatRequestSent &&
        eventChatRequestAccepted &&
        eventChatRequestSent &&
        friendRequestListItem!.length > 0 &&
        userPrivateKey[0].status === "success" && (
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
          userPrivateKey[0].status === "success" ? (
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
            })
          ) : (
            <div className="text-sm text-red-500 text-center px-4">
              You need to add your private key to connect chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
