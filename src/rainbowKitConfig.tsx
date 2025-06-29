"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { anvil, zkSync, mainnet, arbitrum, base, optimism } from "wagmi/chains";

export default getDefaultConfig({
  appName: "Airdropper",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, zkSync, arbitrum, base, optimism, anvil],
  ssr: false,
});

