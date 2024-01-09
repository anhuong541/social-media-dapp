import { formatDateTimeHex, truncateAddress } from "@/lib/utils";
import { chatFeedsFormatType } from "./ChatFeed";

export default function MessageContent({ chatFeedsFormat, userAddress }: any) {
  return (
    <div className="flex-grow flex flex-col-reverse gap-4 px-6 py-4">
      {chatFeedsFormat.map((item: chatFeedsFormatType, index: number) => {
        if (item.sender === userAddress) {
          return (
            <div className="flex items-start space-x-3 ml-auto" key={index}>
              <div className="bg-green-600 text-white rounded-lg p-3 w-[fit-content]">
                <p className="font-medium text-sm">You</p>
                <p>{item.message1}</p>
                <p>{item.message2}</p>
                <p className="text-xs text-white mt-2">
                  {formatDateTimeHex(item.timestamp._hex)}
                </p>
              </div>
              {/* <Avatar className="h-9 w-9">
                <AvatarImage
                  alt="User avatar"
                  src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
                />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar> */}
            </div>
          );
        } else {
          return (
            <div className="flex items-start space-x-3" key={index}>
              {/* <Avatar className="h-9 w-9">
              <AvatarImage
                alt="User avatar"
                src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
              />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar> */}
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 w-[fit-content]">
                <p className="font-medium text-sm">
                  {truncateAddress(item.sender)}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {item.message1}
                  {item.message2}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDateTimeHex(item.timestamp._hex)}
                </p>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
