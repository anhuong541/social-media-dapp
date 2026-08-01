"use client";

import { useState } from "react";
import { KeyRound, TriangleAlert } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import CopyAddress from "@/components/copyAddress";
import { CHAT_COPY } from "@/constants/chat";
import { WALLET_ADDRESS_MIN_LENGTH } from "@/constants/app";
import { shortenPrivateKey } from "@/lib/utils";
import { useChatKey } from "@/providers/ChatKeyProvider";

export default function AddPrivateKey({ address }: { address: string }) {
  const {
    hasStoredKey,
    isUnlocked,
    privateKey,
    isBusy,
    error,
    saveAndRegisterKey,
    unlockKey,
    lockKey,
  } = useChatKey();

  const [privateKeyTyping, setPrivateKeyTyping] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [showUnlockedKey, setShowUnlockedKey] = useState(false);

  const handleStoreUserPrivateKey = async () => {
    const ok = await saveAndRegisterKey(privateKeyTyping, password);
    if (ok) {
      setPrivateKeyTyping("");
      setPassword("");
      setReTypePassword("");
      setShowUnlockedKey(true);
    }
  };

  const onUnlock = async () => {
    const ok = await unlockKey(password);
    if (ok) {
      setPassword("");
      setShowUnlockedKey(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <KeyRound className="size-3.5" />
          {CHAT_COPY.privateKeyAction}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CHAT_COPY.privateKeyDialogTitle}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-amber-500" />
            {CHAT_COPY.privateKeyMissingDescription}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!hasStoredKey ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="chat-private-key">Private key</Label>
              <Input
                id="chat-private-key"
                value={privateKeyTyping}
                onChange={(e) => setPrivateKeyTyping(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="chat-password">Password</Label>
              <Input
                id="chat-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="chat-password-confirm">Confirm password</Label>
              <Input
                id="chat-password-confirm"
                type="password"
                value={reTypePassword}
                onChange={(e) => setReTypePassword(e.target.value)}
              />
              {password !== reTypePassword && (
                <Alert variant="destructive">
                  <AlertDescription>Passwords do not match.</AlertDescription>
                </Alert>
              )}
            </div>
            <Button
              onClick={() => void handleStoreUserPrivateKey()}
              disabled={
                isBusy ||
                password !== reTypePassword ||
                privateKeyTyping.length < WALLET_ADDRESS_MIN_LENGTH ||
                password.length <= 0
              }
            >
              Save key for chatting
            </Button>
          </div>
        ) : isUnlocked && showUnlockedKey && privateKey ? (
          <div className="flex flex-col gap-3">
            <Alert>
              <AlertDescription>{CHAT_COPY.privateKeyUnlocked}</AlertDescription>
            </Alert>
            <div className="flex flex-col gap-2">
              <Label>Your private key</Label>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
                <p className="font-mono text-sm">
                  {shortenPrivateKey(privateKey)}
                </p>
                <CopyAddress textToCopy={privateKey} />
              </div>
            </div>
            <Button variant="outline" onClick={lockKey}>
              Lock key
            </Button>
          </div>
        ) : isUnlocked ? (
          <div className="flex flex-col gap-3">
            <Alert>
              <AlertDescription>{CHAT_COPY.privateKeyUnlocked}</AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowUnlockedKey(true)}>
                Reveal key
              </Button>
              <Button variant="outline" onClick={lockKey}>
                Lock key
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="unlock-password">Password</Label>
              <Input
                id="unlock-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              onClick={() => void onUnlock()}
              disabled={isBusy || password.length <= 0 || !address}
            >
              Unlock private key
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
