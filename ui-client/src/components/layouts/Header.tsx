import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="w-full h-[10vh]">
      <div className="max-w-screen-xl h-full mx-auto flex items-center justify-between border-b px-3">
        <div className="font-medium text-2xl">
          Social Media <br className="sm:hidden" />{" "}
          <sup className="text-xs sm:block hidden">( Graduation thesis )</sup>
          <span className="text-xs sm:hidden">( Graduation thesis )</span>
        </div>
        <div>
          <Button variant="default" className="text-white">
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
}
