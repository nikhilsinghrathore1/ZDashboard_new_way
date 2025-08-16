'use client'; // This is a client component because it uses hooks

import { useState } from 'react';
import { ethers } from 'ethers';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// Import ABI and addresses
import AgentPlatformABI from '../contracts/AgentPlatform.json';
import ERC20ABI from '../contracts/erc20_abi.json'; // You'll need a standard ERC20 ABI
import { agentPlatformAddress, yourTokenAddress } from '../contracts/addresses';

interface RentButtonProps {
    agentId: number;
    amount: string; // e.g., "100"
}

export const RentButton = ({ agentId, amount }: RentButtonProps) => {
    const [isApproving, setIsApproving] = useState(false);
    const { data: approveHash, writeContractAsync: approve } = useWriteContract();
    const { data: rentHash, writeContractAsync: rentAgent } = useWriteContract();

    // Hook to watch for the rental transaction confirmation
    const { isSuccess: isRentConfirmed, isLoading: isRenting } = useWaitForTransactionReceipt({ 
        hash: rentHash, 
    });

    const handleRent = async () => {
        try {
            const amountInWei = ethers.parseUnits(amount, 18); // Assuming 18 decimals

            // --- 1. APPROVE STEP ---
            setIsApproving(true);
            await approve({
                address: yourTokenAddress,
                abi: ERC20ABI,
                functionName: 'approve',
                args: [agentPlatformAddress, amountInWei],
            });
            setIsApproving(false);

            // --- 2. RENT STEP ---
            // The user will be prompted for a second signature here
            await rentAgent({
                address: agentPlatformAddress,
                abi: AgentPlatformABI.abi, // Access the abi property from the imported JSON
                functionName: 'rentAgent',
                args: [agentId, amountInWei],
            });

        } catch (error) {
            console.error("Transaction failed", error);
            setIsApproving(false); // Reset on failure
        }
    };
    
    if (isRentConfirmed) {
        return <div>Payment Successful! ✅</div>;
    }

    if (isRenting) {
        return <div>Confirming Payment...</div>;
    }

    if (isApproving) {
        return <div>Please approve token spend...</div>;
    }

    return (
        <button onClick={handleRent} disabled={isRenting || isApproving}>
            Rent Agent for {amount} Tokens
        </button>
    );
};