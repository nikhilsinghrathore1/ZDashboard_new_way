"use client";

import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef,
  memo,
  Suspense,
  startTransition
} from "react";
import img from "../../public/niko.webp";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Home,
  Zap,
  ShoppingBag,
  Wallet,
  Play,
  Pause,
  Music,
  Square,
  Loader2,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

// Optimized dynamic imports with proper loading states
const preloadedRoutes = {
  '/': dynamic(() => import("../../app/page").catch(() => ({ default: () => <div>Error loading page</div> })), { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }),
  '/createAgent': dynamic(() => import('../../app/createAgent/page').catch(() => ({ default: () => <div>Error loading page</div> })), { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }),
  '/marketplace': dynamic(() => import('../../app/marketplace/page').catch(() => ({ default: () => <div>Error loading page</div> })), { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }),
  '/wallet-profile': dynamic(() => import('../../app/wallet-profile/page').catch(() => ({ default: () => <div>Error loading page</div> })), { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }),
  '/yourAgents': dynamic(() => import('../../app/page').catch(() => ({ default: () => <div>Error loading page</div> })), { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }),
};

// Memoized route configuration
const routeConfig = Object.freeze([
  {
    icon: Home,
    title: "Home",
    subtitle: "Command Center",
    path: "/",
    priority: 'high' as const,
  },
  {
    icon: Zap,
    title: "Create AI Agent",
    subtitle: "Deploy Intelligence",
    path: "/createAgent",
    priority: 'high' as const,
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    subtitle: "Trade Assets",
    path: "/marketplace",
    priority: 'medium' as const,
  },
  {
    icon: Wallet,
    title: "Dao community",
    subtitle: "Crypto Vault",
    path: "/wallet-profile",
    priority: 'medium' as const,
  },
  {
    icon: Zap,
    title: "Your Profile",
    subtitle: "working 24/7",
    path: "/yourAgents",
    priority: 'low' as const,
  },
]);

// Full screen loading component
const FullScreenLoader: React.FC<{ message?: string }> = memo(({ message = "Loading..." }) => (
  <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
        <div className="absolute inset-0 w-12 h-12 border-2 border-purple-400/20 rounded-full animate-pulse mx-auto" />
      </div>
      <div className="space-y-2">
        <h3 className="text-white text-lg font-medium">{message}</h3>
        <div className="flex space-x-1 justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
));

FullScreenLoader.displayName = 'FullScreenLoader';

// Performance monitoring hook
const usePerformanceMonitor = () => {
  const metricsRef = useRef({
    renderCount: 0,
    lastRender: Date.now(),
  });

  useEffect(() => {
    metricsRef.current.renderCount++;
    metricsRef.current.lastRender = Date.now();
  });

  return metricsRef.current;
};

// Optimized intersection observer hook
const useIntersectionObserver = (callback: () => void, deps: any[] = []) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, deps);

  return ref;
};

// Debounced state hook
const useDebouncedState = <T,>(initialValue: T, delay: number) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  //@ts-ignore 
  const timeoutRef = useRef<NodeJS.Timeout>();

  const setDebouncedStateValue = useCallback((newValue: T) => {
    setValue(newValue);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(newValue);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [debouncedValue, setDebouncedStateValue] as const;
};

interface NavItemProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  subtitle: string;
  isActive?: boolean;
  path?: string;
  onHover?: () => void;
  onNavigationStart?: () => void;
  onNavigationEnd?: () => void;
}

// Memoized NavItem component with optimizations
const NavItem: React.FC<NavItemProps> = memo(({
  icon: Icon,
  title,
  subtitle,
  isActive = false,
  path,
  onHover,
  onNavigationStart,
  onNavigationEnd,
}) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useDebouncedState(false, 100);
  const [isHovered, setIsHovered] = useState(false);
  //@ts-ignore 
  const navigationTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoized click handler with optimistic navigation
  const handleClick = useCallback(async () => {
    if (!path || isNavigating) return;

    try {
      setIsNavigating(true);
      onNavigationStart?.();
      
      // Clear any existing timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }

      // Use startTransition for better performance
      startTransition(() => {
        router.push(path);
      });

      // Auto-reset navigation state after timeout
      navigationTimeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
        onNavigationEnd?.();
      }, 2000);

    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
      onNavigationEnd?.();
    }
  }, [path, isNavigating, router, onNavigationStart, onNavigationEnd, setIsNavigating]);

  // Throttled hover handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover?.();
  }, [onHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Memoized class names
  const containerClasses = useMemo(() => `
    relative w-full h-[60px] border flex gap-4 items-center justify-start px-4 rounded-lg 
    cursor-pointer transition-all duration-300 group overflow-hidden select-none
    ${isNavigating ? 'pointer-events-none opacity-75' : ''}
    ${
      isActive
        ? "border-purple-500/60 bg-purple-500/10 shadow-lg shadow-purple-500/30"
        : "border-gray-800/70 bg-black hover:border-purple-500/50 hover:bg-purple-500/5 hover:shadow-lg hover:shadow-purple-500/20"
    }
  `.trim().replace(/\s+/g, ' '), [isActive, isNavigating]);

  const iconClasses = useMemo(() => `${
    isActive ? "text-purple-400" : "text-gray-400"
  } group-hover:text-purple-400 transition-all duration-300 ${
    isHovered ? 'scale-110' : ''
  }`.trim().replace(/\s+/g, ' '), [isActive, isHovered]);

  const titleClasses = useMemo(() => `text-md font-medium transition-all duration-300 ${
    isActive ? "text-white" : "text-gray-300 group-hover:text-white"
  }`.trim().replace(/\s+/g, ' '), [isActive]);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={containerClasses}
      role="button"
      tabIndex={0}
      aria-label={`Navigate to ${title}`}
    >
      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent opacity-50" />

      {/* Loading indicator for navigation */}
      {isNavigating && (
        <div className="absolute inset-0 bg-purple-500/5 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
        </div>
      )}

      <Icon className={iconClasses} size={20} />
      <div className="leading-4">
        <h1 className={titleClasses}>{title}</h1>
        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
          {subtitle}
        </p>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute right-4 w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/60" />
      )}

      {/* Hover glow effect */}
      {isHovered && !isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-purple-400/10 to-purple-500/5 rounded-lg" />
      )}
    </div>
  );
});

NavItem.displayName = 'NavItem';

// Simple Music Player without Web Audio API visualization
const MusicPlayer: React.FC = memo(() => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState<boolean>(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        if (typeof window === 'undefined') return;

        const audioElement = new Audio('/ambSound.mp3');
        audioElement.loop = true;
        audioElement.volume = 0.3;
        audioElement.preload = 'metadata';
        
        audioElement.addEventListener('error', (e) => {
          setAudioError('Failed to load audio file. Check if ambSound.mp3 exists in public folder');
          setIsAudioLoaded(false);
        });

        audioElement.addEventListener('loadeddata', () => {
          setIsAudioLoaded(true);
          setAudioError(null);
        });

        audioElement.addEventListener('ended', () => {
          setIsPlaying(false);
        });
        
        audioRef.current = audioElement;

      } catch (error) {
        console.error('Audio initialization error:', error);
        setAudioError('Audio initialization failed');
      }
    };

    initializeAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = useCallback(async (): Promise<void> => {
    const audio = audioRef.current;
    
    if (!audio || !isAudioLoaded) return;

    try {
      if (!isPlaying) {
        await audio.play();
        setIsPlaying(true);
        setAudioError(null);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error: any) {
      setAudioError(`Playback failed: ${error.message || 'Unknown error'}`);
      setIsPlaying(false);
    }
  }, [isPlaying, isAudioLoaded]);

  const reset = useCallback((): void => {
    const audio = audioRef.current;
    
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    setIsPlaying(false);
    setAudioError(null);
  }, []);

  return (
    <div className="w-full mb-5 border border-gray-800/40 bg-black rounded-lg p-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-purple-400 text-xs font-semibold tracking-wide flex items-center gap-2">
          <Music size={12} />
          Audio Player
          {isPlaying && (
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse shadow-sm shadow-purple-400/50" />
          )}
        </h3>
        <span className="text-gray-500 text-xs font-mono">
          {audioError ? "ERROR" : isPlaying ? "PLAYING" : isAudioLoaded ? "READY" : "LOADING"}
        </span>
      </div>

      {/* Error display */}
      {audioError && (
        <div className="mb-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs">
          {audioError}
        </div>
      )}

      {/* Simple visual indicator */}
      <div className="h-12 bg-gray-900/50 rounded-lg mb-3 p-2 overflow-hidden relative border border-gray-800/30 flex items-center justify-center">
        {isPlaying ? (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-purple-400 rounded-sm animate-pulse"
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-xs">
            {isAudioLoaded ? 'Ready to play' : 'Loading...'}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={togglePlay}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md text-xs py-2 transition-all duration-300 ${
            audioError || !isAudioLoaded
              ? 'bg-gray-800/50 border border-gray-700/40 text-gray-500 cursor-not-allowed'
              : 'bg-purple-500/20 border border-purple-500/40 text-purple-400 hover:bg-purple-500/30 hover:border-purple-400/60'
          }`}
          disabled={!!audioError || !isAudioLoaded}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
        <button
          onClick={reset}
          className="px-3 bg-gray-900/50 border border-gray-700/40 rounded-md text-gray-400 hover:bg-gray-800/60 hover:border-gray-600/60 hover:text-gray-300 transition-all duration-300 disabled:opacity-50"
          disabled={!!audioError}
        >
          <Square size={12} />
        </button>
      </div>
    </div>
  );
});

MusicPlayer.displayName = 'MusicPlayer';

// Main optimized sidebar component
const SideNavbar: React.FC = memo(() => {
  const pathname = usePathname();
  const router = useRouter();
  const [preloadedPaths, setPreloadedPaths] = useState<Set<string>>(new Set());
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  
  // Performance monitoring
  const metrics = usePerformanceMonitor();
  
  const preloadPromisesRef = useRef(new Map<string, Promise<void>>());
  //@ts-ignore 
  const preloadTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoized route configurations by priority
  const routesByPriority = useMemo(() => ({
    high: routeConfig.filter(route => route.priority === 'high'),
    medium: routeConfig.filter(route => route.priority === 'medium'),
    low: routeConfig.filter(route => route.priority === 'low'),
  }), []);

  // Optimized preload function
  const preloadRoute = useCallback(async (path: string): Promise<void> => {
    if (preloadedPaths.has(path)) return;

    if (preloadPromisesRef.current.has(path)) {
      return preloadPromisesRef.current.get(path);
    }

    const preloadPromise = (async () => {
      try {
        await router.prefetch(path);
        setPreloadedPaths(prev => new Set([...prev, path]));
      } catch (error) {
        console.warn(`Failed to preload route ${path}:`, error);
        preloadPromisesRef.current.delete(path);
        throw error;
      } finally {
        preloadPromisesRef.current.delete(path);
      }
    })();

    preloadPromisesRef.current.set(path, preloadPromise);
    return preloadPromise;
  }, [router, preloadedPaths]);

  // Navigation handlers
  const handleNavItemHover = useCallback(async (path: string) => {
    if (preloadedPaths.has(path)) return;
    
    try {
      await preloadRoute(path);
    } catch (error) {
      // Silently handle hover preload errors
    }
  }, [preloadRoute, preloadedPaths]);

  const handleNavigationStart = useCallback(() => {
    setIsGlobalLoading(true);
    setLoadingMessage("Navigating...");
  }, []);

  const handleNavigationEnd = useCallback(() => {
    setTimeout(() => {
      setIsGlobalLoading(false);
    }, 200);
  }, []);

  // Intersection observer
  const intersectionRef = useIntersectionObserver(() => {
    // Trigger any lazy loading when sidebar becomes visible
  });

  // Cleanup
  useEffect(() => {
    return () => {
      preloadPromisesRef.current.clear();
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, []);

  // Memoized nav items
  const navItems = useMemo(() => 
    routeConfig.map((route) => (
      <NavItem
        key={route.path}
        icon={route.icon}
        title={route.title}
        subtitle={route.subtitle}
        isActive={pathname === route.path}
        path={route.path}
        onHover={() => handleNavItemHover(route.path)}
        onNavigationStart={handleNavigationStart}
        onNavigationEnd={handleNavigationEnd}
      />
    )), [pathname, handleNavItemHover, handleNavigationStart, handleNavigationEnd]
  );

  return (
    <>
      {/* Full screen loader */}
      {isGlobalLoading && (
        <FullScreenLoader message={loadingMessage} />
      )}

      <div 
        ref={intersectionRef}
        className="w-full py-4 h-full bg-black border-r-[2px] border-purple-800/40"
      >
        {/* Header */}
        <div className="w-full h-[12%] px-5 flex items-center gap-3 border-b-[2px] border-purple-800/70 mb-5">
          <div className="w-[75px] h-[75px] rounded-full overflow-hidden border border-gray-700/50 shadow-lg">
            <Image 
              className="w-full h-full object-cover" 
              src={img} 
              alt="ZLag"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAgMAAQQRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEcTV52OqyRjy0LlD+2H3+6HdCd/bQdC8dJKs5YYEhLjsVKLwjjdoW3kmmkhNM7PFPcPkW5VZE4XhqPvR6dSHsf/Z"
            />
          </div>
          
          <div>
            <h1 className="font-bold text-lg tracking-wide">
              <span className="text-purple-400">Zero</span>
              <span className="text-white">Lag</span>
            </h1>
            <p className="text-gray-500 text-xs font-medium">
              Decentralised AI Studio
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full flex flex-col px-5 items-center justify-between h-[88%]">
          <div className="flex w-full flex-col gap-3">
            <Suspense fallback={<div className="text-gray-500 text-xs">Loading navigation...</div>}>
              {navItems}
            </Suspense>
          </div>

          <div className="w-full">
            <Suspense fallback={<div className="text-gray-500 text-xs">Loading audio...</div>}>
              <MusicPlayer />
            </Suspense>
          </div>
        </div>
        
        {/* Performance debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black/80 border border-purple-500/30 rounded p-2 text-xs text-purple-400 space-y-1">
            <div>Preloaded: {preloadedPaths.size}/{routeConfig.length}</div>
            <div>Renders: {metrics.renderCount}</div>
            <div>Last: {new Date(metrics.lastRender).toLocaleTimeString()}</div>
          </div>
        )}
      </div>
    </>
  );
});

SideNavbar.displayName = 'SideNavbar';

export default SideNavbar;
