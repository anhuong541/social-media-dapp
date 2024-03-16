import { useAddress } from "@thirdweb-dev/react";

import Footer from "../../layouts/Footer";
import { AddFriend, AddPrivateKey, FriendList } from "./FriendsChatCom";

export type FriendsChatType = {
  addressSelected: string;
  onChangeAddress: (value: string) => void;
};

export default function FriendsChat(props: FriendsChatType) {
  const address = useAddress();

  if (!address) {
    return (
      <div className="h-full w-full px-4 py-4 text-sm text-center text-red-500">
        You did not connected your wallet yet!
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between w-full">
      <div className="flex flex-col">
        <AddFriend />
        <AddPrivateKey address={address} />
        <FriendList address={address} props={props} />
      </div>
      <Footer />
    </div>
  );
}
