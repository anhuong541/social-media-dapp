import { TIP_TOKEN_SYMBOL } from "@/constants/app";

export const STATUS_MAX_CHARACTERS = 140 as const;

export const FEED_PAGE_SIZE = 10 as const;

export const TIP_AMOUNT_STEP = "0.01" as const;

export const SOCIAL_COPY = {
  streamTitle: "Stream",
  composerPrompt: "What's on your mind?",
  composerPlaceholder: "Share an update with the network",
  composerButton: "Post",
  composerDialogTitle: "New post",
  composerDialogDescription: "Share a short status with your network.",
  composerSuccessTitle: "Posted",
  composerSuccessDescription: "Your status was updated successfully.",
  close: "Close",
  walletRequiredTitle: "Wallet required",
  walletRequiredDescription: "Connect your wallet to post and interact.",
  emptyFeedTitle: "No posts yet",
  emptyFeedDescription: "Be the first to share a status on the stream.",
  loadMore: "Load more",
  like: "Like",
  comment: "Comment",
  tip: "Tip",
  dm: "DM",
  commentsTitle: "Comments",
  commentPlaceholder: "Write a comment",
  addComment: "Comment",
  noCommentsTitle: "No comments yet",
  noCommentsDescription: "Start the discussion with the first comment.",
  tipDialogTitle: "Send a tip",
  tipDialogDescription: "Support this creator with a small on-chain tip.",
  tipAmountLabel: "Amount",
  tipAmountPlaceholder: "0.00",
  sendTip: "Send tip",
  editDialogTitle: "Edit your status",
  editDialogDescription: "Update the post content or remove it.",
  editPlaceholder: "Update your status",
  edit: "Save",
  delete: "Delete",
  editSuccess: "Updated successfully",
  deleteSuccess: "Removed successfully",
  trendingTitle: "Trending",
  profileLatestPosts: "Latest posts",
  profileEmptyTitle: "No posts from this account",
  profileEmptyDescription: "This wallet has not shared any status yet.",
  profileTipsReceived: `Tips received (${TIP_TOKEN_SYMBOL})`,
  toastWalletRequired: "Connect your wallet first.",
  toastPrivateKeyRequired: "Add your private key in Messages to send a DM.",
  toastPrivateKeyAction: "Open Messages",
} as const;
