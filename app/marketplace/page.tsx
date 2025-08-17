"use client"
import React, { useState, useEffect } from 'react'
import { Search, Star, Users, Download, TrendingUp, Bot, Code, MessageSquare, Image, Music, Brain, Heart, User, Crown, GitBranch, DollarSign, Zap, Wallet } from 'lucide-react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [apiAgents, setApiAgents] = useState([])
  const [ownedAgents, setOwnedAgents] = useState([])
  const [createdAgents, setCreatedAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get wallet address from wagmi
  const { address: userAddress, isConnected, isConnecting } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  // Custom featured agents
  const featuredAgents = [
    {
      id: 'lana_codes',
      name: "Lana Codes",
      description: "An autonomous dapp builder that creates decentralized applications automatically",
      price: "150 Zlag",
      rating: 4.9,
      users: "2.1k",
      downloads: "8.5k",
      trending: true,
      creator: "BlockchainLabs",
      tags: ["DApp", "Blockchain", "Autonomous"],
      icon: Code,
      color: "bg-purple-500",
      owned: false,
      createdByUser: false,
      liked: true,
      redirectUrl: "/agent/codeGen",
      agentId: 0,
    },
    {
      id: 'pushit',
      name: "PushIt",
      description: "Converts your git push into comprehensive documentation automatically",
      price: "50 Zlag",
      rating: 4.7,
      users: "5.4k",
      downloads: "15.2k",
      trending: false,
      creator: "GitFlow",
      tags: ["Git", "Documentation", "Automation"],
      icon: GitBranch,
      color: "bg-indigo-500",
      owned: false,
      createdByUser: false,
      liked: false,
      redirectUrl: "/agent/pushit",
      agentId: 0,
    },
    {
      id: 'quicktrader',
      name: "QuickerTrader",
      description: "Your everyday trading helper with real-time market analysis and insights",
      price: "50 Zlag",
      rating: 4.8,
      users: "7.8k",
      downloads: "22.3k",
      trending: true,
      creator: "TradeTech",
      tags: ["Trading", "Finance", "Analysis"],
      icon: DollarSign,
      color: "bg-purple-600",
      owned: true,
      createdByUser: false,
      liked: true,
      redirectUrl: "/agent/trading",
      agentId: 0,
    }
  ]

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

  // Transform API agents to match our format
  const transformApiAgent = (agent, isOwned = false, isCreated = false) => ({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    price: agent.price ? `$${agent.price}` : "Free",
    rating: (4.0 + Math.random() * 1.0),
    users: `${(Math.random() * 10 + 1).toFixed(1)}k`,
    downloads: `${(Math.random() * 30 + 5).toFixed(1)}k`,
    trending: Math.random() > 0.7,
    creator: agent.creator ? agent.creator.walletAddress.slice(0, 8) + '...' : "Community",
    tags: agent.capabilities ? agent.capabilities.slice(0, 3) : ['AI', 'Bot', 'Helper'],
    icon: getIconForCapabilities(agent.capabilities || []),
    color: getColorForCapabilities(agent.capabilities || []),
    owned: isOwned,
    createdByUser: isCreated,
    liked: Math.random() > 0.5,
    redirectUrl: `/agent/${agent.id}`,
    agentId: agent.id
  })

  // Fetch agents from different APIs
  useEffect(() => {
    // Don't fetch if wallet is not connected
    if (!isConnected || !userAddress) {
      setLoading(false)
      return
    }

    const fetchAgents = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all agents from the general API
        const [generalResponse, ownedResponse, createdResponse] = await Promise.allSettled([
          fetch('https://create-agent-backend.vercel.app/agents/'),
          fetch(`https://zlag-ownable-service.vercel.app/api/users/${userAddress}/owned-agents`),
          fetch(`https://zlag-ownable-service.vercel.app/api/users/${userAddress}/created-agents`)
        ])

        // Handle general agents
        if (generalResponse.status === 'fulfilled' && generalResponse.value.ok) {
          const generalResult = await generalResponse.value.json()
          if (generalResult.success) {
            const transformedAgents = generalResult.data.map(agent => transformApiAgent(agent))
            setApiAgents(transformedAgents)
          }
        }

        // Handle owned agents
        if (ownedResponse.status === 'fulfilled' && ownedResponse.value.ok) {
          const ownedResult = await ownedResponse.value.json()
          if (ownedResult.success) {
            const transformedOwned = ownedResult.agents.map(agent => transformApiAgent(agent, true, false))
            setOwnedAgents(transformedOwned)
          }
        }

        // Handle created agents
        if (createdResponse.status === 'fulfilled' && createdResponse.value.ok) {
          const createdResult = await createdResponse.value.json()
          if (createdResult.success) {
            const transformedCreated = createdResult.agents.map(agent => transformApiAgent(agent, false, true))
            setCreatedAgents(transformedCreated)
          }
        }

        // Check if all failed
        if (generalResponse.status === 'rejected' && 
            ownedResponse.status === 'rejected' && 
            createdResponse.status === 'rejected') {
          setError('Failed to connect to servers')
        }

      } catch (err) {
        setError('Error connecting to server')
        console.error('Error fetching agents:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [userAddress, isConnected])

  // Get filtered agents based on selected filter
  const getFilteredAgents = () => {
    let agentsToShow = []
    
    switch (selectedFilter) {
      case 'owned':
        agentsToShow = ownedAgents
        break
      case 'created':
        agentsToShow = createdAgents
        break
      default:
        agentsToShow = [...featuredAgents, ...apiAgents]
        break
    }

    return agentsToShow.filter(agent => {
      return agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    })
  }

  const filteredAgents = getFilteredAgents()

  const filters = [
    { id: 'all', name: 'All Agents', icon: Bot },
    { id: 'owned', name: 'Agents You Own', icon: Heart },
    { id: 'created', name: 'Created by You', icon: Crown }
  ]

  const handleAgentClick = (agent) => {
    if (agent.redirectUrl) {
      window.location.href = agent.redirectUrl
    }
  }

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
      <div className="relative bg-black/60 backdrop-blur-md border-b border-purple-900/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              AI Marketplace
            </h1>
            
            <div className="flex items-center gap-4">
              {/* Wallet Connection Status */}
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
            {/* Search */}
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
            
            {/* Filter buttons */}
            <div className="flex gap-3 overflow-x-auto">
              {filters.map(filter => {
                const FilterIcon = filter.icon
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
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Wallet connection required message */}
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

        {/* Content when wallet is connected */}
        {isConnected && (
          <>
            {/* Error state */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 rounded-2xl p-4 mb-6">
                <p className="text-red-300 text-center">{error}</p>
              </div>
            )}

            {/* Stats */}
            <div className="mb-8">
              <p className="text-gray-400 text-sm">
                Showing {filteredAgents.length} agents
                {selectedFilter !== 'all' && (
                  <span className="text-purple-400"> • {filters.find(f => f.id === selectedFilter)?.name}</span>
                )}
              </p>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative mb-8">
                  {/* Main rotating circles */}
                  <div className="relative w-24 h-24">
                    {/* Outer ring */}
                    <div className="absolute inset-0 border-4 border-transparent border-t-purple-400 border-r-indigo-400 rounded-full animate-spin"></div>
                    
                    {/* Middle ring */}
                    <div className="absolute inset-2 border-3 border-transparent border-b-purple-500 border-l-indigo-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                    
                    {/* Inner core */}
                    <div className="absolute inset-6 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-500 rounded-full animate-pulse"></div>
                    
                    {/* Orbiting dots */}
                    <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s'}}>
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                    </div>
                    <div className="absolute inset-0 animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}>
                      <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50"></div>
                    </div>
                    <div className="absolute inset-0 animate-spin" style={{animationDuration: '2.5s'}}>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                    </div>
                  </div>
                  
                  {/* Pulsing background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-600/20 rounded-full blur-xl animate-pulse scale-150"></div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-3">
                    Loading AI Agents
                  </h3>
                  <p className="text-gray-400 animate-pulse text-lg">
                    Discovering amazing agents for you...
                  </p>
                  
                  {/* Loading dots */}
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
                  const IconComponent = agent.icon
                  return (
                    <div
                      key={agent.id}
                      onClick={() => handleAgentClick(agent)}
                      className="group relative bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-black/40 backdrop-blur-xl border border-purple-800/30 rounded-3xl p-6 hover:bg-gradient-to-br hover:from-gray-900/60 hover:via-gray-900/50 hover:to-black/60 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                    >
                      {/* Enhanced glassmorphism overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent rounded-3xl"></div>
                      
                      {/* Dynamic glow effect */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      {/* Status badges */}
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
                      </div>
                      
                      {/* Content */}
                      <div className="relative z-10 pt-4">
                        {/* Icon */}
                        <div className={`w-16 h-16 ${agent.color} rounded-2xl flex items-center justify-center shadow-xl mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <IconComponent size={32} className="text-white" />
                        </div>

                        {/* Title and description */}
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors leading-tight">
                          {agent.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-5 leading-relaxed min-h-[3rem]">
                          {agent.description}
                        </p>
                        
                        {/* Stats */}
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

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {agent.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="bg-purple-800/40 backdrop-blur-sm text-purple-200 text-xs px-3 py-1.5 rounded-xl border border-purple-600/40 font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-purple-800/40">
                          <div>
                            <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                              {agent.price}
                            </div>
                            <div className="text-xs text-gray-400 font-medium">by {agent.creator}</div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAgentClick(agent)
                            }}
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-purple-400 hover:to-indigo-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
                          >
                            {agent.owned ? 'Launch' : 'Deploy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* No results */}
            {!loading && filteredAgents.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-black/40 backdrop-blur-xl border border-purple-800/30 rounded-3xl p-12 mx-auto max-w-lg">
                  <div className="text-purple-500 mb-6">
                    <Search size={64} className="mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No agents found</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Try adjusting your search terms or selecting a different filter to find the perfect AI agent for your needs.
                  </p>
                </div>
              </div>
            )}

            {/* Agent count info */}
            {!loading && (
              <div className="mt-12 text-center">
                <p className="text-gray-500 text-sm">
                  {selectedFilter === 'all' && `${apiAgents.length} community agents • ${featuredAgents.length} featured agents`}
                  {selectedFilter === 'owned' && `${ownedAgents.length} owned agents`}
                  {selectedFilter === 'created' && `${createdAgents.length} created agents`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MarketplacePage