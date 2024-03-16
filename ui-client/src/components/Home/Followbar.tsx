import Link from "next/link";

import { badgeVariants } from "@/components/ui/badge";
import Footer from "../layouts/Footer";

const hashtagItems = [
  { title: "graduation thesis" },
  { title: "web3" },
  { title: "Nimbus" },
  { title: "vku university" },
  { title: "daihoc" },
  // { title: "Viet Han" },

  { title: "VKU" },
];

export default function FollowBar() {
  return (
    <div className="pt-4 lg:flex hidden flex-col justify-between">
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
