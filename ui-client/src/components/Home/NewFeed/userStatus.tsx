import { Web3Button, useAddress } from "@thirdweb-dev/react";
import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { STATUS_CONTRACT_ADDRESS } from "../../../constants/addresses";
import { Button } from "../../ui/button";

export default function UserStatus() {
  const address = useAddress();
  const [newStatus, setNewStatus] = useState("");
  const [dialogOnClose, setDialogOnClose] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  if (!address) {
    return (
      <div className="text-red-500">You did not connected your wallet yet!</div>
    );
  }

  return (
    <div className="w-full">
      <Dialog>
        <div className="w-full flex justify-center">
          <DialogTrigger>
            <Button
              variant="default"
              onClick={() => setDialogOnClose(false)}
              className="w-[200px]"
            >
              Posting
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          {dialogOnClose ? (
            <DialogHeader>
              <DialogTitle>Status Updated!</DialogTitle>
              <DialogDescription>
                You can close the popup now!
              </DialogDescription>
            </DialogHeader>
          ) : (
            <DialogHeader>
              <DialogTitle>New Status:</DialogTitle>
              <DialogDescription>Typing your thought!</DialogDescription>
            </DialogHeader>
          )}

          {dialogOnClose ? (
            <DialogClose>close</DialogClose>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea
                value={newStatus}
                onChange={(e) => {
                  setNewStatus(e.target.value);
                  setCharacterCount(e.target.value.length);
                }}
                placeholder="What is on your mind today!"
                className="h-40 py-2 px-4 border"
              />
              <div className="flex justify-end w-full pr-2">
                <p
                  className={`${
                    characterCount >= 140 ? "text-red-500" : "text-black"
                  }`}
                >
                  {characterCount}/140
                </p>
              </div>

              <Web3Button
                className="bg-[#2c9f41] cursor-pointer rounded-xl p-2 w-full h-10 text-sm hover:opacity-80"
                style={{
                  backgroundColor: "#2c9f41",
                  color: "white",
                  height: "0px",
                }}
                contractAddress={STATUS_CONTRACT_ADDRESS}
                action={(contract) => contract.call("setStatus", [newStatus])}
                isDisabled={characterCount === 0 || characterCount > 140}
                onSuccess={() => {
                  setNewStatus("");
                  setDialogOnClose(true);
                }}
              >
                Post
              </Web3Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
