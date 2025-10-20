"use client"
import React, { useState, useEffect } from 'react'
import { Search, Star, Users, Download, TrendingUp, Bot, Code, MessageSquare, Image, Music, Brain, Heart, User, Crown, GitBranch, DollarSign, Zap, Wallet, ShoppingCart, X, Check, Loader, Send, BookOpen } from 'lucide-react'
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi'
import { ethers } from 'ethers'

// --- IMPORT YOUR CONTRACT INFO ---
import AgentPlatformABI from '../contracts/AgentPlatform.json';
import ERC20ABI from '../contracts/erc20_abi.json';
import { agentPlatformAddress, yourTokenAddress } from '../contracts/addresses';

// Static agents that always appear
const STATIC_AGENTS = [
  {
    id: 'telegram-crypto-bot',
    agentId: 'static-telegram',
    name: 'Crypto Signal Bot',
    description: 'The most aggressive crypto trading signal bot. Get real-time alerts for pump opportunities, whale movements, and market manipulations.',
    price: 'Free',
    creator: 'Zlag Team',
    creatorAddress: null,
    rating: 4.9,
    users: '15.2k',
    downloads: '45.8k',
    trending: true,
    tags: ['Crypto', 'Trading', 'Signals', 'Telegram'],
    icon: Send,
    color: 'bg-blue-600',
    owned: false,
    createdByUser: false,
    liked: true,
    redirectUrl: 'https://t.me/ApeDigest_Bot', // Replace with actual Telegram bot link
    isFree: true,
    isStatic: true
  },
  {
    id: 'yc-docs-bot',
    agentId: 'static-yc',
    name: 'YC Docs Assistant',
    description: 'Your personal Y Combinator knowledge base. Get instant answers about startup advice, funding, growth strategies, and YC application tips.',
    price: 'Free',
    creator: 'Zlag Team',
    creatorAddress: null,
    rating: 4.8,
    users: '8.7k',
    downloads: '23.4k',
    trending: true,
    tags: ['YC', 'Startup', 'Docs', 'Business'],
    icon: BookOpen,
    color: 'bg-orange-600',
    owned: false,
    createdByUser: false,
    liked: true,
    redirectUrl: 'https://deckiq-dujmdaz6crcphu8rcabkkk.streamlit.app/', // Replace with actual route
    isFree: true,
    isStatic: true
  }
];

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [apiAgents, setApiAgents] = useState([])
  const [ownedAgents, setOwnedAgents] = useState([])
  const [createdAgents, setCreatedAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Purchase modal state
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [purchaseError, setPurchaseError] = useState(null)

// --- WAGMI HOOKS FOR WALLET AND PAYMENT ---
  const { address: userAddress, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const { data: approveHash, writeContractAsync: approveTokens, isPending: isApproving, reset: resetApprove } = useWriteContract();
  const { data: rentHash, writeContractAsync: rentAgent, isPending: isRenting, reset: resetRent } = useWriteContract();

  const { isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: isRentConfirmed, isLoading: isConfirmingRent } = useWaitForTransactionReceipt({ hash: rentHash });
  
  const isBlockchainProcessing = isApproving || isRenting || isConfirmingRent;

   // NEW useEffect: Handles clearing data ONLY on disconnect.
  useEffect(() => {
    if (!isConnected) {
      setApiAgents([]);
      setOwnedAgents([]);
      setCreatedAgents([]);
    }
  }, [isConnected]);
  
  // --- This useEffect triggers the rentAgent call AFTER the approval is confirmed ---

  useEffect(() => {
    if (isApprovalConfirmed && selectedAgent) {
      // Check if agentId is a valid number (not undefined, null, etc.)
      if (typeof selectedAgent.agentId !== 'number' && typeof selectedAgent.agentId !== 'string') {
          setPurchaseError("Purchase failed: Agent ID is missing or invalid. Please contact support.");
          return; // Stop execution
      }
      const numericPrice = selectedAgent.price.split(' ')[0];
      const amountInWei = ethers.parseUnits(numericPrice, 18);
// @ts-ignore
      rentAgent({
        address: agentPlatformAddress,
        abi: AgentPlatformABI.abi,
        functionName: 'rentAgent',
        args: [selectedAgent.agentId, amountInWei],
      }).catch(err => {
        setPurchaseError("Payment failed at the final step. Please try again.");
      });
    }
  }, [isApprovalConfirmed, selectedAgent, rentAgent]);

  // --- This listener waits for the on-chain event, then calls the backend ---
  useWatchContractEvent({
    address: agentPlatformAddress,
    abi: AgentPlatformABI.abi,
    eventName: 'RentalPaid',
    onLogs(logs) {
    // @ts-ignore
      const userLog = logs.find(log => log.args.renter === userAddress && log.args.agentId.toString() === selectedAgent?.agentId.toString());
      if (userLog) {
        // console.log(`✅ Event: RentalPaid! Agent ID: ${userLog.args.agentId.toString()}`);
        handleUpdateBackendAfterPurchase();
      }
    },
  });

  // --- This is the NEW function that starts the blockchain payment ---
  const handleBlockchainPayment = async () => {
    if (!selectedAgent || !userAddress) {
      setPurchaseError("No agent selected or wallet not connected.");
      return;
    }
    
    setPurchaseError(null);
    resetApprove();
    resetRent();

    try {
      console.log("1️⃣ Requesting token approval for rental...");
      const numericPrice = selectedAgent.price.split(' ')[0];
      const amountInWei = ethers.parseUnits(numericPrice, 18);
// @ts-ignore
      await approveTokens({
        address: yourTokenAddress,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [agentPlatformAddress, amountInWei],
      });
      console.log("⏳ Approval transaction sent, waiting for confirmation...");
    } catch (err) {
      console.error("❌ Approval transaction failed to send:", err);
      setPurchaseError("Failed to initiate payment. Please check your wallet and try again.");
    }
  };
  
  // --- This is your OLD function, now repurposed to only handle the backend update ---
  const handleUpdateBackendAfterPurchase = async () => {
    console.log("2️⃣ Updating backend after successful payment...");
    try {
      const payload = {
        agentId: selectedAgent.id,
        buyerWalletAddress: userAddress,
        onchainAgentid : selectedAgent.agentId
      };

      console.log("this is the updated payload : " ,payload)

      
      const response = await fetch('https://zlag-ownable-service.vercel.app/api/agents/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Backend update failed.');
      }

      const result = await response.json();
      if (result.success) {
        console.log("🎉 Purchase successful! Backend updated.");
        setPurchaseSuccess(true);
        // Optimistically update UI
        setOwnedAgents(prev => [...prev, { ...selectedAgent, owned: true }]);
        setApiAgents(prev => prev.filter(agent => agent.agentId !== selectedAgent.agentId));
        
        setTimeout(() => {
          setShowPurchaseModal(false);
        }, 2000);
      } else {
        throw new Error(result.message || 'Backend returned a failure message.');
      }
    } catch (error) {
      console.error("❌ Backend/unexpected error after purchase:", error);
      setPurchaseError(`Payment succeeded, but backend update failed: ${error.message}`);
    }
  };

  // Capability to icon mapping
  const getIconForCapabilities = (capabilities) => {
    if (capabilities.includes('coding') || capabilities.includes('debugging')) return Code
    if (capabilities.includes('content-creation') || capabilities.includes('brainstorming')) return Brain
    if (capabilities.includes('data-analysis') || capabilities.includes('research')) return TrendingUp
    if (capabilities.includes('business-analysis') || capabilities.includes('strategic-planning')) return Users
    if (capabilities.includes('mentoring') || capabilities.includes('guidance')) return Heart
    if (capabilities.includes('trading') || capabilities.includes('finance')) return DollarSign
    return Bot
  }

  // Capability to color mapping
  const getColorForCapabilities = (capabilities) => {
    if (capabilities.includes('coding') || capabilities.includes('debugging')) return 'bg-purple-500'
    if (capabilities.includes('content-creation') || capabilities.includes('brainstorming')) return 'bg-purple-600'
    if (capabilities.includes('data-analysis') || capabilities.includes('research')) return 'bg-indigo-500'
    if (capabilities.includes('business-analysis') || capabilities.includes('strategic-planning')) return 'bg-purple-700'
    if (capabilities.includes('mentoring') || capabilities.includes('guidance')) return 'bg-indigo-600'
    if (capabilities.includes('trading') || capabilities.includes('finance')) return 'bg-purple-800'
    return 'bg-gray-600'
  }

 
  const transformApiAgent = (agent, isOwned = false, isCreated = false) => {
    // Determine the full creator address from multiple possible structures
    const fullCreatorAddress = (agent.creator ? agent.creator.walletAddress : agent.creatorWalletAddress) || null;

    return {
      // The DATABASE ID, used for keys and URL links
      id: agent.id, 
      
      // The ON-CHAIN ID from the blockchain, used for payments
      agentId: agent.agentId, 

      name: agent.name,
      description: agent.description,
      price: agent.price ? `${agent.price} Zlag` : "50 Zlag",
      
      // NEW: Use the robust fullCreatorAddress variable
      creatorAddress: fullCreatorAddress,

      // KEEP: The shortened address for display purposes only
      creator: fullCreatorAddress ? fullCreatorAddress.slice(0, 8) + '...' : "Community",
      
      rating: (4.0 + Math.random() * 1.0),
      users: `${(Math.random() * 10 + 1).toFixed(1)}k`,
      downloads: `${(Math.random() * 30 + 5).toFixed(1)}k`,
      trending: Math.random() > 0.7,
      tags: agent.capabilities ? agent.capabilities.slice(0, 3) : ['AI', 'Bot', 'Helper'],
      icon: getIconForCapabilities(agent.capabilities || []),
      color: getColorForCapabilities(agent.capabilities || []),
      owned: isOwned,
      createdByUser: isCreated,
      liked: Math.random() > 0.5,
      redirectUrl: `/agent/${agent.id}`,
      isFree: agent.price === 0 || agent.price === 'Free',
      isStatic: false
    };
  };

  
  // --- CORRECTED useEffect HOOK ---
  // UPDATED useEffect: Handles fetching data ONLY when connected.
  useEffect(() => {
    const fetchAgents = async () => {
      // The guard clause is still here, but it no longer clears state.
      if (!isConnected || !userAddress) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all agents, owned agents, and created agents
        const [generalResponse, ownedResponse, createdResponse] = await Promise.all([
          fetch('https://zlag-ownable-service.vercel.app/api/agents'),
          fetch(`https://zlag-ownable-service.vercel.app/api/users/${userAddress}/owned-agents`),
          fetch(`https://zlag-ownable-service.vercel.app/api/users/${userAddress}/created-agents`)
        ]);
        let createdAgentCreatorAddresses = new Set();

        // Process owned agents first
        if (ownedResponse.ok) {
          const ownedResult = await ownedResponse.json();
          if (ownedResult.success) {
            const transformedOwned = ownedResult.agents.map(agent => transformApiAgent(agent, true, false));
            setOwnedAgents(transformedOwned);
            }
        } else {
           setOwnedAgents([]);
        }

        // Process created agents
        if (createdResponse.ok) {
          const createdResult = await createdResponse.json();

          if (createdResult.success) {
            const transformedCreated = createdResult.agents.map(agent => transformApiAgent(agent, false, true));
            setCreatedAgents(transformedCreated);
            transformedCreated.forEach(agent => createdAgentCreatorAddresses.add(agent.creator));
          }
        }

        // Process all agents and filter out the ones already owned
        if (generalResponse.ok) {
          const generalResult = await generalResponse.json();
          const ownedAgentIds = new Set(ownedAgents.map(a => a.id));
          if (generalResult.success) {
            const allAgentsData = generalResult.agents
              .filter(agent => !ownedAgentIds.has(agent.id))
              .map(agent => {
                const isCreated = agent.creatorWalletAddress === userAddress;
                return transformApiAgent(agent, false, isCreated);
              });
            setApiAgents(allAgentsData);
          }
        } else {
           setApiAgents([]);
        }

      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [userAddress, isConnected]);


  // --- FINAL CORRECTED FILTERING LOGIC ---
  const getFilteredAgents = () => {
    let sourceArray = [];

    // Step 1: Determine which list of agents to start with.
    switch (selectedFilter) {
      case 'owned':
        sourceArray = ownedAgents;
        break;
      case 'created':
        sourceArray = createdAgents;
        break;
      default: // 'all'
        // Combine static agents with API agents
        const allAvailable = [...STATIC_AGENTS, ...apiAgents];
        // In the 'all' view, filter out any agents created by the current user.
        if (userAddress) {
          const lowerCaseUserAddress = userAddress.toLowerCase();
          sourceArray = allAvailable.filter(agent => 
            !agent.creatorAddress || agent.creatorAddress.toLowerCase() !== lowerCaseUserAddress
          );
        } else {
          sourceArray = allAvailable;
        }
        break;
    }

    // Step 2: If there's a search term, filter the chosen list. Otherwise, return it as is.
    if (searchTerm.trim() === '') {
      return sourceArray;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return sourceArray.filter(agent =>
      agent.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      agent.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      (agent.tags && agent.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
    );
  };

  const filteredAgents = getFilteredAgents();

  const filters = [
    { id: 'all', name: 'All Agents', icon: Bot },
    { id: 'owned', name: 'Agents You Own', icon: Heart },
    { id: 'created', name: 'Created by You', icon: Crown }
  ];

  const handleAgentClick = (agent) => {
    // Handle static agents - redirect to their specific URLs
    if (agent.isStatic) {
      window.open(agent.redirectUrl, '_blank');
      return;
    }

    // Handle free agents or owned/created agents directly
    if (agent.owned || agent.createdByUser || agent.isFree) {
      if (agent.redirectUrl) {
        window.location.href = agent.redirectUrl;
      }
    } else {
      setSelectedAgent(agent);
      setShowPurchaseModal(true);
      setPurchaseSuccess(false);
      setPurchaseError(null);
    }
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedAgent(null);
    setPurchaseSuccess(false);
    setPurchaseError(null);
    resetApprove();
    resetRent();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced background pattern */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(147,51,234,0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(99,102,241,0.1) 0%, transparent 50%),
          linear-gradient(rgba(147,51,234,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(147,51,234,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '800px 800px, 800px 800px, 40px 40px, 40px 40px'
      }}></div>

      {/* Header */}
      <div className=" bg-black/60 backdrop-blur-md border-b border-purple-900/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              AI Marketplace
            </h1>
            
            <div className="flex items-center gap-4">
              {!isConnected ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => connect({ connector: connectors[0] })}
                    disabled={isPending}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-400 hover:to-indigo-400 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Wallet size={16} />
                    {isPending ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/40">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-300 text-sm font-medium">
                    {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                  </span>
                  <button
                    onClick={() => disconnect()}
                    className="text-purple-400 hover:text-purple-300 transition-colors ml-2"
                    title="Disconnect"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {loading && isConnected && (
                <div className="flex items-center gap-2 text-purple-400">
                  <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading agents...</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
              <input
                type="text"
                placeholder="Search agents by name, description, or capabilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/60 backdrop-blur-sm border border-purple-800/50 rounded-2xl pl-12 pr-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 placeholder-gray-400 transition-all"
              />
            </div>
            
            <div className="flex gap-3 overflow-x-auto">
              {filters.map(filter => {
                const FilterIcon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`whitespace-nowrap px-5 py-3 rounded-2xl font-medium transition-all backdrop-blur-sm flex items-center gap-2 ${
                      selectedFilter === filter.id
                        ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-white border border-purple-500/50 shadow-lg shadow-purple-500/20'
                        : 'bg-gray-900/40 text-gray-300 hover:bg-gray-800/50 border border-purple-800/40 hover:border-purple-600/50'
                    }`}
                  >
                    <FilterIcon size={16} />
                    {filter.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/90 backdrop-blur-xl border border-purple-800/50 rounded-3xl p-8 max-w-md w-full relative">
            <button
              onClick={closePurchaseModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {purchaseSuccess ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Purchase Successful!</h3>
                <p className="text-gray-300 mb-6">
                  You now own <strong>{selectedAgent.name}</strong>. You can access it from your owned agents.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 ${selectedAgent.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <selectedAgent.icon size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedAgent.name}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {selectedAgent.description}
                  </p>
                  
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6">
                    {selectedAgent.price}
                  </div>
                </div>

                {purchaseError && (
                  <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-4 mb-6">
                    <p className="text-red-300 text-sm text-center">{purchaseError}</p>
                  </div>
                )}

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 mb-6">
                  <p className="text-purple-200 text-sm text-center">
                    You are about to purchase this AI agent. Once purchased, you'll have full access to deploy and use it.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={closePurchaseModal}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBlockchainPayment}
                    disabled={isBlockchainProcessing}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isBlockchainProcessing ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Buy Now
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {!isConnected && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-black/40 backdrop-blur-xl border border-purple-800/30 rounded-3xl p-12 mx-auto max-w-lg">
              <div className="text-purple-500 mb-6">
                <Wallet size={64} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Please connect your wallet to view and manage your AI agents.
              </p>
              <button
                onClick={() => connect({ connector: connectors[0] })}
                disabled={isPending}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-purple-400 hover:to-indigo-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {isPending ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        )}

        {isConnected && (
          <>
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 rounded-2xl p-4 mb-6">
                <p className="text-red-300 text-center">{error}</p>
              </div>
            )}

            <div className="mb-8">
              <p className="text-gray-400 text-sm">
                Showing {filteredAgents.length} agents
                {selectedFilter !== 'all' && (
                  <span className="text-purple-400"> • {filters.find(f => f.id === selectedFilter)?.name}</span>
                )}
                {selectedFilter === 'all' && (
                  <span className="text-purple-400"> • Available for purchase</span>
                )}
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative mb-8">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-transparent border-t-purple-400 border-r-indigo-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-3 border-transparent border-b-purple-500 border-l-indigo-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                    <div className="absolute inset-6 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-600/20 rounded-full blur-xl animate-pulse scale-150"></div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-3">
                    Loading AI Agents
                  </h3>
                  <p className="text-gray-400 animate-pulse text-lg">
                    Discovering amazing agents for you...
                  </p>
                  
                  <div className="flex justify-center gap-2 mt-4">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAgents.map(agent => {
                  const IconComponent = agent.icon;
                  return (
                    <div
                      key={agent.id}
                      onClick={() => handleAgentClick(agent)}
                      className="group relative bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-black/40 backdrop-blur-xl border border-purple-800/30 rounded-3xl p-6 hover:bg-gradient-to-br hover:from-gray-900/60 hover:via-gray-900/50 hover:to-black/60 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent rounded-3xl"></div>
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {agent.trending && (
                          <span className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm text-purple-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 border border-purple-500/40">
                            <TrendingUp size={12} />
                            Trending
                          </span>
                        )}
                        {agent.owned && (
                          <span className="bg-gradient-to-r from-purple-600/20 to-pink-500/20 backdrop-blur-sm text-purple-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 border border-purple-600/40">
                            <Heart size={12} />
                            Owned
                          </span>
                        )}
                        {agent.createdByUser && (
                          <span className="bg-gradient-to-r from-yellow-500/20 to-purple-500/20 backdrop-blur-sm text-yellow-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 border border-yellow-500/40">
                            <Crown size={12} />
                            Your Creation
                          </span>
                        )}
                        {agent.isFree && (
                          <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm text-green-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 border border-green-500/40">
                            <Zap size={12} />
                            Free
                          </span>
                        )}
                      </div>
                      
                      <div className="relative z-10 pt-4">
                        <div className={`w-16 h-16 ${agent.color} rounded-2xl flex items-center justify-center shadow-xl mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <IconComponent size={32} className="text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors leading-tight">
                          {agent.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-5 leading-relaxed min-h-[3rem]">
                          {agent.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-5 text-sm">
                          <div className="flex items-center gap-1 bg-yellow-500/15 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-yellow-500/20">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span className="font-bold text-yellow-300">{typeof agent.rating === 'number' ? agent.rating.toFixed(1) : agent.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Users size={14} />
                            <span className="font-medium">{agent.users}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Download size={14} />
                            <span className="font-medium">{agent.downloads}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-5">
                          {agent.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="bg-purple-800/40 backdrop-blur-sm text-purple-200 text-xs px-3 py-1.5 rounded-xl border border-purple-600/40 font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-purple-800/40">
                          <div>
                            <div className={`text-xl font-bold ${agent.isFree ? 'text-green-400' : 'bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent'}`}>
                              {agent.price}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                              <span>by {agent.creator}</span>
                              {!agent.isStatic && (
                                <div className="relative group flex items-center">
                                  <span className="cursor-help text-gray-500 font-mono">ⓘ</span>
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-gray-800 border border-purple-700/50 rounded-lg text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    Agent ID: {agent.agentId}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAgentClick(agent);
                            }}
                            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                              agent.owned || agent.createdByUser || agent.isFree
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white hover:shadow-xl hover:shadow-green-500/30'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white hover:shadow-xl hover:shadow-purple-500/30'
                            }`}
                          >
                            {agent.owned || agent.createdByUser || agent.isFree ? (
                              <>
                                <Zap size={16} />
                                Launch
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={16} />
                                Buy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && filteredAgents.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-black/40 backdrop-blur-xl border border-purple-800/30 rounded-3xl p-12 mx-auto max-w-lg">
                  <div className="text-purple-500 mb-6">
                    <Search size={64} className="mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No agents found</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {selectedFilter === 'all' 
                      ? "No new agents available for purchase. Check back later for more options!"
                      : "Try adjusting your search terms or selecting a different filter to find the perfect AI agent for your needs."
                    }
                  </p>
                </div>
              </div>
            )}

            {!loading && (
              <div className="mt-12 text-center">
                <p className="text-gray-500 text-sm">
                  {selectedFilter === 'all' && `${filteredAgents.length} agents available for purchase`}
                  {selectedFilter === 'owned' && `${ownedAgents.length} owned agents`}
                  {selectedFilter === 'created' && `${createdAgents.length} created agents`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
