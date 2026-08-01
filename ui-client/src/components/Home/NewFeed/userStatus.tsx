"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PenSquare } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { STATUS_CONTRACT_ADDRESS } from "@/constants/addresses";
import { STATUS_MAX_CHARACTERS, SOCIAL_COPY } from "@/constants/social";
import { statusContractAbi } from "@/abi/statusContract";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WalletAvatar } from "@/components/Chat/wallet-avatar";
import { cn } from "@/lib/utils";

export default function UserStatus() {
  const { address } = useAccount();
  const [newStatus, setNewStatus] = useState("");
  const [dialogOnClose, setDialogOnClose] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const publish = async () => {
    try {
      await writeContractAsync({
        address: STATUS_CONTRACT_ADDRESS,
        abi: statusContractAbi,
        functionName: "setStatus",
        args: [newStatus],
      });
      setNewStatus("");
      setCharacterCount(0);
      setDialogOnClose(true);
    } catch (err) {
      console.error("setStatus failed", err);
    }
  };

  if (!address) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{SOCIAL_COPY.walletRequiredTitle}</AlertTitle>
        <AlertDescription>
          {SOCIAL_COPY.walletRequiredDescription}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setDialogOnClose(false);
      }}
    >
      <Card className="shadow-xs">
        <CardContent className="flex items-center gap-3 p-4">
          <WalletAvatar address={address} size="lg" />
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex h-11 flex-1 items-center rounded-full border bg-muted/40 px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              {SOCIAL_COPY.composerPrompt}
            </button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button className="hidden gap-1.5 sm:inline-flex">
              <PenSquare className="size-4" />
              {SOCIAL_COPY.composerButton}
            </Button>
          </DialogTrigger>
        </CardContent>
      </Card>

      <DialogContent>
        {dialogOnClose ? (
          <>
            <DialogHeader>
              <DialogTitle>{SOCIAL_COPY.composerSuccessTitle}</DialogTitle>
              <DialogDescription>
                {SOCIAL_COPY.composerSuccessDescription}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{SOCIAL_COPY.close}</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{SOCIAL_COPY.composerDialogTitle}</DialogTitle>
              <DialogDescription>
                {SOCIAL_COPY.composerDialogDescription}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <Textarea
                value={newStatus}
                onChange={(e) => {
                  setNewStatus(e.target.value);
                  setCharacterCount(e.target.value.length);
                }}
                placeholder={SOCIAL_COPY.composerPlaceholder}
                className="min-h-36"
              />
              <div className="flex items-center justify-between gap-3">
                <p
                  className={cn(
                    "text-xs",
                    characterCount >= STATUS_MAX_CHARACTERS
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {characterCount}/{STATUS_MAX_CHARACTERS}
                </p>
              </div>
              <Button
                className="w-full"
                disabled={
                  isPending ||
                  isConfirming ||
                  characterCount === 0 ||
                  characterCount > STATUS_MAX_CHARACTERS
                }
                onClick={() => void publish()}
              >
                {isPending || isConfirming
                  ? "Publishing..."
                  : SOCIAL_COPY.composerButton}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
