import { useCallback } from "react";
import { FaFeather } from "react-icons/fa";
import { useRouter } from "next/router";

const SidebarTweetButton = ({ name }: { name: string }) => {
  return (
    <div>
      <div className="mt-6 lg:hidden rounded-full h-14 w-14 p-4 flex items-center justify-center bg-[#DDF8D7] hover:bg-opacity-80 transition cursor-pointer">
        <FaFeather size={24} color="white" />
      </div>
      <div className="mt-6 hidden lg:block px-4 py-2 rounded-full bg-[#DDF8D7] hover:bg-opacity-90 cursor-pointer">
        <p className="hidden lg:block text-center font-medium text-[#008A50] text-[18px]">
          {name}
        </p>
      </div>
    </div>
  );
};

export default SidebarTweetButton;
