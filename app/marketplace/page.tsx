"use client"
import React, { useState, useEffect } from 'react'
import { Search, Star, Users, Download, TrendingUp, Bot, Code, MessageSquare, Image, Music, Brain, Heart, User, Crown, GitBranch, DollarSign, Zap } from 'lucide-react'

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [apiAgents, setApiAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Custom featured agents
  const featuredAgents = [
    {
      id: 'lana_codes',
      name: "Lana Codes",
      description: "An autonomous dapp builder that creates decentralized applications automatically",
      price: "$29.99/mo",
      rating: 4.9,
      users: "2.1k",
      downloads: "8.5k",
      trending: true,
      creator: "BlockchainLabs",
      tags: ["DApp", "Blockchain", "Autonomous"],
      icon: Code,
      color: "bg-violet-500",
      owned: false,
      createdByUser: false,
      liked: true,
      redirectUrl: "/agent/codeGen"
    },
    {
      id: 'pushit',
      name: "PushIt",
      description: "Converts your git push into comprehensive documentation automatically",
      price: "$12.99/mo",
      rating: 4.7,
      users: "5.4k",
      downloads: "15.2k",
      trending: false,
      creator: "GitFlow",
      tags: ["Git", "Documentation", "Automation"],
      icon: GitBranch,
      color: "bg-rose-500",
      owned: false,
      createdByUser: false,
      liked: false,
      redirectUrl: "/agent/pushit"
    },
    {
      id: 'quicktrader',
      name: "QuickerTrader",
      description: "Your everyday trading helper with real-time market analysis and insights",
      price: "$24.99/mo",
      rating: 4.8,
      users: "7.8k",
      downloads: "22.3k",
      trending: true,
      creator: "TradeTech",
      tags: ["Trading", "Finance", "Analysis"],
      icon: DollarSign,
      color: "bg-amber-500",
      owned: true,
      createdByUser: false,
      liked: true,
      redirectUrl: "/agent/trading"
    }
  ]

  // Capability to icon mapping
  const getIconForCapabilities = (capabilities) => {
    if (capabilities.includes('coding') || capabilities.includes('debugging')) return Code
    if (capabilities.includes('content-creation') || capabilities.includes('brainstorming')) return Brain
    if (capabilities.includes('data-analysis') || capabilities.includes('research')) return TrendingUp
    if (capabilities.includes('business-analysis') || capabilities.includes('strategic-planning')) return Users
    if (capabilities.includes('mentoring') || capabilities.includes('guidance')) return Heart
    return Bot
  }

  // Capability to color mapping
  const getColorForCapabilities = (capabilities) => {
    if (capabilities.includes('coding') || capabilities.includes('debugging')) return 'bg-purple-500'
    if (capabilities.includes('content-creation') || capabilities.includes('brainstorming')) return 'bg-purple-600'
    if (capabilities.includes('data-analysis') || capabilities.includes('research')) return 'bg-purple-400'
    if (capabilities.includes('business-analysis') || capabilities.includes('strategic-planning')) return 'bg-indigo-500'
    if (capabilities.includes('mentoring') || capabilities.includes('guidance')) return 'bg-violet-500'
    return 'bg-gray-500'
  }

  // Transform API agents to match our format
  const transformApiAgent = (agent) => ({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    price: "Free", // API doesn't provide price, defaulting to free
    rating: (4.0 + Math.random() * 1.0), // Random rating between 4.0-5.0
    users: `${(Math.random() * 10 + 1).toFixed(1)}k`,
    downloads: `${(Math.random() * 30 + 5).toFixed(1)}k`,
    trending: Math.random() > 0.7,
    creator: "Community",
    tags: agent.capabilities.slice(0, 3),
    icon: getIconForCapabilities(agent.capabilities),
    color: getColorForCapabilities(agent.capabilities),
    owned: Math.random() > 0.6,
    createdByUser: Math.random() > 0.8,
    liked: Math.random() > 0.5,
    redirectUrl: `/agent/${agent.id}`
  })

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://create-agent-backend.vercel.app/agents/')
        const result = await response.json()
        
        if (result.success) {
          const transformedAgents = result.data.map(transformApiAgent)
          setApiAgents(transformedAgents)
        } else {
          setError('Failed to fetch agents')
        }
      } catch (err) {
        setError('Error connecting to server')
        console.error('Error fetching agents:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  // Combine featured and API agents only after loading is complete
  const allAgents = loading ? [] : [...featuredAgents, ...apiAgents]

  const filters = [
    { id: 'all', name: 'All Agents', icon: Bot },
    { id: 'owned', name: 'Agents You Own', icon: Heart },
    { id: 'created', name: 'Created by You', icon: Crown }
  ]

  const filteredAgents = allAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    let matchesFilter = true
    if (selectedFilter === 'owned') matchesFilter = agent.owned
    if (selectedFilter === 'created') matchesFilter = agent.createdByUser
    
    return matchesSearch && matchesFilter
  })

  const handleAgentClick = (agent) => {
    if (agent.redirectUrl) {
      window.location.href = agent.redirectUrl
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Starry background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(120)].map((_, i) => (
          <div 
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 0.5}px`,
              height: `${Math.random() * 3 + 0.5}px`,
              background: '#ffffff',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `starTwinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: `0 0 ${Math.random() * 3 + 1}px rgba(255,255,255,0.3)`
            }}
          />
        ))}
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes starTwinkle {
          0%, 100% { 
            opacity: 0.2; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.2);
          }
        }
      `}</style>

      {/* Header */}
      <div className="relative backdrop-blur-md border-b border-gray-800/30 sticky top-0 z-10" style={{
        background: 'rgba(0,0,0,0.8)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent">
              AI Marketplace
            </h1>
            {loading && (
              <div className="flex items-center gap-2 text-purple-400">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading agents...</span>
              </div>
            )}
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
                className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl pl-12 pr-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 placeholder-gray-400 transition-all"
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
                        ? 'bg-gradient-to-r from-purple-500/30 to-purple-600/30 text-white border border-purple-500/50 shadow-lg shadow-purple-500/20'
                        : 'bg-gray-900/40 text-gray-300 hover:bg-gray-800/50 border border-gray-700/40 hover:border-gray-600/50'
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

        {/* Agents grid or loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative mb-8">
              {/* Main rotating circles */}
              <div className="relative w-24 h-24">
                {/* Outer ring */}
                <div className="absolute inset-0 border-4 border-transparent border-t-purple-400 border-r-purple-500 rounded-full animate-spin"></div>
                
                {/* Middle ring */}
                <div className="absolute inset-2 border-3 border-transparent border-b-violet-400 border-l-purple-300 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                
                {/* Inner core */}
                <div className="absolute inset-6 bg-gradient-to-r from-purple-400 via-purple-500 to-violet-400 rounded-full animate-pulse"></div>
                
                {/* Orbiting dots */}
                <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s'}}>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                </div>
                <div className="absolute inset-0 animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}>
                  <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                </div>
                <div className="absolute inset-0 animate-spin" style={{animationDuration: '2.5s'}}>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-violet-400 rounded-full shadow-lg shadow-violet-400/50"></div>
                </div>
              </div>
              
              {/* Pulsing background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-purple-600/20 to-violet-500/20 rounded-full blur-xl animate-pulse scale-150"></div>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-violet-400 bg-clip-text text-transparent mb-3">
                Loading AI Agents
              </h3>
              <p className="text-gray-400 animate-pulse text-lg">
                Discovering amazing agents for you...
              </p>
              
              {/* Loading dots */}
              <div className="flex justify-center gap-2 mt-4">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
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
                  className="group relative bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-black/60 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-6 hover:bg-gradient-to-br hover:from-gray-900/80 hover:via-gray-900/60 hover:to-black/80 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                >
                  {/* Enhanced glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent rounded-3xl"></div>
                  
                  {/* Dynamic glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Status badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {agent.trending && (
                      <span className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm text-purple-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 border border-purple-500/40">
                        <TrendingUp size={12} />
                        Trending
                      </span>
                    )}
                    {agent.owned && (
                      <span className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-sm text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 border border-violet-500/40">
                        <Heart size={12} />
                        Owned
                      </span>
                    )}
                    {agent.createdByUser && (
                      <span className="bg-gradient-to-r from-purple-400/20 to-violet-500/20 backdrop-blur-sm text-purple-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 border border-purple-400/40">
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
                      <div className="flex items-center gap-1 bg-purple-500/15 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-purple-500/20">
                        <Star size={14} className="text-purple-400 fill-current" />
                        <span className="font-bold text-purple-300">{typeof agent.rating === 'number' ? agent.rating.toFixed(1) : agent.rating}</span>
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
                        <span key={tag} className="bg-gray-800/60 backdrop-blur-sm text-gray-300 text-xs px-3 py-1.5 rounded-xl border border-gray-700/40 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                      <div>
                        <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                          {agent.price}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">by {agent.creator}</div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAgentClick(agent)
                        }}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-purple-400 hover:to-purple-500 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
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

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              {/* Outer rotating ring */}
              <div className="w-20 h-20 border-4 border-gray-700/30 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
              </div>
              
              {/* Inner pulsing dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-pulse"></div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute -inset-4">
                <div className="absolute top-2 left-2 w-2 h-2 bg-purple-400/60 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-4 right-1 w-1.5 h-1.5 bg-purple-500/60 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-3 left-1 w-1 h-1 bg-violet-400/60 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-1 right-4 w-2 h-2 bg-purple-600/60 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Loading AI Agents</h3>
              <p className="text-gray-400 animate-pulse">Discovering amazing agents for you...</p>
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && filteredAgents.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-black/60 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-12 mx-auto max-w-lg">
              <div className="text-gray-500 mb-6">
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
              {apiAgents.length} community agents • {featuredAgents.length} featured agents
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketplacePage