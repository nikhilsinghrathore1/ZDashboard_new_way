"use client";
import React, { useState, useEffect } from "react";
import img from "../../public/coinhehe-removebg-preview.png";
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

interface NavItemProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  subtitle: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, title, subtitle, isActive = false }) => (
  <div
    className={`
    relative w-full h-[60px] border-[1px] flex gap-4 items-center justify-start px-4 rounded-md 
    cursor-pointer transition-all duration-300 group overflow-hidden
    ${
      isActive
        ? "border-[#00FF88] bg-gradient-to-r from-[#00FF88]/10 to-transparent shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        : "border-[#05352C] hover:border-[#00FF88] hover:bg-gradient-to-r hover:from-[#00FF88]/5 hover:to-transparent"
    }
  `}
  >
    {/* Scan lines effect */}
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FF88]/10 to-transparent animate-pulse"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)",
        }}
      ></div>
    </div>

    {/* Glitch effect on hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF0080]/20 to-[#00FF88]/20 animate-pulse"></div>
    </div>

    <Icon
      className={`${
        isActive ? "text-[#00FF88]" : "text-[#fff]/70"
      } group-hover:text-[#00FF88] transition-colors duration-300 relative z-10`}
      size={20}
    />
    <div className="leading-none relative z-10">
      <h1
        className={`text-md tracking-wide font-medium transition-colors duration-300 ${
          isActive ? "text-[#00FF88]" : "text-white group-hover:text-[#00FF88]"
        }`}
      >
        {title}
      </h1>
      <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors duration-300">
        {subtitle}
      </p>
    </div>

    {/* Corner accent */}
    <div
      className={`absolute top-0 right-0 w-0 h-0 border-l-[8px] border-b-[8px] border-l-transparent transition-all duration-300 ${
        isActive
          ? "border-b-[#00FF88]"
          : "border-b-transparent group-hover:border-b-[#00FF88]"
      }`}
    ></div>
  </div>
);

const CyberpunkClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [glitchText, setGlitchText] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      
      // Occasional glitch effect on seconds
      if (Math.random() < 0.1) { // 10% chance per second
        const glitchChars = ['█', '▓', '▒', '░', '◆', '◇', '▀', '▄'];
        setGlitchText(glitchChars[Math.floor(Math.random() * glitchChars.length)]);
        setTimeout(() => setGlitchText(''), 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date): { hours: string; minutes: string; seconds: string } => {
    return {
      hours: date.getHours().toString().padStart(2, '0'),
      minutes: date.getMinutes().toString().padStart(2, '0'),
      seconds: date.getSeconds().toString().padStart(2, '0')
    };
  };

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <div className="w-full border-[1px] border-[#00FF88]/30 rounded-md p-3 mb-3 bg-gradient-to-br from-[#00FF88]/5 to-transparent relative overflow-hidden">
      {/* Scanning line effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF88]/20 to-transparent"
          style={{
            animation: 'clockScan 3s linear infinite',
            background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)'
          }}
        />
      </div>

      <div className="flex justify-between items-center mb-2 relative z-10">
        <h3 className="text-[#00FF88] text-xs font-bold tracking-wide flex items-center gap-1">
          <div className="w-2 h-2 border border-[#00FF88] rounded-full animate-pulse" />
          SYSTEM TIME
        </h3>
        <span className="text-[#FF0080] text-xs font-mono">
          {time.toLocaleDateString('en-US', { 
            month: 'short', 
            day: '2-digit',
            year: '2-digit'
          }).toUpperCase()}
        </span>
      </div>

      {/* Digital Clock Display */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="font-mono text-2xl font-bold tracking-wider flex items-center gap-1">
          {/* Hours */}
          <span className="text-[#00FF88] drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]">
            {hours}
          </span>
          
          {/* Blinking separator */}
          <span className="text-[#00BFFF] animate-pulse text-xl">:</span>
          
          {/* Minutes */}
          <span className="text-[#00BFFF] drop-shadow-[0_0_10px_rgba(0,191,255,0.8)]">
            {minutes}
          </span>
          
          {/* Blinking separator */}
          <span className="text-[#FF0080] animate-pulse text-xl">:</span>
          
          {/* Seconds with glitch effect */}
          <span className="text-[#FF0080] drop-shadow-[0_0_10px_rgba(255,0,128,0.8)] relative">
            {glitchText || seconds}
          </span>
        </div>
      </div>

      {/* Circuit-like decoration */}
      <div className="absolute top-1 right-1 w-4 h-4 opacity-50">
        <div className="w-full h-0.5 bg-[#00FF88] animate-pulse" />
        <div className="w-0.5 h-full bg-[#00FF88] animate-pulse absolute top-0 right-0" />
        <div className="w-1 h-1 bg-[#00FF88] rounded-full absolute top-0 right-0 animate-pulse" />
      </div>

      <div className="absolute bottom-1 left-1 w-4 h-4 opacity-50">
        <div className="w-full h-0.5 bg-[#FF0080] animate-pulse" />
        <div className="w-0.5 h-full bg-[#FF0080] animate-pulse" />
        <div className="w-1 h-1 bg-[#FF0080] rounded-full animate-pulse" />
      </div>

      <style jsx>{`
        @keyframes clockScan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
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

  // Initialize audio with your audio file
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Correct path for Next.js public folder
      const audioElement = new Audio('/ambSound.mp3');
      audioElement.loop = true;
      audioElement.volume = 0.3; // Adjust volume as needed
      audioElement.preload = 'auto';
      
      setAudio(audioElement);
      
      // Setup audio context for visualization
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 64;
      
      setAudioContext(context);
      setAnalyser(analyserNode);
      
      // Connect audio element to analyser when it's ready
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

  // Real-time audio analysis for visualization
  useEffect(() => {
    if (!isPlaying || !analyser) return;

    const updateVisualization = () => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      analyser.getByteFrequencyData(dataArray);
      
      // Map frequency data to bars (take every other sample to get 12 bars)
      const newBars = Array.from({ length: 12 }, (_, i) => {
        const index = Math.floor((i / 12) * bufferLength);
        return (dataArray[index] || 0) / 2.55; // Convert to 0-100 range
      });
      
      setBars(newBars);
      
      // Generate smooth frequency wave
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
        // Resume audio context if needed
        if (audioContext && audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        console.log('Starting audio playback...');
        await audio.play();
        setIsPlaying(true);
        console.log('Audio should be playing now');
      } catch (error) {
        console.error('Error playing audio:', error);
        // Fallback: try again after user interaction
        setTimeout(() => {
          audio.play().catch(console.error);
        }, 100);
      }
    } else {
      console.log('Pausing audio...');
      audio.pause();
      setIsPlaying(false);
    }
  };

  const reset = (): void => {
    console.log('Resetting audio...');
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    setBars(new Array(12).fill(0));
    setFrequency(new Array(12).fill(0));
    setIsPlaying(false);
  };

  return (
    <div className="w-full border-[1px] border-[#00FF88]/30 rounded-md p-3 bg-gradient-to-br from-[#00FF88]/5 to-transparent">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#00FF88] text-xs font-bold tracking-wide flex items-center gap-1">
          <Music size={12} />
          AUDIO SYNC
          {isPlaying && (
            <div className="w-1 h-1 bg-[#00FF88] rounded-full animate-pulse ml-1"></div>
          )}
        </h3>
        <span className="text-white text-xs flex items-center gap-1">
          {isPlaying ? (
            <>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              LIVE
            </>
          ) : (
            "READY"
          )}
        </span>
      </div>

      {/* Main Visualizer */}
      <div className="h-16 bg-black/50 rounded mb-2 p-2 overflow-hidden relative">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,255,136,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,255,136,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px'
            }}
          />
        </div>

        {/* Frequency bars */}
        <div className="flex items-end justify-center gap-1 h-full relative z-10">
          {bars.map((height, index) => (
            <div
              key={index}
              className="transition-all duration-100 ease-out rounded-sm"
              style={{
                width: '6px',
                height: `${isPlaying ? height : 0}%`,
                backgroundColor: `hsl(${120 + (height * 1.2)}, 100%, ${50 + (height * 0.3)}%)`,
                boxShadow: `0 0 ${height * 0.2}px hsl(${120 + (height * 1.2)}, 100%, 70%)`,
                animation: isPlaying ? 'pulse 0.5s ease-in-out infinite alternate' : 'none'
              }}
            />
          ))}
        </div>

        {/* Waveform overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="100%"
            height="100%"
            className="opacity-40"
          >
            <path
              d={`M 0 ${30} ${frequency.map((freq, i) => `L ${(i + 1) * 10} ${freq * 0.4}`).join(' ')}`}
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00FF88" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#00BFFF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FF0080" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-1">
        <button
          onClick={togglePlay}
          className="flex-1 flex items-center justify-center gap-1 bg-[#00FF88]/20 border border-[#00FF88]/50 rounded text-[#00FF88] text-xs py-1 hover:bg-[#00FF88]/30 transition-colors disabled:opacity-50"
          disabled={!audio}
        >
          {isPlaying ? <Pause size={10} /> : <Play size={10} />}
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
        <button
          onClick={reset}
          className="px-2 bg-[#FF0080]/20 border border-[#FF0080]/50 rounded text-[#FF0080] hover:bg-[#FF0080]/30 transition-colors disabled:opacity-50"
          disabled={!audio}
        >
          <Square size={10} />
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

const SideNavbar: React.FC = () => {
  return (
    <div className="w-[16.65%] py-3 h-full border-r-[3px] border-[#085948] relative overflow-hidden">
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        @keyframes glitch {
          0% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-2px);
          }
          40% {
            transform: translateX(2px);
          }
          60% {
            transform: translateX(-1px);
          }
          80% {
            transform: translateX(1px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="w-full h-[11.8%] bg-gradient-to-r from-[#000103] to-[#001a0f] border-b-[0.5px] px-5 border-[#00FF88]/30 flex items-center justify-center gap-3 relative">
        {/* Glowing border effect */}
        <div className="absolute inset-0 border-b-[1px] border-[#00FF88]/50 shadow-[0_1px_10px_rgba(0,255,136,0.3)]"></div>

        <div className="w-[50px] h-[50px] rounded-full relative overflow-hidden border-2 border-[#00FF88]/30">
          <Image
            className="w-full h-full object-cover"
            src={img}
            alt="not showing"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF88]/20 to-transparent"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-[#00FF88] uppercase font-bold text-lg tracking-wider drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
            Zerolag
          </h1>
          <p className="text-[#94A3B8] text-xs leading-none opacity-70 font-semibold tracking-wide">
            Decentralised AI studio
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col px-5 py-5 items-center justify-between h-[88.2%] bg-gradient-to-b from-[#01060A] to-[#000a03] relative overflow-hidden">
        {/* Animated background scan lines for bottom section only */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF88]/20 to-transparent"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)",
              animation: "scan 4s linear infinite",
            }}
          ></div>
        </div>

        <div className="flex w-full flex-col gap-3 relative z-10">
          <NavItem
            icon={Home}
            title="Home"
            subtitle="Command Center"
            isActive={true}
          />
          <NavItem
            icon={Zap}
            title="Create AI Agent"
            subtitle="Deploy Intelligence"
          />
          <NavItem
            icon={ShoppingBag}
            title="Marketplace"
            subtitle="Trade Assets"
          />
          <NavItem icon={Wallet} title="Wallet" subtitle="Crypto Vault" />
        </div>

        {/* Cyberpunk Clock and Music Visualizer at the bottom */}
        <div className="relative z-10 w-full">
          <CyberpunkClock />
          <MusicVisualizer />
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;