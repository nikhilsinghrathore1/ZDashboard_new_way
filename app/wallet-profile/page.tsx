"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Bot,
  DollarSign,
  Activity,
  Megaphone,
  Clock,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  Zap,
  Globe,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';

// Type definitions for dashboard data
interface CommunityStats {
  totalUsers: number;
  activeUsers: number;
  newUsers24h: number;
  userGrowthRate: number;
}

interface AgentStats {
  totalAgents: number;
  activeAgents: number;
  newAgents24h: number;
  agentGrowthRate: number;
  topPerformingAgent: string;
}

interface TradingStats {
  volume24h: number;
  volume7d: number;
  totalVolume: number;
  volumeChange: number;
  avgTradeSize: number;
  totalTrades: number;
}

interface Update {
  id: number;
  type: 'announcement' | 'feature' | 'maintenance' | 'agent';
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  link?: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon: React.ComponentType<any>;
  color?: string;
  isLoading?: boolean;
}

interface UpdateCardProps {
  update: Update;
}

// API service
const API_BASE_URL = 'https://zlag-ownable-service.vercel.app';

const apiService = {
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return { success: false, users: [], count: 0 };
    }
  },

  async getAgents() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents`);
      if (!response.ok) throw new Error('Failed to fetch agents');
      return await response.json();
    } catch (error) {
      console.error('Error fetching agents:', error);
      return { success: false, agents: [] };
    }
  }
};

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [apiError, setApiError] = useState<string | null>(null);

  // Real data from API
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsers24h: 0,
    userGrowthRate: 0
  });

  const [agentStats, setAgentStats] = useState<AgentStats>({
    totalAgents: 0,
    activeAgents: 0,
    newAgents24h: 0,
    agentGrowthRate: 0,
    topPerformingAgent: "Loading..."
  });

  // Mock trading stats (replace with real API when available)
  const [tradingStats] = useState<TradingStats>({
    volume24h: 2450000,
    volume7d: 18500000,
    totalVolume: 127000000,
    volumeChange: 12.4,
    avgTradeSize: 1850,
    totalTrades: 8934
  });

  const [updates] = useState<Update[]>([
    {
      id: 1,
      type: 'announcement',
      title: 'New AI Agent Framework Released',
      description: 'Enhanced trading algorithms with 40% better performance and reduced latency.',
      timestamp: '2 hours ago',
      priority: 'high',
      link: '/updates/agent-framework'
    },
    {
      id: 2,
      type: 'feature',
      title: 'Advanced Portfolio Analytics',
      description: 'New charts and insights for better trading decisions now available.',
      timestamp: '6 hours ago',
      priority: 'medium',
      link: '/features/analytics'
    },
    {
      id: 3,
      type: 'agent',
      title: 'Agent Marketplace Expansion',
      description: '50+ new verified trading agents added to the marketplace.',
      timestamp: '1 day ago',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'maintenance',
      title: 'Scheduled Maintenance Complete',
      description: 'Infrastructure upgrades completed. Improved speed and reliability.',
      timestamp: '2 days ago',
      priority: 'low'
    }
  ]);

  // Fetch data from API
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      // Fetch users and agents concurrently
      const [usersResponse, agentsResponse] = await Promise.all([
        apiService.getUsers(),
        apiService.getAgents()
      ]);

      // Update community stats with real user data
      if (usersResponse.success) {
        const totalUsers = usersResponse.count || 0;
        // Calculate some mock derived stats based on real user count
        const activeUsers = Math.floor(totalUsers * 0.65); // Assume 65% are active
        const newUsers24h = Math.floor(totalUsers * 0.05); // Assume 5% are new today
        const userGrowthRate = totalUsers > 0 ? 15.3 : 0; // Mock growth rate

        setCommunityStats({
          totalUsers,
          activeUsers,
          newUsers24h,
          userGrowthRate
        });
      }

      // Update agent stats with real agent data
      if (agentsResponse.success) {
        const totalAgents = agentsResponse.agents?.length || 0;
        // Calculate some mock derived stats based on real agent count
        const activeAgents = Math.floor(totalAgents * 0.8); // Assume 80% are active
        const newAgents24h = Math.floor(totalAgents * 0.02); // Assume 2% are new today
        const agentGrowthRate = totalAgents > 0 ? 8.7 : 0;
        
        // Find the most recent agent as "top performing" (mock logic)
        let topPerformingAgent = "No agents available";
        if (agentsResponse.agents && agentsResponse.agents.length > 0) {
          // Sort by creation date and get the most recent
          const sortedAgents = agentsResponse.agents.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          topPerformingAgent = sortedAgents[0]?.name || "Unknown Agent";
        }

        setAgentStats({
          totalAgents,
          activeAgents,
          newAgents24h,
          agentGrowthRate,
          topPerformingAgent
        });
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setApiError('Failed to load dashboard data. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    await fetchDashboardData();
  };

  const MetricCard: React.FC<MetricCardProps> = ({ 
    title, 
    value, 
    subtitle, 
    trend, 
    icon: Icon, 
    color = 'purple',
    isLoading = false 
  }) => (
    <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
      </div>
      <div className="space-y-2">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">{subtitle}</span>
                {trend !== undefined && trend > 0 && (
                  <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="text-xs font-medium">{Math.abs(trend)}%</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => {
    const getUpdateIcon = (type: string) => {
      switch (type) {
        case 'announcement': return Megaphone;
        case 'feature': return Zap;
        case 'agent': return Bot;
        case 'maintenance': return Activity;
        default: return Bell;
      }
    };

    const getUpdateColor = (priority: string) => {
      switch (priority) {
        case 'high': return 'border-red-500/30 bg-red-500/5';
        case 'medium': return 'border-yellow-500/30 bg-yellow-500/5';
        case 'low': return 'border-green-500/30 bg-green-500/5';
        default: return 'border-gray-500/30 bg-gray-500/5';
      }
    };

    const Icon = getUpdateIcon(update.type);

    return (
      <div className={`border rounded-xl p-4 hover:border-purple-500/40 transition-all duration-300 cursor-pointer ${getUpdateColor(update.priority)}`}>
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-purple-500/20 flex-shrink-0">
            <Icon className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-white font-semibold truncate">{update.title}</h4>
              <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                update.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                update.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {update.priority}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2 line-clamp-2">{update.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {update.timestamp}
              </div>
              {update.link && (
                <button className="text-purple-400 hover:text-purple-300 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Community Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Real-time insights and updates from the ZeroLag ecosystem
              {apiError && (
                <span className="block text-red-400 text-sm mt-1">
                  ⚠️ {apiError}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
      
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Community Members"
          value={communityStats.totalUsers.toLocaleString()}
          subtitle={communityStats.newUsers24h > 0 ? `+${communityStats.newUsers24h} today` : 'No new users today'}
          trend={communityStats.userGrowthRate}
          icon={Users}
          color="blue"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Agents"
          value={`${agentStats.totalAgents.toLocaleString()}`}
          subtitle={agentStats.newAgents24h > 0 ? `+${agentStats.newAgents24h} new agents` : 'No new agents today'}
          trend={agentStats.agentGrowthRate}
          icon={Bot}
          color="green"
          isLoading={isLoading}
        />
        <MetricCard
          title="24h Trading Volume"
          value={`$${(tradingStats.volume24h / 1000000).toFixed(1)}M`}
          subtitle={`${tradingStats.totalTrades.toLocaleString()} trades`}
          trend={tradingStats.volumeChange}
          icon={BarChart3}
          color="yellow"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Volume"
          value={`$${(tradingStats.totalVolume / 1000000).toFixed(0)}M`}
          subtitle={`Avg: $${tradingStats.avgTradeSize.toLocaleString()}`}
          icon={DollarSign}
          color="purple"
          isLoading={isLoading}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Updates Feed */}
        <div className="xl:col-span-2">
          <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-400" />
                Latest Updates
              </h2>
            </div>
            <div className="space-y-4">
              {updates.map(update => (
                <UpdateCard key={update.id} update={update} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats & Activity */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Users</span>
                <span className="font-semibold">{communityStats.activeUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Agents</span>
                <span className="font-semibold">{agentStats.activeAgents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Top Agent</span>
                <span className="font-semibold text-purple-400 truncate">{agentStats.topPerformingAgent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">7d Volume</span>
                <span className="font-semibold">${(tradingStats.volume7d / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Success Rate</span>
                <span className="font-semibold text-green-400">94.2%</span>
              </div>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              Performance
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">System Health</span>
                  <span className="text-green-400">99.8%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '99.8%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Agent Efficiency</span>
                  <span className="text-blue-400">87.3%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '87.3%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">User Satisfaction</span>
                  <span className="text-purple-400">92.1%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{width: '92.1%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Status */}
          <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" />
              Network Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">API Status</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${apiError ? 'bg-red-400' : 'bg-green-400'}`}></div>
                  <span className={`text-sm ${apiError ? 'text-red-400' : 'text-green-400'}`}>
                    {apiError ? 'Error' : 'Operational'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Trading Engine</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Data Feed</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Synced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;