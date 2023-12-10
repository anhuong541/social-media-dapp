import Image from "next/image";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/home/Feed";
import Widgets from "@/components/Widgets";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="max-w-[1400px] w-2/3 flex justify-between">
      <Sidebar initialSelectedIcon={"Home"} />
      <Feed />
      <Widgets />
    </div>
  );
}
