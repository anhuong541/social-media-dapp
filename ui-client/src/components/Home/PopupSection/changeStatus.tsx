"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { STATUS_CONTRACT_ADDRESS } from "@/constants/addresses";
import { SOCIAL_COPY, STATUS_MAX_CHARACTERS } from "@/constants/social";
import { statusContractAbi } from "@/abi/statusContract";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SuccesType } from "../NewFeed/eventCardItem";
import { walletsEqual } from "@/lib/wallet";
import { toastTxError, toastTxSuccess } from "@/lib/txToast";

type ChangeStatusType = {
  success: SuccesType;
  onChangeSuccess: ({ state, title }: SuccesType) => void;
  status: string;
  walletAddress: string;
  statusId: bigint;
};

export default function ChangeStatusSection({
  success,
  onChangeSuccess,
  status,
  walletAddress,
  statusId,
}: ChangeStatusType) {
  const { address } = useAccount();
  const [edit, setEdit] = useState("");
  const isOwner = walletsEqual(address, walletAddress);

  const {
    writeContractAsync,
    data: hash,
    isPending,
  } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  const busy = isPending || isConfirming;

  const callEditStatus = async () => {
    if (!address) return;
    try {
      await writeContractAsync({
        address: STATUS_CONTRACT_ADDRESS,
        abi: statusContractAbi,
        functionName: "editStatus",
        args: [address, statusId, edit],
      });
      setEdit("");
      onChangeSuccess({
        state: true,
        title: SOCIAL_COPY.editSuccess,
      });
      toastTxSuccess("Status updated");
    } catch (err) {
      console.error("editStatus failed", err);
      toastTxError(err);
    }
  };

  const callDeleteStatus = async () => {
    if (!address) return;
    try {
      await writeContractAsync({
        address: STATUS_CONTRACT_ADDRESS,
        abi: statusContractAbi,
        functionName: "deleteStatus",
        args: [address, statusId],
      });
      onChangeSuccess({
        state: true,
        title: SOCIAL_COPY.deleteSuccess,
      });
      toastTxSuccess("Status deleted");
    } catch (err) {
      console.error("deleteStatus failed", err);
      toastTxError(err);
    }
  };

  return (
    <DialogContent>
      {!success?.state ? (
        <>
          <DialogHeader>
            <DialogTitle>{SOCIAL_COPY.editDialogTitle}</DialogTitle>
            <DialogDescription>
              {SOCIAL_COPY.editDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              {status}
            </p>
            {isOwner && (
              <Textarea
                value={edit}
                onChange={(e) => setEdit(e.target.value)}
                placeholder={SOCIAL_COPY.editPlaceholder}
                maxLength={STATUS_MAX_CHARACTERS}
                disabled={busy}
                className="min-h-28"
              />
            )}
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="default"
                onClick={() => void callEditStatus()}
                disabled={busy || !isOwner || edit.trim().length === 0}
              >
                {SOCIAL_COPY.edit}
              </Button>
              <Button
                variant="destructive"
                onClick={() => void callDeleteStatus()}
                disabled={busy || !isOwner}
              >
                {SOCIAL_COPY.delete}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Alert>
          <AlertDescription className="text-center text-base font-medium text-primary">
            {success?.title}
          </AlertDescription>
        </Alert>
      )}
    </DialogContent>
  );
}
