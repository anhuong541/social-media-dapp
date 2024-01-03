import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractRead,
  useDisconnect,
} from "@thirdweb-dev/react";
import { Button } from "../ui/button";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import Link from "next/link";
import { truncateAddress } from "@/lib/utils";

export default function Header() {
  const address = useAddress();
  const disconnect = useDisconnect();
  const { contract } = useContract(STATUS_CONTRACT_ADDRESS);

  const { data: myStatus, isLoading: isMyStatusLoading } = useContractRead(
    contract,
    "getStatus",
    [address]
  );
  return (
    <header className="w-full h-[10vh]">
      <div className="max-w-screen-xl h-full mx-auto flex items-center justify-between border-b px-3">
        <div className="font-medium text-2xl">
          Social Media <br className="sm:hidden" />{" "}
          <sup className="text-xs sm:block hidden">( Graduation thesis )</sup>
          <span className="text-xs sm:hidden">( Graduation thesis )</span>
        </div>

        <div className="flex justify-end items-center gap-5">
          <Link
            href={`/profile/${address}`}
            className="text-center py-1 px-3 hover:underline text-green-700"
          >
            <p>{truncateAddress(address!)}</p>
          </Link>
          {!address ? (
            <ConnectWallet
              modalSize="compact"
              dropdownPosition={{
                side: "bottom",
                align: "start",
              }}
            />
          ) : (
            <Button variant="destructive" onClick={() => disconnect()}>
              Disconnect
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
