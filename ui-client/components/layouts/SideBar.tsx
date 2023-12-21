import {
  BsHouseFill,
  BsChatLeftText,
  BsCoin,
  BsNewspaper,
} from "react-icons/bs";
import SidebarTweetButton from "./SidebarTweetButton";

export default function Sidebar() {
  const items = [
    {
      icon: BsHouseFill,
      label: "Home",
      href: "/",
    },
    // {
    //   icon: BsBellFill,
    //   label: "Notifications",
    //   href: "/notifications",
    //   auth: true,
    //   alert: currentUser?.hasNotification,
    // },
    // {
    //   icon: FaUser,
    //   label: "Profile",
    //   href: `/users/${currentUser?.id}`,
    //   // auth: true,
    // },
    {
      icon: BsChatLeftText,
      label: "Say Hi",
      href: `/`,
      // auth: true,
    },
    {
      icon: BsCoin,
      label: "Crypto Trends",
      href: `/`,
      // auth: true,
    },
    {
      icon: BsNewspaper,
      label: "News",
      href: `/`,
      // auth: true,
    },
  ];

  return (
    <div className="col-span-1 h-full pr-4 md:pr-6 bg-[#008A50]">
      <div className="flex flex-col items-end">
        <div className="space-y-2 lg:w-[230px]">
          <SidebarTweetButton name="Post" />
          <SidebarTweetButton name="Mint Nft" />
        </div>
      </div>
    </div>
  );
}
