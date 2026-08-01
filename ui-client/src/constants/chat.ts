import { WALLET_ADDRESS_MIN_LENGTH } from "@/constants/app";

export const CHAT_COPY = {
  messagesTitle: "Messages",
  friendsTitle: "Friends",
  requestsTitle: "Chat requests",
  emptyConversationTitle: "No conversation selected",
  emptyConversationDescription:
    "Pick a friend from the list to start chatting, or send a chat request.",
  selectConversationHint: "Select a conversation",
  emptyFriendsTitle: "No friends yet",
  emptyFriendsDescription:
    "Send a chat request with a wallet address to connect.",
  emptyMessagesTitle: "No messages yet",
  emptyMessagesDescription: "Say hello and start the conversation.",
  addFriendPlaceholder: "Paste wallet address",
  sendRequest: "Add",
  privateKeyAction: "Private key",
  privateKeyDialogTitle: "Chat private key",
  privateKeyMissingDescription:
    "Add an encryption key. It stays encrypted in IndexedDB; only the unlocked key decrypts messages.",
  composerPlaceholder: "Type a message",
  composerEmptyHint: "Write a message before sending",
  walletRequiredTitle: "Wallet required",
  walletRequiredDescription: "Connect your wallet to use chat.",
  privateKeyRequiredDescription:
    "Unlock your private key to decrypt and send messages.",
  privateKeyUnlocked: "Key unlocked for this session",
  convexMissingTitle: "Convex not configured",
  convexMissingDescription:
    "Set NEXT_PUBLIC_CONVEX_URL (and run npx convex dev) to enable off-chain chat.",
  activeBadge: "Active",
  youLabel: "You",
  openFriends: "Open friends",
  viewProfile: "View profile",
  requestFailed: "Request failed or already sent to this address.",
  unlockRequired: "Unlock your private key first.",
} as const;

export { WALLET_ADDRESS_MIN_LENGTH };