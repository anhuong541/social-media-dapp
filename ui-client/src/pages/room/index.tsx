import ChatFeed from "@/components/Chat/ChatFeed";
import FriendsChat from "@/components/Chat/FriendsChat";
import { useState } from "react";

export type DirectWalletType = "unselected_wallet_@" | string;

export default function CharRoom() {
  const [directWallet, setDirectWallet] = useState<DirectWalletType>(
    "unselected_wallet_@"
  );
  return (
    <div className="grid xl:grid-cols-3 grid-cols-1 w-full h-[90vh]">
      <ChatFeed directWallet={directWallet} />
      <FriendsChat onChangeAddress={setDirectWallet} />
    </div>
  );
}
