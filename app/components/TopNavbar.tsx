// "use client"
// import React, { useState } from "react";
// import { Search, Bell, Wallet, ChevronDown, LogOut, User, Settings, HelpCircle } from "lucide-react";

// const TopNavbar = () => {
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isNavHovered, setIsNavHovered] = useState(false);
  
//   // Mock wallet connection state
//   const [isConnected, setIsConnected] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
  
//   // Mock account data
//   const account = "0x1234...5678";
//   const balance = "1.25";
//   const alxBalance = "150.5";

//   const notifications = [
//     { id: 1, message: "New transaction confirmed", time: "2 min ago", unread: true },
//     { id: 2, message: "Wallet connected successfully", time: "1 hour ago", unread: true },
//     { id: 3, message: "Price alert: ETH above $2,500", time: "3 hours ago", unread: false },
//     { id: 4, message: "Weekly portfolio summary ready", time: "1 day ago", unread: false },
//     { id: 5, message: "New DeFi opportunity available", time: "2 days ago", unread: false }
//   ];

//   const unreadCount = notifications.filter(n => n.unread).length;

//   const handleConnect = () => {
//     setIsConnecting(true);
//     setTimeout(() => {
//       setIsConnected(true);
//       setIsConnecting(false);
//     }, 2000);
//   };

//   const handleDisconnect = () => {
//     setIsConnected(false);
//     setShowUserMenu(false);
//   };

//   const handleSearch = (e:any) => {
//     if (e.key === 'Enter' && searchQuery.trim()) {
//       console.log("Searching for:", searchQuery);
//     }
//   };

//   return (
//     <header 
//       className={`w-full h-[9%] border-b border-green-500/30 px-6 flex items-center justify-between sticky top-0 z-50 transition-all duration-500   ${
//         isNavHovered 
//           ? 'bg-gradient-to-r from-green-800/90 via-green-700/85 to-emerald-800/90 backdrop-blur-lg shadow-lg shadow-green-400/30' 
//           : 'bg-black/60 backdrop-blur-sm'
//       }`}
//       onMouseEnter={() => setIsNavHovered(true)}
//       onMouseLeave={() => setIsNavHovered(false)}
//               style={{
//         backgroundImage: isNavHovered 
//           ? 'radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), linear-gradient(90deg, rgba(5, 150, 105, 0.2) 0%, rgba(34, 197, 94, 0.2) 50%, rgba(16, 185, 129, 0.2) 100%)'
//           : 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(16, 16, 16, 0.6) 100%)'
//       }}
//     >
//       {/* Cyberpunk grid overlay */}
//       <div className={`absolute inset-0 opacity-20 transition-opacity duration-500 ${isNavHovered ? 'opacity-30' : 'opacity-10'}`}
//         style={{
//           backgroundImage: `
//             linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
//           `,
//           backgroundSize: '20px 20px'
//         }}
//       ></div>

//       {/* Animated cyber lines */}
//       <div className={`absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent transition-opacity duration-500 ${isNavHovered ? 'opacity-60 w-full' : 'opacity-0 w-0'}`}></div>
//       <div className={`absolute bottom-0 right-0 h-px bg-gradient-to-l from-transparent via-emerald-400 to-transparent transition-opacity duration-500 ${isNavHovered ? 'opacity-40 w-3/4' : 'opacity-0 w-0'}`}></div>

//       {/* Search Bar */}
//       <div className="flex-1 max-w-md relative z-10">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             placeholder="Search AI models, prompts, creators..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyDown={handleSearch}
//             className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600/50 rounded-lg focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 outline-none transition-all text-white text-sm placeholder-gray-400"
//           />
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center space-x-4 relative z-10">
//         {/* Notifications */}
//         <div className="relative">
//           <button
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="relative p-2 text-gray-400 hover:text-white transition-colors"
//           >
//             <Bell className="h-5 w-5" />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-0 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           {/* Notifications Dropdown */}
//           {showNotifications && (
//             <div className="absolute z-[100] right-0 top-12 w-80 bg-gray-900/95 border border-gray-700 rounded-lg shadow-xl  backdrop-blur-md">
//               <div className="p-4 border-b border-gray-700">
//                 <h3 className="font-semibold text-white">Notifications</h3>
//               </div>
//               <div className="max-h-96 overflow-y-auto">
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`p-4 border-b border-gray-700/50 hover:bg-gray-800/50 cursor-pointer transition-all ${
//                       notification.unread ? 'bg-gray-800/30' : ''
//                     }`}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <p className={`text-sm ${notification.unread ? 'font-medium text-white' : 'text-gray-300'}`}>
//                           {notification.message}
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
//                       </div>
//                       {notification.unread && (
//                         <div className="w-2 h-2 bg-blue-400 rounded-full ml-2 mt-1"></div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="p-3 border-t border-gray-700">
//                 <button className="text-sm text-gray-400 hover:text-white font-medium">
//                   View all notifications
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Wallet Connection */}
//         {isConnected ? (
//           <div className="flex items-center space-x-3">
//             {/* Balances */}
//             <div className="hidden md:flex items-center space-x-2">
//               <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-medium border border-blue-500/30">
//                 {balance} MATIC
//               </span>
//               <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-medium border border-green-500/30">
//                 {alxBalance} ALX
//               </span>
//             </div>

//             {/* User Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowUserMenu(!showUserMenu)}
//                 className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-gray-800/50 rounded-lg transition-colors"
//               >
//                 <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
//                   {account.slice(2, 4).toUpperCase()}
//                 </div>
//                 <div className="hidden md:block text-left">
//                   <div className="text-sm font-medium">
//                     {account.slice(0, 6)}...{account.slice(-4)}
//                   </div>
//                   <div className="text-xs text-gray-400">Connected</div>
//                 </div>
//                 <ChevronDown className="h-4 w-4 text-gray-400" />
//               </button>

//               {/* User Dropdown */}
//               {showUserMenu && (
//                 <div className="absolute right-0 top-12 w-56 bg-gray-900/95 border border-gray-700 rounded-lg shadow-xl z-50 backdrop-blur-md">
//                   <div className="p-3 border-b border-gray-700">
//                     <div className="text-sm font-medium text-white">My Account</div>
//                   </div>
//                   <div className="py-1">
//                     <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors flex items-center">
//                       <User className="mr-2 h-4 w-4" />
//                       Profile
//                     </button>
//                     <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors flex items-center">
//                       <Settings className="mr-2 h-4 w-4" />
//                       Settings
//                     </button>
//                     <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors flex items-center">
//                       <HelpCircle className="mr-2 h-4 w-4" />
//                       Help & Support
//                     </button>
//                   </div>
//                   <div className="border-t border-gray-700 py-1">
//                     <button 
//                       onClick={handleDisconnect}
//                       className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800/50 hover:text-red-300 transition-colors flex items-center"
//                     >
//                       <LogOut className="mr-2 h-4 w-4" />
//                       Disconnect Wallet
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <button 
//             onClick={handleConnect} 
//             disabled={isConnecting}
//             className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-all font-medium"
//           >
//             <Wallet className="h-4 w-4" />
//             {isConnecting ? "Connecting..." : "Connect Wallet"}
//           </button>
//         )}
//       </div>

//       {/* Backdrop for closing dropdowns */}
//       {(showNotifications || showUserMenu) && (
//         <div
//           className="fixed inset-0 z-40"
//           onClick={() => {
//             setShowNotifications(false);
//             setShowUserMenu(false);
//           }}
//         ></div>
//       )}
//     </header>
//   );
// };

// export default TopNavbar;



//  version 2 

"use client"
import React, { useState } from "react";
import { Search, Bell, Wallet, ChevronDown, LogOut, User, Settings, HelpCircle } from "lucide-react";

const TopNavbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavHovered, setIsNavHovered] = useState(false);
  
  // Mock wallet connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Mock account data
  const account = "0x1234...5678";
  const balance = "1.25";
  const alxBalance = "150.5";

  const notifications = [
    { id: 1, message: "New transaction confirmed", time: "2 min ago", unread: true },
    { id: 2, message: "Wallet connected successfully", time: "1 hour ago", unread: true },
    { id: 3, message: "Price alert: ETH above $2,500", time: "3 hours ago", unread: false },
    { id: 4, message: "Weekly portfolio summary ready", time: "1 day ago", unread: false },
    { id: 5, message: "New DeFi opportunity available", time: "2 days ago", unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setShowUserMenu(false);
  };

  const handleSearch = (e: any) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <header 
      className="w-full h-[9%] border-b border-purple-800/50 px-6 flex items-center justify-between sticky top-0 z-50 transition-all duration-500 backdrop-blur-sm bg-black/60"
      onMouseEnter={() => setIsNavHovered(true)}
      onMouseLeave={() => setIsNavHovered(false)}
      style={{
        backgroundImage: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(16, 16, 16, 0.6) 100%)',
        boxShadow: isNavHovered 
          ? '0 0 50px rgba(76,201,255,0.4), 0 0 100px rgba(0,255,240,0.2), 0 0 150px rgba(122,92,255,0.15)'
          : '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >
      {/* Subtle grid overlay */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isNavHovered ? 'opacity-20' : 'opacity-10'}`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(76,201,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,240,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      ></div>

      {/* Subtle edge glow lines */}
      <div className={`absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-[#4cc9ff] to-transparent transition-all duration-500 ${isNavHovered ? 'opacity-60 w-full' : 'opacity-0 w-0'}`}></div>
      <div className={`absolute bottom-0 right-0 h-px bg-gradient-to-l from-transparent via-[#00fff0] to-transparent transition-all duration-500 ${isNavHovered ? 'opacity-40 w-3/4' : 'opacity-0 w-0'}`}></div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md relative z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <input
            placeholder="Search AI models, prompts, creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/40 border-b-[2px] rounded-lg focus:ring-2 focus:ring-[#4cc9ff]/50 focus:border-[#4cc9ff]/50 outline-none transition-all text-white text-sm placeholder-white/40 backdrop-blur-sm hover:border-[#00fff0]/30"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 relative z-10">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-white/70 hover:text-[#4cc9ff] transition-all duration-300 rounded-lg hover:bg-white/5 backdrop-blur-sm"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-0 bg-gradient-to-r from-[#4cc9ff] to-[#7a5cff] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-[0_0_8px_rgba(76,201,255,0.6)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute z-[100] right-0 top-12 w-80 bg-black/80 border border-white/10 rounded-lg shadow-[0_0_40px_rgba(76,201,255,0.3)] backdrop-blur-md">
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#4cc9ff]/10 to-[#7a5cff]/10">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-white/5 hover:bg-gradient-to-r hover:from-[#4cc9ff]/10 hover:to-[#7a5cff]/10 cursor-pointer transition-all ${
                      notification.unread ? 'bg-gradient-to-r from-[#4cc9ff]/10 to-transparent' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-sm ${notification.unread ? 'font-medium text-white' : 'text-white/70'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-white/40 mt-1">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-[#4cc9ff] rounded-full ml-2 mt-1 shadow-[0_0_4px_rgba(76,201,255,0.8)]"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/10">
                <button className="text-sm text-white/50 hover:text-[#4cc9ff] font-medium transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wallet Connection */}
        {isConnected ? (
          <div className="flex items-center space-x-3">
            {/* Balances */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="bg-gradient-to-r from-[#4cc9ff]/20 to-[#7a5cff]/20 text-[#4cc9ff] px-3 py-1.5 rounded-lg text-xs font-medium border border-[#4cc9ff]/30 backdrop-blur-sm shadow-[0_0_10px_rgba(76,201,255,0.3)]">
                {balance} MATIC
              </span>
              <span className="bg-gradient-to-r from-[#00fff0]/20 to-[#4cc9ff]/20 text-[#00fff0] px-3 py-1.5 rounded-lg text-xs font-medium border border-[#00fff0]/30 backdrop-blur-sm shadow-[0_0_10px_rgba(0,255,240,0.3)]">
                {alxBalance} ALX
              </span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 rounded-lg transition-all backdrop-blur-sm border border-white/10"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-[#4cc9ff] to-[#00fff0] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(76,201,255,0.5)]">
                  {account.slice(2, 4).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </div>
                  <div className="text-xs text-[#4cc9ff]">Connected</div>
                </div>
                <ChevronDown className="h-4 w-4 text-white/50" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-56 bg-black/80 border border-white/10 rounded-lg shadow-[0_0_40px_rgba(76,201,255,0.3)] z-50 backdrop-blur-md">
                  <div className="p-3 border-b border-white/10 bg-gradient-to-r from-[#4cc9ff]/10 to-[#7a5cff]/10">
                    <div className="text-sm font-medium text-white">My Account</div>
                  </div>
                  <div className="py-1">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-gradient-to-r hover:from-[#4cc9ff]/10 hover:to-[#00fff0]/10 hover:text-white transition-all flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-gradient-to-r hover:from-[#4cc9ff]/10 hover:to-[#00fff0]/10 hover:text-white transition-all flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-gradient-to-r hover:from-[#4cc9ff]/10 hover:to-[#00fff0]/10 hover:text-white transition-all flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </button>
                  </div>
                  <div className="border-t border-white/10 py-1">
                    <button 
                      onClick={handleDisconnect}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#7a5cff] hover:bg-gradient-to-r hover:from-[#7a5cff]/10 hover:to-[#4cc9ff]/10 hover:text-[#7a5cff] transition-all flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="flex items-center gap-2 bg-gradient-to-r from-[#4cc9ff] via-[#7a5cff] to-[#00fff0] hover:from-[#4cc9ff]/80 hover:via-[#7a5cff]/80 hover:to-[#00fff0]/80 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg transition-all font-medium shadow-[0_0_20px_rgba(76,201,255,0.4)] backdrop-blur-sm border border-white/10"
          >
            <Wallet className="h-4 w-4" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>

      {/* Backdrop for closing dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default TopNavbar;
