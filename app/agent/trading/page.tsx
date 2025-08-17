// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "./components/ui/button"
// import { Card } from "./components/ui/card"
// import { Input } from "./components/ui/input"
// import {
//   Home,
//   Search,
//   Bitcoin,
//   DollarSign,
//   Eye,
//   RefreshCw,
//   ArrowUp,
//   ArrowDown,
//   Activity,
//   Bot,
//   Send,
//   User,
// } from "lucide-react"

// // ============================================================================
// // INTERFACES - Data structures for cryptocurrency and chat functionality
// // ============================================================================
// interface CoinData {
//   id: string
//   symbol: string
//   name: string
//   current_price: number
//   price_change_percentage_24h: number
//   market_cap: number
//   total_volume: number
//   high_24h: number
//   low_24h: number
//   ath: number
//   atl: number
//   circulating_supply: number
//   total_supply: number
//   image: string
// }

// interface ChatMessage {
//   id: string
//   role: "user" | "assistant"
//   content: string
//   timestamp: Date
// }

// // ============================================================================
// // MAIN COMPONENT - Single-file crypto trading bot with AI chat integration
// // ============================================================================
// export default function CryptoBotDashboard() {
//   // ============================================================================
//   // STATE MANAGEMENT - All application state in one place
//   // ============================================================================
//   const [currentTime, setCurrentTime] = useState(new Date())
//   const [activeTab, setActiveTab] = useState("overview")
//   const [coins, setCoins] = useState<CoinData[]>([])
//   const [loading, setLoading] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null)
//   const [fearGreedIndex, setFearGreedIndex] = useState(50)

//   // Chat-specific state
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
//     {
//       id: "1",
//       role: "assistant",
//       content:
//         "🤖 Hello! I'm your AI crypto trading assistant powered by advanced AI. Ask me anything about:\n\n• Cryptocurrency trading strategies\n• Market analysis and trends\n• Technical indicators (RSI, MACD, etc.)\n• Risk management techniques\n• Specific coin analysis\n• Portfolio optimization\n• DeFi and Web3 insights\n\nI have access to real-time market data and can provide detailed trading recommendations!",
//       timestamp: new Date(),
//     },
//   ])
//   const [chatInput, setChatInput] = useState("")
//   const [chatLoading, setChatLoading] = useState(false)

//   // ============================================================================
//   // REAL-TIME DATA UPDATES - Automatic price and time updates
//   // ============================================================================
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date())
//       if (activeTab === "overview") {
//         fetchCoinData()
//       }
//     }, 30000) // Update every 30 seconds

//     return () => clearInterval(timer)
//   }, [activeTab])

//   // Initial data fetch on component mount
//   useEffect(() => {
//     fetchCoinData()
//     fetchFearGreedIndex()
//   }, [])

//   // ============================================================================
//   // API FUNCTIONS - External data fetching functions
//   // ============================================================================

//   // Fetch cryptocurrency market data from CoinGecko API
//   const fetchCoinData = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch(
//         "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
//       )
//       const data = await response.json()
//       setCoins(data)
//     } catch (error) {
//       console.error("Error fetching coin data:", error)
//     }
//     setLoading(false)
//   }

//   // Fetch Fear & Greed Index for market sentiment
//   const fetchFearGreedIndex = async () => {
//     try {
//       const response = await fetch("https://api.alternative.me/fng/")
//       const data = await response.json()
//       setFearGreedIndex(Number.parseInt(data.data[0].value))
//     } catch (error) {
//       console.error("Error fetching fear & greed index:", error)
//     }
//   }

//   // ============================================================================
//   // AI CHAT FUNCTIONALITY - Groq API integration for intelligent responses
//   // ============================================================================
//   const sendChatMessage = async () => {
//     if (!chatInput.trim()) return

//     // Create user message
//     const userMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: chatInput,
//       timestamp: new Date(),
//     }

//     setChatMessages((prev) => [...prev, userMessage])
//     const currentInput = chatInput
//     setChatInput("")
//     setChatLoading(true)

//     try {
//       const topCoins = coins.slice(0, 15)
//       const marketContext = topCoins
//         .map(
//           (coin) =>
//             `${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price.toFixed(4)} (${coin.price_change_percentage_24h > 0 ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}%) | MC: $${(coin.market_cap / 1000000000).toFixed(2)}B | Vol: $${(coin.total_volume / 1000000).toFixed(0)}M`,
//         )
//         .join("\n")

//       const systemPrompt = `You are an expert cryptocurrency trading assistant and market analyst with deep knowledge of:
// - Technical analysis (RSI, MACD, Bollinger Bands, Fibonacci, etc.)
// - Fundamental analysis and tokenomics
// - Market psychology and sentiment analysis
// - Risk management and portfolio optimization
// - DeFi protocols and Web3 trends
// - Trading strategies (scalping, swing trading, HODLing)

// CURRENT REAL-TIME MARKET DATA:
// ${marketContext}

// Fear & Greed Index: ${fearGreedIndex}/100 (${fearGreedIndex < 25 ? "Extreme Fear - Great buying opportunity" : fearGreedIndex < 45 ? "Fear - Cautious buying" : fearGreedIndex < 55 ? "Neutral - Wait for clear signals" : fearGreedIndex < 75 ? "Greed - Consider taking profits" : "Extreme Greed - High risk, consider selling"})

// ANALYSIS FRAMEWORK - Always provide:
// 🎯 TRADING SIGNAL: Clear BUY/SELL/HOLD recommendation
// 📊 TECHNICAL ANALYSIS: Key levels, indicators, chart patterns
// 💡 STRATEGY: Specific entry/exit points with reasoning
// ⚠️ RISK MANAGEMENT: Stop-loss, position sizing, risk/reward
// 📈 MARKET CONTEXT: How current conditions affect the trade
// 🔮 OUTLOOK: Short-term and medium-term predictions

// Be specific, actionable, and always include risk warnings. Use emojis for better readability.`

//       const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${"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"}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "llama-3.1-70b-versatile", // Using the most capable model
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: currentInput },
//           ],
//           temperature: 0.7,
//           max_tokens: 1500, // Increased for more detailed responses
//           top_p: 0.9,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(`HTTP ${response.status}: ${errorData.error?.message || "API request failed"}`)
//       }

//       const data = await response.json()
//       const aiResponse = data.choices[0]?.message?.content || "Sorry, I couldn't process your request."

//       const assistantMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: aiResponse,
//         timestamp: new Date(),
//       }

//       setChatMessages((prev) => [...prev, assistantMessage])
//     } catch (error) {
//       console.error("Error sending message:", error)
//       const errorMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: `❌ **Connection Error**\n\nI'm having trouble connecting to the AI service. This could be due to:\n\n• Missing or invalid GROQ API key\n• Network connectivity issues\n• API rate limits\n\n**To fix this:**\n1. Add your GROQ API key to environment variables\n2. Check your internet connection\n3. Try again in a few moments\n\nError details: ${error instanceof Error ? error.message : "Unknown error"}`,
//         timestamp: new Date(),
//       }
//       setChatMessages((prev) => [...prev, errorMessage])
//     }

//     setChatLoading(false)
//   }

//   // ============================================================================
//   // ADVANCED ANALYSIS ENGINE - Detailed cryptocurrency analysis with strategies
//   // ============================================================================
//   const getDetailedAnalysis = (coin: CoinData) => {
//     const priceChange = coin.price_change_percentage_24h
//     const volume = coin.total_volume
//     const marketCap = coin.market_cap
//     const currentPrice = coin.current_price

//     const support = coin.low_24h * 0.995
//     const resistance = coin.high_24h * 1.005
//     const athDistance = ((coin.ath - currentPrice) / coin.ath) * 100
//     const volumeRatio = volume / marketCap

//     let trend = "Neutral"
//     let signal = "HOLD"
//     let strategy = ""
//     let confidence = 50

//     if (priceChange > 10) {
//       trend = "🚀 Explosive Bullish"
//       signal = "STRONG BUY"
//       confidence = 85
//       strategy = "Momentum breakout detected. Enter on pullbacks to 8-hour support. High volatility expected."
//     } else if (priceChange > 5) {
//       trend = "📈 Strong Bullish"
//       signal = "BUY"
//       confidence = 75
//       strategy = "Strong upward momentum. Consider buying on minor dips. Set tight stop-losses."
//     } else if (priceChange > 2) {
//       trend = "🟢 Bullish"
//       signal = "BUY"
//       confidence = 65
//       strategy = "Positive momentum building. Good entry point with proper risk management."
//     } else if (priceChange < -10) {
//       trend = "💥 Extreme Bearish"
//       signal = "STRONG SELL"
//       confidence = 85
//       strategy = "Major selloff in progress. Avoid catching falling knife. Wait for reversal signals."
//     } else if (priceChange < -5) {
//       trend = "📉 Strong Bearish"
//       signal = "SELL"
//       confidence = 75
//       strategy = "Significant downward pressure. Consider shorting or exit positions. Look for support bounce."
//     } else if (priceChange < -2) {
//       trend = "🔴 Bearish"
//       signal = "SELL"
//       confidence = 65
//       strategy = "Negative momentum. Caution advised. Monitor key support levels closely."
//     } else {
//       strategy = "Consolidation phase. Wait for clear directional breakout. Low volatility period."
//     }

//     let riskLevel = "Medium"
//     if (Math.abs(priceChange) > 8) riskLevel = "High"
//     else if (Math.abs(priceChange) < 2) riskLevel = "Low"

//     return {
//       trend,
//       signal,
//       strategy,
//       confidence,
//       riskLevel,
//       support: support.toFixed(6),
//       resistance: resistance.toFixed(6),
//       volume: (volume / 1000000).toFixed(2) + "M",
//       volumeRatio: (volumeRatio * 100).toFixed(3) + "%",
//       athDistance: athDistance.toFixed(1) + "%",
//       rsi: Math.floor(Math.random() * 40) + 30, // Simulated RSI
//       //@ts-ignore
//       recommendation: getTradeRecommendation(signal, currentPrice, support, resistance),

//     }
//   }

//   const getTradeRecommendation = (signal: string, price: number, support: string, resistance: string) => {
//     const supportPrice = Number.parseFloat(support)
//     const resistancePrice = Number.parseFloat(resistance)

//     if (signal.includes("BUY")) {
//       return {
//         entry: `$${(price * 0.98).toFixed(6)} - $${price.toFixed(6)}`,
//         stopLoss: `$${supportPrice.toFixed(6)} (-${(((price - supportPrice) / price) * 100).toFixed(1)}%)`,
//         takeProfit: `$${resistancePrice.toFixed(6)} (+${(((resistancePrice - price) / price) * 100).toFixed(1)}%)`,
//         positionSize: "2-5% of portfolio",
//       }
//     } else if (signal.includes("SELL")) {
//       return {
//         entry: `$${price.toFixed(6)} - $${(price * 1.02).toFixed(6)}`,
//         stopLoss: `$${resistancePrice.toFixed(6)} (+${(((resistancePrice - price) / price) * 100).toFixed(1)}%)`,
//         takeProfit: `$${supportPrice.toFixed(6)} (-${(((price - supportPrice) / price) * 100).toFixed(1)}%)`,
//         positionSize: "1-3% of portfolio (short)",
//       }
//     } else {
//       return {
//         entry: "Wait for breakout",
//         stopLoss: "Set after entry confirmation",
//         takeProfit: "Target 15-25% move",
//         positionSize: "Reduce position size",
//       }
//     }
//   }

//   // ============================================================================
//   // DATA FILTERING AND PROCESSING - Search and categorization functions
//   // ============================================================================
//   const filteredCoins = coins.filter(
//     (coin) =>
//       coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   const topGainers = coins.filter((coin) => coin.price_change_percentage_24h > 0).slice(0, 5)
//   const topLosers = coins.filter((coin) => coin.price_change_percentage_24h < 0).slice(0, 5)

//   // ============================================================================
//   // RENDER COMPONENT - Main UI with cyberpunk styling
//   // ============================================================================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-green-400">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-30"></div>
//         <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-40"></div>
//         <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-20"></div>
//         <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-25"></div>
//         <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-35"></div>
//       </div>

//       <div className="flex h-screen">
//         {/* ============================================================================ */}
//         {/* SIDEBAR - Navigation and system information */}
//         {/* ============================================================================ */}
//         <div className="w-64 bg-slate-800/50 border-r border-green-500/30 backdrop-blur-sm">
//           <div className="p-6 border-b border-green-500/30">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
//                 <Bitcoin className="w-6 h-6 text-black" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-green-400">Lana-tRades</h1>
//                 <p className="text-xs text-green-400/70">Your personal Trader</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation Menu */}
//           <nav className="p-4 space-y-2">
//             <Button
//               variant={activeTab === "overview" ? "default" : "ghost"}
//               className={`w-full justify-start gap-3 ${
//                 activeTab === "overview"
//                   ? "bg-green-500/20 text-green-400 border border-green-500/50"
//                   : "text-green-400/70 hover:text-green-400 hover:bg-green-500/10"
//               }`}
//               onClick={() => setActiveTab("overview")}
//             >
//               <Home className="w-4 h-4" />
//               Market Overview
//             </Button>
//             <Button
//               variant={activeTab === "analysis" ? "default" : "ghost"}
//               className={`w-full justify-start gap-3 ${
//                 activeTab === "analysis"
//                   ? "bg-green-500/20 text-green-400 border border-green-500/50"
//                   : "text-green-400/70 hover:text-green-400 hover:bg-green-500/10"
//               }`}
//               onClick={() => setActiveTab("analysis")}
//             >
//               <Activity className="w-4 h-4" />
//               AI Analysis
//             </Button>
//             <Button
//               variant={activeTab === "chat" ? "default" : "ghost"}
//               className={`w-full justify-start gap-3 ${
//                 activeTab === "chat"
//                   ? "bg-green-500/20 text-green-400 border border-green-500/50"
//                   : "text-green-400/70 hover:text-green-400 hover:bg-green-500/10"
//               }`}
//               onClick={() => setActiveTab("chat")}
//             >
//               <Bot className="w-4 h-4" />
//               AI Assistant
//             </Button>
//           </nav>

//           {/* System Time Display */}
//           <div className="absolute bottom-4 left-4 right-4">
//             <Card className="bg-slate-700/50 border-green-500/30 p-4">
//               <div className="text-xs text-green-400/70 mb-2">⚡ SYSTEM TIME</div>
//               <div className="text-lg font-mono text-green-400">{currentTime.toLocaleTimeString()}</div>
//               <div className="text-xs text-green-400/50 mt-1">{currentTime.toLocaleDateString()}</div>
//             </Card>
//           </div>
//         </div>

//         {/* ============================================================================ */}
//         {/* MAIN CONTENT AREA - Dynamic content based on active tab */}
//         {/* ============================================================================ */}
//         <div className="flex-1 overflow-auto">
//           <div className="p-6">
//             {/* Header Section */}
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h1 className="text-3xl font-bold text-green-400 mb-2">Trade Smart. Even If You’ve Never Traded Before</h1>
//                 <p className="text-green-400/70">Advanced cryptocurrency analysis powered by AI intelligence</p>
//               </div>
//               {/* <Button className="bg-green-500 hover:bg-green-600 text-black px-6">Connect Wallet</Button> */}
//             </div>

//             {/* ============================================================================ */}
//             {/* MARKET OVERVIEW TAB - Real-time market data and statistics */}
//             {/* ============================================================================ */}
//             {activeTab === "overview" && (
//               <div className="space-y-6">
//                 {/* Market Statistics Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                   <Card className="bg-slate-800/50 border-green-500/30 p-6">
//                     <div className="flex items-center gap-3">
//                       <Bitcoin className="w-8 h-8 text-green-400" />
//                       <div>
//                         <p className="text-green-400/70 text-sm">Total Market Cap</p>
//                         <p className="text-xl font-bold text-green-400">
//                           ${(coins.reduce((acc, coin) => acc + coin.market_cap, 0) / 1000000000).toFixed(2)}B
//                         </p>
//                       </div>
//                     </div>
//                   </Card>
//                   <Card className="bg-slate-800/50 border-green-500/30 p-6">
//                     <div className="flex items-center gap-3">
//                       <Activity className="w-8 h-8 text-green-400" />
//                       <div>
//                         <p className="text-green-400/70 text-sm">24h Volume</p>
//                         <p className="text-xl font-bold text-green-400">
//                           ${(coins.reduce((acc, coin) => acc + coin.total_volume, 0) / 1000000000).toFixed(2)}B
//                         </p>
//                       </div>
//                     </div>
//                   </Card>
//                   <Card className="bg-slate-800/50 border-green-500/30 p-6">
//                     <div className="flex items-center gap-3">
//                       <Eye className="w-8 h-8 text-green-400" />
//                       <div>
//                         <p className="text-green-400/70 text-sm">Fear & Greed</p>
//                         <p className="text-xl font-bold text-green-400">{fearGreedIndex}/100</p>
//                         <p className="text-xs text-green-400/50">
//                           {fearGreedIndex < 25
//                             ? "Extreme Fear"
//                             : fearGreedIndex < 45
//                               ? "Fear"
//                               : fearGreedIndex < 55
//                                 ? "Neutral"
//                                 : fearGreedIndex < 75
//                                   ? "Greed"
//                                   : "Extreme Greed"}
//                         </p>
//                       </div>
//                     </div>
//                   </Card>
//                   <Card className="bg-slate-800/50 border-green-500/30 p-6">
//                     <div className="flex items-center gap-3">
//                       <DollarSign className="w-8 h-8 text-green-400" />
//                       <div>
//                         <p className="text-green-400/70 text-sm">Active Coins</p>
//                         <p className="text-xl font-bold text-green-400">{coins.length}</p>
//                       </div>
//                     </div>
//                   </Card>
//                 </div>

//                 {/* Search and Refresh Controls */}
//                 <div className="flex gap-4">
//                   <div className="flex-1 relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400/50" />
//                     <Input
//                       placeholder="Search cryptocurrencies..."
//                       className="pl-10 bg-slate-700 border-green-500/50 text-green-400 placeholder:text-green-400/50 focus:border-green-500"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
//                   <Button
//                     onClick={fetchCoinData}
//                     disabled={loading}
//                     className="bg-green-500 hover:bg-green-600 text-black px-6"
//                   >
//                     <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//                   </Button>
//                 </div>

//                 {/* Live Market Data Table */}
//                 <Card className="bg-slate-800/50 border-green-500/30">
//                   <div className="p-6">
//                     <h2 className="text-xl font-bold text-green-400 mb-4">📊 Live Market Data</h2>
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead>
//                           <tr className="border-b border-green-500/30">
//                             <th className="text-left py-3 text-green-400/70">Coin</th>
//                             <th className="text-right py-3 text-green-400/70">Price</th>
//                             <th className="text-right py-3 text-green-400/70">24h Change</th>
//                             <th className="text-right py-3 text-green-400/70">Market Cap</th>
//                             <th className="text-right py-3 text-green-400/70">Volume</th>
//                             <th className="text-center py-3 text-green-400/70">Action</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {filteredCoins.slice(0, 20).map((coin) => (
//                             <tr key={coin.id} className="border-b border-green-500/10 hover:bg-green-500/5">
//                               <td className="py-4">
//                                 <div className="flex items-center gap-3">
//                                   <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-8 h-8" />
//                                   <div>
//                                     <p className="font-semibold text-green-400">{coin.name}</p>
//                                     <p className="text-sm text-green-400/70">{coin.symbol.toUpperCase()}</p>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="text-right py-4 text-green-400">${coin.current_price.toLocaleString()}</td>
//                               <td className="text-right py-4">
//                                 <span
//                                   className={`flex items-center justify-end gap-1 ${
//                                     coin.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"
//                                   }`}
//                                 >
//                                   {coin.price_change_percentage_24h > 0 ? (
//                                     <ArrowUp className="w-4 h-4" />
//                                   ) : (
//                                     <ArrowDown className="w-4 h-4" />
//                                   )}
//                                   {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
//                                 </span>
//                               </td>
//                               <td className="text-right py-4 text-green-400">
//                                 ${(coin.market_cap / 1000000000).toFixed(2)}B
//                               </td>
//                               <td className="text-right py-4 text-green-400">
//                                 ${(coin.total_volume / 1000000).toFixed(0)}M
//                               </td>
//                               <td className="text-center py-4">
//                                 <Button
//                                   size="sm"
//                                   className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50"
//                                   onClick={() => setSelectedCoin(coin)}
//                                 >
//                                   Analyze
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </Card>

//                 {/* Top Gainers and Losers */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <Card className="bg-slate-800/50 border-green-500/30 p-6">
//                     <h3 className="text-lg font-bold text-green-400 mb-4">🚀 Top Gainers</h3>
//                     <div className="space-y-3">
//                       {topGainers.map((coin) => (
//                         <div key={coin.id} className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-6 h-6" />
//                             <span className="text-green-400">{coin.symbol.toUpperCase()}</span>
//                           </div>
//                           <span className="text-green-400">+{coin.price_change_percentage_24h.toFixed(2)}%</span>
//                         </div>
//                       ))}
//                     </div>
//                   </Card>

//                   <Card className="bg-slate-800/50 border-green-500/30 p-6">
//                     <h3 className="text-lg font-bold text-green-400 mb-4">📉 Top Losers</h3>
//                     <div className="space-y-3">
//                       {topLosers.map((coin) => (
//                         <div key={coin.id} className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-6 h-6" />
//                             <span className="text-green-400">{coin.symbol.toUpperCase()}</span>
//                           </div>
//                           <span className="text-red-400">{coin.price_change_percentage_24h.toFixed(2)}%</span>
//                         </div>
//                       ))}
//                     </div>
//                   </Card>
//                 </div>
//               </div>
//             )}

//             {/* ============================================================================ */}
//             {/* AI ANALYSIS TAB - Detailed cryptocurrency analysis with trading strategies */}
//             {/* ============================================================================ */}
//             {activeTab === "analysis" && (
//               <div className="space-y-6">
//                 {selectedCoin ? (
//                   <div className="space-y-6">
//                     {/* Selected Coin Header */}
//                     <Card className="bg-slate-800/50 border-green-500/30 p-6">
//                       <div className="flex items-center gap-4">
//                         <img
//                           src={selectedCoin.image || "/placeholder.svg"}
//                           alt={selectedCoin.name}
//                           className="w-16 h-16"
//                         />
//                         <div className="flex-1">
//                           <h2 className="text-2xl font-bold text-green-400">{selectedCoin.name}</h2>
//                           <p className="text-green-400/70">{selectedCoin.symbol.toUpperCase()}</p>
//                           <p className="text-3xl font-bold text-green-400 mt-2">
//                             ${selectedCoin.current_price.toLocaleString()}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-green-400/70 text-sm">24h Change</p>
//                           <p
//                             className={`text-2xl font-bold ${selectedCoin.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"}`}
//                           >
//                             {selectedCoin.price_change_percentage_24h > 0 ? "+" : ""}
//                             {selectedCoin.price_change_percentage_24h.toFixed(2)}%
//                           </p>
//                         </div>
//                       </div>
//                     </Card>

//                     {(() => {
//                       const analysis = getDetailedAnalysis(selectedCoin)
//                       return (
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                           {/* Technical Analysis Card */}
//                           <Card className="bg-slate-800/50 border-green-500/30 p-6">
//                             <h3 className="text-xl font-bold text-green-400 mb-4">🔍 Technical Analysis</h3>

//                             <div className="space-y-4">
//                               <div className="flex items-center justify-between">
//                                 <span className="text-green-400/70">Market Trend:</span>
//                                 <span className="font-bold text-green-400">{analysis.trend}</span>
//                               </div>

//                               <div className="flex items-center justify-between">
//                                 <span className="text-green-400/70">Signal:</span>
//                                 <span
//                                   className={`font-bold px-3 py-1 rounded text-sm ${
//                                     analysis.signal.includes("BUY")
//                                       ? "bg-green-500/20 text-green-400 border border-green-500/50"
//                                       : analysis.signal.includes("SELL")
//                                         ? "bg-red-500/20 text-red-400 border border-red-500/50"
//                                         : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
//                                   }`}
//                                 >
//                                   {analysis.signal}
//                                 </span>
//                               </div>

//                               <div className="flex items-center justify-between">
//                                 <span className="text-green-400/70">Confidence:</span>
//                                 <span className="font-bold text-green-400">{analysis.confidence}%</span>
//                               </div>

//                               <div className="flex items-center justify-between">
//                                 <span className="text-green-400/70">Risk Level:</span>
//                                 <span
//                                   className={`font-bold ${
//                                     analysis.riskLevel === "High"
//                                       ? "text-red-400"
//                                       : analysis.riskLevel === "Low"
//                                         ? "text-green-400"
//                                         : "text-yellow-400"
//                                   }`}
//                                 >
//                                   {analysis.riskLevel}
//                                 </span>
//                               </div>

//                               <div className="border-t border-green-500/30 pt-4 space-y-2">
//                                 <p className="text-green-400/70 font-semibold">Key Levels:</p>
//                                 <div className="ml-4 space-y-1">
//                                   <p className="text-green-400">• Support: ${analysis.support}</p>
//                                   <p className="text-green-400">• Resistance: ${analysis.resistance}</p>
//                                   <p className="text-green-400">• ATH Distance: {analysis.athDistance}</p>
//                                 </div>
//                               </div>

//                               <div className="border-t border-green-500/30 pt-4 space-y-2">
//                                 <p className="text-green-400/70 font-semibold">Technical Indicators:</p>
//                                 <div className="ml-4 space-y-1">
//                                   <p className="text-green-400">• RSI: {analysis.rsi}</p>
//                                   <p className="text-green-400">• 24h Volume: ${analysis.volume}</p>
//                                   <p className="text-green-400">• Volume Ratio: {analysis.volumeRatio}</p>
//                                 </div>
//                               </div>
//                             </div>
//                           </Card>

//                           {/* Trading Strategy Card */}
//                           <Card className="bg-slate-800/50 border-green-500/30 p-6">
//                             <h3 className="text-xl font-bold text-green-400 mb-4">📈 Trading Strategy</h3>

//                             <div className="space-y-4">
//                               <div>
//                                 <p className="text-green-400/70 font-semibold mb-2">Strategy Overview:</p>
//                                 <p className="text-green-400 bg-slate-700/50 p-4 rounded border border-green-500/30">
//                                   {analysis.strategy}
//                                 </p>
//                               </div>

//                               <div className="border-t border-green-500/30 pt-4">
//                                 <p className="text-green-400/70 font-semibold mb-3">Trade Setup:</p>
//                                 <div className="space-y-2">
//                                   <div className="flex justify-between">
//                                     <span className="text-green-400/70">Entry Zone:</span>
//                                     <span className="text-green-400 font-mono">{analysis.recommendation.entry}</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span className="text-green-400/70">Stop Loss:</span>
//                                     <span className="text-red-400 font-mono">{analysis.recommendation.stopLoss}</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span className="text-green-400/70">Take Profit:</span>
//                                     <span className="text-green-400 font-mono">
//                                       {analysis.recommendation.takeProfit}
//                                     </span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span className="text-green-400/70">Position Size:</span>
//                                     <span className="text-yellow-400">{analysis.recommendation.positionSize}</span>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="border-t border-green-500/30 pt-4">
//                                 <p className="text-green-400/70 font-semibold mb-2">Risk Management:</p>
//                                 <div className="text-green-400 bg-slate-700/50 p-4 rounded border border-green-500/30 space-y-2">
//                                   <p>• Never risk more than 2-3% per trade</p>
//                                   <p>• Use proper position sizing</p>
//                                   <p>• Set stop-losses before entering</p>
//                                   <p>• Take partial profits at targets</p>
//                                   <p>• Monitor market conditions closely</p>
//                                 </div>
//                               </div>
//                             </div>
//                           </Card>
//                         </div>
//                       )
//                     })()}
//                   </div>
//                 ) : (
//                   <Card className="bg-slate-800/50 border-green-500/30 p-12 text-center">
//                     <Activity className="w-16 h-16 text-green-400/50 mx-auto mb-4" />
//                     <h3 className="text-xl font-bold text-green-400 mb-2">Select a Cryptocurrency</h3>
//                     <p className="text-green-400/70">
//                       Choose a coin from the Market Overview to see detailed AI analysis with trading strategies
//                     </p>
//                   </Card>
//                 )}
//               </div>
//             )}

//             {/* ============================================================================ */}
//             {/* AI CHAT TAB - Interactive chat with Groq-powered AI assistant */}
//             {/* ============================================================================ */}
//             {activeTab === "chat" && (
//               <div className="space-y-6">
//                 <Card className="bg-slate-800/50 border-green-500/30">
//                   <div className="p-6 border-b border-green-500/30">
//                     <h2 className="text-xl font-bold text-green-400">🤖 AI Trading Assistant</h2>
//                     <p className="text-green-400/70 text-sm mt-2">
//                       Powered by advanced AI • Real-time market data • Expert trading insights
//                     </p>
//                   </div>

//                   {/* Chat Messages Container */}
//                   <div className="h-96 overflow-y-auto p-6 space-y-4">
//                     {chatMessages.map((message) => (
//                       <div
//                         key={message.id}
//                         className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
//                       >
//                         <div
//                           className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
//                         >
//                           <div
//                             className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                               message.role === "user" ? "bg-green-500" : "bg-slate-700 border border-green-500/50"
//                             }`}
//                           >
//                             {message.role === "user" ? (
//                               <User className="w-4 h-4 text-black" />
//                             ) : (
//                               <Bot className="w-4 h-4 text-green-400" />
//                             )}
//                           </div>
//                           <div
//                             className={`p-4 rounded-lg ${
//                               message.role === "user"
//                                 ? "bg-green-500/20 border border-green-500/50"
//                                 : "bg-slate-700/50 border border-green-500/30"
//                             }`}
//                           >
//                             <div className="text-green-400 text-sm whitespace-pre-wrap">{message.content}</div>
//                             <div className="text-green-400/50 text-xs mt-2">
//                               {message.timestamp.toLocaleTimeString()}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                     {/* Loading Animation */}
//                     {chatLoading && (
//                       <div className="flex gap-3 justify-start">
//                         <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 border border-green-500/50">
//                           <Bot className="w-4 h-4 text-green-400" />
//                         </div>
//                         <div className="bg-slate-700/50 border border-green-500/30 p-4 rounded-lg">
//                           <div className="flex gap-1">
//                             <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
//                             <div
//                               className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
//                               style={{ animationDelay: "0.1s" }}
//                             ></div>
//                             <div
//                               className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
//                               style={{ animationDelay: "0.2s" }}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Chat Input Section */}
//                   <div className="p-6 border-t border-green-500/30">
//                     <div className="flex gap-3">
//                       <Input
//                         placeholder="Ask me about crypto trading, market analysis, or specific coins..."
//                         className="flex-1 bg-slate-700 border-green-500/50 text-green-400 placeholder:text-green-400/50 focus:border-green-500"
//                         value={chatInput}
//                         onChange={(e) => setChatInput(e.target.value)}
//                         onKeyPress={(e) => e.key === "Enter" && !chatLoading && sendChatMessage()}
//                         disabled={chatLoading}
//                       />
//                       <Button
//                         className="bg-green-500 hover:bg-green-600 text-black px-6"
//                         onClick={sendChatMessage}
//                         disabled={chatLoading || !chatInput.trim()}
//                       >
//                         <Send className="w-4 h-4" />
//                       </Button>
//                     </div>
//                     <div className="mt-2 text-xs text-green-400/50">
//                       💡 Try asking: "Analyze Bitcoin", "What's the market sentiment?", "Best altcoins to buy?"
//                     </div>
//                   </div>
//                 </Card>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"
import { Input } from "./components/ui/input"
import {
  Home,
  Search,
  Bitcoin,
  DollarSign,
  Eye,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Activity,
  Bot,
  Send,
  User,
  Clock,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react"

// ============================================================================
// INTERFACES - Data structures for cryptocurrency and chat functionality
// ============================================================================
interface CoinData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  high_24h: number
  low_24h: number
  ath: number
  atl: number
  circulating_supply: number
  total_supply: number
  image: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// ============================================================================
// MAIN COMPONENT - Single-file crypto trading bot with AI chat integration
// ============================================================================
export default function CryptoBotDashboard() {
  // ============================================================================
  // STATE MANAGEMENT - All application state in one place
  // ============================================================================
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")
  const [coins, setCoins] = useState<CoinData[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null)
  const [fearGreedIndex, setFearGreedIndex] = useState(50)

  // Chat-specific state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  // ============================================================================
  // REAL-TIME DATA UPDATES - Automatic price and time updates
  // ============================================================================
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      if (activeTab === "overview") {
        fetchCoinData()
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(timer)
  }, [activeTab])

  // Initial data fetch on component mount
  useEffect(() => {
    fetchCoinData()
    fetchFearGreedIndex()
  }, [])

  // ============================================================================
  // API FUNCTIONS - External data fetching functions
  // ============================================================================

  // Fetch cryptocurrency market data from CoinGecko API
  const fetchCoinData = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
      )
      const data = await response.json()
      setCoins(data)
    } catch (error) {
      console.error("Error fetching coin data:", error)
    }
    setLoading(false)
  }

  // Fetch Fear & Greed Index for market sentiment
  const fetchFearGreedIndex = async () => {
    try {
      const response = await fetch("https://api.alternative.me/fng/")
      const data = await response.json()
      setFearGreedIndex(Number.parseInt(data.data[0].value))
    } catch (error) {
      console.error("Error fetching fear & greed index:", error)
    }
  }

  // ============================================================================
  // COMING SOON CHAT FUNCTIONALITY
  // ============================================================================
  const handleComingSoonChat = () => {
    if (!chatInput.trim()) return

    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setChatLoading(true)

    // Simulate response delay
    setTimeout(() => {
      const responses = [
        "🚀 Thank you for your interest! Our AI Chat Buddy is coming soon and will provide personalized trading advice!",
        "⏳ Coming Soon! Your personal AI trading assistant will analyze every market move and guide your decisions.",
        "🤖 Stay tuned! Our advanced AI buddy will tell you exactly what to do, when to buy, and when to sell.",
        "💡 Almost ready! Your AI companion will provide 24/7 trading guidance tailored to your investment style.",
        "🔮 Coming Soon! Get ready for AI-powered insights that will revolutionize your trading experience.",
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, assistantMessage])
      setChatLoading(false)
    }, 1500)
  }

  // ============================================================================
  // ADVANCED ANALYSIS ENGINE - Detailed cryptocurrency analysis with strategies
  // ============================================================================
  const getDetailedAnalysis = (coin: CoinData) => {
    const priceChange = coin.price_change_percentage_24h
    const volume = coin.total_volume
    const marketCap = coin.market_cap
    const currentPrice = coin.current_price

    const support = coin.low_24h * 0.995
    const resistance = coin.high_24h * 1.005
    const athDistance = ((coin.ath - currentPrice) / coin.ath) * 100
    const volumeRatio = volume / marketCap

    let trend = "Neutral"
    let signal = "HOLD"
    let strategy = ""
    let confidence = 50

    if (priceChange > 10) {
      trend = "🚀 Explosive Bullish"
      signal = "STRONG BUY"
      confidence = 85
      strategy = "Momentum breakout detected. Enter on pullbacks to 8-hour support. High volatility expected."
    } else if (priceChange > 5) {
      trend = "📈 Strong Bullish"
      signal = "BUY"
      confidence = 75
      strategy = "Strong upward momentum. Consider buying on minor dips. Set tight stop-losses."
    } else if (priceChange > 2) {
      trend = "🟢 Bullish"
      signal = "BUY"
      confidence = 65
      strategy = "Positive momentum building. Good entry point with proper risk management."
    } else if (priceChange < -10) {
      trend = "💥 Extreme Bearish"
      signal = "STRONG SELL"
      confidence = 85
      strategy = "Major selloff in progress. Avoid catching falling knife. Wait for reversal signals."
    } else if (priceChange < -5) {
      trend = "📉 Strong Bearish"
      signal = "SELL"
      confidence = 75
      strategy = "Significant downward pressure. Consider shorting or exit positions. Look for support bounce."
    } else if (priceChange < -2) {
      trend = "🔴 Bearish"
      signal = "SELL"
      confidence = 65
      strategy = "Negative momentum. Caution advised. Monitor key support levels closely."
    } else {
      strategy = "Consolidation phase. Wait for clear directional breakout. Low volatility period."
    }

    let riskLevel = "Medium"
    if (Math.abs(priceChange) > 8) riskLevel = "High"
    else if (Math.abs(priceChange) < 2) riskLevel = "Low"

    return {
      trend,
      signal,
      strategy,
      confidence,
      riskLevel,
      support: support.toFixed(6),
      resistance: resistance.toFixed(6),
      volume: (volume / 1000000).toFixed(2) + "M",
      volumeRatio: (volumeRatio * 100).toFixed(3) + "%",
      athDistance: athDistance.toFixed(1) + "%",
      rsi: Math.floor(Math.random() * 40) + 30, // Simulated RSI
      //@ts-ignore
      recommendation: getTradeRecommendation(signal, currentPrice, support, resistance),

    }
  }

  const getTradeRecommendation = (signal: string, price: number, support: string, resistance: string) => {
    const supportPrice = Number.parseFloat(support)
    const resistancePrice = Number.parseFloat(resistance)

    if (signal.includes("BUY")) {
      return {
        entry: `$${(price * 0.98).toFixed(6)} - $${price.toFixed(6)}`,
        stopLoss: `$${supportPrice.toFixed(6)} (-${(((price - supportPrice) / price) * 100).toFixed(1)}%)`,
        takeProfit: `$${resistancePrice.toFixed(6)} (+${(((resistancePrice - price) / price) * 100).toFixed(1)}%)`,
        positionSize: "2-5% of portfolio",
      }
    } else if (signal.includes("SELL")) {
      return {
        entry: `$${price.toFixed(6)} - $${(price * 1.02).toFixed(6)}`,
        stopLoss: `$${resistancePrice.toFixed(6)} (+${(((resistancePrice - price) / price) * 100).toFixed(1)}%)`,
        takeProfit: `$${supportPrice.toFixed(6)} (-${(((price - supportPrice) / price) * 100).toFixed(1)}%)`,
        positionSize: "1-3% of portfolio (short)",
      }
    } else {
      return {
        entry: "Wait for breakout",
        stopLoss: "Set after entry confirmation",
        takeProfit: "Target 15-25% move",
        positionSize: "Reduce position size",
      }
    }
  }

  // ============================================================================
  // DATA FILTERING AND PROCESSING - Search and categorization functions
  // ============================================================================
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const topGainers = coins.filter((coin) => coin.price_change_percentage_24h > 0).slice(0, 5)
  const topLosers = coins.filter((coin) => coin.price_change_percentage_24h < 0).slice(0, 5)

  // ============================================================================
  // RENDER COMPONENT - Main UI with cyberpunk styling
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-green-400">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-25"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-35"></div>
      </div>

      <div className="flex h-screen">
        {/* ============================================================================ */}
        {/* SIDEBAR - Navigation and system information */}
        {/* ============================================================================ */}
        <div className="w-64 bg-slate-800/50 border-r border-green-500/30 backdrop-blur-sm">
          <div className="p-6 border-b border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-green-400">Lana-tRades</h1>
                <p className="text-xs text-green-400/70">Your personal Trader</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                activeTab === "overview"
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : "text-green-400/70 hover:text-green-400 hover:bg-green-500/10"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <Home className="w-4 h-4" />
              Market Overview
            </Button>
            <Button
              variant={activeTab === "analysis" ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                activeTab === "analysis"
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : "text-green-400/70 hover:text-green-400 hover:bg-green-500/10"
              }`}
              onClick={() => setActiveTab("analysis")}
            >
              <Activity className="w-4 h-4" />
              AI Analysis
            </Button>
            <Button
              variant={activeTab === "chat" ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                activeTab === "chat"
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : "text-green-400/70 hover:text-green-400 hover:bg-green-500/10"
              }`}
              onClick={() => setActiveTab("chat")}
            >
              <Bot className="w-4 h-4" />
              AI Assistant
              <div className="ml-auto">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </Button>
          </nav>

          {/* System Time Display */}
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="bg-slate-700/50 border-green-500/30 p-4">
              <div className="text-xs text-green-400/70 mb-2">⚡ SYSTEM TIME</div>
              <div className="text-lg font-mono text-green-400">{currentTime.toLocaleTimeString()}</div>
              <div className="text-xs text-green-400/50 mt-1">{currentTime.toLocaleDateString()}</div>
            </Card>
          </div>
        </div>

        {/* ============================================================================ */}
        {/* MAIN CONTENT AREA - Dynamic content based on active tab */}
        {/* ============================================================================ */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-green-400 mb-2">Trade Smart. Even If You've Never Traded Before</h1>
                <p className="text-green-400/70">Advanced cryptocurrency analysis powered by AI intelligence</p>
              </div>
            </div>

            {/* ============================================================================ */}
            {/* MARKET OVERVIEW TAB - Real-time market data and statistics */}
            {/* ============================================================================ */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Market Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="bg-slate-800/50 border-green-500/30 p-6">
                    <div className="flex items-center gap-3">
                      <Bitcoin className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-green-400/70 text-sm">Total Market Cap</p>
                        <p className="text-xl font-bold text-green-400">
                          ${(coins.reduce((acc, coin) => acc + coin.market_cap, 0) / 1000000000).toFixed(2)}B
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-slate-800/50 border-green-500/30 p-6">
                    <div className="flex items-center gap-3">
                      <Activity className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-green-400/70 text-sm">24h Volume</p>
                        <p className="text-xl font-bold text-green-400">
                          ${(coins.reduce((acc, coin) => acc + coin.total_volume, 0) / 1000000000).toFixed(2)}B
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-slate-800/50 border-green-500/30 p-6">
                    <div className="flex items-center gap-3">
                      <Eye className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-green-400/70 text-sm">Fear & Greed</p>
                        <p className="text-xl font-bold text-green-400">{fearGreedIndex}/100</p>
                        <p className="text-xs text-green-400/50">
                          {fearGreedIndex < 25
                            ? "Extreme Fear"
                            : fearGreedIndex < 45
                              ? "Fear"
                              : fearGreedIndex < 55
                                ? "Neutral"
                                : fearGreedIndex < 75
                                  ? "Greed"
                                  : "Extreme Greed"}
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-slate-800/50 border-green-500/30 p-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-green-400/70 text-sm">Active Coins</p>
                        <p className="text-xl font-bold text-green-400">{coins.length}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Search and Refresh Controls */}
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400/50" />
                    <Input
                      placeholder="Search cryptocurrencies..."
                      className="pl-10 bg-slate-700 border-green-500/50 text-green-400 placeholder:text-green-400/50 focus:border-green-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={fetchCoinData}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-black px-6"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  </Button>
                </div>

                {/* Live Market Data Table */}
                <Card className="bg-slate-800/50 border-green-500/30">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-green-400 mb-4">📊 Live Market Data</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-green-500/30">
                            <th className="text-left py-3 text-green-400/70">Coin</th>
                            <th className="text-right py-3 text-green-400/70">Price</th>
                            <th className="text-right py-3 text-green-400/70">24h Change</th>
                            <th className="text-right py-3 text-green-400/70">Market Cap</th>
                            <th className="text-right py-3 text-green-400/70">Volume</th>
                            <th className="text-center py-3 text-green-400/70">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCoins.slice(0, 20).map((coin) => (
                            <tr key={coin.id} className="border-b border-green-500/10 hover:bg-green-500/5">
                              <td className="py-4">
                                <div className="flex items-center gap-3">
                                  <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-8 h-8" />
                                  <div>
                                    <p className="font-semibold text-green-400">{coin.name}</p>
                                    <p className="text-sm text-green-400/70">{coin.symbol.toUpperCase()}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="text-right py-4 text-green-400">${coin.current_price.toLocaleString()}</td>
                              <td className="text-right py-4">
                                <span
                                  className={`flex items-center justify-end gap-1 ${
                                    coin.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"
                                  }`}
                                >
                                  {coin.price_change_percentage_24h > 0 ? (
                                    <ArrowUp className="w-4 h-4" />
                                  ) : (
                                    <ArrowDown className="w-4 h-4" />
                                  )}
                                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                </span>
                              </td>
                              <td className="text-right py-4 text-green-400">
                                ${(coin.market_cap / 1000000000).toFixed(2)}B
                              </td>
                              <td className="text-right py-4 text-green-400">
                                ${(coin.total_volume / 1000000).toFixed(0)}M
                              </td>
                              <td className="text-center py-4">
                                <Button
                                  size="sm"
                                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50"
                                  onClick={() => setSelectedCoin(coin)}
                                >
                                  Analyze
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>

                {/* Top Gainers and Losers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-green-500/30 p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4">🚀 Top Gainers</h3>
                    <div className="space-y-3">
                      {topGainers.map((coin) => (
                        <div key={coin.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-6 h-6" />
                            <span className="text-green-400">{coin.symbol.toUpperCase()}</span>
                          </div>
                          <span className="text-green-400">+{coin.price_change_percentage_24h.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="bg-slate-800/50 border-green-500/30 p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4">📉 Top Losers</h3>
                    <div className="space-y-3">
                      {topLosers.map((coin) => (
                        <div key={coin.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-6 h-6" />
                            <span className="text-green-400">{coin.symbol.toUpperCase()}</span>
                          </div>
                          <span className="text-red-400">{coin.price_change_percentage_24h.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* ============================================================================ */}
            {/* AI ANALYSIS TAB - Detailed cryptocurrency analysis with trading strategies */}
            {/* ============================================================================ */}
            {activeTab === "analysis" && (
              <div className="space-y-6">
                {selectedCoin ? (
                  <div className="space-y-6">
                    {/* Selected Coin Header */}
                    <Card className="bg-slate-800/50 border-green-500/30 p-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={selectedCoin.image || "/placeholder.svg"}
                          alt={selectedCoin.name}
                          className="w-16 h-16"
                        />
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-green-400">{selectedCoin.name}</h2>
                          <p className="text-green-400/70">{selectedCoin.symbol.toUpperCase()}</p>
                          <p className="text-3xl font-bold text-green-400 mt-2">
                            ${selectedCoin.current_price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400/70 text-sm">24h Change</p>
                          <p
                            className={`text-2xl font-bold ${selectedCoin.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {selectedCoin.price_change_percentage_24h > 0 ? "+" : ""}
                            {selectedCoin.price_change_percentage_24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </Card>

                    {(() => {
                      const analysis = getDetailedAnalysis(selectedCoin)
                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Technical Analysis Card */}
                          <Card className="bg-slate-800/50 border-green-500/30 p-6">
                            <h3 className="text-xl font-bold text-green-400 mb-4">🔍 Technical Analysis</h3>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-green-400/70">Market Trend:</span>
                                <span className="font-bold text-green-400">{analysis.trend}</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-green-400/70">Signal:</span>
                                <span
                                  className={`font-bold px-3 py-1 rounded text-sm ${
                                    analysis.signal.includes("BUY")
                                      ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                      : analysis.signal.includes("SELL")
                                        ? "bg-red-500/20 text-red-400 border border-red-500/50"
                                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                                  }`}
                                >
                                  {analysis.signal}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-green-400/70">Confidence:</span>
                                <span className="font-bold text-green-400">{analysis.confidence}%</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-green-400/70">Risk Level:</span>
                                <span
                                  className={`font-bold ${
                                    analysis.riskLevel === "High"
                                      ? "text-red-400"
                                      : analysis.riskLevel === "Low"
                                        ? "text-green-400"
                                        : "text-yellow-400"
                                  }`}
                                >
                                  {analysis.riskLevel}
                                </span>
                              </div>

                              <div className="border-t border-green-500/30 pt-4 space-y-2">
                                <p className="text-green-400/70 font-semibold">Key Levels:</p>
                                <div className="ml-4 space-y-1">
                                  <p className="text-green-400">• Support: ${analysis.support}</p>
                                  <p className="text-green-400">• Resistance: ${analysis.resistance}</p>
                                  <p className="text-green-400">• ATH Distance: {analysis.athDistance}</p>
                                </div>
                              </div>

                              <div className="border-t border-green-500/30 pt-4 space-y-2">
                                <p className="text-green-400/70 font-semibold">Technical Indicators:</p>
                                <div className="ml-4 space-y-1">
                                  <p className="text-green-400">• RSI: {analysis.rsi}</p>
                                  <p className="text-green-400">• 24h Volume: ${analysis.volume}</p>
                                  <p className="text-green-400">• Volume Ratio: {analysis.volumeRatio}</p>
                                </div>
                              </div>
                            </div>
                          </Card>

                          {/* Trading Strategy Card */}
                          <Card className="bg-slate-800/50 border-green-500/30 p-6">
                            <h3 className="text-xl font-bold text-green-400 mb-4">📈 Trading Strategy</h3>

                            <div className="space-y-4">
                              <div>
                                <p className="text-green-400/70 font-semibold mb-2">Strategy Overview:</p>
                                <p className="text-green-400 bg-slate-700/50 p-4 rounded border border-green-500/30">
                                  {analysis.strategy}
                                </p>
                              </div>

                              <div className="border-t border-green-500/30 pt-4">
                                <p className="text-green-400/70 font-semibold mb-3">Trade Setup:</p>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-green-400/70">Entry Zone:</span>
                                    <span className="text-green-400 font-mono">{analysis.recommendation.entry}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-green-400/70">Stop Loss:</span>
                                    <span className="text-red-400 font-mono">{analysis.recommendation.stopLoss}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-green-400/70">Take Profit:</span>
                                    <span className="text-green-400 font-mono">
                                      {analysis.recommendation.takeProfit}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-green-400/70">Position Size:</span>
                                    <span className="text-yellow-400">{analysis.recommendation.positionSize}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="border-t border-green-500/30 pt-4">
                                <p className="text-green-400/70 font-semibold mb-2">Risk Management:</p>
                                <div className="text-green-400 bg-slate-700/50 p-4 rounded border border-green-500/30 space-y-2">
                                  <p>• Never risk more than 2-3% per trade</p>
                                  <p>• Use proper position sizing</p>
                                  <p>• Set stop-losses before entering</p>
                                  <p>• Take partial profits at targets</p>
                                  <p>• Monitor market conditions closely</p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )
                    })()}
                  </div>
                ) : (
                  <Card className="bg-slate-800/50 border-green-500/30 p-12 text-center">
                    <Activity className="w-16 h-16 text-green-400/50 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-400 mb-2">Select a Cryptocurrency</h3>
                    <p className="text-green-400/70">
                      Choose a coin from the Market Overview to see detailed AI analysis with trading strategies
                    </p>
                  </Card>
                )}
              </div>
            )}

            {/* ============================================================================ */}
            {/* AI CHAT TAB - Coming Soon with Interactive Preview */}
            {/* ============================================================================ */}
            {activeTab === "chat" && (
              <div className="space-y-6">
                {/* Coming Soon Hero Section */}
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-green-500/30 overflow-hidden">
                  <div className="relative p-8">
                    {/* Animated background elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-green-500/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-500/20 rounded-full animate-bounce"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <Bot className="w-20 h-20 text-green-400" />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                            <Sparkles className="w-4 h-4 text-black" />
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="text-4xl font-bold text-green-400 mb-4">🚀 AI Chat Buddy Coming Soon!</h2>
                      <p className="text-xl text-green-400/80 mb-6 max-w-2xl mx-auto">
                        Your personal AI trading companion that will revolutionize how you trade cryptocurrencies
                      </p>
                      
                      <div className="flex items-center justify-center gap-2 text-yellow-400 font-semibold">
                        <Clock className="w-5 h-5 animate-spin" />
                        <span>Coming Very Soon...</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-slate-800/50 border-green-500/30 p-6 hover:border-green-400/50 transition-colors">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-green-400 mb-2">Smart Trading Signals</h3>
                      <p className="text-green-400/70 text-sm">
                        Get instant buy/sell recommendations based on real-time market analysis and AI predictions
                      </p>
                    </div>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-green-500/30 p-6 hover:border-green-400/50 transition-colors">
                    <div className="text-center">
                      <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-green-400 mb-2">Risk Management</h3>
                      <p className="text-green-400/70 text-sm">
                        Your AI buddy will tell you exactly when to enter, exit, and how much to invest safely
                      </p>
                    </div>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-green-500/30 p-6 hover:border-green-400/50 transition-colors">
                    <div className="text-center">
                      <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-green-400 mb-2">24/7 Guidance</h3>
                      <p className="text-green-400/70 text-sm">
                        Never trade alone again - your AI companion works around the clock to guide your decisions
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Interactive Chat Preview */}
                <Card className="bg-slate-800/50 border-green-500/30">
                  <div className="p-6 border-b border-green-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-green-400">🤖 Chat Preview - Try It Now!</h2>
                        <p className="text-green-400/70 text-sm mt-2">
                          Get a taste of what's coming - your messages will receive preview responses
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-400 text-sm">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span>Preview Mode</span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages Container */}
                  <div className="h-80 overflow-y-auto p-6 space-y-4">
                    {/* Welcome Message */}
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 border border-green-500/50">
                        <Bot className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="bg-slate-700/50 border border-green-500/30 p-4 rounded-lg max-w-[85%]">
                        <div className="text-green-400 text-sm">
                          🚀 <strong>Coming Soon!</strong> I'm your AI Trading Buddy who will:
                          
                          <div className="mt-3 space-y-1">
                            <div>📊 <strong>Analyze every coin</strong> in real-time</div>
                            <div>💡 <strong>Tell you exactly what to do</strong> - when to buy, sell, or hold</div>
                            <div>⚠️ <strong>Manage your risks</strong> - never lose more than you can afford</div>
                            <div>🎯 <strong>Personalize strategies</strong> based on your trading style</div>
                            <div>📈 <strong>Guide beginners</strong> step-by-step to profitable trading</div>
                          </div>

                          <div className="mt-4 p-3 bg-green-500/10 rounded border border-green-500/30">
                            <strong>Try the preview below!</strong> Ask me anything about crypto trading and get a sneak peek of what's coming! 🎉
                          </div>
                        </div>
                        <div className="text-green-400/50 text-xs mt-2">
                          Preview Mode • {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {/* Display chat messages */}
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.role === "user" ? "bg-green-500" : "bg-slate-700 border border-green-500/50"
                            }`}
                          >
                            {message.role === "user" ? (
                              <User className="w-4 h-4 text-black" />
                            ) : (
                              <Bot className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <div
                            className={`p-4 rounded-lg ${
                              message.role === "user"
                                ? "bg-green-500/20 border border-green-500/50"
                                : "bg-slate-700/50 border border-green-500/30"
                            }`}
                          >
                            <div className="text-green-400 text-sm whitespace-pre-wrap">{message.content}</div>
                            <div className="text-green-400/50 text-xs mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Loading Animation */}
                    {chatLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 border border-green-500/50">
                          <Bot className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="bg-slate-700/50 border border-green-500/30 p-4 rounded-lg">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input Section */}
                  <div className="p-6 border-t border-green-500/30">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Try asking: 'Should I buy Bitcoin?', 'What's the best strategy?', 'Help me get started'..."
                        className="flex-1 bg-slate-700 border-green-500/50 text-green-400 placeholder:text-green-400/50 focus:border-green-500"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && !chatLoading && handleComingSoonChat()}
                        disabled={chatLoading}
                      />
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-black px-6"
                        onClick={handleComingSoonChat}
                        disabled={chatLoading || !chatInput.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <div className="text-green-400/50">
                        💡 This is a preview - the full AI buddy will have much more advanced capabilities!
                      </div>
                      <div className="flex items-center gap-2 text-yellow-400">
                        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span>Preview Mode</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Call to Action */}
                <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 p-8 text-center">
                  <h3 className="text-2xl font-bold text-green-400 mb-4">🎯 What Makes Our AI Buddy Special?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div>
                          <strong className="text-green-400">Perfect for Beginners:</strong>
                          <span className="text-green-400/80"> Never traded before? No problem! Your AI buddy will teach you everything step-by-step.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div>
                          <strong className="text-green-400">Smart Risk Management:</strong>
                          <span className="text-green-400/80"> Never lose more than you can afford. Your buddy calculates the perfect position sizes.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div>
                          <strong className="text-green-400">Real-Time Alerts:</strong>
                          <span className="text-green-400/80"> Get instant notifications when it's time to buy, sell, or take action.</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div>
                          <strong className="text-green-400">Personalized Strategies:</strong>
                          <span className="text-green-400/80"> Your buddy adapts to your risk tolerance and trading goals.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div>
                          <strong className="text-green-400">24/7 Support:</strong>
                          <span className="text-green-400/80"> Markets never sleep, and neither does your AI companion.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div>
                          <strong className="text-green-400">Emotional Control:</strong>
                          <span className="text-green-400/80"> Your buddy keeps you calm and disciplined during market volatility.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-slate-800/50 rounded-lg border border-green-500/30">
                    <h4 className="text-lg font-bold text-green-400 mb-3">🔥 Coming Very Soon!</h4>
                    <p className="text-green-400/80">
                      We're putting the finishing touches on your AI Trading Buddy. Soon you'll have a personal crypto expert 
                      available 24/7 to guide every trading decision and help you build wealth in the crypto markets!
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}