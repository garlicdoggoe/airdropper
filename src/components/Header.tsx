"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4.5 border-b-[1px] border-zinc-100 flex flex-row justify-between items-center bg-white xl:min-h-[77px]">
      <div className="flex items-center gap-2.5 md:gap-6">
        <a href="/" className="flex items-center gap-1 text-zinc-800">
          <h1 className="font-bold text-2xl hidden md:block">Airdropper</h1>
        </a>
      </div>
      <div className="flex items-center gap-4">
        <ConnectButton />
      </div>
    </nav>
  );
}
