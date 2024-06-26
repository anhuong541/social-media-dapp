import { STATUS_CONTRACT_ADDRESS } from "@/constants/addresses";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Web3Button } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useState } from "react";

type TipsType = {
  status: string;
  walletAddress: string;
  statusId: {
    type: string;
    _hex: string;
  };
};

export default function TipsSection({
  status,
  walletAddress,
  statusId,
}: TipsType) {
  const [tip, setTip] = useState(0.0);

  // console.log(tip);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-sm font-medium">
          Tip {walletAddress}
        </DialogTitle>
        {/* <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription> */}
      </DialogHeader>

      <div className="flex flex-col gap-4 pt-4">
        <div>
          <Input
            value={tip}
            onChange={(e) => {
              setTip(parseFloat(e.target.value));
            }}
            type="number"
            placeholder="!!!!"
            step="0.01"
          />
        </div>
        <div className="flex justify-end items-center gap-2">
          <Web3Button
            className="bg-[#2c9f41] cursor-pointer rounded-xl p-2 w-full h-10 text-sm hover:opacity-80"
            style={{
              backgroundColor: "#2c9f41",
              color: "white",
              height: "0px",
            }}
            contractAddress={STATUS_CONTRACT_ADDRESS}
            action={(contract) => {
              // Convert tip amount to wei
              const tipInWei = ethers.utils.parseEther(tip.toString());
              contract.call("tipUser", [walletAddress], {
                value: tipInWei,
              });
            }}
            onSuccess={() => {
              setTip(0.0);
            }}
          >
            Post
          </Web3Button>
        </div>
      </div>
    </DialogContent>
  );
}
