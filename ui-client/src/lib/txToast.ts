import { toast } from "sonner";

export function toastTxError(err: unknown, fallback = "Transaction failed") {
  const message =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : fallback;
  const short =
    message.length > 180 ? `${message.slice(0, 180)}…` : message;
  toast.error(short);
}

export function toastTxSuccess(description: string) {
  toast.success(description);
}

export function toastTxSubmitted() {
  toast.message("Transaction submitted", {
    description: "Waiting for confirmation…",
  });
}
