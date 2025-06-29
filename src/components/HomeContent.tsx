"use client";

import AirdropForm from "@/components/AirdropForm";
import { useAccount } from "wagmi";
import Landing from "@/components/Landing";

export default function HomeContent() {
    const { isConnected } = useAccount();

    return (
        <div>
            {isConnected ? (
                <div>
                    <AirdropForm />
                </div>
            ) : (
                <Landing />
            )}
        </div>
    );
}