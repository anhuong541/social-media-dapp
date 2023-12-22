import ChatFeed from "@/components/Chat/ChatFeed";
import FriendsChat from "@/components/Chat/FriendsChat";

export default function CharRoom() {
  return (
    <div className="grid grid-cols-3 w-full">
      <ChatFeed />
      <FriendsChat />
    </div>
  );
}
