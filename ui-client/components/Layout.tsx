import { ReactNode } from "react";
import { FollowBar, Sidebar } from "./layouts";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen bg-gray-200">
      <div className="container h-full mx-auto xl:px-30 max-w-6xl">
        <div className="grid grid-cols-4 h-full">
          <Sidebar />
          <div className="col-span-3 lg:col-span-2 border-x-[1px] border-gray-500">
            {children}
          </div>
          <FollowBar />
        </div>
      </div>
    </div>
  );
}
