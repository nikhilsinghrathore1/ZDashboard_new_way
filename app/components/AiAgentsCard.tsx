'use client'; // Required for hooks

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Wallet, CheckCircle } from 'lucide-react';
import { ethers } from 'ethers';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';

// --- STEP 1: IMPORT YOUR CONTRACT INFO ---
import AgentPlatformABI from '../contracts/AgentPlatform.json';
import ERC20ABI from '../contracts/erc20_abi.json';
import { agentPlatformAddress, yourTokenAddress } from '../contracts/addresses';

interface AiAgentsCardProps {
  img: any;
  title: string;
  description: string;
  price: string;
  owner: string;
  url: string;
  agentId: number;
}

const AiAgentsCard: React.FC<AiAgentsCardProps> = ({ img, title, description, price, owner, url, agentId }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('payment');
  const router = useRouter();

  const { isConnected } = useAccount();

  // --- WAGMI HOOKS FOR THE TWO-STEP TRANSACTION ---
  const { data: approveHash, writeContractAsync: approveTokens, isPending: isApproving, reset: resetApprove } = useWriteContract();
  const { data: rentHash, writeContractAsync: rentAgent, isPending: isRenting, reset: resetRent } = useWriteContract();

  // Hook to watch for the APPROVAL transaction to be confirmed
  const { isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash,
  });
  
  // Hook to watch for the final RENT transaction to be confirmed
  const { isSuccess: isRentConfirmed, isLoading: isConfirmingRent } = useWaitForTransactionReceipt({
    hash: rentHash,
  });

  // This variable combines all loading states for the UI
  const isProcessing = isApproving || isRenting || isConfirmingRent;

  // This `useEffect` triggers the second transaction (rentAgent) AFTER the first one (approve) is confirmed.
  useEffect(() => {
    if (isApprovalConfirmed) {
      console.log("✅ Approval confirmed! Now calling rentAgent...");
      const numericPrice = price.split(' ')[0];
      const amountInWei = ethers.parseUnits(numericPrice, 18);

      // Call the rentAgent function now that approval is granted
    //  @ts-ignore

      rentAgent({
        address: agentPlatformAddress,
        abi: AgentPlatformABI.abi,
        functionName: 'rentAgent',
        args: [agentId, amountInWei],
      }).catch(err => {
        console.error("❌ Rent agent call failed after approval", err);
      });
    }
  }, [isApprovalConfirmed, rentAgent, agentId, price]);
  
  // This `useEffect` updates the UI to the "success" step once the final transaction is confirmed.
  useEffect(() => {
    if (isRentConfirmed) {
      setPaymentStep('success');
    }
  }, [isRentConfirmed]);

  // Check if this is a free agent that should redirect directly
  const isFreeAgent = (agentTitle: string) => {
    const normalizedTitle = agentTitle.toLowerCase();
    return normalizedTitle.includes('lana code') || normalizedTitle.includes('quickie trader');
  };

  // Get the redirect URL for free agents
  const getFreeAgentUrl = (agentTitle: string) => {
    const normalizedTitle = agentTitle.toLowerCase();
    if (normalizedTitle.includes('lana code')) {
      return '/agent/codeGen';
    } else if (normalizedTitle.includes('quickie trader')) {
      return '/agent/trading';
    }
    return url; // fallback to original url
  };

  const handleBuyClick = () => {
    // Check if this is a free agent
    if (isFreeAgent(title)) {
      // Redirect directly to the agent page
      const redirectUrl = getFreeAgentUrl(title);
      router.push(redirectUrl);
      return;
    }
    
    // Otherwise, show payment modal for paid agents
    setShowPaymentModal(true);
    setPaymentStep('payment');
  };

  // This is the function that starts the entire payment process.
  const handlePayment = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    // Reset previous transaction states before starting a new one
    resetApprove();
    resetRent();
    
    const numericPrice = price.split(' ')[0];
    const amountInWei = ethers.parseUnits(numericPrice, 18);

    try {
      console.log("1️⃣ Requesting token approval...");
      // This only starts the FIRST step (approve)
      //  @ts-ignore
      await approveTokens({
        address: yourTokenAddress,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [agentPlatformAddress, amountInWei],
      });
      console.log("⏳ Approval transaction sent, waiting for confirmation...");
    } catch (error) {
      console.error("❌ Approval transaction failed to send:", error);
    }
  };

  const handleDeploy = () => {
    setShowPaymentModal(false);
    router.push(url);
  };

  const closeModal = () => {
    // Don't let the user close the modal while a transaction is processing
    if (!isProcessing) {
      setShowPaymentModal(false);
    }
  };

  return (
    <>
      <div className="w-[25%] h-[95%] relative cursor-pointer"
      onClick={handleBuyClick}>
        {/* Main card with cyberpunk shape - clipped corners */}
        <div 
          className="w-full h-full relative overflow-hidden"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
          }}
        >
          {/* Background image */}
          <div className="w-full h-full">
            <Image
              className="w-full h-full object-cover" 
              src={img} 
              alt="AI Agent Background" 
            />
            {/* Pure black overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800/10 via-transparent to-purple-600/10"></div>
          </div>
          
          {/* Glass morphism info panel */}
          <div className="absolute bottom-0 left-0 right-0 h-[45%] backdrop-blur-xl bg-gradient-to-t from-black/95 via-black/80 to-transparent border-t border-purple-500/30">
            {/* Glowing top border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_8px_rgba(147,51,234,0.8)]"></div>
            
            {/* Glass highlight */}
            <div className="absolute top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent opacity-60"></div>
            
            {/* Content */}
            <div className="p-4 h-full flex flex-col justify-between text-white relative z-10">
              <div className="space-y-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent tracking-wider"
                    style={{
                      textShadow: '0 0 10px rgba(147,51,234,0.5)',
                      filter: 'drop-shadow(0 0 6px rgba(147,51,234,0.3))'
                    }}>
                  {title}
                </h1>
                <p className="text-sm text-white/80 leading-relaxed font-light">
                  {description}
                </p>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <h1 className="text-lg font-bold text-purple-300 relative"
                      style={{
                        textShadow: '0 0 12px rgba(196,181,253,0.8), 0 0 25px rgba(196,181,253,0.4)',
                        filter: 'drop-shadow(0 0 8px rgba(196,181,253,0.6))'
                      }}>
                    {isFreeAgent(title) ? 'FREE' : price}
                  </h1>
                  <h2 className="text-xs text-purple-400/70 uppercase tracking-wider">
                    {owner}
                  </h2>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); handleBuyClick(); }}
                  className="relative hover:scale-95 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 font-semibold uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(147,51,234,0.4)] backdrop-blur-sm"
                  style={{ 
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                >
                  <span className="relative z-10 text-white">
                    {isFreeAgent(title) ? 'USE' : 'RENT'}
                  </span>
                  
                  {/* Glass highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60"></div>
                </button>
              </div>
            </div>
            
            {/* Ambient light effects */}
            <div className="absolute bottom-0 left-4 w-20 h-20 bg-purple-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-4 right-4 w-16 h-16 bg-purple-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Cyberpunk corner accents */}
          <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-purple-500/60"></div>
          <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-purple-400/60"></div>
          
          {/* Additional corner details */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-purple-600/40"></div>
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-purple-600/40"></div>
        </div>
      </div>

      {/* Payment Modal - Only shows for paid agents */}
      {showPaymentModal && !isFreeAgent(title) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal */}
          <div className="relative w-[90%] max-w-md bg-gradient-to-br from-black via-gray-900 to-black border border-purple-500/30 rounded-lg shadow-[0_0_50px_rgba(147,51,234,0.3)] backdrop-blur-md">
            
            {/* Header */}
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  {paymentStep === 'payment' ? 'Complete Purchase' : 'Payment Successful!'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {paymentStep === 'payment' ? (
                <>
                  {/* Agent Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image src={img} alt={title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{title}</h3>
                        <p className="text-white/60 text-sm">by {owner}</p>
                        <p className="text-purple-300 font-bold text-lg">{price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method - Only Crypto */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Payment Method</h4>
                    <div className="p-4 border-2 border-purple-500/50 rounded-lg bg-gradient-to-r from-purple-600/20 to-purple-500/20 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-600/20 rounded-lg">
                            <Wallet className="text-purple-400" size={20} />
                          </div>
                          <div>
                            <span className="text-white font-semibold">Crypto Wallet</span>
                            <p className="text-purple-400 text-sm">Secure & Decentralized</p>
                          </div>
                        </div>
                        <div className="w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.8)]"></div>
                      </div>
                    </div>
                    
                    {/* Crypto info */}
                    <div className="p-3 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                      <p className="text-purple-400 text-sm font-medium">✓ Connect your wallet to proceed</p>
                      <p className="text-white/60 text-xs mt-1">Supports ETH, MATIC, and other major cryptocurrencies</p>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || !isConnected}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-600/80 hover:to-purple-500/80 disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)]"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : isConnected ? (
                      `Pay ${price} with Crypto`
                      ) : (
                      'Please Connect Wallet'
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Success State */}
                  <div className="text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)]">
                      <CheckCircle className="text-white" size={32} />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Payment Complete!</h3>
                      <p className="text-white/70">Your AI Agent is ready to deploy</p>
                    </div>

                    <div className="p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                      <p className="text-purple-400 font-medium">{title}</p>
                      <p className="text-white/60 text-sm">Successfully purchased with crypto</p>
                    </div>

                    {/* Deploy Button */}
                    <button
                      onClick={handleDeploy}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-500/80 hover:to-purple-600/80 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)]"
                    >
                      Deploy Agent
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AiAgentsCard