"use client";

import { useEffect, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";

import { STATUS_CONTRACT_ADDRESS } from "@/constants/addresses";
import { TIP_TOKEN_SYMBOL } from "@/constants/app";
import { SOCIAL_COPY, TIP_AMOUNT_STEP } from "@/constants/social";
import { statusContractAbi } from "@/abi/statusContract";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/utils";

type TipsType = {
  status: string;
  walletAddress: string;
  statusId: bigint;
};

export default function TipsSection({ walletAddress }: TipsType) {
  const [tip, setTip] = useState(0.0);
  const { writeContractAsync, data: hash, isPending, reset } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setTip(0.0);
      reset();
    }
  }, [isSuccess, reset]);

  const sendTip = async () => {
    if (!tip || tip <= 0) return;
    try {
      await writeContractAsync({
        address: STATUS_CONTRACT_ADDRESS,
        abi: statusContractAbi,
        functionName: "tipUser",
        args: [walletAddress as `0x${string}`],
        value: parseEther(tip.toString()),
      });
    } catch (err) {
      console.error("tipUser failed", err);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{SOCIAL_COPY.tipDialogTitle}</DialogTitle>
        <DialogDescription>
          {SOCIAL_COPY.tipDialogDescription} ({truncateAddress(walletAddress)})
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4 pt-1">
        <div className="flex flex-col gap-2">
          <Label htmlFor="tip-amount">
            {SOCIAL_COPY.tipAmountLabel} ({TIP_TOKEN_SYMBOL})
          </Label>
          <Input
            id="tip-amount"
            value={Number.isNaN(tip) ? "" : tip}
            onChange={(e) => {
              setTip(parseFloat(e.target.value));
            }}
            type="number"
            placeholder={SOCIAL_COPY.tipAmountPlaceholder}
            step={TIP_AMOUNT_STEP}
            min={0}
          />
        </div>
        <Button
          className="w-full"
          disabled={isPending || isConfirming || !tip || tip <= 0}
          onClick={() => void sendTip()}
        >
          {isPending || isConfirming ? "Sending..." : SOCIAL_COPY.sendTip}
        </Button>
      </div>
    </DialogContent>
  );
}
