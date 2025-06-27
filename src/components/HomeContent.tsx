"use client";

import AirdropForm from "@/components/AirdropForm";
import { useAccount } from "wagmi";

export default function HomeContent() {
    const { isConnected } = useAccount();

    return (
        <div>
            {isConnected ? (
                <div>
                    <AirdropForm />
                </div>
            ) : (
                <h1>Please connect your wallet</h1>
            )}
        </div>
    );
}