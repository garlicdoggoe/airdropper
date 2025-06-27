"use client";

import InputField from "./ui/InputField";
import { useState } from "react";
import { chainsToTSender } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { erc20Abi } from "@/constants";
import { useMemo } from "react";
import { calculateTotal } from "@/utils";

function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amount, setAmount] = useState("");
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const total: number = useMemo(() => calculateTotal(amount), [amount]);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();

  async function getApprovalAmount(
    tSenderAddress: string | null
  ): Promise<number> {
    if (!tSenderAddress) {
      alert("No tSender address found, please use a supported chain");
      return 0;
    }

    // in the smart contract it would look like token.allowance(account, tsender)
    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tSenderAddress as `0x${string}`],
    });

    return response as number;
  }

  async function handleSubmit() {
    // 1.1  If approved, move to step 2
    // 1.2  Else, approve sender contract to spend tokens
    // 2.   Send tokens to sender
    // 3.   Wait for the transaction to be mined

    // Get contract address
    const tSenderAddress = chainsToTSender[chainId]["tsender"];
    const approvedAmount = await getApprovalAmount(tSenderAddress);
    
    if (approvedAmount < total) {
      const approvalHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [tSenderAddress as `0x${string}`, BigInt(total)],
      });
      const approvalReceipt = await waitForTransactionReceipt(config, {
        hash: approvalHash,
      });
      console.log("approvalReceipt", approvalReceipt);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <InputField
        label="Address"
        placeholder="0x..."
        value={tokenAddress}
        type="text"
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputField
        label="Recipients"
        placeholder="0x..., 0x..., 0x..."
        value={recipients}
        type="text"
        onChange={(e) => setRecipients(e.target.value)}
        large={true}
      />
      <InputField
        label="Amount"
        placeholder="100, 200, 300, ..."
        value={amount}
        type="text"
        onChange={(e) => setAmount(e.target.value)}
        large={true}
      />
      <button
        onClick={handleSubmit}
        className="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Send tokens
      </button>
    </div>
  );
}

export default AirdropForm;
