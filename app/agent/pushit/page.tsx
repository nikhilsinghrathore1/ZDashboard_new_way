"use client"
import React, { useState, useEffect } from "react";
import { Github, Zap, FileText, Activity, Eye, GitBranch, Code, Bot } from "lucide-react";

const GitHubTrackerApp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  // Simulate connection status
  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate activity data
//   useEffect(() => {
//     setRecentActivity([
//       { repo: "user/awesome-project", time: "2 min ago", status: "completed" },
//       { repo: "dev/react-components", time: "5 min ago", status: "analyzing" },
//       { repo: "team/backend-api", time: "12 min ago", status: "completed" },
//     ]);
//   }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  const handleGitHubRedirect = () => {
    window.open("https://github.com/apps/readmepusher", "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated Scanlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Github className="h-16 w-16 text-green-400 animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <Zap className="h-6 w-6 text-yellow-400 animate-bounce" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
            Pushit
          </h1>
          <p className="text-xl text-green-300 mb-2">
            AUTONOMOUS REPOSITORY INTELLIGENCE SYSTEM
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-ping' : 'bg-red-500'}`}></div>
            <span className={isConnected ? 'text-green-400' : 'text-red-500'}>
              {isConnected ? 'SYSTEM ONLINE' : 'INITIALIZING...'}
            </span>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Panel - Features */}
          <div className="space-y-6">
            {/* Feature Cards */}
            <div className="bg-gray-900 border border-green-400 rounded-lg p-6 shadow-lg shadow-green-400/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Activity className="h-6 w-6 mr-2 text-green-400" />
                SYSTEM CAPABILITIES
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-black border border-green-800 rounded">
                  <Eye className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-300">Real-time Monitoring</h3>
                    <p className="text-sm text-gray-400">Continuous surveillance of repository push events</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-black border border-green-800 rounded">
                  <Code className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-300">Code Extraction</h3>
                    <p className="text-sm text-gray-400">Complete codebase analysis and extraction</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-black border border-green-800 rounded">
                  <Bot className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-300">AI Documentation</h3>
                    <p className="text-sm text-gray-400">Intelligent README generation and auto-commit</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-black border border-green-800 rounded">
                  <GitBranch className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-300">Automated Deployment</h3>
                    <p className="text-sm text-gray-400">Seamless integration with GitHub workflows</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Panel */}
            <div className="bg-gray-900 border border-green-400 rounded-lg p-6 shadow-lg shadow-green-400/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-yellow-400" />
                CONTROL INTERFACE
              </h2>
              
              <div className="space-y-4">
             
                
                <button
                  onClick={handleGitHubRedirect}
                  className="w-full bg-black hover:bg-gray-800 text-green-400 font-bold py-4 px-6 rounded-lg border-2 border-green-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-400/20"
                >
                  <span className="flex items-center justify-center">
                    <Github className="h-5 w-5 mr-2" />
                    ACCESS GITHUB APP
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Activity Monitor */}
          <div className="space-y-6">
            {/* Stats Dashboard */}
            <div className="bg-gray-900 border border-green-400 rounded-lg p-6 shadow-lg shadow-green-400/20">
              <h2 className="text-2xl font-bold mb-6">SYSTEM METRICS</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black p-4 rounded border border-green-800">
                  <div className="text-3xl font-bold text-green-400 animate-pulse">247</div>
                  <div className="text-sm text-gray-400">Repos Monitored</div>
                </div>
                <div className="bg-black p-4 rounded border border-green-800">
                  <div className="text-3xl font-bold text-green-400 animate-pulse">1,432</div>
                  <div className="text-sm text-gray-400">READMEs Generated</div>
                </div>
                <div className="bg-black p-4 rounded border border-green-800">
                  <div className="text-3xl font-bold text-green-400 animate-pulse">98.7%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div className="bg-black p-4 rounded border border-green-800">
                  <div className="text-3xl font-bold text-green-400 animate-pulse">15.2s</div>
                  <div className="text-sm text-gray-400">Avg Response</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900 border border-green-400 rounded-lg p-6 shadow-lg shadow-green-400/20">
              <h2 className="text-2xl font-bold mb-6">ACTIVITY LOG</h2>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-black border border-green-800 rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        // @ts-ignore
                        activity.status=== 'completed' ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
                      }`}></div>
                      <div>
                      {/* @ts-ignore */}

                        <div className="font-semibold text-green-300">{activity.repo}</div>
                      {/* @ts-ignore */}
                        <div className="text-xs text-gray-400">{activity.time}</div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded border ${
                      // @ts-ignore
                      activity.status === 'completed' 
                        ? 'bg-green-900 text-green-300 border-green-600'
                        : 'bg-yellow-900 text-yellow-300 border-yellow-600'
                    }`}>
                      {/*  @ts-ignore */}
                      {activity.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Window */}
            <div className="bg-gray-900 border border-green-400 rounded-lg shadow-lg shadow-green-400/20">
              <div className="flex items-center justify-between bg-black px-4 py-2 border-b border-green-800 rounded-t-lg">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-green-400">TERMINAL</div>
              </div>
              <div className="p-4 text-sm font-mono">
                <div className="text-green-400">
                  <span className="text-green-300">$</span> system-status --verbose<br />
                  <span className="text-gray-400">✓ GitHub webhook listeners active</span><br />
                  <span className="text-gray-400">✓ AI analysis engine running</span><br />
                  <span className="text-gray-400">✓ Documentation generator online</span><br />
                  <span className="text-green-300 animate-pulse">● Monitoring 247 repositories...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          <div className="border-t border-green-800 pt-4">
            REPO SENTINEL v2.1.0 | AUTONOMOUS DOCUMENTATION SYSTEM | STATUS: OPERATIONAL
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GitHubTrackerApp;