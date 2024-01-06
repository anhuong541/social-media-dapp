import ChatFeed from "@/components/Chat/ChatFeed";
import FriendsChat from "@/components/Chat/FriendsChat";

export default function CharRoom() {
  return (
    <div className="grid xl:grid-cols-3 grid-cols-1 w-full h-[90vh]">
      <ChatFeed />
      <FriendsChat />
    </div>
  );
}
