import { createClient } from "@sanity/client";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "v1",
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
});
