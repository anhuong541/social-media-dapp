import { Header, SideBar } from "@/components/layouts";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`container max-h-screen ${inter.className}`}>
      <Header />
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-4 grid-cols-1">
          <SideBar />
          <div className="flex col-span-3 rounded-lg lg:h-[90vh] bg-gray-50">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </main>
  );
}
