import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

import { Input } from "../../../ui/input";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { CHAT_CONTRACT_ADDRESS } from "../../../constants/addresses";
import { Button } from "../../../ui/button";
import { getPublicKeyByPrivate } from "@/lib/encodeMsg";
import { decryptPrivateKey } from "@/lib/enCodePrivateKey";

export default function AddFriend() {
  const address = useAddress();
  const encryptedPrivateKey = localStorage.getItem(address!);
  const userPrivateKey = decryptPrivateKey(encryptedPrivateKey!, "123123");
  const [typeAddress, setTypeAddress] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const { contract } = useContract(CHAT_CONTRACT_ADDRESS);

  const { mutateAsync: sendChatRequest, isLoading: isLoadingChatRequest } =
    useContractWrite(contract, "sendChatRequest");

  const callChatRequestt = async () => {
    try {
      if (userPrivateKey[0].status === "success") {
        const publicKey = getPublicKeyByPrivate(userPrivateKey[0].message);
        const data = await sendChatRequest({
          args: [typeAddress, publicKey],
        });
        setIsError(false);
      }
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
        disabled={typeAddress.length < 24 || isLoadingChatRequest}
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
