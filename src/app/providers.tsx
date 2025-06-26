"use client";

import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import config from "@/rainbowKitConfig";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton />
          {props.children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
