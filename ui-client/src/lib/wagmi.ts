"use client";

import { http } from "wagmi";
import { polygon, polygonAmoy } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  ALCHEMY_POLYGON_AMOY_HTTP,
  ALCHEMY_POLYGON_MAINNET_HTTP,
  DAPP_NAME,
  WALLETCONNECT_PROJECT_ID_OR_PLACEHOLDER,
} from "@/constants/app";

export const wagmiConfig = getDefaultConfig({
  appName: DAPP_NAME,
  projectId: WALLETCONNECT_PROJECT_ID_OR_PLACEHOLDER,
  chains: [polygonAmoy, polygon],
  transports: {
    [polygonAmoy.id]: http(ALCHEMY_POLYGON_AMOY_HTTP),
    [polygon.id]: http(ALCHEMY_POLYGON_MAINNET_HTTP),
  },
  ssr: true,
});
