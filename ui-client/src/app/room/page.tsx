"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ChatFeed, FriendsChat } from "@/components/Chat";
import {
  DirectWalletType,
  UNSELECTED_WALLET,
} from "@/constants/navigation";

export default function RoomPage() {
  const { address } = useAccount();
  const [directWallet, setDirectWallet] =
    useState<DirectWalletType>(UNSELECTED_WALLET);

  useEffect(() => {
    setDirectWallet(UNSELECTED_WALLET);
  }, [address]);

  return (
    <div className="grid h-full min-h-0 w-full flex-1 grid-cols-1 overflow-hidden xl:grid-cols-3">
      <div className="min-h-0 xl:col-span-2">
        <ChatFeed
          onChangeAddress={setDirectWallet}
          directWallet={directWallet}
        />
      </div>
      <aside className="hidden min-h-0 border-l xl:flex">
        <FriendsChat
          onChangeAddress={setDirectWallet}
          addressSelected={directWallet}
        />
      </aside>
    </div>
  );
}
