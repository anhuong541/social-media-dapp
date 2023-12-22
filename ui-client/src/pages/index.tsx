import FollowBar from "@/components/Home/Followbar";
import NewsFeed from "@/components/Home/NewsFeed";

export default function Home() {
  return (
    <div className="grid grid-cols-3">
      <NewsFeed />
      <FollowBar />
    </div>
  );
}
