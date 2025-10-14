"use client"
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Zap, Clock, Star, Activity, ExternalLink, Eye, Calendar, Volume2, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const [profitableTokens, setProfitableTokens] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [newLaunches, setNewLaunches] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Sample chart data - in real implementation, this would come from your API
  const [chartData, setChartData] = useState([
    { time: '00:00', profitable: 12, gainers: 8, launches: 3 },
    { time: '04:00', profitable: 15, gainers: 12, launches: 5 },
    { time: '08:00', profitable: 18, gainers: 15, launches: 7 },
    { time: '12:00', profitable: 22, gainers: 18, launches: 9 },
    { time: '16:00', profitable: 25, gainers: 20, launches: 12 },
    { time: '20:00', profitable: 28, gainers: 25, launches: 15 },
    { time: '24:00', profitable: 30, gainers: 28, launches: 18 }
  ]);

  // API base URL - adjust this to match your backend
  const API_BASE = 'http://localhost:3001';

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data from:', API_BASE);
      
      // Fetch all endpoints with individual error handling
      const fetchEndpoint = async (endpoint, name) => {
        try {
          const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            //@ts-ignore
            timeout: 10000, // 10 second timeout
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${name} API error (${response.status}): ${errorText}`);
          }
          
          const data = await response.json();
          
          if (!data.success) {
            throw new Error(`${name} API returned error: ${data.message || 'Unknown error'}`);
          }
          
          return { success: true, data: data.data.tokens || [], endpoint: name };
        } catch (fetchError) {
          console.error(`Error fetching ${name}:`, fetchError);
          return { 
            success: false, 
            error: fetchError.message, 
            endpoint: name,
            data: [] 
          };
        }
      };

      // Fetch all endpoints
      const [profitableResult, gainersResult, launchesResult] = await Promise.all([
        fetchEndpoint('/profitable-tokens', 'Profitable Tokens'),
        fetchEndpoint('/top-gainers', 'Top Gainers'),
        fetchEndpoint('/new-launches', 'New Launches')
      ]);

      // Process results and collect errors
      const errors = [];
      
      if (profitableResult.success) {
        setProfitableTokens(profitableResult.data);
      } else {
        errors.push(`${profitableResult.endpoint}: ${profitableResult.error}`);
        setProfitableTokens([]);
      }

      if (gainersResult.success) {
        setTopGainers(gainersResult.data);
      } else {
        errors.push(`${gainersResult.endpoint}: ${gainersResult.error}`);
        setTopGainers([]);
      }

      if (launchesResult.success) {
        setNewLaunches(launchesResult.data);
      } else {
        errors.push(`${launchesResult.endpoint}: ${launchesResult.error}`);
        setNewLaunches([]);
      }

      // Set error state if any endpoint failed
      if (errors.length > 0) {
        const allFailed = errors.length === 3;
        setError({
          type: allFailed ? 'complete_failure' : 'partial_failure',
          message: allFailed 
            ? `Cannot connect to backend server at ${API_BASE}. Please check if the server is running.`
            : 'Some data could not be loaded:',
          details: errors,
          allFailed
        });
      } else {
        setError(null);
      }

      setLastUpdated(new Date().toLocaleTimeString());
      console.log('Data fetch completed:', { 
        profitable: profitableResult.success, 
        gainers: gainersResult.success, 
        launches: launchesResult.success 
      });

    } catch (err) {
      console.error('Critical error during data fetch:', err);
      setError({
        type: 'critical_error',
        message: 'Critical error occurred while fetching data',
        details: [err.message],
        allFailed: true
      });
      // Set empty arrays for all data
      setProfitableTokens([]);
      setTopGainers([]);
      setNewLaunches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto refresh every 2 minutes
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    if (marketCap >= 1e3) return `$${(marketCap / 1e3).toFixed(2)}K`;
    return `$${marketCap.toLocaleString()}`;
  };

  const formatPercentage = (percentage) => {
    if (!percentage && percentage !== 0) return 'N/A';
    return `${percentage.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    if (!change && change !== 0) return 'text-gray-400';
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = (change) => {
    if (!change && change !== 0) return null;
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const generateTokenUrl = (token) => {
    // This would be your actual token detail page or external service like DexScreener, CoinGecko, etc.
    return `https://dexscreener.com/search?q=${token.symbol}`;
  };

  const EnhancedTokenCard = ({ token, showScore = false, showDaysOld = false, rank }) => (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {token.image && (
                <img src={token.image} alt={token.name} className="w-12 h-12 rounded-full border-2 border-purple-500/30" />
              )}
              {rank && (
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {rank}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{token.name}</h3>
              <p className="text-purple-300 text-sm font-medium">{token.symbol}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {showScore && (
            <div className="text-center bg-purple-900/50 px-3 py-2 rounded-lg">
              <div className="text-purple-400 text-xl font-bold">
                {token.profitabilityScore || token.newLaunchScore}
              </div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
          )}
          {showDaysOld && token.daysOld && (
            <div className="text-center bg-blue-900/50 px-3 py-2 rounded-lg">
              <div className="text-blue-400 text-lg font-bold">{token.daysOld}d</div>
              <div className="text-xs text-gray-400">Old</div>
            </div>
          )}
          <a 
            href={generateTokenUrl(token)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors flex items-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Current Price</p>
          <p className="text-white font-bold text-sm">{formatPrice(token.currentPrice)}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Market Cap</p>
          <p className="text-white font-bold text-sm">{formatMarketCap(token.marketCap)}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">24h Volume</p>
          <p className="text-white font-bold text-sm">{formatMarketCap(token.volume24h)}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">24h Change</p>
          <div className={`flex items-center justify-center space-x-1 ${getChangeColor(token.priceChange24h)}`}>
            {getChangeIcon(token.priceChange24h)}
            <span className="font-bold text-sm">{formatPercentage(token.priceChange24h)}</span>
          </div>
        </div>
      </div>

      {/* Extended Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {token.priceChange7d && (
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">7d Change</p>
            <p className={`font-semibold text-sm ${getChangeColor(token.priceChange7d)}`}>
              {formatPercentage(token.priceChange7d)}
            </p>
          </div>
        )}
        {token.priceChange30d && (
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">30d Change</p>
            <p className={`font-semibold text-sm ${getChangeColor(token.priceChange30d)}`}>
              {formatPercentage(token.priceChange30d)}
            </p>
          </div>
        )}
        {token.totalSupply && (
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Supply</p>
            <p className="text-white font-semibold text-sm">
              {formatMarketCap(token.totalSupply)}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Listed {token.listedDate || 'N/A'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => {
    const topGainer = topGainers[0];
    const topProfitable = profitableTokens[0];
    const newestLaunch = newLaunches[0];

    return (
      <div className="space-y-8">
        {/* Main Chart */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-purple-900/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Market Overview</h2>
              <p className="text-gray-400">Token performance over the last 24 hours</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">Profitable</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Gainers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">New Launches</span>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="profitableGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gainersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="launchesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #4c1d95',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="profitable" 
                  stroke="#8b5cf6" 
                  fill="url(#profitableGradient)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="gainers" 
                  stroke="#10b981" 
                  fill="url(#gainersGradient)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="launches" 
                  stroke="#3b82f6" 
                  fill="url(#launchesGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">🏆 Today's Top Performers</h2>
          <div className="space-y-6">
            {topGainer && (
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Top Gainer</span>
                </h3>
                <EnhancedTokenCard token={topGainer} rank={1} />
              </div>
            )}
            
            {topProfitable && (
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Most Profitable</span>
                </h3>
                <EnhancedTokenCard token={topProfitable} showScore rank={1} />
              </div>
            )}
            
            {newestLaunch && (
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Newest Launch</span>
                </h3>
                <EnhancedTokenCard token={newestLaunch} showScore showDaysOld rank={1} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, component: OverviewTab },
    { id: 'profitable', label: 'Most Profitable', icon: DollarSign, data: profitableTokens },
    { id: 'gainers', label: 'Top Gainers', icon: TrendingUp, data: topGainers },
    { id: 'launches', label: 'New Launches', icon: Star, data: newLaunches }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-300">Loading profitable tokens...</p>
        </div>
      </div>
    );
  }

  if (error && error.allFailed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl mb-2">Failed to Load Data</h2>
          <p className="text-gray-400 mb-4">{error.message}</p>
          <button
            onClick={fetchData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-gradient-to-r from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Crypto Profitability Hub
              </h1>
              <p className="text-gray-400 mt-2 text-lg">Advanced cryptocurrency analysis and real-time insights</p>
            </div>
            <div className="flex items-center space-x-6">
              {lastUpdated && (
                <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-800 px-3 py-2 rounded-lg">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {lastUpdated}</span>
                </div>
              )}
              <button
                onClick={fetchData}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-all flex items-center space-x-2 font-medium shadow-lg"
              >
                <Activity className="w-4 h-4" />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-2 bg-gray-900 p-2 rounded-xl border border-gray-700">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all font-medium ${
                activeTab === id
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {error && !error.allFailed && (
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
            <div className="text-yellow-400 font-medium">Warning: {error.message}</div>
            <ul className="text-yellow-300 text-sm mt-1">
              {error.details.map((detail, index) => (
                <li key={index}>• {detail}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'overview' ? (
          <OverviewTab />
        ) : (
          <div>
            {(() => {
              const currentTab = tabs.find(tab => tab.id === activeTab);
              const data = currentTab?.data || [];
              
              return (
                <>
                  {/* Stats Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-purple-900/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Total Tokens</p>
                          <p className="text-3xl font-bold text-white">{data.length}</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-purple-400" />
                      </div>
                    </div>
                    
                    {data.length > 0 && (
                      <>
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-purple-900/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-400 text-sm">Best Performer</p>
                              <p className="text-2xl font-bold text-green-400">
                                {formatPercentage(data[0].priceChange24h)}
                              </p>
                              <p className="text-sm text-gray-300">{data[0].symbol}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-400" />
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-purple-900/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-400 text-sm">Top Score</p>
                              <p className="text-3xl font-bold text-purple-400">
                                {data[0].profitabilityScore || data[0].newLaunchScore || 'N/A'}
                              </p>
                            </div>
                            <Zap className="w-8 h-8 text-purple-400" />
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-purple-900/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-400 text-sm">Total Volume</p>
                              <p className="text-2xl font-bold text-blue-400">
                                {formatMarketCap(data.reduce((sum, token) => sum + (token.volume24h || 0), 0))}
                              </p>
                            </div>
                            <Volume2 className="w-8 h-8 text-blue-400" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Token List */}
                  {data.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-gray-400 text-6xl mb-4">📊</div>
                      <h3 className="text-white text-2xl mb-2">No Data Available</h3>
                      <p className="text-gray-400">Try refreshing or check your backend connection</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">
                        {currentTab?.label} ({data.length})
                      </h2>
                      {data.map((token, index) => (
                        <EnhancedTokenCard
                          key={token.id}
                          token={token}
                          showScore={activeTab === 'profitable' || activeTab === 'launches'}
                          showDaysOld={activeTab === 'launches'}
                          rank={index + 1}
                        />
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;