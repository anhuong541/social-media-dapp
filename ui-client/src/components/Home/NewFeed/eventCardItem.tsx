"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import {
  HandCoins,
  Loader2,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { STATUS_CONTRACT_ADDRESS } from "@/constants/addresses";
import { SOCIAL_COPY } from "@/constants/social";
import { isConvexConfigured } from "@/constants/convex";
import { statusContractAbi } from "@/abi/statusContract";
import { api } from "@/lib/convexApi";
import { formatDateTimeDecimal, truncateAddress } from "@/lib/utils";
import { walletsEqual } from "@/lib/wallet";
import { useChatKey } from "@/providers/ChatKeyProvider";
import {
  ChangeStatusSection,
  CommentSection,
  TipsSection,
} from "../PopupSection";
import CopyAddress from "../../copyAddress";
import { WalletAvatar } from "@/components/Chat/wallet-avatar";

type EventCardProps = {
  walletAddress: string;
  newStatus: string;
  timeStamp: bigint;
  statusId: bigint;
};

export type SuccesType = {
  state: boolean;
  title: string;
};

export default function EventCardItem(props: EventCardProps) {
  const { address } = useAccount();
  const router = useRouter();
  const { isUnlocked, hasStoredKey } = useChatKey();
  const [changeContentSuccess, setChangeContentSuccess] = useState<SuccesType>({
    state: false,
    title: "Edit",
  });
  const [isAlreadyDM, setIsAlreadyDM] = useState(false);
  const [isDmLoading, setIsDmLoading] = useState(false);

  const date = formatDateTimeDecimal(Number(props.timeStamp) * 1000);
  const isOwner = walletsEqual(address, props.walletAddress);

  const { data: statusState, isLoading: isMyStatusLoading, refetch } =
    useReadContract({
      address: STATUS_CONTRACT_ADDRESS,
      abi: statusContractAbi,
      functionName: "getStatus",
      args: [props.walletAddress as `0x${string}`, props.statusId],
    });

  const friends = useQuery(
    api.chatRequests.listFriends,
    isConvexConfigured && address ? { walletAddress: address } : "skip"
  );

  const sendRequest = useMutation(api.chatRequests.sendRequest);

  const {
    writeContractAsync: likeWrite,
    data: likeHash,
    isPending: isLikePending,
  } = useWriteContract();
  const { isLoading: isLikeConfirming, isSuccess: isLikeSuccess } =
    useWaitForTransactionReceipt({ hash: likeHash });

  useEffect(() => {
    if (isLikeSuccess) void refetch();
  }, [isLikeSuccess, refetch]);

  useEffect(() => {
    if (!friends || !address) {
      setIsAlreadyDM(false);
      return;
    }
    setIsAlreadyDM(
      friends.some((friend: string) => walletsEqual(friend, props.walletAddress))
    );
  }, [friends, address, props.walletAddress]);

  const callChatRequest = async () => {
    if (!isConvexConfigured) {
      toast(SOCIAL_COPY.toastWalletRequired, {
        description: "Configure Convex to send chat requests.",
      });
      return;
    }
    if (!address || !isUnlocked) {
      toast(SOCIAL_COPY.toastPrivateKeyRequired, {
        description: dayjs().format("dddd, MMMM DD, YYYY [at] h:mm A"),
        action: {
          label: SOCIAL_COPY.toastPrivateKeyAction,
          onClick: () => router.push("/room"),
        },
      });
      return;
    }

    setIsDmLoading(true);
    try {
      await sendRequest({
        fromWallet: address,
        toWallet: props.walletAddress,
      });
      setIsAlreadyDM(true);
    } catch (err) {
      console.error("chat request failure", err);
      toast(err instanceof Error ? err.message : "Request failed");
    } finally {
      setIsDmLoading(false);
    }
  };

  const callLike = async () => {
    try {
      await likeWrite({
        address: STATUS_CONTRACT_ADDRESS,
        abi: statusContractAbi,
        functionName: "addLike",
        args: [props.walletAddress as `0x${string}`, props.statusId],
      });
    } catch (err) {
      console.error("addLike failed", err);
    }
  };

  const likeCount =
    !isMyStatusLoading && statusState ? Number(statusState[1]) : null;
  const commentCount =
    !isMyStatusLoading && statusState ? Number(statusState[2]) : null;

  return (
    <Card className="w-full rounded-2xl shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <WalletAvatar address={props.walletAddress} size="lg" />
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-1.5 text-base">
                <Link
                  href={`/profile/${props.walletAddress}`}
                  className="truncate hover:underline"
                >
                  {truncateAddress(props.walletAddress)}
                </Link>
                <CopyAddress textToCopy={props.walletAddress} />
              </CardTitle>
              <CardDescription>{date.toLocaleString()}</CardDescription>
            </div>
          </div>
          {isOwner && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setChangeContentSuccess({ state: false, title: "" })
                  }
                >
                  <MoreVertical className="size-5" />
                </Button>
              </DialogTrigger>
              <ChangeStatusSection
                success={changeContentSuccess}
                onChangeSuccess={setChangeContentSuccess}
                status={props.newStatus}
                walletAddress={props.walletAddress}
                statusId={props.statusId}
              />
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {props.newStatus}
        </p>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-wrap items-center gap-1 pt-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          disabled={!address || isLikePending || isLikeConfirming}
          onClick={() => {
            if (address) void callLike();
          }}
        >
          <ThumbsUp className="size-4" />
          {isLikePending || isLikeConfirming || isMyStatusLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">{SOCIAL_COPY.like}</span>
              <span>{likeCount ?? 0}</span>
            </>
          )}
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <MessageSquare className="size-4" />
              {isMyStatusLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">{SOCIAL_COPY.comment}</span>
                  <span>{commentCount ?? 0}</span>
                </>
              )}
            </Button>
          </DialogTrigger>
          <CommentSection
            status={props.newStatus}
            walletAddress={props.walletAddress}
            statusId={props.statusId}
          />
        </Dialog>

        {!isOwner && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <HandCoins className="size-4" />
                <span className="hidden sm:inline">{SOCIAL_COPY.tip}</span>
              </Button>
            </DialogTrigger>
            <TipsSection
              status={props.newStatus}
              walletAddress={props.walletAddress}
              statusId={props.statusId}
            />
          </Dialog>
        )}

        {!isOwner && !isAlreadyDM && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto gap-1.5"
            onClick={() => {
              if (!address) {
                toast(SOCIAL_COPY.toastWalletRequired, {
                  description: dayjs().format(
                    "dddd, MMMM DD, YYYY [at] h:mm A"
                  ),
                });
                return;
              }
              if (!hasStoredKey || !isUnlocked) {
                toast(SOCIAL_COPY.toastPrivateKeyRequired, {
                  description: dayjs().format(
                    "dddd, MMMM DD, YYYY [at] h:mm A"
                  ),
                  action: {
                    label: SOCIAL_COPY.toastPrivateKeyAction,
                    onClick: () => router.push("/room"),
                  },
                });
                return;
              }
              void callChatRequest();
            }}
          >
            <MessageCircle className="size-4" />
            {!isDmLoading ? (
              SOCIAL_COPY.dm
            ) : (
              <Loader2 className="size-4 animate-spin" />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
