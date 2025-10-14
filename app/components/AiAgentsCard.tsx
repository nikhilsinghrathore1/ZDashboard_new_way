'use client';

import Image from 'next/image';
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { X, Wallet, CheckCircle } from 'lucide-react';
import { ethers } from 'ethers';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';

// --- CONTRACT INFO ---
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

// Memoized modal header component
const ModalHeader = memo(({ 
  paymentStep, 
  onClose 
}: { 
  paymentStep: string, 
  onClose: () => void 
}) => (
  <div className="p-6 border-b border-purple-500/20">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
        {paymentStep === 'payment' ? 'Complete Purchase' : 'Payment Successful!'}
      </h2>
      <button 
        onClick={onClose}
        className="text-white/50 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  </div>
));

// Memoized agent info component
const AgentInfo = memo(({ 
  img, 
  title, 
  owner, 
  price 
}: { 
  img: any, 
  title: string, 
  owner: string, 
  price: string 
}) => (
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
));

// Memoized payment method section
const PaymentMethodSection = memo(() => (
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
    
    <div className="p-3 bg-purple-600/10 border border-purple-500/30 rounded-lg">
      <p className="text-purple-400 text-sm font-medium">✓ Connect your wallet to proceed</p>
      <p className="text-white/60 text-xs mt-1">Supports ETH, MATIC, and other major cryptocurrencies</p>
    </div>
  </div>
));

// Memoized payment button
const PaymentButton = memo(({ 
  isProcessing, 
  isConnected, 
  price, 
  onPayment 
}: { 
  isProcessing: boolean, 
  isConnected: boolean, 
  price: string, 
  onPayment: () => void 
}) => (
  <button
    onClick={onPayment}
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
));

// Memoized success state component
const SuccessState = memo(({ 
  title, 
  onDeploy 
}: { 
  title: string, 
  onDeploy: () => void 
}) => (
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

    <button
      onClick={onDeploy}
      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-500/80 hover:to-purple-600/80 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)]"
    >
      Deploy Agent
    </button>
  </div>
));

// Memoized card content component
const CardContent = memo(({ 
  title, 
  description, 
  price, 
  owner, 
  isFree, 
  onBuyClick 
}: {
  title: string,
  description: string,
  price: string,
  owner: string,
  isFree: boolean,
  onBuyClick: (e: React.MouseEvent) => void
}) => (
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
          {isFree ? 'FREE' : price}
        </h1>
        <h2 className="text-xs text-purple-400/70 uppercase tracking-wider">
          {owner}
        </h2>
      </div>
      
      <button 
        onClick={onBuyClick}
        className="relative cursor-pointer hover:scale-95 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 font-semibold uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(147,51,234,0.4)] backdrop-blur-sm"
        style={{ 
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
        }}
      >
        <span className="relative z-10 text-white">
          {isFree ? 'USE' : 'RENT'}
        </span>
        
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60"></div>
      </button>
    </div>
  </div>
));

const AiAgentsCard: React.FC<AiAgentsCardProps> = memo(({ 
  img, 
  title, 
  description, 
  price, 
  owner, 
  url, 
  agentId 
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'payment' | 'success'>('payment');
  const router = useRouter();

  const { isConnected } = useAccount();

  // Wagmi hooks for transactions
  const { 
    data: approveHash, 
    writeContractAsync: approveTokens, 
    isPending: isApproving, 
    reset: resetApprove 
  } = useWriteContract();
  
  const { 
    data: rentHash, 
    writeContractAsync: rentAgent, 
    isPending: isRenting, 
    reset: resetRent 
  } = useWriteContract();

  // Transaction receipt watchers
  const { isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash,
  });
  
  const { 
    isSuccess: isRentConfirmed, 
    isLoading: isConfirmingRent 
  } = useWaitForTransactionReceipt({
    hash: rentHash,
  });

  // Memoized processing state
  const isProcessing = useMemo(() => 
    isApproving || isRenting || isConfirmingRent,
    [isApproving, isRenting, isConfirmingRent]
  );

  // Memoized free agent check 
  const isFreeAgent = useMemo(() => {
    const normalizedTitle = title.toLowerCase();
    return normalizedTitle.includes('lana code') || 
           normalizedTitle.includes('quickie trader') 
  }, [title]);

  // Memoized redirect URL for free agents
  const freeAgentUrl = useMemo(() => {
    const normalizedTitle = title.toLowerCase();
    if (normalizedTitle.includes('lana code')) {
      return '/agent/codeGen';
    } else if (normalizedTitle.includes('quickie trader')) {
      return '/agent/trading';
    }
    return url;
  }, [title, url]);

  // Memoized price calculation
  const priceInWei = useMemo(() => {
    const numericPrice = price.split(' ')[0];
    return ethers.parseUnits(numericPrice, 18);
  }, [price]);

  // Optimized effect for handling approval confirmation
  useEffect(() => {
    if (!isApprovalConfirmed) return;

    console.log("✅ Approval confirmed! Now calling rentAgent...");
    
    const executeRent = async () => {
      try {
        // @ts-ignore
        await rentAgent({
          address: agentPlatformAddress,
          abi: AgentPlatformABI.abi,
          functionName: 'rentAgent',
          args: [agentId, priceInWei],
        });
      } catch (err) {
        console.error("❌ Rent agent call failed after approval", err);
      }
    };

    executeRent();
  }, [isApprovalConfirmed, rentAgent, agentId, priceInWei]);
  
  // Effect to update UI on rent confirmation
  useEffect(() => {
    if (isRentConfirmed) {
      setPaymentStep('success');
    }
  }, [isRentConfirmed]);

  // Memoized event handlers
  const handleBuyClick = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (isFreeAgent) {
      // if (freeAgentUrl === "/3000") {
      //   window.location.href = "https://auditor-chi.vercel.app";
      //   return;
      // }
      if (freeAgentUrl === "/3000") {
        window.location.href = "https://t.me/ApeDigest_Bot";
        return;
      }
      console.log("this is the free agent url , " , freeAgentUrl)
      router.push(freeAgentUrl);
      return;  
    }

    setShowPaymentModal(true);
    setPaymentStep('payment');
  }, [isFreeAgent, freeAgentUrl, router]);

  const handlePayment = useCallback(async () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    resetApprove();
    resetRent();

    try {
      console.log("1️⃣ Requesting token approval...");
      // @ts-ignore
      await approveTokens({
        address: yourTokenAddress,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [agentPlatformAddress, priceInWei],
      });
      console.log("⏳ Approval transaction sent, waiting for confirmation...");
    } catch (error) {
      console.error("❌ Approval transaction failed to send:", error);
    }
  }, [isConnected, approveTokens, priceInWei, resetApprove, resetRent]);

  const handleDeploy = useCallback(() => {
    setShowPaymentModal(false);
    router.push(url);
  }, [router, url]);

  const closeModal = useCallback(() => {
    if (!isProcessing) {
      setShowPaymentModal(false);
    }
  }, [isProcessing]);

  // Memoized card styles
  const cardClipPath = useMemo(() => ({
    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
  }), []);

  const buttonClipPath = useMemo(() => ({
    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
  }), []);

  const titleStyle = useMemo(() => ({
    textShadow: '0 0 10px rgba(147,51,234,0.5)',
    filter: 'drop-shadow(0 0 6px rgba(147,51,234,0.3))'
  }), []);

  const priceStyle = useMemo(() => ({
    textShadow: '0 0 12px rgba(196,181,253,0.8), 0 0 25px rgba(196,181,253,0.4)',
    filter: 'drop-shadow(0 0 8px rgba(196,181,253,0.6))'
  }), []);

  // Render the modal content based on payment step
  const renderModalContent = useCallback(() => {
    if (paymentStep === 'success') {
      return <SuccessState title={title} onDeploy={handleDeploy} />;
    }

    return (
      <>
        <AgentInfo img={img} title={title} owner={owner} price={price} />
        <PaymentMethodSection />
        <PaymentButton 
          isProcessing={isProcessing}
          isConnected={isConnected}
          price={price}
          onPayment={handlePayment}
        />
      </>
    );
  }, [paymentStep, title, handleDeploy, img, owner, price, isProcessing, isConnected, handlePayment]);

  return (
    <>
      <div 
        className="w-[25%] h-[95%] relative cursor-pointer"
        onClick={handleBuyClick}
      >
        {/* Main card with cyberpunk shape */}
        <div 
          className="w-full h-full relative overflow-hidden"
          style={cardClipPath}
        >
          {/* Background image */}
          <div className="w-full h-full">
            <Image
              className="w-full h-full object-cover" 
              src={img} 
              alt="AI Agent Background"
              priority={false}
              loading="lazy"
            />
            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800/10 via-transparent to-purple-600/10"></div>
          </div>
          
          {/* Glass morphism info panel */}
          <div className="absolute bottom-0 left-0 right-0 h-[45%] backdrop-blur-xl bg-gradient-to-t from-black/95 via-black/80 to-transparent border-t border-purple-500/30">
            {/* Glowing effects */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_8px_rgba(147,51,234,0.8)]"></div>
            <div className="absolute top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent opacity-60"></div>
            
            {/* Content */}
            <CardContent
              title={title}
              description={description}
              price={price}
              owner={owner}
              isFree={isFreeAgent}
              onBuyClick={handleBuyClick}
            />
            
            {/* Ambient light effects */}
            <div className="absolute bottom-0 left-4 w-20 h-20 bg-purple-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-4 right-4 w-16 h-16 bg-purple-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Cyberpunk corner accents */}
          <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-purple-500/60"></div>
          <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-purple-400/60"></div>
          <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-purple-600/40"></div>
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-purple-600/40"></div>
        </div>
      </div>

      {/* Payment Modal - Only render when needed and not for free agents */}
      {showPaymentModal && !isFreeAgent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal */}
          <div className="relative w-[90%] max-w-md bg-gradient-to-br from-black via-gray-900 to-black border border-purple-500/30 rounded-lg shadow-[0_0_50px_rgba(147,51,234,0.3)] backdrop-blur-md">
            <ModalHeader paymentStep={paymentStep} onClose={closeModal} />
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

// Set display names for debugging
AiAgentsCard.displayName = 'AiAgentsCard';
ModalHeader.displayName = 'ModalHeader';
AgentInfo.displayName = 'AgentInfo';
PaymentMethodSection.displayName = 'PaymentMethodSection';
PaymentButton.displayName = 'PaymentButton';
SuccessState.displayName = 'SuccessState';
CardContent.displayName = 'CardContent';

export default AiAgentsCard;


// research design is the structured framework or blueprint that writes process of gathering analysing and to add a same resarch problem , it defins how data will be collected and analysed , research component 1.research problem, how to problem reseach problem-. atleast 10=20 paper review, research component , reaserach meathod , types of reasearch design , literature review , descriptive 