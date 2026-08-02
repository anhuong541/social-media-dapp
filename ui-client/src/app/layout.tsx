import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, SideBar, NetworkGuard } from "@/components/layouts";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social Media DApp",
  description: "Graduation thesis social media dApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="flex max-h-screen min-h-screen w-full flex-col">
            <Header />
            <NetworkGuard />
            <div className="mx-auto flex min-h-0 w-full flex-1">
              <div className="grid min-h-0 w-full flex-1 grid-cols-1 lg:grid-cols-4">
                <SideBar />
                <div className="col-span-3 flex min-h-0 overflow-hidden rounded-lg bg-muted/40 xl:h-[90vh]">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
