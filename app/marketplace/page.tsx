"use client"
import React, { useState } from 'react'
import { Search, Star, Users, Download, TrendingUp, Bot, Code, MessageSquare, Image, Music, Brain } from 'lucide-react'

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Sample AI agents data
  const aiAgents = [
    {
      id: 1,
      name: "NeuralChat Pro",
      category: "conversation",
      description: "Advanced conversational AI with human-like responses",
      price: "Free",
      rating: 4.8,
      users: "12.3k",
      downloads: "45.2k",
      trending: true,
      creator: "CyberDev",
      tags: ["Chat", "NLP", "Advanced"],
      icon: MessageSquare,
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "CodeGen X1",
      category: "development",
      description: "AI-powered code generation and debugging assistant",
      price: "$9.99/mo",
      rating: 4.9,
      users: "8.7k",
      downloads: "28.1k",
      trending: true,
      creator: "DevMatrix",
      tags: ["Coding", "Debug", "AI"],
      icon: Code,
      color: "bg-emerald-500"
    },
    {
      id: 3,
      name: "VisualAI Studio",
      category: "creative",
      description: "Create stunning visuals and art with AI assistance",
      price: "$14.99/mo",
      rating: 4.7,
      users: "15.6k",
      downloads: "52.8k",
      trending: false,
      creator: "ArtifexLabs",
      tags: ["Art", "Design", "Visual"],
      icon: Image,
      color: "bg-purple-500"
    },
    {
      id: 4,
      name: "SynthBeats AI",
      category: "creative",
      description: "Generate unique music and soundscapes with AI",
      price: "$7.99/mo",
      rating: 4.6,
      users: "6.2k",
      downloads: "19.4k",
      trending: false,
      creator: "SoundWave",
      tags: ["Music", "Audio", "Creative"],
      icon: Music,
      color: "bg-orange-500"
    },
    {
      id: 5,
      name: "DataMind Pro",
      category: "analytics",
      description: "Advanced data analysis and predictive modeling",
      price: "$19.99/mo",
      rating: 4.9,
      users: "4.1k",
      downloads: "12.7k",
      trending: true,
      creator: "DataCorp",
      tags: ["Analytics", "ML", "Data"],
      icon: Brain,
      color: "bg-indigo-500"
    },
    {
      id: 6,
      name: "AutoBot Assistant",
      category: "productivity",
      description: "Automate workflows and boost productivity",
      price: "Free",
      rating: 4.5,
      users: "9.8k",
      downloads: "31.5k",
      trending: false,
      creator: "AutoTech",
      tags: ["Automation", "Productivity", "Workflow"],
      icon: Bot,
      color: "bg-teal-500"
    }
  ]

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'conversation', name: 'Chat' },
    { id: 'development', name: 'Code' },
    { id: 'creative', name: 'Creative' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'productivity', name: 'Productivity' }
  ]

  const filteredAgents = aiAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `
          linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Header */}
      <div className="relative bg-black/40 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold text-white mb-6">AI Marketplace</h1>
          
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
              />
            </div>
            
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-medium transition-all backdrop-blur-sm ${
                    selectedCategory === category.id
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30 shadow-lg shadow-green-500/10'
                      : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/40 border border-gray-700/30'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        {/* Agents grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => {
            const IconComponent = agent.icon
            return (
              <div
                key={agent.id}
                className="group relative bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                
                {/* Subtle green glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${agent.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <IconComponent size={24} className="text-white" />
                    </div>
                    {agent.trending && (
                      <span className="bg-green-500/20 backdrop-blur-sm text-green-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 border border-green-500/30">
                        <TrendingUp size={12} />
                        Trending
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{agent.description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-300">{agent.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{agent.users}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={14} />
                      <span>{agent.downloads}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-white">{agent.price}</div>
                      <div className="text-xs text-gray-400">by {agent.creator}</div>
                    </div>
                    <button className="bg-green-500/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 border border-green-400/20">
                      Deploy
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No results */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 mx-auto max-w-md">
              <div className="text-gray-500 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No agents found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketplacePage