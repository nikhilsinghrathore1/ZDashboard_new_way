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

// @ts-ignore
// const AiAgentsCard = ({img, title, description, price, owner, url, agentId}) => {
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paymentStep, setPaymentStep] = useState('payment'); // 'payment' or 'success'
//   const [isProcessing, setIsProcessing] = useState(false);
//   const router = useRouter();
//   const { isConnected } = useAccount(); // <-- Add this line


//   const handleBuyClick = () => {
//     setShowPaymentModal(true);
//     setPaymentStep('payment');
//   };

//   const handlePayment = async () => {
//     setIsProcessing(true);
//     // Simulate payment processing
//     setTimeout(() => {
//       setIsProcessing(false);
//       setPaymentStep('success');
//     }, 2000);
//   };

//   const handleDeploy = () => {
//     setShowPaymentModal(false);
//     router.push(url);
//   };

//   const closeModal = () => {
//     setShowPaymentModal(false);
//     setPaymentStep('payment');
//     setIsProcessing(false);
//   };

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

  const handleBuyClick = () => {
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
      <div className="w-[25%] h-[95%] relative group cursor-pointer"
      onClick={handleBuyClick}>
        {/* Main card with cyberpunk shape - clipped corners */}
        <div 
          className="w-full h-full relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:rotate-1"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
          }}
        >
          {/* Background image */}
          <div className="w-full h-full">
            <Image
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src={img} 
              alt="AI Agent Background" 
            />
            {/* Neon liquid overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#4cc9ff]/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#4cc9ff]/10 via-transparent to-[#00fff0]/10"></div>
            
            {/* Liquid flow background overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(70% 100% at 30% 50%, rgba(76,201,255,0.15), rgba(0,255,240,0.1) 50%, transparent 80%)',
                  animation: 'cardLiquidFlow 4s ease-in-out infinite alternate'
                }}
              />
            </div>
          </div>
          
          {/* Glass morphism info panel */}
          <div className="absolute bottom-0 left-0 right-0 h-[45%] backdrop-blur-xl bg-gradient-to-t from-black/70 via-black/50 to-transparent border-t border-[#4cc9ff]/30">
            {/* Glowing top border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4cc9ff] to-transparent shadow-[0_0_8px_rgba(76,201,255,0.8)]"></div>
            
            {/* Glass highlight */}
            <div className="absolute top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60"></div>
            
            {/* Content */}
            <div className="p-4 h-full flex flex-col justify-between text-white relative z-10">
              <div className="space-y-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#4cc9ff] via-[#00fff0] to-[#4cc9ff] bg-clip-text text-transparent tracking-wider"
                    style={{
                      textShadow: '0 0 10px rgba(76,201,255,0.5)',
                      filter: 'drop-shadow(0 0 6px rgba(76,201,255,0.3))'
                    }}>
                  {title}
                </h1>
                <p className="text-sm text-white/80 leading-relaxed font-light">
                  {description}
                </p>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <h1 className="text-lg font-bold text-[#00fff0] relative"
                      style={{
                        textShadow: '0 0 12px rgba(0,255,240,0.8), 0 0 25px rgba(0,255,240,0.4)',
                        filter: 'drop-shadow(0 0 8px rgba(0,255,240,0.6))'
                      }}>
                    {price}
                  </h1>
                  <h2 className="text-xs text-[#4cc9ff]/70 uppercase tracking-wider">
                    {owner}
                  </h2>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); handleBuyClick(); }}
                  className="relative px-4 py-2 bg-gradient-to-r from-[#4cc9ff] to-[#00fff0] hover:from-[#4cc9ff]/80 hover:to-[#00fff0]/80 transition-all duration-300 font-semibold uppercase tracking-wider text-sm transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(76,201,255,0.4)] hover:shadow-[0_0_30px_rgba(76,201,255,0.6)] backdrop-blur-sm"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                >
                  <span className="relative z-10 text-white">BUY</span>
                  
                  {/* Glass highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60"></div>
                  
                  {/* Glowing effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4cc9ff]/20 to-[#00fff0]/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                       style={{
                         clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                       }}>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Ambient light effects */}
            <div className="absolute bottom-0 left-4 w-20 h-20 bg-[#4cc9ff]/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-4 right-4 w-16 h-16 bg-[#00fff0]/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Cyberpunk corner accents */}
          <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-[#4cc9ff]/60 group-hover:border-[#4cc9ff] transition-colors duration-300 group-hover:shadow-[0_0_8px_rgba(76,201,255,0.6)]"></div>
          <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-[#00fff0]/60 group-hover:border-[#00fff0] transition-colors duration-300 group-hover:shadow-[0_0_8px_rgba(0,255,240,0.6)]"></div>
          
          {/* Additional corner details */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#7a5cff]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#7a5cff]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Holographic scan line effect */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#4cc9ff] to-transparent"
               style={{
                 animation: 'scanLineMove 3s linear infinite',
                 boxShadow: '0 0 10px rgba(76,201,255,0.8)'
               }}>
          </div>
        </div>
        
        {/* Neon glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             style={{
               clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
               boxShadow: '0 0 30px rgba(76,201,255,0.4), 0 0 60px rgba(76,201,255,0.2), inset 0 0 30px rgba(76,201,255,0.1)'
             }}>
        </div>
        
        {/* Floating energy particles */}
        <div className="absolute top-2 right-8 w-1 h-1 bg-[#4cc9ff] rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 group-hover:animate-pulse"></div>
        <div className="absolute bottom-12 left-6 w-1 h-1 bg-[#00fff0] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 group-hover:animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        
        {/* CSS animations */}
        <style jsx>{`
          @keyframes cardLiquidFlow {
            0% { 
              transform: scale(1) rotate(0deg); 
              opacity: 0.2;
            }
            100% { 
              transform: scale(1.02) rotate(2deg); 
              opacity: 0.4;
            }
          }
          @keyframes scanLineMove {
            0% { 
              transform: translateY(-100%); 
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% { 
              transform: translateY(400%); 
              opacity: 0;
            }
          }
        `}</style>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal */}
          <div className="relative w-[90%] max-w-md bg-gradient-to-br from-[#020204] via-[#0f0f1a] to-[#020204] border border-[#4cc9ff]/30 rounded-lg shadow-[0_0_50px_rgba(76,201,255,0.3)] backdrop-blur-md">
            
            {/* Header */}
            <div className="p-6 border-b border-[#4cc9ff]/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#4cc9ff] to-[#00fff0] bg-clip-text text-transparent">
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
                        <p className="text-[#00fff0] font-bold text-lg">{price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method - Only Crypto */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Payment Method</h4>
                    <div className="p-4 border-2 border-[#4cc9ff]/50 rounded-lg bg-gradient-to-r from-[#4cc9ff]/20 to-[#00fff0]/20 shadow-[0_0_15px_rgba(76,201,255,0.3)]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-[#4cc9ff]/20 rounded-lg">
                            <Wallet className="text-[#4cc9ff]" size={20} />
                          </div>
                          <div>
                            <span className="text-white font-semibold">Crypto Wallet</span>
                            <p className="text-[#4cc9ff] text-sm">Secure & Decentralized</p>
                          </div>
                        </div>
                        <div className="w-4 h-4 bg-[#4cc9ff] rounded-full shadow-[0_0_8px_rgba(76,201,255,0.8)]"></div>
                      </div>
                    </div>
                    
                    {/* Crypto info */}
                    <div className="p-3 bg-[#4cc9ff]/10 border border-[#4cc9ff]/30 rounded-lg">
                      <p className="text-[#4cc9ff] text-sm font-medium">✓ Connect your wallet to proceed</p>
                      <p className="text-white/60 text-xs mt-1">Supports ETH, MATIC, and other major cryptocurrencies</p>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || !isConnected}
                    className="w-full py-3 bg-gradient-to-r from-[#4cc9ff] to-[#00fff0] hover:from-[#4cc9ff]/80 hover:to-[#00fff0]/80 disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(76,201,255,0.4)] hover:shadow-[0_0_30px_rgba(76,201,255,0.6)]"
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
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#4cc9ff] to-[#00fff0] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(76,201,255,0.5)]">
                      <CheckCircle className="text-white" size={32} />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Payment Complete!</h3>
                      <p className="text-white/70">Your AI Agent is ready to deploy</p>
                    </div>

                    <div className="p-4 bg-[#4cc9ff]/10 border border-[#4cc9ff]/30 rounded-lg">
                      <p className="text-[#4cc9ff] font-medium">{title}</p>
                      <p className="text-white/60 text-sm">Successfully purchased with crypto</p>
                    </div>

                    {/* Deploy Button */}
                    <button
                      onClick={handleDeploy}
                      className="w-full py-3 bg-gradient-to-r from-[#00fff0] to-[#4cc9ff] hover:from-[#00fff0]/80 hover:to-[#4cc9ff]/80 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,255,240,0.4)] hover:shadow-[0_0_30px_rgba(0,255,240,0.6)]"
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
