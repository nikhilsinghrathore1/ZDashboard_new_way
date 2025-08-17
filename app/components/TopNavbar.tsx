"use client";
import React, { useState, useEffect } from "react";
import { Search, Bell, Wallet, ChevronDown, LogOut, User, Settings, HelpCircle } from "lucide-react";

// --- Imports are corrected here ---
import { useAccount, useConnect, useDisconnect, useBalance, useReadContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { formatUnits } from "viem";

// --- Your Token ABI and Address (This is correct) ---
const zlagTokenAbi = [
  { "constant": true, "inputs": [{"name": "_owner", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"}], "type": "function" },
  { "constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8"}], "type": "function" },
  { "constant": true, "inputs": [], "name": "symbol", "outputs": [{"name": "", "type": "string"}], "type": "function" }
];

const zlagTokenContract = {
  address: '0xea4808283eFC9140BBea9E5465AEAF102DDA1b85',
  abi: zlagTokenAbi,
} as const;

// API function to check if user exists
const checkUserExists = async (walletAddress: string) => {
  try {
    const response = await fetch(`https://zlag-ownable-service.vercel.app/api/users/${walletAddress}/exists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('User existence check:', data);
    return data;
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
};

// API function to create user
const createUser = async (walletAddress: string) => {
  try {
    const response = await fetch('https://zlag-ownable-service.vercel.app/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: walletAddress
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('User created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const TopNavbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  
  const { address, isConnected, isConnecting, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { data: balanceData } = useBalance({ address });

  // --- Your hooks to read contract data (This is correct) ---
  const { data: zlagBalanceData, isLoading: isBalanceLoading, isError: isBalanceError, error: balanceError } = useReadContract({
    ...zlagTokenContract,
    functionName: 'balanceOf',
    args: [address!],
    chainId: chain?.id,
    query: { enabled: isConnected },
  });

  const { data: zlagDecimals, isLoading: isDecimalsLoading, isError: isDecimalsError, error: decimalsError } = useReadContract({
    ...zlagTokenContract,
    functionName: 'decimals',
    chainId: chain?.id,
  });

  const { data: zlagSymbol, isLoading: isSymbolLoading, isError: isSymbolError, error: symbolError } = useReadContract({
    ...zlagTokenContract,
    functionName: 'symbol',
    chainId: chain?.id,
  });

  // --- UPDATED: Effect to check user existence and create if needed ---
  useEffect(() => {
    const handleUserManagement = async () => {
      if (isConnected && address && !userChecked && !isCheckingUser && !isCreatingUser) {
        setIsCheckingUser(true);
        
        try {
          // First, check if user exists
          const existsResponse = await checkUserExists(address);
          
          if (existsResponse.success) {
            if (existsResponse.exists) {
              // User already exists
              console.log('User already exists:', existsResponse.user);
              setUserExists(true);
              setUserChecked(true);
              
              // Add notification for existing user
              const existingUserNotification = {
                id: Date.now(),
                message: "Welcome back! Account verified.",
                time: "Just now",
                unread: true
              };
              // You might want to add this to your notifications state
              
            } else {
              // User doesn't exist, create new user
              setIsCreatingUser(true);
              try {
                const createResponse = await createUser(address);
                setUserExists(true);
                setUserChecked(true);
                
                // Add success notification for new user
                const successNotification = {
                  id: Date.now(),
                  message: "Account created successfully!",
                  time: "Just now",
                  unread: true
                };
                // You might want to add this to your notifications state
                
              } catch (createError) {
                console.error('Failed to create user:', createError);
                
                // Add error notification
                const errorNotification = {
                  id: Date.now(),
                  message: "Failed to create account. Please try again.",
                  time: "Just now",
                  unread: true
                };
                // You might want to add this to your notifications state
                
              } finally {
                setIsCreatingUser(false);
              }
            }
          } else {
            console.error('Failed to check user existence');
          }
          
        } catch (error) {
          console.error('Error in user management:', error);
          
          // Add error notification
          const errorNotification = {
            id: Date.now(),
            message: "Failed to verify account. Please try again.",
            time: "Just now",
            unread: true
          };
          // You might want to add this to your notifications state
          
        } finally {
          setIsCheckingUser(false);
        }
      }
    };

    handleUserManagement();
  }, [isConnected, address, userChecked, isCheckingUser, isCreatingUser]);

  // --- Reset user states when disconnected ---
  useEffect(() => {
    if (!isConnected) {
      setUserExists(false);
      setUserChecked(false);
      setIsCheckingUser(false);
      setIsCreatingUser(false);
    }
  }, [isConnected]);

  // --- NEW: Added the missing logic to format your balance ---
  const formattedZlagBalance =
    typeof zlagBalanceData === 'bigint' && typeof zlagDecimals === 'number'
      ? formatUnits(zlagBalanceData, zlagDecimals)
      : '0';

  // --- Your existing notifications and search handler ---
  const notifications = [
    { id: 1, message: "New transaction confirmed", time: "2 min ago", unread: true },
    { id: 2, message: "Wallet connected successfully", time: "1 hour ago", unread: true },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleDisconnect = () => {
    disconnect();
    setShowUserMenu(false);
  };

  return (
    <header 
      className={`w-full h-[9%] border-b border-purple-500/30 px-6 flex items-center justify-between sticky top-0 z-50 transition-all duration-500 relative bg-black ${
        isNavHovered 
          ? 'shadow-lg shadow-purple-500/50' 
          : ''
      }`}
      onMouseEnter={() => setIsNavHovered(true)}
      onMouseLeave={() => setIsNavHovered(false)}
    >

      {/* Search Bar */}
      <div className="flex-1 max-w-md relative z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search AI models, prompts, creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600/50 rounded-lg focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all text-white text-sm placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 relative z-10">
        {/* User Status Indicator */}
        {(isCheckingUser || isCreatingUser) && (
          <div className="flex items-center space-x-2 text-yellow-400 text-sm">
            <div className="animate-spin h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
            <span>
              {isCheckingUser ? 'Verifying account...' : isCreatingUser ? 'Creating account...' : ''}
            </span>
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-0 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-gray-900/95 border border-gray-700 rounded-lg shadow-xl z-50 backdrop-blur-md">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-700/50 hover:bg-gray-800/50 cursor-pointer transition-all ${
                      notification.unread ? 'bg-gray-800/30' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-sm ${notification.unread ? 'font-medium text-white' : 'text-gray-300'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full ml-2 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-700">
                <button className="text-sm text-gray-400 hover:text-white font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wallet Connection */}
        {isConnected && address ? (
          <div className="flex items-center space-x-3">
            {/* Balances */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-medium border border-blue-500/30">
                {balanceData ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : "Loading..."}
              </span>
              <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs font-medium border border-purple-500/30">
                {zlagSymbol ? `${parseFloat(formattedZlagBalance).toFixed(4)} ${zlagSymbol}` : "Loading..."}
              </span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  userExists && userChecked ? 'bg-purple-500' : 'bg-yellow-500'
                }`}>
                  {address.slice(2, 4).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">
                    {`${address.slice(0, 6)}...${address.slice(-4)}`}
                  </div>
                  <div className={`text-xs ${userExists && userChecked ? 'text-purple-400' : 'text-yellow-400'}`}>
                    {userExists && userChecked ? 'Account Ready' : 'Verifying...'}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-56 bg-gray-900/95 border border-gray-700 rounded-lg shadow-xl z-50 backdrop-blur-md">
                  <div className="p-3 border-b border-gray-700">
                    <div className="text-sm font-medium text-white">My Account</div>
                    {userExists && userChecked && (
                      <div className="text-xs text-purple-400 mt-1">✓ Account verified</div>
                    )}
                  </div>
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </button>
                  </div>
                  <div className="border-t border-gray-700 py-1">
                    <button 
                      onClick={handleDisconnect}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800/50 hover:text-red-300 transition-colors flex items-center"
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
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-all font-medium"
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