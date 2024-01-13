import { useState } from "react";
import {
  Web3Button,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { STATUS_CONTRACT_ADDRESS } from "@/components/constants/addresses";
import { formatHexToDecimal } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SuccesType } from "../EventCard";

type ChangeStatusType = {
  success: SuccesType;
  onChangeSuccess: ({ state, title }: SuccesType) => void;
  status: string;
  walletAddress: string;
  statusId: {
    type: string;
    _hex: string;
  };
};

export default function ChangeStatusSection({
  success,
  onChangeSuccess,
  status,
  walletAddress,
  statusId,
}: ChangeStatusType) {
  const address = useAddress();
  const [edit, setEdit] = useState("");
  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);
  const statusIdDeciaml = formatHexToDecimal(statusId._hex);

  const { mutateAsync: editStatus, isLoading: isLoadingEdit } =
    useContractWrite(contract, "editStatus");

  const { mutateAsync: deleteStatus, isLoading: isLoadingDelete } =
    useContractWrite(contract, "deleteStatus");

  const callEditStatus = async () => {
    try {
      const data = await editStatus({ args: [address, statusIdDeciaml, edit] });
      // console.info("contract call successs", data);
      setEdit("");
      onChangeSuccess({
        state: true,
        title: "Edit",
      });
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  const callDeleteStatus = async () => {
    try {
      const data = await deleteStatus({ args: [address, statusIdDeciaml] });
      // console.info("contract call successs", data);
      onChangeSuccess({
        state: true,
        title: "Removed",
      });
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  // if () {
  //   return (
  //     <DialogContent>
  //       <Lottie
  //         animationData={loadingLottie}
  //         loop={true}
  //         className="w-24 h-24 mx-auto"
  //       />
  //     </DialogContent>
  //   );
  // }

  return (
    <DialogContent>
      {!success?.state && (
        <DialogHeader>
          <DialogTitle>Are you sure you want to edit your status?</DialogTitle>
          <DialogDescription>Your old status: {status}</DialogDescription>
        </DialogHeader>
      )}
      {!success?.state ? (
        <div className="flex flex-col gap-4 pt-4">
          <div>
            <Input
              value={edit}
              onChange={(e) => {
                setEdit(e.target.value);
              }}
              placeholder="!!!!"
              disabled={isLoadingDelete || isLoadingEdit}
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <Button
              variant="default"
              onClick={callEditStatus}
              disabled={isLoadingDelete || isLoadingEdit}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={callDeleteStatus}
              disabled={isLoadingDelete || isLoadingEdit}
            >
              Delete
            </Button>
            <DialogClose>
              <Button
                className="bg-yellow-400 hover:bg-yellow-300"
                onClick={callDeleteStatus}
                disabled={isLoadingDelete || isLoadingEdit}
              >
                Block
              </Button>
            </DialogClose>
          </div>
        </div>
      ) : (
        <div className="text-center text-green-600 font-medium text-lg">
          {success?.title} success
        </div>
      )}
    </DialogContent>
  );
}
