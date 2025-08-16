// "use client";

// const MusicVisualizer: React.FC = () => {
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);
//   const [bars, setBars] = useState<number[]>(new Array(12).fill(0));
//   const [frequency, setFrequency] = useState<number[]>(new Array(12).fill(0));
//   const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
//   const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
//   const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

//   // Initialize audio with your audio file
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       // Correct path for Next.js public folder
//       const audioElement = new Audio('/ambSound.mp3');
//       audioElement.loop = true;
//       audioElement.volume = 0.3; // Adjust volume as needed
//       audioElement.preload = 'auto';
      
//       setAudio(audioElement);
      
//       // Setup audio context for visualization
//       const context = new (window.AudioContext || (window as any).webkitAudioContext)();
//       const analyserNode = context.createAnalyser();
//       analyserNode.fftSize = 64;
      
//       setAudioContext(context);
//       setAnalyser(analyserNode);
      
//       // Connect audio element to analyser when it's ready
//       audioElement.addEventListener('canplaythrough', () => {
//         try {
//           const source = context.createMediaElementSource(audioElement);
//           source.connect(analyserNode);
//           analyserNode.connect(context.destination);
//         } catch (error) {
//           console.log('Audio already connected or error:', error);
//         }
//       });
//     }
//   }, []);

//   // Real-time audio analysis for visualization
//   useEffect(() => {
//     if (!isPlaying || !analyser) return;

//     const updateVisualization = () => {
//       const bufferLength = analyser.frequencyBinCount;
//       const dataArray = new Uint8Array(bufferLength);
      
//       analyser.getByteFrequencyData(dataArray);
      
//       // Map frequency data to bars (take every other sample to get 12 bars)
//       const newBars = Array.from({ length: 12 }, (_, i) => {
//         const index = Math.floor((i / 12) * bufferLength);
//         return (dataArray[index] || 0) / 2.55; // Convert to 0-100 range
//       });
      
//       setBars(newBars);
      
//       // Generate smooth frequency wave
//       const time = Date.now() / 1000;
//       const newFrequency = Array.from({ length: 12 }, (_, i) => {
//         const baseFreq = (dataArray[i * 2] || 0) / 2.55;
//         const wave = Math.sin(time + i * 0.3) * 10;
//         return Math.max(5, Math.min(95, baseFreq + wave));
//       });
      
//       setFrequency(newFrequency);
//     };

//     const interval = setInterval(updateVisualization, 60);
//     return () => clearInterval(interval);
//   }, [isPlaying, analyser]);

//   const togglePlay = async (): Promise<void> => {
//     if (!audio) return;

//     if (!isPlaying) {
//       try {
//         // Resume audio context if needed
//         if (audioContext && audioContext.state === 'suspended') {
//           await audioContext.resume();
//         }
        
//         console.log('Starting audio playback...');
//         await audio.play();
//         setIsPlaying(true);
//         console.log('Audio should be playing now');
//       } catch (error) {
//         console.error('Error playing audio:', error);
//         // Fallback: try again after user interaction
//         setTimeout(() => {
//           audio.play().catch(console.error);
//         }, 100);
//       }
//     } else {
//       console.log('Pausing audio...');
//       audio.pause();
//       setIsPlaying(false);
//     }
//   };

//   const reset = (): void => {
//     console.log('Resetting audio...');
//     if (audio) {
//       audio.pause();
//       audio.currentTime = 0;
//     }
    
//     setBars(new Array(12).fill(0));
//     setFrequency(new Array(12).fill(0));
//     setIsPlaying(false);
//   };

//   return (
//     <div className="w-full border-[1px] border-[#00FF88]/30 rounded-md p-3 bg-gradient-to-br from-[#00FF88]/5 to-transparent">
//       <div className="flex justify-between items-center mb-2">
//         <h3 className="text-[#00FF88] text-xs font-bold tracking-wide flex items-center gap-1">
//           <Music size={12} />
//           AUDIO SYNC
//           {isPlaying && (
//             <div className="w-1 h-1 bg-[#00FF88] rounded-full animate-pulse ml-1"></div>
//           )}
//         </h3>
//         <span className="text-white text-xs flex items-center gap-1">
//           {isPlaying ? (
//             <>
//               <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
//               LIVE
//             </>
//           ) : (
//             "READY"
//           )}
//         </span>
//       </div>

//       {/* Main Visualizer */}
//       <div className="h-16 bg-black/50 rounded mb-2 p-2 overflow-hidden relative">
//         {/* Background grid */}
//         <div className="absolute inset-0 opacity-20">
//           <div
//             className="w-full h-full"
//             style={{
//               backgroundImage: `
//                 linear-gradient(to right, rgba(0,255,136,0.1) 1px, transparent 1px),
//                 linear-gradient(to bottom, rgba(0,255,136,0.1) 1px, transparent 1px)
//               `,
//               backgroundSize: '8px 8px'
//             }}
//           />
//         </div>

//         {/* Frequency bars */}
//         <div className="flex items-end justify-center gap-1 h-full relative z-10">
//           {bars.map((height, index) => (
//             <div
//               key={index}
//               className="transition-all duration-100 ease-out rounded-sm"
//               style={{
//                 width: '6px',
//                 height: `${isPlaying ? height : 0}%`,
//                 backgroundColor: `hsl(${120 + (height * 1.2)}, 100%, ${50 + (height * 0.3)}%)`,
//                 boxShadow: `0 0 ${height * 0.2}px hsl(${120 + (height * 1.2)}, 100%, 70%)`,
//                 animation: isPlaying ? 'pulse 0.5s ease-in-out infinite alternate' : 'none'
//               }}
//             />
//           ))}
//         </div>

//         {/* Waveform overlay */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <svg
//             width="100%"
//             height="100%"
//             className="opacity-40"
//           >
//             <path
//               d={`M 0 ${30} ${frequency.map((freq, i) => `L ${(i + 1) * 10} ${freq * 0.4}`).join(' ')}`}
//               fill="none"
//               stroke="url(#waveGradient)"
//               strokeWidth="2"
//             />
//             <defs>
//               <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#00FF88" stopOpacity="0.8" />
//                 <stop offset="50%" stopColor="#00BFFF" stopOpacity="0.6" />
//                 <stop offset="100%" stopColor="#FF0080" stopOpacity="0.4" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex gap-1">
//         <button
//           onClick={togglePlay}
//           className="flex-1 flex items-center justify-center gap-1 bg-[#00FF88]/20 border border-[#00FF88]/50 rounded text-[#00FF88] text-xs py-1 hover:bg-[#00FF88]/30 transition-colors disabled:opacity-50"
//           disabled={!audio}
//         >
//           {isPlaying ? <Pause size={10} /> : <Play size={10} />}
//           {isPlaying ? "PAUSE" : "PLAY"}
//         </button>
//         <button
//           onClick={reset}
//           className="px-2 bg-[#FF0080]/20 border border-[#FF0080]/50 rounded text-[#FF0080] hover:bg-[#FF0080]/30 transition-colors disabled:opacity-50"
//           disabled={!audio}
//         >
//           <Square size={10} />
//         </button>
//       </div>

//       <style jsx>{`
//         @keyframes pulse {
//           0% { opacity: 1; }
//           100% { opacity: 0.7; }
//         }
//       `}</style>
//     </div>
//   );
// };

// // const SideNavbar: React.FC = () => {
// //   return (
// //     <div className="w-[16.65%] py-3 h-full border-r-[3px] border-[#085948] relative overflow-hidden">
// //       <style jsx>{`
// //         @keyframes scan {
// //           0% {
// //             transform: translateY(-100vh);
// //           }
// //           100% {
// //             transform: translateY(100vh);
// //           }
// //         }
// //         @keyframes glitch {
// //           0% {
// //             transform: translateX(0);
// //           }
// //           20% {
// //             transform: translateX(-2px);
// //           }
// //           40% {
// //             transform: translateX(2px);
// //           }
// //           60% {
// //             transform: translateX(-1px);
// //           }
// //           80% {
// //             transform: translateX(1px);
// //           }
// //           100% {
// //             transform: translateX(0);
// //           }
// //         }
// //       `}</style>

// //       <div className="w-full h-[11.8%] bg-gradient-to-r from-[#000103] to-[#001a0f] border-b-[0.5px] px-5 border-[#00FF88]/30 flex items-center justify-center gap-3 relative">
// //         {/* Glowing border effect */}
// //         <div className="absolute inset-0 border-b-[1px] border-[#00FF88]/50 shadow-[0_1px_10px_rgba(0,255,136,0.3)]"></div>

// //         <div className="w-[50px] h-[50px] rounded-full relative overflow-hidden border-2 border-[#00FF88]/30">
// //           <Image
// //             className="w-full h-full object-cover"
// //             src={img}
// //             alt="not showing"
// //           />
// //           <div className="absolute inset-0 bg-gradient-to-br from-[#00FF88]/20 to-transparent"></div>
// //         </div>

// //         <div className="relative z-10">
// //           <h1 className="text-[#00FF88] uppercase font-bold text-lg tracking-wider drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
// //             ZLag
// //           </h1>
// //           <p className="text-[#94A3B8] text-xs leading-none opacity-70 font-semibold tracking-wide">
// //             Decentralised AI studio
// //           </p>
// //         </div>
// //       </div>

// //       <div className="w-full flex flex-col px-5 py-5 items-center justify-between h-[88.2%] bg-gradient-to-b from-[#01060A] to-[#000a03] relative overflow-hidden">
// //         {/* Animated background scan lines for bottom section only */}
// //         <div className="absolute inset-0 opacity-15 pointer-events-none">
// //           <div
// //             className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF88]/20 to-transparent"
// //             style={{
// //               backgroundImage:
// //                 "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)",
// //               animation: "scan 4s linear infinite",
// //             }}
// //           ></div>
// //         </div>

// //         <div className="flex w-full flex-col gap-3 relative z-10">
// //           <NavItem
// //             icon={Home}
// //             title="Home"
// //             subtitle="Command Center"
// //             isActive={true}
// //           />
// //           <NavItem
// //             icon={Zap}
// //             title="Create AI Agent"
// //             subtitle="Deploy Intelligence"
// //           />
// //           <NavItem
// //             icon={ShoppingBag}
// //             title="Marketplace"
// //             subtitle="Trade Assets"
// //           />
// //           <NavItem icon={Wallet} title="Wallet" subtitle="Crypto Vault" />
// //         </div>

// //         {/* Cyberpunk Clock and Music Visualizer at the bottom */}
// //         <div className="relative z-10 w-full">
// //           <CyberpunkClock />
// //           <MusicVisualizer />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SideNavbar;




// import React, { useState, useEffect } from "react";
// import img from "../../public/coinhehe-removebg-preview.png";
// import Image from "next/image";
// import {
//   Home,
//   Zap,
//   Settings,
//   ShoppingBag,
//   Vote,
//   Wallet,
//   TrendingUp,
//   Users,
//   FileText,
//   Play,
//   Pause,
//   RotateCcw,
//   Music,
//   Square,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// interface NavItemProps {
//   icon: React.ComponentType<{ className?: string; size?: number }>;
//   title: string;
//   subtitle: string;
//   isActive?: boolean;
//   path?: string;
// }

// const NavItem: React.FC<NavItemProps> = ({
//   icon: Icon,
//   title,
//   subtitle,
//   isActive = false,
//   path,
// }) => {
//   const router = useRouter();

//   const handleClick = () => {
//     if (path) {
//       router.push(path);
//     }
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className={`
//     relative w-full h-[60px] border-[1px] flex gap-4 items-center justify-start px-4 rounded-md 
//     cursor-pointer transition-all duration-300 group overflow-hidden
//     ${
//       isActive
//         ? "border-[#00FF88] bg-gradient-to-r from-[#00FF88]/10 to-transparent shadow-[0_0_20px_rgba(0,255,136,0.3)]"
//         : "border-[#05352C] hover:border-[#00FF88] hover:bg-gradient-to-r hover:from-[#00FF88]/5 hover:to-transparent"
//     }
//   `}
//     >
//       {/* Scan lines effect */}
//       <div className="absolute inset-0 opacity-20 pointer-events-none">
//         <div
//           className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FF88]/10 to-transparent animate-pulse"
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)",
//           }}
//         ></div>
//       </div>

//       {/* Glitch effect on hover */}
//       <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none">
//         <div className="absolute inset-0 bg-gradient-to-r from-[#FF0080]/20 to-[#00FF88]/20 animate-pulse"></div>
//       </div>

//       <Icon
//         className={`${
//           isActive ? "text-[#00FF88]" : "text-[#fff]/70"
//         } group-hover:text-[#00FF88] transition-colors duration-300 relative z-10`}
//         size={20}
//       />
//       <div className="leading-none relative z-10">
//         <h1
//           className={`text-md tracking-wide font-medium transition-colors duration-300 ${
//             isActive ? "text-[#00FF88]" : "text-white group-hover:text-[#00FF88]"
//           }`}
//         >
//           {title}
//         </h1>
//         <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors duration-300">
//           {subtitle}
//         </p>
//       </div>

//       {/* Corner accent */}
//       <div
//         className={`absolute top-0 right-0 w-0 h-0 border-l-[8px] border-b-[8px] border-l-transparent transition-all duration-300 ${
//           isActive
//             ? "border-b-[#00FF88]"
//             : "border-b-transparent group-hover:border-b-[#00FF88]"
//         }`}
//       ></div>
//     </div>
//   );
// };

// const CyberpunkClock: React.FC = () => {
//   const [time, setTime] = useState<Date>(new Date());
//   const [glitchText, setGlitchText] = useState<string>("");

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTime(new Date());

//       // Occasional glitch effect on seconds
//       if (Math.random() < 0.1) {
//         const glitchChars = ["█", "▓", "▒", "░", "◆", "◇", "▀", "▄"];
//         setGlitchText(
//           glitchChars[Math.floor(Math.random() * glitchChars.length)]
//         );
//         setTimeout(() => setGlitchText(""), 100);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const formatTime = (
//     date: Date
//   ): { hours: string; minutes: string; seconds: string } => {
//     return {
//       hours: date.getHours().toString().padStart(2, "0"),
//       minutes: date.getMinutes().toString().padStart(2, "0"),
//       seconds: date.getSeconds().toString().padStart(2, "0"),
//     };
//   };

//   const { hours, minutes, seconds } = formatTime(time);

//   return (
//     <div className="w-full border-[1px] border-[#00FF88]/30 rounded-md p-3 mb-3 bg-gradient-to-br from-[#00FF88]/5 to-transparent relative overflow-hidden">
//       {/* Scanning line effect */}
//       <div className="absolute inset-0 opacity-30 pointer-events-none">
//         <div
//           className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF88]/20 to-transparent"
//           style={{
//             animation: "clockScan 3s linear infinite",
//             background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)",
//           }}
//         />
//       </div>

//       <div className="flex justify-between items-center mb-2 relative z-10">
//         <h3 className="text-[#00FF88] text-xs font-bold tracking-wide flex items-center gap-1">
//           <div className="w-2 h-2 border border-[#00FF88] rounded-full animate-pulse" />
//           SYSTEM TIME
//         </h3>
//         <span className="text-[#FF0080] text-xs font-mono">
//           {time
//             .toLocaleDateString("en-US", {
//               month: "short",
//               day: "2-digit",
//               year: "2-digit",
//             })
//             .toUpperCase()}
//         </span>
//       </div>

//       {/* Digital Clock Display */}
//       <div className="relative z-10 flex items-center justify-center">
//         <div className="font-mono text-2xl font-bold tracking-wider flex items-center gap-1">
//           <span className="text-[#00FF88] drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]">
//             {hours}
//           </span>
//           <span className="text-[#00BFFF] animate-pulse text-xl">:</span>
//           <span className="text-[#00BFFF] drop-shadow-[0_0_10px_rgba(0,191,255,0.8)]">
//             {minutes}
//           </span>
//           <span className="text-[#FF0080] animate-pulse text-xl">:</span>
//           <span className="text-[#FF0080] drop-shadow-[0_0_10px_rgba(255,0,128,0.8)] relative">
//             {glitchText || seconds}
//           </span>
//         </div>
//       </div>

//       <div className="absolute top-1 right-1 w-4 h-4 opacity-50">
//         <div className="w-full h-0.5 bg-[#00FF88] animate-pulse" />
//         <div className="w-0.5 h-full bg-[#00FF88] animate-pulse absolute top-0 right-0" />
//         <div className="w-1 h-1 bg-[#00FF88] rounded-full absolute top-0 right-0 animate-pulse" />
//       </div>

//       <div className="absolute bottom-1 left-1 w-4 h-4 opacity-50">
//         <div className="w-full h-0.5 bg-[#FF0080] animate-pulse" />
//         <div className="w-0.5 h-full bg-[#FF0080] animate-pulse" />
//         <div className="w-1 h-1 bg-[#FF0080] rounded-full animate-pulse" />
//       </div>

//       <style jsx>{`
//         @keyframes clockScan {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(100%);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// // MusicVisualizer unchanged (not shown here due to length)

// const SideNavbar: React.FC = () => {
//   return (
//     <div className="w-[16.65%] py-3 h-full border-r-[3px] border-[#085948] relative overflow-hidden">
//       <style jsx>{`
//         @keyframes scan {
//           0% {
//             transform: translateY(-100vh);
//           }
//           100% {
//             transform: translateY(100vh);
//           }
//         }
//         @keyframes glitch {
//           0% {
//             transform: translateX(0);
//           }
//           20% {
//             transform: translateX(-2px);
//           }
//           40% {
//             transform: translateX(2px);
//           }
//           60% {
//             transform: translateX(-1px);
//           }
//           80% {
//             transform: translateX(1px);
//           }
//           100% {
//             transform: translateX(0);
//           }
//         }
//       `}</style>

//       <div className="w-full h-[11.8%] bg-gradient-to-r from-[#000103] to-[#001a0f] border-b-[0.5px] px-5 border-[#00FF88]/30 flex items-center justify-center gap-3 relative">
//         <div className="absolute inset-0 border-b-[1px] border-[#00FF88]/50 shadow-[0_1px_10px_rgba(0,255,136,0.3)]"></div>

//         <div className="w-[50px] h-[50px] rounded-full relative overflow-hidden border-2 border-[#00FF88]/30">
//           <Image
//             className="w-full h-full object-cover"
//             src={img}
//             alt="not showing"
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-[#00FF88]/20 to-transparent"></div>
//         </div>

//         <div className="relative z-10">
//           <h1 className="text-[#00FF88] uppercase font-bold text-lg tracking-wider drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
//             ZLag
//           </h1>
//           <p className="text-[#94A3B8] text-xs leading-none opacity-70 font-semibold tracking-wide">
//             Decentralised AI studio
//           </p>
//         </div>
//       </div>

//       <div className="w-full flex flex-col px-5 py-5 items-center justify-between h-[88.2%] bg-gradient-to-b from-[#01060A] to-[#000a03] relative overflow-hidden">
//         <div className="absolute inset-0 opacity-15 pointer-events-none">
//           <div
//             className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF88]/20 to-transparent"
//             style={{
//               backgroundImage:
//                 "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)",
//               animation: "scan 4s linear infinite",
//             }}
//           ></div>
//         </div>

//         <div className="flex w-full flex-col gap-3 relative z-10">
//           <NavItem
//             icon={Home}
//             title="Home"
//             subtitle="Command Center"
//             isActive={true}
//             path="/"
//           />
//           <NavItem
//             icon={Zap}
//             title="Create AI Agent"
//             subtitle="Deploy Intelligence"
//             path="/createAgent"
//           />
//           <NavItem
//             icon={ShoppingBag}
//             title="Marketplace"
//             subtitle="Trade Assets"
//             path="/marketplace"
//           />
//           <NavItem icon={Wallet} title="Wallet" subtitle="Crypto Vault" path="/wallet" />
//         </div>

//         <div className="relative z-10 w-full">
//           <CyberpunkClock />
//           <MusicVisualizer />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SideNavbar;



// version 2
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

  const handleClick = () => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative w-full h-[60px] border flex gap-4 items-center justify-start px-4 rounded-lg 
        cursor-pointer transition-all duration-500 group overflow-hidden
        bg-gradient-to-r from-white/[0.03] via-white/[0.01] to-transparent
        backdrop-blur-sm
        ${
          isActive
            ? "border-[#4cc9ff]/60 shadow-[0_0_35px_rgba(76,201,255,0.4)] ring-1 ring-inset ring-white/10"
            : "border-white/10 hover:border-[#4cc9ff]/50 hover:shadow-[0_0_25px_rgba(76,201,255,0.3)]"
        }
      `}
    >
      {/* Liquid flow background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: isActive 
              ? 'radial-gradient(80% 120% at 30% 50%, rgba(76,201,255,0.15), rgba(122,92,255,0.1) 40%, transparent 70%)'
              : 'radial-gradient(100% 100% at 70% 30%, rgba(76,201,255,0.08), transparent 60%)',
            animation: 'liquidFlow 4s ease-in-out infinite alternate'
          }}
        />
      </div>

      {/* Glossy highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

      <Icon
        className={`${
          isActive ? "text-[#4cc9ff]" : "text-white/70"
        } group-hover:text-[#4cc9ff] transition-all duration-300 relative z-10 drop-shadow-sm`}
        size={20}
      />
      <div className="leading-none relative z-10">
        <h1
          className={`text-md tracking-wide font-medium transition-all duration-300 ${
            isActive ? "text-white" : "text-white group-hover:text-[#4cc9ff]"
          }`}
        >
          {title}
        </h1>
        <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors duration-300">
          {subtitle}
        </p>
      </div>

      {/* Corner glow */}
      <div
        className={`absolute top-1 right-1 w-2 h-2 rounded-full transition-all duration-300 ${
          isActive
            ? "bg-[#4cc9ff] shadow-[0_0_4px_rgba(76,201,255,0.6)]"
            : "bg-transparent group-hover:bg-[#4cc9ff] group-hover:shadow-[0_0_3px_rgba(76,201,255,0.25)]"
        }`}
      />

      <style jsx>{`
        @keyframes liquidFlow {
          0% { transform: translateX(-20%) rotate(0deg); }
          100% { transform: translateX(20%) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

const CyberpunkClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [glitchText, setGlitchText] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());

      if (Math.random() < 0.08) {
        const glitchChars = ["█", "▓", "▒", "░", "◆", "◇", "▀", "▄"];
        setGlitchText(
          glitchChars[Math.floor(Math.random() * glitchChars.length)]
        );
        setTimeout(() => setGlitchText(""), 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (
    date: Date
  ): { hours: string; minutes: string; seconds: string } => {
    return {
      hours: date.getHours().toString().padStart(2, "0"),
      minutes: date.getMinutes().toString().padStart(2, "0"),
      seconds: date.getSeconds().toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <div className="w-full border border-white/10 rounded-lg p-4 mb-3 relative overflow-hidden bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent backdrop-blur-sm shadow-[0_0_30px_rgba(76,201,255,0.15)]">
      
      {/* Flowing background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'conic-gradient(from 45deg at 50% 50%, rgba(76,201,255,0.2), rgba(0,255,240,0.15), rgba(122,92,255,0.1), rgba(76,201,255,0.2))',
            animation: 'clockFlow 6s linear infinite'
          }}
        />
      </div>

      <div className="flex justify-between items-center mb-3 relative z-10">
        <h3 className="text-[#4cc9ff] text-xs font-bold tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 border border-[#4cc9ff] rounded-full animate-pulse shadow-[0_0_6px_rgba(76,201,255,0.6)]" />
          SYSTEM TIME
        </h3>
        <span className="text-[#00fff0] text-xs font-mono tracking-wide">
          {time
            .toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "2-digit",
            })
            .toUpperCase()}
        </span>
      </div>

      <div className="relative z-10 flex items-center justify-center">
        <div className="font-mono text-3xl font-bold tracking-wider flex items-center gap-2">
          <span className="text-[#4cc9ff] drop-shadow-[0_0_15px_rgba(76,201,255,0.8)]">
            {hours}
          </span>
          <span className="text-[#00fff0] animate-pulse text-2xl">:</span>
          <span className="text-[#7a5cff] drop-shadow-[0_0_15px_rgba(122,92,255,0.8)]">
            {minutes}
          </span>
          <span className="text-[#4cc9ff] animate-pulse text-2xl">:</span>
          <span className="text-[#00fff0] drop-shadow-[0_0_15px_rgba(0,255,240,0.8)]">
            {glitchText || seconds}
          </span>
        </div>
      </div>

      {/* Glass highlights */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <style jsx>{`
        @keyframes clockFlow {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1.05); }
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
    <div className="w-full border border-white/10 rounded-lg p-3 relative overflow-hidden bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent backdrop-blur-sm">
      
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#4cc9ff] text-xs font-bold tracking-wider flex items-center gap-2">
          <Music size={12} />
          AUDIO SYNC
          {isPlaying && (
            <div className="w-1.5 h-1.5 bg-[#00fff0] rounded-full animate-pulse shadow-[0_0_4px_rgba(0,255,240,0.8)]" />
          )}
        </h3>
        <span className="text-white/70 text-xs flex items-center gap-1 font-mono">
          {isPlaying ? (
            <>
              <div className="w-1 h-1 bg-[#00fff0] rounded-full animate-pulse" />
              LIVE
            </>
          ) : (
            "READY"
          )}
        </span>
      </div>

      {/* Main Visualizer */}
      <div className="h-16 bg-black/40 rounded-lg mb-3 p-2 overflow-hidden relative backdrop-blur-sm border border-white/5">
        
        {/* Liquid background */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="w-full h-full rounded-lg"
            style={{
              background: 'radial-gradient(50% 50% at 50% 50%, rgba(76,201,255,0.15), rgba(0,255,240,0.1) 50%, transparent 80%)',
              animation: isPlaying ? 'visualizerFlow 2s ease-in-out infinite alternate' : 'none'
            }}
          />
        </div>

        {/* Background grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(76,201,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,255,240,0.1) 1px, transparent 1px)
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
                background: `linear-gradient(to top, #4cc9ff, #00fff0 ${height * 0.5}%, #7a5cff)`,
                boxShadow: `0 0 ${height * 0.3}px rgba(76,201,255,0.6)`,
                animation: isPlaying ? 'barPulse 0.3s ease-in-out infinite alternate' : 'none'
              }}
            />
          ))}
        </div>

        {/* Waveform overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="100%" height="100%" className="opacity-50">
            <path
              d={`M 0 ${30} ${frequency.map((freq, i) => `L ${(i + 1) * 10} ${freq * 0.4}`).join(' ')}`}
              fill="none"
              stroke="url(#liquidGradient)"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4cc9ff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#00fff0" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#7a5cff" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={togglePlay}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4cc9ff]/20 via-[#00fff0]/15 to-[#4cc9ff]/20 border border-[#4cc9ff]/40 rounded-md text-[#4cc9ff] text-xs py-2 hover:border-[#00fff0]/60 hover:text-[#00fff0] transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
          disabled={!audio}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
        <button
          onClick={reset}
          className="px-3 bg-gradient-to-r from-[#7a5cff]/20 to-[#4cc9ff]/20 border border-[#7a5cff]/40 rounded-md text-[#7a5cff] hover:border-[#7a5cff]/60 transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
          disabled={!audio}
        >
          <Square size={12} />
        </button>
      </div>

      <style jsx>{`
        @keyframes visualizerFlow {
          0% { transform: scale(1) rotate(0deg); }
          100% { transform: scale(1.02) rotate(1deg); }
        }
        @keyframes barPulse {
          0% { opacity: 0.8; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const SideNavbar: React.FC = () => {
  return (
    <div className="w-[16.65%] py-4 h-full relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] border-r border-white/10">
      
      {/* Liquid background overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(60% 80% at 20% 30%, rgba(76,201,255,0.25), transparent 70%),
              radial-gradient(70% 60% at 80% 70%, rgba(0,255,240,0.2), transparent 70%),
              radial-gradient(50% 90% at 50% 50%, rgba(122,92,255,0.15), transparent 80%)
            `,
            animation: 'backgroundFlow 8s ease-in-out infinite alternate'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes backgroundFlow {
          0% { 
            transform: translateY(-2%) rotate(0deg); 
            filter: blur(40px);
          }
          100% { 
            transform: translateY(2%) rotate(2deg); 
            filter: blur(50px);
          }
        }
      `}</style>

      {/* Header */}
      <div className="w-full h-[12%] relative px-5 flex items-center gap-3 bg-gradient-to-r from-black/60 via-white/[0.02] to-black/60 border-b border-white/10 backdrop-blur-sm">
        
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden relative border border-white/20 shadow-[0_0_20px_rgba(76,201,255,0.3)]">
          <Image className="w-full h-full object-cover" src={img} alt="ZLag" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#4cc9ff]/20 via-transparent to-[#00fff0]/20" />
        </div>
        
        <div className="relative z-10">
          <h1 className="font-bold text-lg tracking-widest">
            <span className="text-[#4cc9ff] drop-shadow-[0_0_8px_rgba(76,201,255,0.8)]">Z</span>
            <span className="text-[#00fff0] drop-shadow-[0_0_8px_rgba(0,255,240,0.8)]">Lag</span>
          </h1>
          <p className="text-white/60 text-[11px] tracking-wide font-medium">
            Decentralised AI studio
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full flex flex-col px-5 py-5 items-center justify-between h-[88%] relative">
        
        <div className="flex w-full flex-col gap-3 relative z-10">
          <NavItem
            icon={Home}
            title="Home"
            subtitle="Command Center"
            isActive={true}
            path="/"
          />
          <NavItem
            icon={Zap}
            title="Create AI Agent"
            subtitle="Deploy Intelligence"
            path="/createAgent"
          />
          <NavItem
            icon={ShoppingBag}
            title="Marketplace"
            subtitle="Trade Assets"
            path="/marketplace"
          />
          <NavItem 
            icon={Wallet} 
            title="Wallet" 
            subtitle="Crypto Vault" 
            path="/wallet" 
          />
        </div>

        <div className="relative z-10 w-full">
          <CyberpunkClock />
          <MusicVisualizer />
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
