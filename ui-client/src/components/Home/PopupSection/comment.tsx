"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STATUS_CONTRACT_ADDRESS } from "@/constants/addresses";
import { SOCIAL_COPY } from "@/constants/social";
import { statusContractAbi } from "@/abi/statusContract";
import { truncateAddress } from "@/lib/utils";
import { WalletAvatar } from "@/components/Chat/wallet-avatar";

type CommentType = {
  status: string;
  walletAddress: string;
  statusId: bigint;
};

export default function CommentSection({
  status,
  walletAddress,
  statusId,
}: CommentType) {
  const { address } = useAccount();
  const [comment, setComment] = useState("");

  const {
    data: comments,
    isLoading: isStatusCommentLoading,
    refetch,
  } = useReadContract({
    address: STATUS_CONTRACT_ADDRESS,
    abi: statusContractAbi,
    functionName: "getComments",
    args: [statusId, walletAddress as `0x${string}`],
  });

  const { writeContractAsync, data: hash, isPending, reset } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (!isSuccess) return;
    setComment("");
    void refetch();
    reset();
  }, [isSuccess, refetch, reset]);

  const submitComment = async () => {
    if (!comment.trim()) return;
    try {
      await writeContractAsync({
        address: STATUS_CONTRACT_ADDRESS,
        abi: statusContractAbi,
        functionName: "addComment",
        args: [walletAddress as `0x${string}`, statusId, comment.trim()],
      });
    } catch (err) {
      console.error("addComment failed", err);
    }
  };

  if (isStatusCommentLoading) {
    return (
      <DialogContent>
        <div className="flex flex-col gap-3 py-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </DialogContent>
    );
  }

  const list = (comments as string[] | undefined) ?? [];

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-sm">
          <WalletAvatar address={walletAddress} size="sm" />
          <Link href={`/profile/${walletAddress}`} className="hover:underline">
            {truncateAddress(walletAddress)}
          </Link>
        </DialogTitle>
        <DialogDescription className="line-clamp-3 text-left">
          {status}
        </DialogDescription>
      </DialogHeader>

      {!address ? (
        <Alert variant="destructive">
          <AlertDescription>
            {SOCIAL_COPY.walletRequiredDescription}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col gap-3">
          <Separator />
          <h4 className="text-sm font-medium">{SOCIAL_COPY.commentsTitle}</h4>
          <ScrollArea className="h-[40vh] rounded-lg border">
            <div className="flex flex-col gap-3 p-3">
              {list.length === 0 ? (
                <Card className="border-dashed shadow-none">
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">
                      {SOCIAL_COPY.noCommentsTitle}
                    </CardTitle>
                    <CardDescription>
                      {SOCIAL_COPY.noCommentsDescription}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                list.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-xl bg-muted/50 px-3 py-2.5 text-sm leading-relaxed"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="flex items-center gap-2">
            <Input
              className="flex-1"
              placeholder={SOCIAL_COPY.commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              disabled={isPending || isConfirming || !comment.trim()}
              onClick={() => void submitComment()}
            >
              {isPending || isConfirming ? "..." : SOCIAL_COPY.addComment}
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  );
}
