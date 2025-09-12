import React from "react";
import {
  Smartphone,
  Monitor,
  ArrowRight,
  Bot,
  Sparkles,
  Zap,
  Code,
  TrendingUp,
  Users,
} from "lucide-react";
import img from "../../public/niko.webp"
import Image from "next/image";


const MobileView = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Zerolag Agent Hub
          </h1>
        </div>
        <p className="text-gray-300 text-lg leading-relaxed">
          The Future of Autonomous AI Agents
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 mb-8 border border-blue-500/30">
        <div className="text-center mb-6">
          <Sparkles className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">
            Discover Powerful AI Agents
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Explore our marketplace of autonomous AI agents that work 24/7 to
            automate your tasks, generate code, trade cryptocurrencies, and much
            more.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">245+</div>
            <div className="text-sm text-gray-400">AI Models</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">45+</div>
            <div className="text-sm text-gray-400">Active Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <TrendingUp className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">798+</div>
            <div className="text-sm text-gray-400">API Calls</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
            <Bot className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">564+</div>
            <div className="text-sm text-gray-400">Agents Created</div>
          </div>
        </div>
      </div>

      {/* Featured Agents Preview */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Bot className="h-5 w-5 mr-2 text-blue-400" />
          Featured AI Agents
        </h3>

        <div className="space-y-4">
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
            <div className="flex items-center mb-2">
              <Code className="h-5 w-5 text-green-400 mr-2" />
              <h4 className="font-semibold">Lana Codes</h4>
              <span className="ml-auto text-sm text-blue-400 font-medium">
                2.5 ZLAG
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Autonomous code generator that builds dApps
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-yellow-400 mr-2" />
              <h4 className="font-semibold">Quickie Trader</h4>
              <span className="ml-auto text-sm text-blue-400 font-medium">
                2.5 ZLAG
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Autonomous AI assistant for crypto trading
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
            <div className="flex items-center mb-2">
              <Bot className="h-5 w-5 text-purple-400 mr-2" />
              <h4 className="font-semibold">PushIt</h4>
              <span className="ml-auto text-sm text-blue-400 font-medium">
                2.5 ZLAG
              </span>
            </div>
            <p className="text-sm text-gray-400">
              GitHub AI agent that works 24/7
            </p>
          </div>
        </div>
      </div>

      {/* Desktop CTA */}
      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-6 mb-8 border border-orange-500/30">
        <div className="text-center">
          <Monitor className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-3 text-orange-100">
            Full Experience on Desktop
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            To interact with AI agents, browse the full marketplace, and access
            all features, please visit us on your desktop or laptop computer.
          </p>
          <div className="flex items-center justify-center text-orange-400 font-medium">
            <Smartphone className="h-4 w-4 mr-2" />
            <span className="text-sm">Mobile viewing only</span>
          </div>
        </div>
      </div>

      {/* Categories Preview */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Agent Categories</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700 text-center">
            <Code className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="font-medium text-sm">Code Generation</div>
            <div className="text-xs text-gray-400 mt-1">+1 Agents</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700 text-center">
            <Bot className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="font-medium text-sm">Autonomous Agents</div>
            <div className="text-xs text-gray-400 mt-1">+3 Agents</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700 text-center">
            <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="font-medium text-sm">Trading Bots</div>
            <div className="text-xs text-gray-400 mt-1">+2 Agents</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700 text-center">
            <Sparkles className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="font-medium text-sm">Voice Models</div>
            <div className="text-xs text-gray-400 mt-1">+1 Agents</div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
        <p className="text-blue-100 text-sm mb-4">
          Switch to desktop to explore, purchase, and deploy AI agents
        </p>
        <div className="flex items-center justify-center text-white font-medium">
          <Monitor className="h-5 w-5 mr-2" />
          <span>Visit on Desktop</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pt-6 border-t border-gray-800">
        <p className="text-gray-500 text-sm">
          © 2025 AI Agent Hub. Powered by autonomous intelligence.
        </p>
      </div>
    </div>
  );
};

export default MobileView;
