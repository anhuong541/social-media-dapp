"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HASHTAG_ITEMS } from "@/constants/navigation";
import { SOCIAL_COPY } from "@/constants/social";
import Footer from "../layouts/footer";

export default function FollowBar() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col justify-between gap-4 overflow-hidden px-4 py-4">
      <Card className="shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{SOCIAL_COPY.trendingTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {HASHTAG_ITEMS.map((item) => (
            <Link key={item.title} href="/">
              <Badge variant="outline" className="font-normal">
                #{item.title}
              </Badge>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div>
        <Separator className="mb-2" />
        <Footer />
      </div>
    </div>
  );
}
