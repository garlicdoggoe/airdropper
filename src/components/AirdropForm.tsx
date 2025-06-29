"use client";

import InputField from "./ui/InputField";
import NeumorphButton from "./ui/NeumorphButton";
import Overlay from "./Overlay";
import { useState, useEffect } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract, useReadContracts, useWaitForTransactionReceipt  } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { useMemo } from "react";
import { calculateTotal, formatTokenAmount } from "@/utils";
import { ShineBorder } from "@/components/magicui/shine-border";


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

      setTokenAddress("");
      setRecipients("");
      setAmounts("");

      localStorage.removeItem('tokenAddress');
      localStorage.removeItem('recipients');
      localStorage.removeItem('amounts');
      const timer = setTimeout(() => {
        setShowSuccessOverlay(false)
      }, 5000);
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
    <div className="relative overflow-hidden border border-white/15 bg-gray-900/50 rounded-md p-10 mx-auto mb-10 max-w-5xl mt-32 shadow-[0_0_30px_-13px_rgba(255,107,53,0.9)]">
      <ShineBorder shineColor={"#FF6B35"} />
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
      <div className="flex flex-col items-center mx-auto mb-10 max-w-5xl mt-10">
        <InputField
          label="Token Address (ERC20)"
          placeholder="0x..."
          value={tokenAddress}
          type="text"
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <InputField
          label="Recipients"
          placeholder="Enter wallet addresses separated by commas or new lines"
          value={recipients}
          type="text"
          onChange={(e) => setRecipients(e.target.value)}
          large={true}
        />
        <InputField
          label="Amounts"
          placeholder="Enter token amounts in wei (one per recipient: 100, 100, 200, ...)"
          value={amounts}
          type="text"
          onChange={(e) => setAmounts(e.target.value)}
          large={true}
        />
        <div className="flex flex-col gap-2 p-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-10 mb-5 w-full">
          <h3 className="text-m font-medium pb-2">
            Transaction Details
          </h3>
          <div className="flex justify-between mt-2">
            <span className="text-gray-500 text-sm">Token Name</span>
            <span className="font-mono">
              {tokenData?.[1]?.result as string ?? "..."}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Amount (wei)</span>
            <span className="font-mono">{total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Amount (tokens)</span>
            <span className="font-mono">
              {formatTokenAmount(total, tokenData?.[0]?.result as number)}
            </span>
          </div>
        </div>
        <NeumorphButton
          className="justify-center px-4 text-sm font-medium items-center transition-[box-shadow,background-color] disabled:cursor-not-allowed disabled:opacity-50 flex active:transition-none bg-[#E94004] text-[#fff] hover:enabled:bg-[#EF551E] disabled:bg-[#E5A690] [box-shadow:inset_0px_-2.108433723449707px_0px_0px_#D13903,_0px_1.2048193216323853px_6.325301647186279px_0px_rgba(209,_57,_3,_58%)] hover:enabled:[box-shadow:inset_0px_-2.53012px_0px_0px_#D13903,_0px_1.44578px_7.59036px_0px_rgba(209,_57,_3,_64%)] disabled:shadow-none active:bg-[#E94004] active:[box-shadow:inset_0px_-1.5px_0px_0px_#B33202,_0px_0.5px_2px_0px_rgba(209,_57,_3,_70%)] text-xs py-4 h-11 rounded-[8px] cursor-pointer w-full"
          intent="primary"
          size={"small"}
          onClick={handleSubmit}
        >
          <span className="flex items-center gap-1">
              SEND TOKENS
          </span>
        </NeumorphButton>
      </div>
    </div>
  );
}

export default AirdropForm;
