"use client";
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Search, Bell, Wallet, ChevronDown, LogOut, User, Settings, HelpCircle } from "lucide-react";

import { useAccount, useConnect, useDisconnect, useBalance, useReadContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { formatUnits } from "viem";

// Token ABI and Address
const zlagTokenAbi = [
  { "constant": true, "inputs": [{"name": "_owner", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"}], "type": "function" },
  { "constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8"}], "type": "function" },
  { "constant": true, "inputs": [], "name": "symbol", "outputs": [{"name": "", "type": "string"}], "type": "function" }
] as const;

const zlagTokenContract = {
  address: '0xea4808283eFC9140BBea9E5465AEAF102DDA1b85' as `0x${string}`,
  abi: zlagTokenAbi,
} as const;

// API utility function
const createApiCall = async (endpoint: string, method: string, data?: any) => {
  try {
    const config: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }
    
    const response = await fetch(endpoint, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
};

// Memoized notification component
const NotificationItem = memo(({ notification }: { notification: any }) => (
  <div
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
));

// Memoized dropdown components
const NotificationsDropdown = memo(({ notifications, unreadCount }: { notifications: any[], unreadCount: number }) => (
  <div className="absolute right-0 top-12 w-80 bg-gray-900/95 border border-gray-700 rounded-lg shadow-xl z-50 backdrop-blur-md">
    <div className="p-4 border-b border-gray-700">
      <h3 className="font-semibold text-white">Notifications</h3>
    </div>
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
    <div className="p-3 border-t border-gray-700">
      <button className="text-sm text-gray-400 hover:text-white font-medium">
        View all notifications
      </button>
    </div>
  </div>
));

const UserDropdown = memo(({ 
  address, 
  userExists, 
  userChecked, 
  onDisconnect 
}: { 
  address: string, 
  userExists: boolean, 
  userChecked: boolean, 
  onDisconnect: () => void 
}) => (
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
        onClick={onDisconnect}
        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800/50 hover:text-red-300 transition-colors flex items-center"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Disconnect Wallet
      </button>
    </div>
  </div>
));

// Memoized balance display component
const BalanceDisplay = memo(({ 
  balanceData, 
  formattedZlagBalance, 
  zlagSymbol 
}: {
  balanceData: any,
  formattedZlagBalance: string,
  zlagSymbol: string | undefined
}) => (
  <div className="hidden md:flex items-center space-x-2">
    <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-medium border border-blue-500/30">
      {balanceData ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : "Loading..."}
    </span>
    <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs font-medium border border-purple-500/30">
      {zlagSymbol ? `${parseFloat(formattedZlagBalance).toFixed(4)} ${zlagSymbol}` : "Loading..."}
    </span>
  </div>
));

// Status indicator component
const StatusIndicator = memo(({ isCheckingUser, isCreatingUser }: { isCheckingUser: boolean, isCreatingUser: boolean }) => {
  if (!isCheckingUser && !isCreatingUser) return null;
  
  return (
    <div className="flex items-center space-x-2 text-yellow-400 text-sm">
      <div className="animate-spin h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
      <span>
        {isCheckingUser ? 'Verifying account...' : 'Creating account...'}
      </span>
    </div>
  );
});

const TopNavbar = memo(() => {
  // State management - using separate states to minimize re-renders
  const [dropdownStates, setDropdownStates] = useState({
    notifications: false,
    userMenu: false
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [userState, setUserState] = useState({
    isCheckingUser: false,
    isCreatingUser: false,
    userExists: false,
    userChecked: false
  });
  
  const { address, isConnected, isConnecting, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Only fetch balance when connected
  const { data: balanceData } = useBalance({ 
    address,
    query: { enabled: isConnected && !!address }
  });

  // Contract reads with proper optimization
  const contractQueryConfig = useMemo(() => ({
    ...zlagTokenContract,
    chainId: chain?.id,
    query: { 
      enabled: isConnected && !!address,
      staleTime: 30000, // 30 seconds
      refetchInterval: 60000 // 1 minute
    }
  }), [isConnected, address, chain?.id]);

  const { data: zlagBalanceData } = useReadContract({
    ...contractQueryConfig,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: zlagDecimals } = useReadContract({
    ...contractQueryConfig,
    functionName: 'decimals',
  });

  const { data: zlagSymbol } = useReadContract({
    ...contractQueryConfig,
    functionName: 'symbol',
  });

  // API functions using useCallback to memoize them
  const checkUserExists = useCallback(async (walletAddress: string) => {
    return createApiCall(`https://zlag-ownable-service.vercel.app/api/users/${walletAddress}/exists`, 'GET');
  }, []);

  const createUser = useCallback(async (walletAddress: string) => {
    return createApiCall('https://zlag-ownable-service.vercel.app/api/users', 'POST', { walletAddress });
  }, []);

  // Memoized formatted balance calculation
  const formattedZlagBalance = useMemo(() => {
    if (typeof zlagBalanceData === 'bigint' && typeof zlagDecimals === 'number') {
      return formatUnits(zlagBalanceData, zlagDecimals);
    }
    return '0';
  }, [zlagBalanceData, zlagDecimals]);

  // Memoized notifications
  const notifications = useMemo(() => [
    { id: 1, message: "New transaction confirmed", time: "2 min ago", unread: true },
    { id: 2, message: "Wallet connected successfully", time: "1 hour ago", unread: true },
  ], []);

  const unreadCount = useMemo(
    () => notifications.filter(n => n.unread).length,
    [notifications]
  );

  // Optimized user management effect with better error handling
  useEffect(() => {
    if (!isConnected || !address || userState.userChecked) return;

    let isCancelled = false;

    const handleUserManagement = async () => {
      setUserState(prev => ({ ...prev, isCheckingUser: true }));
      
      try {
        const existsResponse = await checkUserExists(address);
        
        if (isCancelled) return;
        
        if (existsResponse.success) {
          if (existsResponse.exists) {
            setUserState(prev => ({
              ...prev,
              userExists: true,
              userChecked: true,
              isCheckingUser: false
            }));
          } else {
            setUserState(prev => ({ ...prev, isCreatingUser: true, isCheckingUser: false }));
            
            try {
              await createUser(address);
              if (!isCancelled) {
                setUserState(prev => ({
                  ...prev,
                  userExists: true,
                  userChecked: true,
                  isCreatingUser: false
                }));
              }
            } catch (createError) {
              if (!isCancelled) {
                console.error('Failed to create user:', createError);
                setUserState(prev => ({ ...prev, isCreatingUser: false }));
              }
            }
          }
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error in user management:', error);
          setUserState(prev => ({ 
            ...prev, 
            isCheckingUser: false, 
            isCreatingUser: false 
          }));
        }
      }
    };

    handleUserManagement();

    return () => {
      isCancelled = true;
    };
  }, [isConnected, address, userState.userChecked, checkUserExists, createUser]);

  // Reset user states when disconnected
  useEffect(() => {
    if (!isConnected) {
      setUserState({
        isCheckingUser: false,
        isCreatingUser: false,
        userExists: false,
        userChecked: false
      });
    }
  }, [isConnected]);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleSearch = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  }, [searchQuery]);

  const handleConnect = useCallback(() => {
    connect({ connector: injected() });
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setDropdownStates(prev => ({ ...prev, userMenu: false }));
  }, [disconnect]);

  const toggleNotifications = useCallback(() => {
    setDropdownStates(prev => ({ 
      ...prev, 
      notifications: !prev.notifications,
      userMenu: false // Close other dropdown
    }));
  }, []);

  const toggleUserMenu = useCallback(() => {
    setDropdownStates(prev => ({ 
      ...prev, 
      userMenu: !prev.userMenu,
      notifications: false // Close other dropdown
    }));
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setDropdownStates({ notifications: false, userMenu: false });
  }, []);

  const handleNavHover = useCallback(() => setIsNavHovered(true), []);
  const handleNavLeave = useCallback(() => setIsNavHovered(false), []);

  // Memoized address formatting
  const formattedAddress = useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const addressInitials = useMemo(() => {
    if (!address) return '';
    return address.slice(2, 4).toUpperCase();
  }, [address]);

  // Memoized user status
  const userStatus = useMemo(() => {
    const { userExists, userChecked } = userState;
    return {
      color: userExists && userChecked ? 'purple' : 'yellow',
      text: userExists && userChecked ? 'Account Ready' : 'Verifying...',
      bgClass: userExists && userChecked ? 'bg-purple-500' : 'bg-yellow-500',
      textClass: userExists && userChecked ? 'text-purple-400' : 'text-yellow-400'
    };
  }, [userState.userExists, userState.userChecked]);

  // Early return for loading states
  if (isConnecting) {
    return (
      <header className="w-full h-[9%] border-b border-purple-500/30 px-6 flex items-center justify-between sticky top-0 z-50 bg-black">
        <div className="flex-1 max-w-md">
          <div className="animate-pulse bg-gray-700 h-10 rounded-lg"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="animate-pulse bg-gray-700 h-10 w-32 rounded-lg"></div>
        </div>
      </header>
    );
  }

  return (
    <header 
      className={`w-full h-[9%] border-b border-purple-500/30 px-6 flex items-center justify-between sticky top-0 z-50 transition-all duration-500 relative bg-black ${
        isNavHovered ? 'shadow-lg shadow-purple-500/50' : ''
      }`}
      onMouseEnter={handleNavHover}
      onMouseLeave={handleNavLeave}
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
      <div className="flex items-center space-x-4 relative z-50">
        {/* Status Indicator */}
        <StatusIndicator 
          isCheckingUser={userState.isCheckingUser} 
          isCreatingUser={userState.isCreatingUser} 
        />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-0 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown - Only render when needed */}
          {dropdownStates.notifications && (
            <NotificationsDropdown 
              notifications={notifications} 
              unreadCount={unreadCount} 
            />
          )}
        </div>

        {/* Wallet Connection */}
        {isConnected && address ? (
          <div className="flex items-center space-x-3">
            {/* Balances - Only render when data is available */}
            {(balanceData || zlagSymbol) && (
              <BalanceDisplay
                balanceData={balanceData}
                formattedZlagBalance={formattedZlagBalance}
                // @ts-ignore
                zlagSymbol={zlagSymbol}
              />
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                aria-label="User menu"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${userStatus.bgClass}`}>
                  {addressInitials}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">
                    {formattedAddress}
                  </div>
                  <div className={`text-xs ${userStatus.textClass}`}>
                    {userStatus.text}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* User Dropdown - Only render when needed */}
              {dropdownStates.userMenu && (
                <UserDropdown
                  address={address}
                  userExists={userState.userExists}
                  userChecked={userState.userChecked}
                  onDisconnect={handleDisconnect}
                />
              )}
            </div>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-all font-medium"
            aria-label="Connect wallet"
          >
            <Wallet className="h-4 w-4" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>

      {/* Backdrop for closing dropdowns - Only render when needed */}
      {(dropdownStates.notifications || dropdownStates.userMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeAllDropdowns}
          aria-hidden="true"
        />
      )}
    </header>
  );
});

// Set display names for debugging
TopNavbar.displayName = 'TopNavbar';
NotificationItem.displayName = 'NotificationItem';
NotificationsDropdown.displayName = 'NotificationsDropdown';
UserDropdown.displayName = 'UserDropdown';
BalanceDisplay.displayName = 'BalanceDisplay';
StatusIndicator.displayName = 'StatusIndicator';

export default TopNavbar;