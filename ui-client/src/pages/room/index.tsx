import ChatFeed from "@/components/Chat/ChatFeed";
import FriendsChat from "@/components/Chat/FriendsChat";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

export type DirectWalletType = "unselected_wallet_@" | string;

export default function CharRoom() {
  const address = useAddress();
  const [directWallet, setDirectWallet] = useState<DirectWalletType>(
    "unselected_wallet_@"
  );

  useEffect(() => {
    setDirectWallet("unselected_wallet_@");
  }, [useAddress()]);

  return (
    <div className="grid xl:grid-cols-3 grid-cols-1 w-full h-[90vh]">
      <ChatFeed onChangeAddress={setDirectWallet} directWallet={directWallet} />
      <div className="xl:flex hidden">
        <FriendsChat
          onChangeAddress={setDirectWallet}
          addressSelected={directWallet}
        />
      </div>
    </div>
  );
}
