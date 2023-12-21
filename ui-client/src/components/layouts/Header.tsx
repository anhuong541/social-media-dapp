import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="max-w-screen-xl mx-auto w-full flex items-center justify-between border-b py-5 px-3">
      <div className="font-medium text-2xl">
        Social Media <sup className="text-xs">( Graduation thesis )</sup>
      </div>
      <div>
        <Button variant="default" className="text-white">
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}
