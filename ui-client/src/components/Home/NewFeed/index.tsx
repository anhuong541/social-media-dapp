import StatusEvents from "./statusEvent";
import UserStatus from "./userStatus";

export default function NewsFeed() {
  return (
    <div className="flex-grow py-4 lg:col-span-2 col-span-3 space-y-4">
      <UserStatus />
      <StatusEvents />
    </div>
  );
}
