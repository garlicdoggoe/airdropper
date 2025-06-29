"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import ReactiveButton from "@/components/ui/ReactiveButton";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";
import airdrop from "../../public/airdrop.svg";

export default function Header() {
  return (
    <nav className={cn(
      "fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[530px] mt-5",
    )}>
      <div className="flex flex-row items-center justify-between border border-white/10 bg-[#3e2319]/30 pl-5 pr-2 backdrop-blur(50px) min-h-[50px] rounded-xl">
        <div className="flex flex-row items-center gap-1">
          <img src={airdrop.src} alt="airdrop" className="w-5 h-5 brightness-0 invert" /> 
          <a href="/" className="flex items-center gap-10 text-zinc-800">
            <h1 className="font-bold text-white text-sm">Airdropper</h1>
          </a>
        </div>
        <div className="flex flex-row items-center justify-center gap-2.5 md:gap-6">
          <a href="#" className="flex items-center gap-10 text-zinc-800">
            <h1 className="text-white text-[12px]">About us</h1>
          </a>
          <a href="#" className="flex items-center gap-10 text-zinc-800">
            <h1 className="text-white text-[12px]">FAQ</h1>
          </a>
          <a href="#" className="flex items-center gap-10 text-zinc-800">
            <h1 className="text-white text-[12px]">Contact</h1>
          </a>
        </div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <ReactiveButton baseColor="#000000" gradient={true} gradientColor="#FF6B35" onClick={openConnectModal} className="cursor-pointer text-[12px] py-2.5 px-4">
                        <AnimatedShinyText className="text-white text-[12px]">
                          Connect Wallet
                        </AnimatedShinyText>
                      </ReactiveButton>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <ReactiveButton baseColor="#B30101" gradient={true} gradientColor="#FF6B35" onClick={openConnectModal} className="cursor-pointer text-[12px] py-2.5 px-4">
                          Wrong network
                      </ReactiveButton>
                    );
                  }

                  return (
                    <div className="flex items-center">
                      <ReactiveButton baseColor="#000000" gradient={true} gradientColor="#FF6B35" onClick={openChainModal} className="cursor-pointer text-[12px] py-2.5 px-4">
                        {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 20,
                                height: 20,
                                borderRadius: 999,
                                overflow: 'hidden',
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  style={{ width: 24, height: 24 }}
                                />
                              )}
                            </div>
                          )}
                      </ReactiveButton>

                      <ReactiveButton baseColor="#000000" gradient={true} gradientColor="#FF6B35" onClick={openAccountModal} className="cursor-pointer text-[12px] py-2.5 px-4">
                        {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ''}
                      </ReactiveButton>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </nav>
  );
}
