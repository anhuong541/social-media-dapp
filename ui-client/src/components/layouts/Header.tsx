import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { useRouter } from "next/router";
import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { PiNewspaper } from "react-icons/pi";
import { BiImageAdd } from "react-icons/bi";
import { truncateAddress } from "@/lib/utils";

import { MessageCircleIcon, WifiIcon } from "./Sidebar";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const router = useRouter();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <header className="w-full h-[10vh]">
      <div className="max-w-screen-xl h-full mx-auto flex items-center justify-between border-b px-3">
        <div className="font-medium text-2xl">
          Social Media <br className="sm:hidden" />{" "}
          <sup className="text-xs sm:block hidden">( Graduation thesis )</sup>
        </div>

        <div className="flex justify-end items-center md:gap-5 gap-1">
          <Link
            href={`/profile/${address}`}
            className="text-center py-1 px-3 hover:underline text-green-700 md:text-base text-sm"
          >
            <p>{truncateAddress(address!)}</p>
          </Link>
          <div className="lg:hidden flex justify-center items-center">
            <Sheet>
              <SheetTrigger>
                <GiHamburgerMenu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent className="pt-12">
                <SheetHeader>
                  {!address ? (
                    <ConnectWallet
                      modalSize="compact"
                      dropdownPosition={{
                        side: "bottom",
                        align: "start",
                      }}
                    />
                  ) : (
                    <Button variant="destructive" onClick={() => disconnect()}>
                      Disconnect
                    </Button>
                  )}
                </SheetHeader>
                <nav className="bg-white px-2 py-3 flex flex-col gap-3 border-r">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg hover:bg-green-200 p-3"
                  >
                    <WifiIcon className="h-6 w-6 text-green-700" />
                    <span className="font-medium text-gray-900">Stream</span>
                  </Link>
                  <Link
                    href="/room"
                    className="flex items-center gap-3 rounded-lg hover:bg-green-200 p-3"
                  >
                    <MessageCircleIcon className="h-6 w-6 text-green-700" />
                    <span className="font-medium text-gray-900">Hi!</span>
                  </Link>
                  <button
                    onClick={() => router.push(`/profile/${address}`)}
                    disabled={!address}
                    className={`flex items-center gap-3 rounded-lg hover:bg-green-200 p-3 ${
                      !address ? "opacity-40" : ""
                    }`}
                  >
                    <HomeIcon className="h-6 w-6 text-green-700" />
                    <span className="font-medium text-gray-900">
                      Feed History
                    </span>
                  </button>
                  <Link
                    href="/crypto"
                    className="flex items-center gap-3 rounded-lg hover:bg-green-200 p-3"
                  >
                    <BsCurrencyBitcoin className="h-6 w-6 text-green-700" />
                    <span className="font-medium text-gray-900">
                      Crypto Trends
                    </span>
                  </Link>
                  <Link
                    href="/news"
                    className="flex items-center gap-3 rounded-lg hover:bg-green-200 p-3"
                  >
                    <PiNewspaper className="h-6 w-6 text-green-700" />
                    <span className="font-medium text-gray-900">News</span>
                  </Link>
                  <div>
                    <Button
                      className="text-white dark:text-green-700"
                      variant="default"
                    >
                      <BiImageAdd className="mr-2 h-6 w-6" /> Mint NFT Image
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="lg:block hidden">
            {!address ? (
              <ConnectWallet
                modalSize="compact"
                dropdownPosition={{
                  side: "bottom",
                  align: "start",
                }}
              />
            ) : (
              <Button variant="destructive" onClick={() => disconnect()}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
