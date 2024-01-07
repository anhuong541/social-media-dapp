import { useState } from "react";
import { Input } from "../ui/input";
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CHAT_CONTRACT_ADDRESS } from "../constants/addresses";
import { Button } from "../ui/button";

export default function AddFriend() {
  const [typeAddress, setTypeAddress] = useState<string>("");
  const { contract } = useContract(CHAT_CONTRACT_ADDRESS);

  const { mutateAsync: sendChatRequest, isLoading: isLoadingChatRequest } =
    useContractWrite(contract, "sendChatRequest");

  const callChatRequestt = async () => {
    try {
      const data = await sendChatRequest({ args: [typeAddress] });
      // console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
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
    </div>
  );
}
