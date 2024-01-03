import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge, badgeVariants } from "@/components/ui/badge";

const hashtagItems = [
  { title: "crypto" },
  { title: "web3" },
  { title: "Nimbus" },
  { title: "vku university" },
  { title: "daihoc" },
  { title: "Viet Han" },
];

export default function FollowBar() {
  return (
    <div className="p-4 space-y-4">
      {/* <Input className="w-full" placeholder="Search" /> */}
      <div className="bg-white p-4 rounded-lg space-y-2">
        <h2 className="text-lg font-semibold">Trending 🔥</h2>
        <div className="flex flex-wrap gap-2">
          {hashtagItems.map((item, index) => {
            return (
              <Link
                key={index}
                href="/"
                className={`${badgeVariants({ variant: "outline" })} shrink`}
              >
                #{item.title}
              </Link>
            );
          })}
          {/* <Button variant="ghost" className="rounded-xl self-end">
            Show more
          </Button> */}
        </div>
      </div>
      {/* <div className="bg-white p-4 rounded-lg space-y-2">
        <h2 className="text-lg font-semibold">Who to follow</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Avatar>
                <AvatarImage
                  src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
                  alt="user Avatar"
                />
                <AvatarFallback>AH</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Simon</p>
                <p className="text-gray-500">@socodemaker</p>
              </div>
            </div>
            <Button variant="outline">Follow</Button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Avatar>
                <AvatarImage
                  src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
                  alt="user Avatar"
                />
                <AvatarFallback>AH</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Ashley Kang</p>
                <p className="text-gray-500">@AshleyKang</p>
              </div>
            </div>
            <Button variant="outline">Follow</Button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Avatar>
                <AvatarImage
                  src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
                  alt="user Avatar"
                />
                <AvatarFallback>AH</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Frame</p>
                <p className="text-gray-500">@frame_xyz</p>
              </div>
            </div>
            <Button variant="outline">Follow</Button>
          </div>
        </div>
        <Button variant="ghost">Show more</Button>
      </div> */}
    </div>
  );
}
