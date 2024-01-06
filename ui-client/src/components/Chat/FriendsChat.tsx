import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import {
  Web3Button,
  useAddress,
  useContract,
  useContractEvents,
} from "@thirdweb-dev/react";
import { CHAT_CONTRACT_ADDRESS } from "../constants/addresses";
import { truncateAddress } from "@/lib/utils";
import Lottie from "lottie-react";
import loadingLottie from "@/lib/loadingLottie.json";

// const friendListItems = [
//   {
//     address: "0xfD48208363DA96d5ED6E11343a50dD5272762528",
//     title: "Quang Sang",
//     // img: "https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no",
//   },
//   {
//     address: "0x01B78D0cE42cF65c487B6683367C7Abc1929bd42",
//     title: "Thanh Phong",
//     // img: "https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no",
//   },
//   {
//     address: "0x6d742a228B0949C68134d8E1e6164B6d9e8C4F76",
//     title: "Le Duy",
//     // img: "https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no",
//   },
// ];

type FriendsChatType = {
  addressSelected: string;
  onChangeAddress: (value: string) => void;
};

export default function FriendsChat(props: FriendsChatType) {
  const address = useAddress();
  const [typeAddress, setTypeAddress] = useState<string>("");

  const { contract } = useContract(CHAT_CONTRACT_ADDRESS);
  // You can get a specific event
  const { data: eventChatRequestSent, isLoading: isLoadingChatRequestSent } =
    useContractEvents(contract, "ChatRequestSent");

  // You can get a specific event
  const {
    data: eventChatRequestAccepted,
    isLoading: isLoadingChatRequestAccepted,
  } = useContractEvents(contract, "ChatRequestAccepted");

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
      .map((item) => item.data)
      .map((data) => {
        if (data.sender === address) {
          return { address: data.receiver };
        } else if (data.receiver === address) {
          return { address: data.sender };
        }
      });

  const friendRequestListItem =
    !isLoadingChatRequestSent &&
    eventChatRequestSent &&
    eventChatRequestSent
      .map((item) => item.data)
      .filter((data) => data.receiver === address)
      .map((data) => {
        for (let i = 0; i < friendListItems.length; i++) {
          if (friendListItems[i].address !== data.sender) {
            return { address: data.sender };
          }
        }
      })
      .filter((item) => item?.address !== undefined);

  console.log({ friendRequestListItem, friendListItems });

  return (
    <div className="flex flex-col">
      <div className="py-3 px-4 border-b text-sm font-medium">
        {/* <Input
          onChange={(e) => {
            setTypeAddress(e.target.value);
          }}
          placeholder="Type your address!!"
        /> */}
        &rdquo;Phần chọn địa chỉ ví để gửi kết nối&rdquo;
      </div>
      <div className="flex flex-col py-2 gap-4">
        {!isLoadingChatRequestAccepted &&
          !isLoadingChatRequestSent &&
          eventChatRequestAccepted &&
          eventChatRequestSent && (
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-sm px-4">
                You have {friendRequestListItem?.length} friend request
              </h2>
              {friendRequestListItem?.map((item: any, index: number) => {
                return (
                  <div
                    className="flex items-center justify-between gap-2 px-4 py-3 bg-green-800 text-white"
                    key={index}
                  >
                    {/* <Avatar>
                  <AvatarImage src={item.img} alt="user Avatar" />
                  <AvatarFallback>AH</AvatarFallback>
                </Avatar> */}
                    <div>
                      {/* <p className="font-medium">{item.data.title}</p> */}
                      <p className="font-medium text-sm">
                        {truncateAddress(item.address)}
                      </p>
                    </div>
                    <div className="text-green-800 cursor-pointer rounded-full p-1 bg-white hover:text-white hover:bg-green-500">
                      <FaCheck />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-sm px-4">Friend List:</h2>
          {!isLoadingChatRequestAccepted &&
            eventChatRequestAccepted &&
            friendListItems?.map((item: any, index: number) => {
              return (
                <div
                  className={`flex items-center gap-2 px-4 py-3 hover:bg-green-800 text-white cursor-pointer ${
                    props.addressSelected === item.address && "bg-green-800"
                  }`}
                  onClick={() => props.onChangeAddress(item.address)}
                  key={index}
                >
                  {/* <Avatar>
                  <AvatarImage src={item.img} alt="user Avatar" />
                  <AvatarFallback>AH</AvatarFallback>
                </Avatar> */}
                  <div>
                    {/* <p className="font-medium">{item.data.title}</p> */}
                    <p className="font-medium text-sm">
                      {truncateAddress(item.address)}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
