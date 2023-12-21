import { Badge } from "@/components/ui/badge";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { PiNewspaper } from "react-icons/pi";
import { Button } from "../ui/button";
import { BiImageAdd } from "react-icons/bi";
import Link from "next/link";

export default function SideBar() {
  return (
    <nav className="bg-white w-full h-full px-2 py-3 flex flex-col gap-3">
      {/* <Link
        href="/"
        className="flex items-center gap-3 rounded-lg hover:bg-green-200 p-3"
      >
        <HomeIcon className="h-6 w-6 text-green-700" />
        <span className="font-medium text-gray-900">Home</span>
      </Link> */}
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
        <span className="font-medium text-gray-900">Hi</span>
      </Link>
      {/* <Link href="/" className="flex items-center gap-3 rounded-lg hover:bg-green-200 py-3">
        <GroupIcon className="h-6 w-6 text-green-700" />
        <span className="font-medium text-gray-900">Group</span>
        <Badge variant="secondary">Beta</Badge>
      </Link> */}
      {/* <Link href="/" className="flex items-center gap-3 rounded-lg hover:bg-green-200 py-3">
        <MoreHorizontalIcon className="h-6 w-6 text-green-700" />
        <span className="font-medium text-gray-900">More</span>
      </Link> */}
      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg hover:bg-green-200 p-3"
      >
        <BsCurrencyBitcoin className="h-6 w-6 text-green-700" />
        <span className="font-medium text-gray-900">Crypto Trends</span>
      </Link>
      <Link
        href="/"
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

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  );
}

function WifiIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13a10 10 0 0 1 14 0" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M2 8.82a15 15 0 0 1 20 0" />
      <line x1="12" x2="12.01" y1="20" y2="20" />
    </svg>
  );
}

function GroupIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7V5c0-1.1.9-2 2-2h2" />
      <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
      <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
      <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
      <rect width="7" height="5" x="7" y="7" rx="1" />
      <rect width="7" height="5" x="10" y="12" rx="1" />
    </svg>
  );
}

function MoreHorizontalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}
