import { Header, SideBar } from "@/components/layouts";
import {
  ThirdwebProvider,
  coinbaseWallet,
  embeddedWallet,
  metamaskWallet,
  rainbowWallet,
  smartWallet,
  trustWallet,
  walletConnect,
  phantomWallet,
} from "@thirdweb-dev/react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });
const activeChain = "binance-testnet";

export default function App({ Component, pageProps }: AppProps) {
  //Set up smart wallet config
  const smartWalletConfig = {
    factoryAddress: "0xb073ab62195b46fd43ae74e86fb978f0a234d94b",
    gasless: true,
  };

  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[
        smartWallet(embeddedWallet(), smartWalletConfig),
        phantomWallet(),
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        rainbowWallet(),
        trustWallet(),
      ]}
    >
      <main className={`sm:container max-h-screen ${inter.className}`}>
        <Header />
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-4 grid-cols-1">
            <SideBar />
            <div className="flex col-span-3 rounded-lg xl:h-[90vh] bg-gray-50">
              <Component {...pageProps} />
            </div>
          </div>
        </div>

        <Toaster />
      </main>
    </ThirdwebProvider>
  );
}
