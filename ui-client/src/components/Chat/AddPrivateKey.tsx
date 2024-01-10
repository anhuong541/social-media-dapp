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

export default function AddPrivateKey() {
  return (
    <div className="flex flex-col gap-2 justify-between items-center py-3 px-4 border-b text-sm font-medium">
      <Dialog>
        <DialogTrigger>
          <Button>See Your Private Key</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>See Your Private Key secure message!</DialogTitle>
            <DialogDescription className="text-yellow-400 flex items-center gap-2">
              <IoWarning /> Your wallet only use for encrypt your message
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
