import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { PiNewspaper } from "react-icons/pi";
import { BiImageAdd } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { MdOutlineCurrencyBitcoin } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";

import { Button } from "../ui/button";
import Link from "next/link";
import { FaRegComments } from "react-icons/fa";

export default function SideBar() {
  const router = useRouter();
  const address = useAddress();

  return (
    <nav className="bg-white px-2 py-3 lg:flex hidden flex-col gap-3 border-r">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg hover:bg-green-200 p-3"
      >
        <HiOutlineStatusOnline className="h-6 w-6 text-green-700" />
        <span className="font-medium text-gray-900">Stream</span>
      </Link>
      <Link
        href="/room"
        className="flex items-center gap-3 rounded-lg hover:bg-green-200 p-3"
      >
        <FaRegComments className="h-6 w-6 text-green-700" />
        <span className="font-medium text-gray-900">Hi!</span>
      </Link>
      <button
        onClick={() => router.push(`/profile/${address}`)}
        disabled={!address}
        className={`flex items-center gap-3 rounded-lg hover:bg-green-200 p-3 ${
          !address ? "opacity-40" : ""
        }`}
      >
        <IoPersonOutline className="h-6 w-6 text-green-700" />
        <span className="font-medium text-gray-900">Feed History</span>
      </button>
      <Link
        href="/crypto"
        className="flex items-center gap-3 rounded-lg hover:bg-green-200 p-3"
      >
        <MdOutlineCurrencyBitcoin className="h-6 w-6 text-green-700" />
        <span className="font-medium text-gray-900">Crypto Trends</span>
      </Link>
      <Link
        href="/news"
        className="flex items-center gap-3 rounded-lg hover:bg-green-200 p-3"
      >
        <PiNewspaper className="h-6 w-6 text-green-700" />
        <span className="font-medium text-gray-900">News</span>
      </Link>
      <div>
        <Button className="text-white dark:text-green-700" variant="default">
          <BiImageAdd className="mr-2 h-6 w-6" /> Mint NFT Image
        </Button>
      </div>
    </nav>
  );
}
