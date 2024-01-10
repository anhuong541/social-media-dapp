import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoWarning } from "react-icons/io5";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { decryptPrivateKey, encryptPrivateKey } from "@/lib/encodeMsg";
import CopyAddress from "../CopyAddress";
import { shortenPrivateKey } from "@/lib/utils";

export default function AddPrivateKey() {
  const address = useAddress();
  const [privateKeyTyping, setPrivateKeyTyping] = useState("ạbaibfibaibfibasb");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [userStorePrivateKey, setUserStorePrivateKey] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);

  const handleStoreUserPrivateKey = () => {
    if (address) {
      localStorage.setItem(
        address,
        encryptPrivateKey(privateKeyTyping, password)
      );
      setUserStorePrivateKey(true);
      setPrivateKeyTyping("");
      setPassword("");
      setReTypePassword("");
    }
  };

  const onCheckingCorrectPassword = async () => {
    if (address) {
      const encryptedPrivateKey = localStorage.getItem(address);
      if (encryptedPrivateKey) {
        const decrypted = decryptPrivateKey(encryptedPrivateKey, password);
        if (decrypted[0].status == "success") {
          setPasswordSuccess(true);
          setPrivateKeyTyping(decrypted[0].message);
          setPassword("");
        } else {
          setWrongPassword(true);
          setPassword("");
        }
      }
    }
  };

  useEffect(() => {
    if (address) {
      const userStorePrivateKey = localStorage.getItem(address);
      if (userStorePrivateKey) {
        setUserStorePrivateKey(true);
      }
    }
  }, [address]);

  return (
    <div className="flex flex-col gap-2 justify-between items-center py-3 px-4 border-b text-sm font-medium">
      <Dialog>
        <DialogTrigger>
          <Button>See Your Private Key</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              You didn&apos;t have your private key yet!
            </DialogTitle>
            <DialogDescription className="text-yellow-400 flex items-center gap-2">
              <IoWarning /> Type your private key
            </DialogDescription>
          </DialogHeader>
          {!userStorePrivateKey ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h5>PrivateKey:</h5>
                <Input
                  value={privateKeyTyping}
                  onChange={(e) => setPrivateKeyTyping(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h5>Your Password:</h5>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h5>Retyping Your Password:</h5>
                <Input
                  type="password"
                  value={reTypePassword}
                  onChange={(e) => setReTypePassword(e.target.value)}
                />

                {password !== reTypePassword && (
                  <p className="text-red-500">
                    Two password are not the same!!!
                  </p>
                )}
              </div>
              <Button
                variant={
                  password !== reTypePassword || privateKeyTyping.length < 24
                    ? "ghost"
                    : "default"
                }
                onClick={handleStoreUserPrivateKey}
                disabled={
                  password !== reTypePassword || privateKeyTyping.length < 24
                }
              >
                Submit your Key for Chatting
              </Button>
            </div>
          ) : passwordSuccess ? (
            <div className="flex flex-col gap-1">
              <h5>Your Private Key is: </h5>
              <div className="flex items-center gap-2 relative">
                <p>{shortenPrivateKey(privateKeyTyping)}</p>
                <CopyAddress textToCopy={privateKeyTyping} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {wrongPassword && (
                <p className="text-red-500 text-sm">Typing Wrong Password</p>
              )}
              <Button
                onClick={onCheckingCorrectPassword}
                disabled={password.length <= 0}
              >
                Type Your Password to see your Private Key
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
