"use client";

import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Send, 
  Download, 
  Plus, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown,
  ExternalLink,
  QrCode,
  Settings,
  Filter,
  Search,
  ChevronDown,
  Wallet,
  Shield,
  Bell,
  Moon,
  Sun,
  Check
} from 'lucide-react';

// Type definitions
interface WalletData {
  address: string;
  shortAddress: string;
  ensName: string;
  balance: {
    zlag: number;
    usd: number;
  };
  available: number;
  locked: number;
}

interface Transaction {
  id: number;
  type: 'receive' | 'send' | 'stake';
  amount: string;
  date: string;
  hash: string;
  status: 'completed' | 'pending';
}

interface NFT {
  id: number;
  name: string;
  collection: string;
  price: string;
  image: string;
}

interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface NFTCardProps {
  nft: NFT;
}

interface TransactionRowProps {
  tx: Transaction;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  twinkleDelay: number;
}

type ActiveTab = 'overview' | 'transactions' | 'nfts' | 'deposit' | 'withdraw' | 'settings';

const WalletPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [balanceVisible, setBalanceVisible] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [stars, setStars] = useState<Star[]>([]);

  // Generate stars on component mount
  useEffect(() => {
    const generateStars = () => {
      const starArray: Star[] = [];
      for (let i = 0; i < 150; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          twinkleDelay: Math.random() * 5
        });
      }
      setStars(starArray);
    };

    generateStars();
  }, []);

  // Mock data
  const walletData: WalletData = {
    address: '0x742d35Cc6Bb1d4f5F6a79Ad8d6a5484d8f6e',
    shortAddress: '0x742d35...8f6e',
    ensName: 'zerolag.eth',
    balance: {
      zlag: 15420.67,
      usd: 89340.22
    },
    available: 12850.34,
    locked: 2570.33
  };

  const transactions: Transaction[] = [
    { id: 1, type: 'receive', amount: '+2,500 ZLAG', date: '2 hours ago', hash: '0xabc...123', status: 'completed' },
    { id: 2, type: 'send', amount: '-850 ZLAG', date: '5 hours ago', hash: '0xdef...456', status: 'completed' },
    { id: 3, type: 'stake', amount: '5,000 ZLAG', date: '1 day ago', hash: '0xghi...789', status: 'pending' },
    { id: 4, type: 'receive', amount: '+1,200 ZLAG', date: '2 days ago', hash: '0xjkl...101', status: 'completed' },
    { id: 5, type: 'send', amount: '-300 ZLAG', date: '3 days ago', hash: '0xmno...112', status: 'completed' },
  ];

  const nfts: NFT[] = [
    { id: 1, name: 'AI Agent #001', collection: 'ZeroLag Agents', price: '2.5 ETH', image: '🤖' },
    { id: 2, name: 'Neural Network', collection: 'Digital Minds', price: '1.8 ETH', image: '🧠' },
    { id: 3, name: 'Quantum Bot', collection: 'Future Bots', price: '3.2 ETH', image: '⚡' },
    { id: 4, name: 'Data Synth', collection: 'ZeroLag Agents', price: '1.9 ETH', image: '🔮' },
    { id: 5, name: 'Logic Gate', collection: 'Digital Minds', price: '2.1 ETH', image: '🎯' },
    { id: 6, name: 'Cyber Core', collection: 'Future Bots', price: '2.8 ETH', image: '⚙️' },
  ];

  const handleCopy = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const TabButton: React.FC<TabButtonProps> = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 whitespace-nowrap ${
        isActive 
          ? 'text-purple-400 border-purple-400 bg-purple-500/10' 
          : 'text-gray-400 border-transparent hover:text-purple-300 hover:border-purple-300/50'
      }`}
    >
      {label}
    </button>
  );

  const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, trend, icon: Icon }) => (
    <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <Icon className="w-5 h-5 text-purple-400" />
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtitle && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">{subtitle}</span>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="text-xs">{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const NFTCard: React.FC<NFTCardProps> = ({ nft }) => (
    <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all duration-300 group cursor-pointer backdrop-blur-sm">
      <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-4xl">
        {nft.image}
      </div>
      <div className="p-4">
        <h4 className="text-white font-semibold mb-1 truncate">{nft.name}</h4>
        <p className="text-gray-400 text-sm mb-2 truncate">{nft.collection}</p>
        <p className="text-purple-400 font-medium">{nft.price}</p>
      </div>
    </div>
  );

  const TransactionRow: React.FC<TransactionRowProps> = ({ tx }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-800/60 last:border-0 hover:bg-gray-800/20 transition-colors px-4 rounded-lg">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          tx.type === 'receive' ? 'bg-green-500/20 text-green-400' :
          tx.type === 'send' ? 'bg-red-500/20 text-red-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {tx.type === 'receive' ? <Download className="w-5 h-5" /> :
           tx.type === 'send' ? <Send className="w-5 h-5" /> :
           <TrendingUp className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-white font-medium capitalize">{tx.type}</p>
          <p className="text-gray-400 text-sm">{tx.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${tx.type === 'receive' ? 'text-green-400' : 'text-white'}`}>
          {tx.amount}
        </p>
        <div className="flex items-center gap-2 justify-end">
          <span className={`text-xs px-2 py-1 rounded-full ${
            tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {tx.status}
          </span>
          <button className="text-gray-400 hover:text-purple-400 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId as ActiveTab);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Starry Background */}
      <div className="fixed inset-0 z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full opacity-80"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle 3s ease-in-out infinite`,
              animationDelay: `${star.twinkleDelay}s`
            }}
          />
        ))}
      </div>

      {/* CSS for twinkling animation */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header with Profile */}
        <div className="relative">
          {/* Background Banner */}
          <div className="h-48 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 relative overflow-hidden">
          </div>
          
          {/* Profile Card Overlay */}
          <div className="absolute -bottom-16 left-4 right-4 md:left-8 md:right-8">
            <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-800/60 rounded-2xl p-4 md:p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg flex-shrink-0">
                  ZL
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-xl md:text-2xl font-bold">{walletData.ensName}</h1>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                      Verified
                    </span>
                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/30">
                      Creator
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-400 font-mono text-sm">{walletData.shortAddress}</span>
                    <button 
                      onClick={() => handleCopy(walletData.address)}
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl md:text-3xl font-bold">
                        {balanceVisible ? `${walletData.balance.zlag.toLocaleString()} ZLAG` : '••••••'}
                      </span>
                      <button 
                        onClick={() => setBalanceVisible(!balanceVisible)}
                        className="text-gray-400 hover:text-purple-400 transition-colors"
                      >
                        {balanceVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="text-gray-400">
                      ≈ ${walletData.balance.usd.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-3 w-full lg:w-auto">
                  <button className="flex-1 lg:flex-none bg-purple-600 hover:bg-purple-700 px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                  <button className="flex-1 lg:flex-none bg-gray-800 hover:bg-gray-700 px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5" />
                    <span className="hidden sm:inline">Receive</span>
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 px-3 py-3 rounded-xl transition-all duration-300">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-20 md:mt-24 px-4 md:px-8">
          <div className="flex border-b border-gray-800/60 overflow-x-auto scrollbar-hide">
            <TabButton id="overview" label="Overview" isActive={activeTab === 'overview'} onClick={handleTabChange} />
            <TabButton id="transactions" label="Transactions" isActive={activeTab === 'transactions'} onClick={handleTabChange} />
            <TabButton id="deposit" label="Deposit" isActive={activeTab === 'deposit'} onClick={handleTabChange} />
            <TabButton id="withdraw" label="Withdraw" isActive={activeTab === 'withdraw'} onClick={handleTabChange} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 md:px-8 py-6 md:py-8">
          {activeTab === 'overview' && (
            <div className="space-y-6 md:space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <StatCard 
                  title="Available Balance" 
                  value={`${walletData.available.toLocaleString()} ZLAG`}
                  subtitle="Ready to use"
                  icon={Wallet}
                />
                <StatCard 
                  title="Locked Balance" 
                  value={`${walletData.locked.toLocaleString()} ZLAG`}
                  subtitle="In staking & orders"
                  icon={Shield}
                />
                <StatCard 
                  title="24h Change" 
                  value="+5.67%"
                  subtitle="Portfolio performance"
                  trend={5.67}
                  icon={TrendingUp}
                />
              </div>

              {/* Recent Activity & NFTs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Recent Transactions */}
                <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg md:text-xl font-semibold">Recent Activity</h3>
                    <button 
                      onClick={() => setActiveTab('transactions')}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {transactions.slice(0, 3).map(tx => (
                      <TransactionRow key={tx.id} tx={tx} />
                    ))}
                  </div>
                </div>

                {/* NFT Preview */}
                <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg md:text-xl font-semibold">NFT Collection (coming soon)</h3>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Total: 12</span>
                      <span>Collections: 3</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {nfts.slice(0, 2).map(nft => (
                      <NFTCard key={nft.id} nft={nft} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-4 md:p-6 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Transaction History</h2>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <button className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                    Export
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {transactions.map(tx => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'deposit' && (
            <div className="max-w-md mx-auto">
              <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Deposit Assets</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Select Token</label>
                    <button className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 flex items-center justify-between hover:border-purple-500 transition-colors">
                      <span className="text-white">ZLAG</span>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-xl inline-block mb-4">
                      <div className="w-32 h-32 bg-black rounded-lg flex items-center justify-center">
                        <QrCode className="w-16 h-16" />
                      </div>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-gray-300 break-all">{walletData.shortAddress}</span>
                        <button 
                          onClick={() => handleCopy(walletData.address)}
                          className="text-purple-400 hover:text-purple-300 ml-2"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ Only send ZLAG tokens to this address. Sending other tokens may result in permanent loss.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="max-w-md mx-auto">
              <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Withdraw Assets</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Address</label>
                    <input 
                      type="text" 
                      placeholder="Enter wallet address..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="0.00"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-20 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">ZLAG</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-sm transition-colors">25%</button>
                      <button className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-sm transition-colors">50%</button>
                      <button className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-sm transition-colors">75%</button>
                      <button className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-sm transition-colors">MAX</button>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network Fee</span>
                      <span className="text-white">0.001 ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">You'll receive</span>
                      <span className="text-white">0 ZLAG</span>
                    </div>
                  </div>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-medium transition-colors">
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage