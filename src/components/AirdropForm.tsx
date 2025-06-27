"use client";

import InputField from "./ui/InputField";
import Overlay from "./Overlay";
import { useState, useEffect } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract, useReadContracts, useWaitForTransactionReceipt  } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { useMemo } from "react";
import { calculateTotal, formatTokenAmount } from "@/utils";

function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
  const { data: hash, isPending, error, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError} = useWaitForTransactionReceipt({
    confirmations: 1,
    hash,
  })
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);

  const { data: tokenData } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "decimals",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "name",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "balanceOf",
        args: [account.address],
      },
    ],
  });
  useEffect(() => {
    if (isConfirmed) {
      setShowSuccessOverlay(true);
      const timer = setTimeout(() => {
        setShowSuccessOverlay(false)
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (error) {
      setShowErrorOverlay(true)
      const timer = setTimeout(() => {
        setShowErrorOverlay(false)
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const savedTokenAddress = localStorage.getItem('tokenAddress');
    const savedRecipients = localStorage.getItem('recipients');
    const savedAmounts = localStorage.getItem('amounts');

    if (savedTokenAddress) setTokenAddress(savedTokenAddress);
    if (savedRecipients) setRecipients(savedRecipients);
    if (savedAmounts) setAmounts(savedAmounts);
  }, []);

  useEffect(() => {
    localStorage.setItem('tokenAddress', tokenAddress);
  }, [tokenAddress]);

  useEffect(() => {
    localStorage.setItem('recipients', recipients);
  }, [recipients]);

  useEffect(() => {
    localStorage.setItem('amounts', amounts);
  }, [amounts]);

  async function getApprovalAmounts(
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
    const approvedAmounts = await getApprovalAmounts(tSenderAddress);
    
    if (approvedAmounts < total) {
      console.log("Approving tokens...");
      const approvalHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [tSenderAddress as `0x${string}`, BigInt(total)],
      });
      const approvalReceipt = await waitForTransactionReceipt(config, {
        hash: approvalHash,
      });
      console.log("Approval confirmed: ", approvalReceipt);

      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
          amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
          BigInt(total),
        ],
      })
    } else {
      await writeContractAsync({
          abi: tsenderAbi,
          address: tSenderAddress as `0x${string}`,
          functionName: "airdropERC20",
          args: [
            tokenAddress,
            recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
            amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
            BigInt(total),
        ],
      })
    }
  }

  return (
    <>
      {(isPending || isConfirming) && (
        <Overlay
          message={
            isPending
              ? "Submitting transaction..."
              : "Confirming transaction..."
          }
        />
      )}
      {showSuccessOverlay && <Overlay message="Transaction successful!" />}
      {showErrorOverlay && (
        <Overlay 
          message="Transaction aborted" 
          type="error"
        />
      )}
      <div className="mx-auto mb-10 max-w-5xl mt-10">
        <InputField
          label="ERC20 Address"
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
          label="Amounts"
          placeholder="100, 200, 300, ..."
          value={amounts}
          type="text"
          onChange={(e) => setAmounts(e.target.value)}
          large={true}
        />
        <div className="flex flex-col gap-2 p-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mb-5">
          <h3 className="text-m font-medium pb-2">
            Transaction Details
          </h3>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600 text-sm">Token Name</span>
            <span className="font-mono">
              {tokenData?.[1]?.result as string ?? "..."}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Amount (wei)</span>
            <span className="font-mono">{total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Amount (tokens)</span>
            <span className="font-mono">
              {formatTokenAmount(total, tokenData?.[0]?.result as number)}
            </span>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isPending || isConfirming}
          className="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send tokens
        </button>
      </div>
    </>
  );
}

export default AirdropForm;
