"use client";

import FollowBar from "@/components/Home/followbar";
import { NewsFeed } from "@/components/Home";

export default function HomePage() {
  return (
    <div className="grid h-full min-h-0 w-full flex-1 grid-cols-1 overflow-hidden lg:grid-cols-3">
      <div className="min-h-0 lg:col-span-2">
        <NewsFeed />
      </div>
      <aside className="hidden min-h-0 border-l lg:flex">
        <FollowBar />
      </aside>
    </div>
  );
}
