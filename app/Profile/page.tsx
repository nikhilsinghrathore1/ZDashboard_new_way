"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Wallet,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  TrendingUp,
  Zap,
  Activity,
  User,
  Settings,
  Award,
  Globe,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';
import img from "../../public/niko.webp"

// Import your contract info
import ERC20ABI from '../contracts/erc20_abi.json';
import { yourTokenAddress } from '../contracts/addresses';
import Image from "next/image";

const ProfilePage = () => {
  const [showPrivateData, setShowPrivateData] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // User state management
  const [userProfile, setUserProfile] = useState(null);
  const [ownedAgents, setOwnedAgents] = useState([]);
  const [createdAgents, setCreatedAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userState, setUserState] = useState({
    isCheckingUser: false,
    isCreatingUser: false,
    userExists: false,
    userChecked: false,
  });

  // Wagmi hooks for wallet connection
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // ZLAG token balance
  const { data: zlagBalance, isLoading: zlagBalanceLoading, refetch: refetchZlagBalance } = useReadContract({
    address: yourTokenAddress,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    // @ts-ignore
    enabled: !!address,
  });
  
  // ZLAG token decimals
  const { data: zlagDecimals } = useReadContract({
    address: yourTokenAddress,
    abi: ERC20ABI,
    functionName: 'decimals',
    // @ts-ignore
    enabled: !!address,
  });
  
  // ZLAG token symbol
  const { data: zlagSymbol } = useReadContract({
    address: yourTokenAddress,
    abi: ERC20ABI,
    functionName: 'symbol',
    // @ts-ignore
    enabled: !!address,
  });
  
  // ZLAG total supply
  const { data: totalSupply } = useReadContract({
    address: yourTokenAddress,
    abi: ERC20ABI,
    functionName: 'totalSupply',
    // @ts-ignore
    enabled: !!address,
  });

  // Helper function to format units
  const formatUnits = (value, decimals) => {
    if (!value || !decimals) return "0";
    const divisor = BigInt(10 ** decimals);
    const quotient = value / divisor;
    const remainder = value % divisor;
    const decimalPart = remainder.toString().padStart(decimals, "0");
    return `${quotient}.${decimalPart}`.replace(/\.?0+$/, "") || "0";
  };

  // Formatted calculations
  const formattedZlagBalance = useMemo(() => {
    if (zlagBalance && zlagDecimals) {
      return formatUnits(zlagBalance, zlagDecimals);
    }
    return "0";
  }, [zlagBalance, zlagDecimals]);

  const formattedTotalSupply = useMemo(() => {
    if (totalSupply && zlagDecimals) {
      return formatUnits(totalSupply, zlagDecimals);
    }
    return "0";
  }, [totalSupply, zlagDecimals]);

  const ownershipPercentage = useMemo(() => {
    if (formattedZlagBalance !== "0" && formattedTotalSupply !== "0") {
      return (
        (parseFloat(formattedZlagBalance) / parseFloat(formattedTotalSupply)) *
        100
      ).toFixed(6);
    }
    return "0";
  }, [formattedZlagBalance, formattedTotalSupply]);

  // Data fetching effect - similar to MarketplacePage pattern
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isConnected || !address) {
        setUserProfile(null);
        setOwnedAgents([]);
        setCreatedAgents([]);
        setUserState({
          isCheckingUser: false,
          isCreatingUser: false,
          userExists: false,
          userChecked: false,
        });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setUserState(prev => ({ ...prev, isCheckingUser: true }));

        // Parallel fetch of user data
        const [userResponse, ownedResponse, createdResponse] = await Promise.all([
          fetch(`https://zlag-ownable-service.vercel.app/api/users/${address}`),
          fetch(`https://zlag-ownable-service.vercel.app/api/users/${address}/owned-agents`),
          fetch(`https://zlag-ownable-service.vercel.app/api/users/${address}/created-agents`)
        ]);

        // Handle user profile
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success && userData.user) {
            setUserProfile(userData.user);
            setUserState({
              isCheckingUser: false,
              isCreatingUser: false,
              userExists: true,
              userChecked: true,
            });
          } else {
            // User doesn't exist, create new user
            await createNewUser();
          }
        } else if (userResponse.status === 404) {
          // User doesn't exist, create new user
          await createNewUser();
        } else {
          throw new Error('Failed to fetch user profile');
        }

        // Handle owned agents
        if (ownedResponse.ok) {
          const ownedData = await ownedResponse.json();
          setOwnedAgents(ownedData.success ? ownedData.agents : []);
        } else {
          setOwnedAgents([]);
        }

        // Handle created agents
        if (createdResponse.ok) {
          const createdData = await createdResponse.json();
          setCreatedAgents(createdData.success ? createdData.agents : []);
        } else {
          setCreatedAgents([]);
        }

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
        setUserState(prev => ({ ...prev, isCheckingUser: false }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [address, isConnected]);

  // Create new user function
  const createNewUser = async () => {
    if (!address) return;

    try {
      setUserState(prev => ({ ...prev, isCheckingUser: false, isCreatingUser: true }));

      const response = await fetch('https://zlag-ownable-service.vercel.app/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          username: `User_${address.slice(2, 8)}`,
        })
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.success) {
          setUserProfile(userData.user);
          setUserState({
            isCheckingUser: false,
            isCreatingUser: false,
            userExists: true,
            userChecked: true,
          });
        } else {
          throw new Error('Failed to create user');
        }
      } else {
        throw new Error('Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setUserState({
        isCheckingUser: false,
        isCreatingUser: false,
        userExists: false,
        userChecked: true,
      });
    }
  };

  // Helper functions
  const copyAddress = useCallback(async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  }, [address]);

  const handleConnect = useCallback(() => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  }, [connect, connectors]);

  const handleRefresh = useCallback(async () => {
    if (refetchZlagBalance) refetchZlagBalance();
    // Re-fetch user data
    if (address && isConnected) {
      setLoading(true);
      // Trigger the useEffect by updating a state
      setTimeout(() => setLoading(false), 1000);
    }
  }, [refetchZlagBalance, address, isConnected]);

  const formatAddress = useCallback(
    (addr) => {
      if (!addr) return "";
      return showPrivateData ? addr : `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    },
    [showPrivateData]
  );

  const getAddressInitials = useMemo(() => {
    if (!address) return "UN";
    return address.slice(2, 4).toUpperCase();
  }, [address]);

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-purple-400 text-lg">Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-2xl mb-8">
            <Wallet className="h-20 w-20 text-white mx-auto mb-4" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to Your Profile
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Connect your wallet to access your personalized dashboard with
            real-time portfolio data and blockchain insights.
          </p>
          <button
            onClick={handleConnect}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-10 py-4 rounded-xl transition-all font-semibold flex items-center gap-3 mx-auto text-lg shadow-lg hover:shadow-purple-500/25"
          >
            <Wallet className="h-6 w-6" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  // Main loading state when connected
  if (loading && isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-transparent border-t-purple-400 border-r-indigo-400 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-3 border-transparent border-b-purple-500 border-l-indigo-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-3">
            Loading Profile
          </h3>
          <p className="text-gray-400 animate-pulse text-lg">
            {userState.isCreatingUser ? "Setting up your profile..." : "Loading your data..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
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

      {/* Hero Section with Profile Header */}
      <div className="relative bg-gradient-to-br from-purple-900/20 to-black border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 rounded-2xl p-4 mb-6">
              <p className="text-red-300 text-center">{error}</p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Profile Info */}
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {getAddressInitials}
                  </span>
                </div>
                <div
                  className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 border-black flex items-center justify-center ${
                    userState.userExists && userState.userChecked
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {userState.userExists && userState.userChecked ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>

              {/* User Details */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">
                    {userProfile?.username || 'My Wallet'}
                  </h1>
                  <button
                    onClick={() => setShowPrivateData(!showPrivateData)}
                    className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                    title={showPrivateData ? "Hide details" : "Show details"}
                  >
                    {showPrivateData ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg border border-gray-700">
                    <code className="text-purple-300 font-mono text-sm">
                      {formatAddress(address || "")}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>

                  {chain && (
                    <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/30">
                      <Globe className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-300 text-sm font-medium">
                        {chain.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        userState.userExists && userState.userChecked
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <span className="text-gray-300">
                      {userState.isCheckingUser
                        ? "Verifying..."
                        : userState.isCreatingUser
                        ? "Setting up..."
                        : userState.userExists
                        ? "Verified Account"
                        : "Pending Verification"}
                    </span>
                  </div>
                </div>

                {copiedAddress && (
                  <p className="text-xs text-green-400 mt-2">
                    ✓ Address copied to clipboard!
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl transition-all border border-gray-700"
                title="Refresh data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://etherscan.io/address/${address}`,
                    "_blank"
                  )
                }
                className="p-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 rounded-xl transition-all border border-purple-500/30"
                title="View on Etherscan"
              >
                <ExternalLink className="h-5 w-5" />
              </button>
              <button
                onClick={() => disconnect()}
                className="px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 rounded-xl transition-all border border-red-500/30 text-sm font-medium"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl  mx-auto px-6 py-8">
        {/* ZLAG Token Balance - Single Card */}
        <div className="mb-8 w-full">
  <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-2xl p-8 relative overflow-hidden w-full mx-auto cursor-pointer transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-purple-500/25 hover:border-purple-400/50 hover:scale-[1.02] group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:bg-purple-500/20 transition-all duration-500"></div>
    
    {/* Additional glow effect on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-purple-500/0 to-purple-600/0 group-hover:from-purple-400/5 group-hover:via-purple-500/10 group-hover:to-purple-600/5 rounded-2xl transition-all duration-500"></div>
    
    <div className="relative z-10 text-center">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-32 h-32 overflow-hidden bg-white rounded-full group-hover:shadow-xl group-hover:shadow-purple-500/30 transition-all duration-500 group-hover:scale-105">
          <Image className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={img} alt="not showing" />
        </div>
        <h3 className="text-2xl font-semibold text-white group-hover:text-purple-100 transition-colors duration-300">ZLAG Balance</h3>
        {zlagBalanceLoading && (
          <div className="animate-spin h-5 w-5 border-2 border-purple-400 border-t-transparent rounded-full"></div>
        )}
      </div>
      <div className="text-4xl font-bold text-white mb-4 group-hover:text-purple-100 transition-colors duration-300 group-hover:scale-105 transform">
        {parseFloat(formattedZlagBalance).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        })}
      </div>
      <div className="text-lg text-purple-300 mb-2 group-hover:text-purple-200 transition-colors duration-300">
         ZLAG Tokens
      </div>
      {ownershipPercentage !== "0" && (
        <div className="text-sm text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
          {ownershipPercentage}% of total supply
        </div>
      )}
    </div>
    
    {/* Animated border pulse effect */}
    <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/0 group-hover:border-purple-400/30 transition-all duration-500"></div>
    
    {/* Corner accent glow */}
    <div className="absolute -top-1 -right-1 w-8 h-8 bg-purple-500/0 group-hover:bg-purple-400/20 rounded-full blur-sm transition-all duration-500"></div>
    <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-purple-500/0 group-hover:bg-purple-400/15 rounded-full blur-sm transition-all duration-700"></div>
  </div>
</div>


        {/* Tabs Navigation */}
        <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-xl mb-8 border border-gray-700">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "agents", label: `Agents (${ownedAgents.length + createdAgents.length})`, icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Token Details */}
            <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-400" />
                Token Information
              </h3>

              <div className="space-y-4">
                <div className="bg-black/50 p-4 rounded-xl border border-gray-700">
                  <div className="text-xs text-gray-400 mb-2">Contract Address</div>
                  <code className="text-sm text-purple-300 font-mono break-all">
                    {yourTokenAddress}
                  </code>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/50 p-4 rounded-xl border border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">Decimals</div>
                    <div className="text-lg font-semibold text-white">
                      {zlagDecimals?.toString() || "18"}
                    </div>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">Symbol</div>
                    <div className="text-lg font-semibold text-white">
                      {/* @ts-ignore */}
                      {zlagSymbol || "ZLAG"}
                    </div>
                  </div>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-gray-700">
                  <div className="text-xs text-gray-400 mb-2">Total Supply</div>
                  <div className="text-2xl font-bold text-white">
                    {parseFloat(formattedTotalSupply).toLocaleString()}
                  </div>
                </div>
                {parseFloat(ownershipPercentage) > 0 && (
                  <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl">
                    <div className="text-xs text-purple-300 mb-2">Your Ownership</div>
                    <div className="text-xl font-bold text-purple-400">
                      {ownershipPercentage}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                Account Statistics
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl">
                  <span className="text-gray-400">Account Status</span>
                  <span
                    className={`font-medium ${
                      userState.userExists
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {userState.userExists ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl">
                  <span className="text-gray-400">Network</span>
                  <span className="text-purple-300 font-medium">
                    {chain?.name || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl">
                  <span className="text-gray-400">Owned Agents</span>
                  <span className="text-white font-medium">{ownedAgents.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl">
                  <span className="text-gray-400">Created Agents</span>
                  <span className="text-white font-medium">{createdAgents.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl">
                  <span className="text-gray-400">ZLAG Holdings</span>
                  <span className="text-emerald-300 font-medium">
                    {parseFloat(formattedZlagBalance).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "agents" && (
          <div className="space-y-8">
            {/* Owned Agents */}
            {ownedAgents.length > 0 && (
              <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-400" />
                  Owned Agents ({ownedAgents.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ownedAgents.map((agent) => (
                    <div key={agent.id} className="bg-black/30 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{agent.name}</h4>
                          <p className="text-xs text-gray-400">Owned Agent</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{agent.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-purple-300">{agent.price || 'Free'}</span>
                        <button 
                          onClick={() => window.location.href = `/agent/${agent.id}`}
                          className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded-lg transition-all"
                        >
                          Launch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Created Agents */}
            {createdAgents.length > 0 && (
              <div className="bg-gray-900/50 border border-emerald-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-400" />
                  Created Agents ({createdAgents.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {createdAgents.map((agent) => (
                    <div key={agent.id} className="bg-black/30 border border-gray-700 rounded-xl p-4 hover:border-emerald-500/50 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <Settings className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{agent.name}</h4>
                          <p className="text-xs text-gray-400">Your Creation</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{agent.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-emerald-300">{agent.price || 'Free'}</span>
                        <button 
                          onClick={() => window.location.href = `/agent/${agent.id}`}
                          className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg transition-all"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ownedAgents.length === 0 && createdAgents.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-black/40 backdrop-blur-xl border border-purple-800/30 rounded-3xl p-12 mx-auto max-w-lg">
                  <div className="text-purple-500 mb-6">
                    <User size={64} className="mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Agents Yet</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    You haven't owned or created any agents yet. Visit the marketplace to get started!
                  </p>
                  <button
                    onClick={() => window.location.href = '/marketplace'}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-purple-400 hover:to-indigo-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
                  >
                    Explore Marketplace
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Network Information Footer */}
        <div className="mt-8 bg-gradient-to-r from-gray-900/30 to-gray-800/30 border border-gray-700 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Network Information
              </h4>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400">Status: </span>
                  <span className="text-green-400">Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Chain ID: </span>
                  <span className="text-white">{chain?.id || 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Network: </span>
                  <span className="text-purple-300">
                    {chain?.name || "Ethereum"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
