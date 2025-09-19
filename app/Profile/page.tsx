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
  Clock,
  Shield,
  Zap,
  Activity,
  User,
  Settings,
  Award,
  BarChart3,
  Coins,
  Globe,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
} from "lucide-react";

// Mock data for demonstration since wagmi hooks aren't available
const mockData = {
  address: "0x742d35Cc6635C0532925a3b8D57C7A2C9AF572B9",
  isConnected: true,
  isConnecting: false,
  chain: { name: "Ethereum", id: 1 },
  nativeBalance: { formatted: "2.456789", symbol: "ETH" },
  zlagBalance: "1250000",
  zlagDecimals: 18,
  zlagSymbol: "ZLAG",
  totalSupply: "10000000000000000000000000", // 10M tokens
};

const ProfilePage = () => {
  const [showPrivateData, setShowPrivateData] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userState, setUserState] = useState({
    isCheckingUser: false,
    isCreatingUser: false,
    userExists: true,
    userChecked: true,
  });

  // Mock wallet connection state
  const address = mockData.address;
  const isConnected = mockData.isConnected;
  const isConnecting = mockData.isConnecting;
  const chain = mockData.chain;
  const balanceData = mockData.nativeBalance;
  const balanceLoading = false;

  // Mock contract data
  const zlagBalanceData = BigInt(mockData.zlagBalance + "000000000000000000"); // Add 18 decimals
  const zlagBalanceLoading = false;
  const zlagDecimals = mockData.zlagDecimals;
  const zlagSymbol = mockData.zlagSymbol;
  const totalSupply = BigInt(mockData.totalSupply);

  // Mock activity data
  const activityData = [
    {
      id: 1,
      type: "received",
      token: "ZLAG",
      amount: "1,250",
      from: "0x1234...5678",
      timestamp: "2 hours ago",
      txHash: "0xabc123...def456",
    },
    {
      id: 2,
      type: "sent",
      token: "ETH",
      amount: "0.125",
      to: "0x9876...4321",
      timestamp: "1 day ago",
      txHash: "0xdef456...abc123",
    },
    {
      id: 3,
      type: "received",
      token: "ETH",
      amount: "2.5",
      from: "0x5555...7777",
      timestamp: "3 days ago",
      txHash: "0x789abc...456def",
    },
  ];

  // Helper function to format units
  const formatUnits = (value, decimals) => {
    const divisor = BigInt(10 ** decimals);
    const quotient = value / divisor;
    const remainder = value % divisor;
    const decimalPart = remainder.toString().padStart(decimals, "0");
    return `${quotient}.${decimalPart}`.replace(/\.?0+$/, "") || "0";
  };

  // Formatted calculations
  const formattedZlagBalance = useMemo(() => {
    if (
      typeof zlagBalanceData === "bigint" &&
      typeof zlagDecimals === "number"
    ) {
      return formatUnits(zlagBalanceData, zlagDecimals);
    }
    return "0";
  }, [zlagBalanceData, zlagDecimals]);

  const formattedTotalSupply = useMemo(() => {
    if (typeof totalSupply === "bigint" && typeof zlagDecimals === "number") {
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

  const totalPortfolioValue = useMemo(() => {
    const nativeBalance = balanceData ? parseFloat(balanceData.formatted) : 0;
    const zlagBalance = parseFloat(formattedZlagBalance);
    // Mock price calculation - in real app, you'd fetch token prices
    return nativeBalance * 1800 + zlagBalance * 0.1; // Mock prices: ETH=$1800, ZLAG=$0.1
  }, [balanceData, formattedZlagBalance]);

  // Helper functions
  const copyAddress = useCallback(async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  }, [address]);

  const handleConnect = useCallback(() => {
    // Mock connect function
    console.log("Connect wallet");
  }, []);

  const handleRefresh = useCallback(async () => {
    // Mock refresh function
    console.log("Refreshing data...");
  }, []);

  const handleDisconnect = useCallback(() => {
    // Mock disconnect function
    console.log("Disconnect wallet");
  }, []);

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
  if (isConnecting) {
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

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Profile Header */}
      <div className="relative bg-gradient-to-br from-purple-900/20 to-black border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
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
                  <h1 className="text-3xl font-bold text-white">My Wallet</h1>
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
                onClick={handleDisconnect}
                className="px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 rounded-xl transition-all border border-red-500/30 text-sm font-medium"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Portfolio Value */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Portfolio Value
                </h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                $
                {totalPortfolioValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-sm text-purple-300">Estimated USD Value</div>
            </div>
          </div>

          {/* Native Token Balance */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Coins className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Native Balance
                </h3>
                {balanceLoading && (
                  <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                )}
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {balanceData
                  ? parseFloat(balanceData.formatted).toFixed(6)
                  : "0.000000"}
              </div>
              <div className="text-sm text-blue-300">
                {balanceData?.symbol || "ETH"}
              </div>
            </div>
          </div>

          {/* ZLAG Token Balance */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Zap className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">ZLAG Token</h3>
                {zlagBalanceLoading && (
                  <div className="animate-spin h-4 w-4 border-2 border-emerald-400 border-t-transparent rounded-full"></div>
                )}
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {parseFloat(formattedZlagBalance).toFixed(6)}
              </div>
              <div className="text-sm text-emerald-300">
                {ownershipPercentage !== "0"
                  ? `${ownershipPercentage}% ownership`
                  : "ZLAG"}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-xl mb-8 border border-gray-700">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "tokens", label: "Tokens", icon: Coins },
            { id: "activity", label: "Activity", icon: Clock },
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
            {/* Balance Details */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" />
                  Balance Breakdown
                </h3>

                <div className="space-y-4">
                  {/* Native Token */}
                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Coins className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {balanceData?.symbol || "ETH"}
                        </div>
                        <div className="text-sm text-gray-400">
                          Native Token
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">
                        {balanceData
                          ? parseFloat(balanceData.formatted).toFixed(6)
                          : "0.000000"}
                      </div>
                      <div className="text-sm text-gray-400">
                        $
                        {balanceData
                          ? (parseFloat(balanceData.formatted) * 1800).toFixed(
                              2
                            )
                          : "0.00"}
                      </div>
                    </div>
                  </div>

                  {/* ZLAG Token */}
                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {zlagSymbol || "ZLAG"}
                        </div>
                        <div className="text-sm text-gray-400">
                          ERC-20 Token
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">
                        {parseFloat(formattedZlagBalance).toFixed(6)}
                      </div>
                      <div className="text-sm text-gray-400">
                        ${(parseFloat(formattedZlagBalance) * 0.1).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
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
                  <span className="text-gray-400">Token Holdings</span>
                  <span className="text-white font-medium">2 Tokens</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl">
                  <span className="text-gray-400">ZLAG Ownership</span>
                  <span className="text-purple-300 font-medium">
                    {ownershipPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tokens" && (
          <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Coins className="h-5 w-5 text-purple-400" />
              Token Details
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Contract Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">
                  ZLAG Contract Information
                </h4>
                <div className="space-y-3">
                  <div className="bg-black/50 p-4 rounded-xl border border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">
                      Contract Address
                    </div>
                    <code className="text-sm text-purple-300 font-mono break-all">
                      0xea4808283eFC9140BBea9E5465AEAF102DDA1b85
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
                        {zlagSymbol || "ZLAG"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supply Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Supply Information</h4>
                <div className="space-y-3">
                  <div className="bg-black/50 p-4 rounded-xl border border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">
                      Total Supply
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {parseFloat(formattedTotalSupply).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">
                      Your Holdings
                    </div>
                    <div className="text-2xl font-bold text-purple-400">
                      {parseFloat(formattedZlagBalance).toLocaleString()}
                    </div>
                  </div>
                  {parseFloat(ownershipPercentage) > 0 && (
                    <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl">
                      <div className="text-xs text-purple-300 mb-2">
                        Ownership Percentage
                      </div>
                      <div className="text-xl font-bold text-purple-400">
                        {ownershipPercentage}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" />
              Recent Activity
            </h3>

            {activityData.length > 0 ? (
              <div className="space-y-4">
                {activityData.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          activity.type === "received"
                            ? "bg-green-500/20"
                            : "bg-red-500/20"
                        }`}
                      >
                        {activity.type === "received" ? (
                          <ArrowDownLeft
                            className={`h-5 w-5 ${
                              activity.type === "received"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          />
                        ) : (
                          <ArrowUpRight
                            className={`h-5 w-5 ${
                              activity.type === "received"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">
                            {activity.type === "received" ? "Received" : "Sent"}{" "}
                            {activity.amount} {activity.token}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {activity.type === "received" ? "From" : "To"}:{" "}
                          {activity.type === "received"
                            ? activity.from
                            : activity.to}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">
                        {activity.timestamp}
                      </div>
                      <button
                        onClick={() =>
                          window.open(
                            `https://etherscan.io/tx/${activity.txHash}`,
                            "_blank"
                          )
                        }
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                      >
                        View Tx
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="text-center pt-4">
                  <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
                    View All Transactions
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Activity className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-400 mb-2">
                  No Recent Activity
                </h4>
                <p className="text-gray-500 mb-6">
                  Your transaction history will appear here once you start
                  interacting with the blockchain.
                </p>
                <button
                  onClick={handleRefresh}
                  className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-6 py-3 rounded-xl transition-all border border-purple-500/30 font-medium"
                >
                  <RefreshCw className="h-4 w-4 inline mr-2" />
                  Refresh Activity
                </button>
              </div>
            )}
          </div>
        )}

        {/* Additional Stats Section - Only show on overview tab */}
        {activeTab === "overview" && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Stats Cards */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-400">Security Score</span>
              </div>
              <div className="text-2xl font-bold text-white">95/100</div>
              <div className="text-xs text-green-400">Excellent</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-gray-400">Account Age</span>
              </div>
              <div className="text-2xl font-bold text-white">2.3</div>
              <div className="text-xs text-gray-400">Years</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-400">
                  Total Transactions
                </span>
              </div>
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-xs text-green-400">+12 this month</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-gray-400">Gas Spent</span>
              </div>
              <div className="text-2xl font-bold text-white">0.045</div>
              <div className="text-xs text-gray-400">ETH Total</div>
            </div>
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
              <button
                onClick={() => window.open("https://ethereum.org/", "_blank")}
                className="text-gray-400 hover:text-purple-400 transition-colors p-2"
                title="Learn more about Ethereum"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
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
