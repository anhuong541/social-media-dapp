import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Web3Button } from "@thirdweb-dev/react";
import { CHAT_CONTRACT_ADDRESS } from "../constants/addresses";
import { truncateAddress } from "@/lib/utils";

const friendListItems = [
  {
    address: "0xfD48208363DA96d5ED6E11343a50dD5272762528",
    title: "Quang Sang",
    // img: "https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no",
  },
  {
    address: "0x01B78D0cE42cF65c487B6683367C7Abc1929bd42",
    title: "Thanh Phong",
    // img: "https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no",
  },
  {
    address: "0x6d742a228B0949C68134d8E1e6164B6d9e8C4F76",
    title: "Le Duy",
    // img: "https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no",
  },
];

type FriendsChatType = {
  onChangeAddress: (value: string) => void;
};

export default function FriendsChat(props: FriendsChatType) {
  const [typeAddress, setTypeAddress] = useState<string>("");

  return (
    <div className="flex flex-col">
      <div className="py-4 px-4 border-b">
        {/* <Input
          onChange={(e) => {
            setTypeAddress(e.target.value);
          }}
          placeholder="Type your address!!"
        /> */}
        Choose
      </div>
      <div className="flex flex-col py-2">
        {friendListItems.map((item) => {
          return (
            <div
              className="flex items-center gap-2 px-4 py-3 hover:bg-green-200 cursor-pointer"
              onClick={() => props.onChangeAddress(item.address)}
              key={item.address}
            >
              {/* <Avatar>
                <AvatarImage src={item.img} alt="user Avatar" />
                <AvatarFallback>AH</AvatarFallback>
              </Avatar> */}
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-500">{truncateAddress(item.address)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
