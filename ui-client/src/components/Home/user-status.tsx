import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useContract,
  useContractRead,
  useDisconnect,
} from "@thirdweb-dev/react";

import { useState } from "react";
import styles from "@/styles/Home.module.css";
import Lottie from "lottie-react";
import loadingLottie from "@/lib/loadingLottie.json";
import Link from "next/link";
import { truncateAddress } from "@/lib/utils";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

export default function UserStatus() {
  const address = useAddress();
  const disconnect = useDisconnect();
  const [newStatus, setNewStatus] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const characterDecoration =
    characterCount >= 140
      ? styles.characterCountOver
      : styles.characterCountUnder;

  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);

  const { data: myStatus, isLoading: isMyStatusLoading } = useContractRead(
    contract,
    "getStatus",
    [address]
  );

  if (!address) {
    return (
      <div>
        <ConnectWallet
          modalSize="compact"
          dropdownPosition={{
            side: "bottom",
            align: "start",
          }}
        />
        <p>Please connect your wallet.</p>
      </div>
    );
  }

  if (isMyStatusLoading) {
    return (
      <div className={styles.sectionLoading}>
        <Lottie animationData={loadingLottie} loop={true} />
      </div>
    );
  }

  return (
    <div className={styles.userContainer}>
      <div className="flex gap-2 w-full flex-1">
        {/* <Avatar>
          <AvatarImage
            src="https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no"
            alt="user Avatar"
          />
          <AvatarFallback>AH</AvatarFallback>
        </Avatar> */}
        <Input className="flex-grow" placeholder="What's on your mind today?" />
        <Button variant="default" onClick={() => setIsStatusModalOpen(true)}>
          Post
        </Button>
      </div>
      {isStatusModalOpen && (
        <div className={styles.statusModalContainer}>
          <div className={styles.statusModal}>
            <div className={styles.statusModalHeader}>
              <p>New Status:</p>
              <button onClick={() => setIsStatusModalOpen(false)}>Close</button>
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
              <p className={characterDecoration}>{characterCount}/140</p>
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
      )}
    </div>
  );
}
