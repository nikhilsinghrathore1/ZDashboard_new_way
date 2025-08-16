"use client";

import React, { useState, useEffect } from "react";
import img from "../../public/niko.jpg";
import Image from "next/image";
import {
  Home,
  Zap,
  Settings,
  ShoppingBag,
  Vote,
  Wallet,
  TrendingUp,
  Users,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Music,
  Square,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface NavItemProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  subtitle: string;
  isActive?: boolean;
  path?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  title,
  subtitle,
  isActive = false,
  path,
}) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async () => {
    if (path && !isNavigating) {
      try {
        setIsNavigating(true);
        await router.push(path);
      } catch (error) {
        console.error('Navigation error:', error);
      } finally {
        // Reset navigation state after a short delay
        setTimeout(() => {
          setIsNavigating(false);
        }, 100);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative w-full h-[60px] border flex gap-4 items-center justify-start px-4 rounded-lg 
        cursor-pointer transition-all duration-300 group overflow-hidden select-none
        ${isNavigating ? 'pointer-events-none opacity-75' : ''}
        ${
          isActive
            ? "border-purple-500/60 bg-purple-500/10 shadow-lg shadow-purple-500/30"
            : "border-gray-800/70 bg-black hover:border-purple-500/50 hover:bg-purple-500/5 hover:shadow-lg hover:shadow-purple-500/20"
        }
      `}
    >
      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent opacity-50" />

      <Icon
        className={`${
          isActive ? "text-purple-400" : "text-gray-400"
        } group-hover:text-purple-400 transition-all duration-300`}
        size={20}
      />
      <div className="leading-6">
        <h1
          className={`text-md font-medium transition-all duration-300 ${
            isActive ? "text-white" : "text-gray-300 group-hover:text-white"
          }`}
        >
          {title}
        </h1>
        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
          {subtitle}
        </p>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute right-4 w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/60" />
      )}
    </div>
  );
};

const MusicVisualizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bars, setBars] = useState<number[]>(new Array(12).fill(0));
  const [frequency, setFrequency] = useState<number[]>(new Array(12).fill(0));
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audioElement = new Audio('/ambSound.mp3');
      audioElement.loop = true;
      audioElement.volume = 0.3;
      audioElement.preload = 'auto';
      
      setAudio(audioElement);
      
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 64;
      
      setAudioContext(context);
      setAnalyser(analyserNode);
      
      audioElement.addEventListener('canplaythrough', () => {
        try {
          const source = context.createMediaElementSource(audioElement);
          source.connect(analyserNode);
          analyserNode.connect(context.destination);
        } catch (error) {
          console.log('Audio already connected or error:', error);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || !analyser) return;

    const updateVisualization = () => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      analyser.getByteFrequencyData(dataArray);
      
      const newBars = Array.from({ length: 12 }, (_, i) => {
        const index = Math.floor((i / 12) * bufferLength);
        return (dataArray[index] || 0) / 2.55;
      });
      
      setBars(newBars);
      
      const time = Date.now() / 1000;
      const newFrequency = Array.from({ length: 12 }, (_, i) => {
        const baseFreq = (dataArray[i * 2] || 0) / 2.55;
        const wave = Math.sin(time + i * 0.3) * 10;
        return Math.max(5, Math.min(95, baseFreq + wave));
      });
      
      setFrequency(newFrequency);
    };

    const interval = setInterval(updateVisualization, 60);
    return () => clearInterval(interval);
  }, [isPlaying, analyser]);

  const togglePlay = async (): Promise<void> => {
    if (!audio) return;

    if (!isPlaying) {
      try {
        if (audioContext && audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
        setTimeout(() => {
          audio.play().catch(console.error);
        }, 100);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const reset = (): void => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    setBars(new Array(12).fill(0));
    setFrequency(new Array(12).fill(0));
    setIsPlaying(false);
  };

  return (
    <div className="w-full border border-gray-800/40 bg-black rounded-lg p-3">
      
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-purple-400 text-xs font-semibold tracking-wide flex items-center gap-2">
          <Music size={12} />
          Audio
          {isPlaying && (
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse shadow-sm shadow-purple-400/50" />
          )}
        </h3>
        <span className="text-gray-500 text-xs font-mono">
          {isPlaying ? "PLAYING" : "READY"}
        </span>
      </div>

      {/* Visualizer */}
      <div className="h-16 bg-gray-900/50 rounded-lg mb-3 p-2 overflow-hidden relative border border-gray-800/30">
        
        {/* Frequency bars */}
        <div className="flex items-end justify-center gap-1 h-full">
          {bars.map((height, index) => (
            <div
              key={index}
              className="transition-all duration-100 ease-out rounded-sm"
              style={{
                width: '6px',
                height: `${isPlaying ? height : 0}%`,
                background: `linear-gradient(to top, #8b5cf6, #a855f7 50%, #c084fc)`,
                opacity: 0.8
              }}
            />
          ))}
        </div>

        {/* Waveform overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <svg width="100%" height="100%">
            <path
              d={`M 0 ${30} ${frequency.map((freq, i) => `L ${(i + 1) * 10} ${freq * 0.4}`).join(' ')}`}
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={togglePlay}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-500/20 border border-purple-500/40 rounded-md text-purple-400 text-xs py-2 hover:bg-purple-500/30 hover:border-purple-400/60 transition-all duration-300 disabled:opacity-50"
          disabled={!audio}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
        <button
          onClick={reset}
          className="px-3 bg-gray-900/50 border border-gray-700/40 rounded-md text-gray-400 hover:bg-gray-800/60 hover:border-gray-600/60 hover:text-gray-300 transition-all duration-300 disabled:opacity-50"
          disabled={!audio}
        >
          <Square size={12} />
        </button>
      </div>
    </div>
  );
};

const SideNavbar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');

  // Listen to route changes to update active state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      
      // Listen for navigation events
      const handleRouteChange = () => {
        setCurrentPath(window.location.pathname);
      };

      window.addEventListener('popstate', handleRouteChange);
      
      return () => {
        window.removeEventListener('popstate', handleRouteChange);
      };
    }
  }, []);

  return (
    <div className="w-full py-4 h-full bg-black border-r-[2px] border-purple-800/40">
      
      {/* Header */}
      <div className="w-full h-[12%] px-5 flex items-center gap-3 border-b-[2px] border-purple-800/70 mb-5">
        
        <div className="w-[65px] h-[65px]  rounded-full overflow-hidden border border-gray-700/50 shadow-lg">
          <Image className="w-full h-full object-cover" src={img} alt="ZLag" />
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
          <NavItem
            icon={Home}
            title="Home"
            subtitle="Command Center"
            isActive={currentPath === '/'}
            path="/"
          />
          <NavItem
            icon={Zap}
            title="Create AI Agent"
            subtitle="Deploy Intelligence"
            isActive={currentPath === '/createAgent'}
            path="/createAgent"
          />
          <NavItem
            icon={ShoppingBag}
            title="Marketplace"
            subtitle="Trade Assets"
            isActive={currentPath === '/marketplace'}
            path="/marketplace"
          />
          <NavItem 
            icon={Wallet} 
            title="Wallet" 
            subtitle="Crypto Vault" 
            isActive={currentPath === '/wallet'}
            path="/wallet" 
          />
          <NavItem 
            icon={Zap} 
            title="your Agents" 
            subtitle="working 24/7" 
            isActive={currentPath === '/yourAgents'}
            path="/yourAgents" 
          />
        </div>

        <div className="w-full">
          <MusicVisualizer />
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;