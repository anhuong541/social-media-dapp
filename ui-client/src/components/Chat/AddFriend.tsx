import { useState } from "react";
import { Input } from "../ui/input";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CHAT_CONTRACT_ADDRESS } from "../constants/addresses";
import { Button } from "../ui/button";

export default function AddFriend() {
  const [typeAddress, setTypeAddress] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const { contract } = useContract(CHAT_CONTRACT_ADDRESS);

  const { mutateAsync: sendChatRequest, isLoading: isLoadingChatRequest } =
    useContractWrite(contract, "sendChatRequest");

  const callChatRequestt = async () => {
    try {
      const data = await sendChatRequest({ args: [typeAddress] });
      // console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
      setIsError(true);
    } finally {
      setTypeAddress("");
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-between items-center py-3 px-4 border-b text-sm font-medium">
      <Input
        value={typeAddress}
        onChange={(e) => {
          setTypeAddress(e.target.value);
        }}
        placeholder="Type address!!"
        disabled={isLoadingChatRequest}
      />
      <Button
        onClick={callChatRequestt}
        className="text-white"
        disabled={isLoadingChatRequest}
      >
        {!isLoadingChatRequest ? (
          "Send Chat Request"
        ) : (
          <ReloadIcon className="animate-spin" />
        )}
      </Button>
      {isError && (
        <div className="text-red-500 text-xs">
          Something wrong happen or you already sentDM
        </div>
      )}
    </div>
  );
}
