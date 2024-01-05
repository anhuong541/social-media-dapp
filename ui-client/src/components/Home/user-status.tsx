import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useContract,
  useContractRead,
  useDisconnect,
} from "@thirdweb-dev/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";
import Lottie from "lottie-react";
import loadingLottie from "@/lib/loadingLottie.json";
import Link from "next/link";
import { truncateAddress } from "@/lib/utils";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

export default function UserStatus({
  statusFeedsLengh,
}: {
  statusFeedsLengh: number;
}) {
  const address = useAddress();
  // const disconnect = useDisconnect();
  const [newStatus, setNewStatus] = useState("");
  const [dialogOnClose, setDialogOnClose] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);

  const { data: myStatus, isLoading: isMyStatusLoading } = useContractRead(
    contract,
    "getStatus",
    [address, statusFeedsLengh + 1]
  );

  if (!address) {
    return (
      <div className="text-red-500">
        Your did not connected your wallet yet!
      </div>
    );
  }

  if (isMyStatusLoading) {
    return (
      <Lottie
        animationData={loadingLottie}
        loop={true}
        className="w-24 h-24 mx-auto"
      />
    );
  }

  return (
    <div className="w-full">
      <Dialog>
        <div className="w-full flex justify-center">
          <Button
            variant="default"
            onClick={() => setDialogOnClose(false)}
            className="w-[200px]"
          >
            <DialogTrigger>Posting</DialogTrigger>
          </Button>
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

        {/* {isStatusModalOpen && (
        <div className="">
          <div className={styles.statusModal}>
            <div className={styles.statusModalHeader}>
              <p>New Status:</p>
              <button>Close</button>
            </div>
            <textarea
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e.target.value);
                setCharacterCount(e.target.value.length);
              }}
              placeholder="What is on your mind today!"
            />
            <div className={styles.characterCountContainer}>
              <p
                className={`${
                  characterCount >= 140 ? "text-red-500" : "text-white"
                }`}
              >
                {characterCount}/140
              </p>
            </div>
            <Web3Button
              className={styles.statusModalButton}
              contractAddress={STATUS_CONTRACT_ADDRESS}
              action={(contract) => contract.call("setStatus", [newStatus])}
              isDisabled={characterCount === 0 || characterCount > 140}
              onSuccess={() => {
                setIsStatusModalOpen(false);
                setNewStatus("");
              }}
            >
              Post
            </Web3Button>
          </div>
        </div>
      )} */}
      </Dialog>
    </div>
  );
}
