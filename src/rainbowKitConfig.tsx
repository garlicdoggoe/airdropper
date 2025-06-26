"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { anvil, zkSync } from "wagmi/chains";

export default getDefaultConfig({
  appName: "Airdropper",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [anvil, zkSync],
  ssr: false,
});
