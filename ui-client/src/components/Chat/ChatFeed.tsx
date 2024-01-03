import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function ChatFeed() {
  return (
    <div className="flex flex-col justify-between items-center xl:col-span-2 py-4 border-r h-full">
      <div className="flex flex-col gap-4 px-8 w-full">
        <div className="flex items-start space-x-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              alt="User avatar"
              src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
            />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 w-[fit-content]">
            <p className="font-medium text-sm">John Doe</p>
            <p className="text-gray-800 dark:text-gray-200">
              Hello! How can I assist you today?
            </p>
            <p className="text-xs text-gray-500 mt-2">10:15 AM</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 ml-auto">
          <div className="bg-green-600 text-white rounded-lg p-3 w-[fit-content]">
            <p className="font-medium text-sm">You</p>
            <p>My parrent is gone!</p>
            <p className="text-xs text-white mt-2">10:16 AM</p>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage
              alt="User avatar"
              src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
            />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-start space-x-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              alt="User avatar"
              src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
            />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 w-[fit-content]">
            <p className="font-medium text-sm">John Doe</p>
            <p className="text-gray-800 dark:text-gray-200">
              Sorry to hear that.
            </p>
            <p className="text-xs text-gray-500 mt-2">10:17 AM</p>
          </div>
        </div>
      </div>
      <div className="flex items-center p-3 border-t border-gray-300 w-full">
        {/* need emoji */}
        <Input className="flex-1" placeholder="Type a message..." />
        <Button className="ml-2">Send</Button>
      </div>
    </div>
  );
}
