"use client";

import StatusEvents from "./statusEvent";
import UserStatus from "./userStatus";

export default function NewsFeed() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden px-4 py-4">
      <UserStatus />
      <div className="min-h-0 flex-1">
        <StatusEvents />
      </div>
    </div>
  );
}
