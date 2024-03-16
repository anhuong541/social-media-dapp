import FollowBar from "@/components/Home/followbar";
import { NewsFeed } from "@/components/Home";

export default function Home() {
  return (
    <div className="grid grid-cols-3 flex-grow">
      <NewsFeed />
      <FollowBar />
    </div>
  );
}
