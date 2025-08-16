import { Zap } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

const MainFooter = () => {
  const router = useRouter();

  // Navigation handlers
  const handleLaunchStudio = () => {
    router.push('/createAgent');
  };

  const handleLearnMore = () => {
    window.open('https://zerolag.space', '_blank');
  }

  return (
    <div className="w-full h-[40vh] relative overflow-hidden bg-gradient-to-br from-[#020204] via-[#0a0a0a] to-[#020204] border border-white/5 rounded-lg mt-10 mb-5 group backdrop-blur-sm">
      
      {/* Liquid background overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: `
              radial-gradient(60% 80% at 20% 30%, rgba(147,51,234,0.1), transparent 70%),
              radial-gradient(70% 60% at 80% 70%, rgba(168,85,247,0.08), transparent 70%),
              radial-gradient(50% 90% at 50% 50%, rgba(124,58,237,0.05), transparent 80%)
            `,
            animation: 'footerFlow 10s ease-in-out infinite alternate'
          }}
        />
      </div>

      {/* Corner brackets with neon glow */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#9333ea]/40 shadow-[0_0_4px_rgba(147,51,234,0.3)]"></div>
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#a855f7]/40 shadow-[0_0_4px_rgba(168,85,247,0.3)]"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#7c3aed]/40 shadow-[0_0_4px_rgba(124,58,237,0.3)]"></div>
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#9333ea]/40 shadow-[0_0_4px_rgba(147,51,234,0.3)]"></div>

      {/* Flowing border overlay */}
      <div className="absolute inset-0 border border-[#9333ea]/10 rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.08)]"></div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-8 rounded-lg"
        style={{
          backgroundImage: `
            linear-gradient(rgba(147,51,234,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Neon accent lines */}
      <div className="absolute top-4 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#9333ea]/35 to-transparent shadow-[0_0_3px_rgba(147,51,234,0.4)]"></div>
      <div className="absolute bottom-4 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#a855f7]/35 to-transparent shadow-[0_0_3px_rgba(168,85,247,0.4)]"></div>

      {/* Glass highlights */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20" />

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">
        
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9333ea] via-[#a855f7] to-[#7c3aed] bg-clip-text text-transparent tracking-wider text-center"
              style={{
                textShadow: '0 0 10px rgba(147,51,234,0.25), 0 0 20px rgba(168,85,247,0.15)',
                filter: 'drop-shadow(0 0 5px rgba(147,51,234,0.2))'
              }}>
            READY TO CREATE?
          </h1>
        </div>

        {/* Description */}
        <div className="mb-8 max-w-3xl">
          <p className="text-white/80 text-center text-lg tracking-wide leading-relaxed">
            Join thousands of creators building the future of decentralized AI.
            <br />
            <span className="text-[#9333ea]">Start creating, sharing, and monetizing</span> your AI Agents today.
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full flex gap-6 justify-center items-center relative z-10">
          
          {/* Primary Button - Launch AI Studio */}
          <div className="relative group/btn">
            {/* Button glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea]/10 to-[#a855f7]/10 blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-lg"></div>

            <button 
              onClick={handleLaunchStudio}
              className="relative w-64 h-12 bg-gradient-to-r from-[#9333ea] to-[#a855f7] border border-[#9333ea]/30 text-white font-bold tracking-wider uppercase transition-all duration-300 hover:from-[#9333ea]/90 hover:to-[#a855f7]/90 hover:border-[#9333ea]/40 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3 rounded-lg backdrop-blur-sm cursor-pointer"
            >
              
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#9333ea] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#a855f7] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#9333ea] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#a855f7] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

              {/* Glass highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />

              <Zap
                size={20}
                className="transition-transform duration-300 group-hover/btn:rotate-12 text-white relative z-10"
              />
              <span className="text-base relative z-10">Launch AI Studio</span>
            </button>
          </div>

          {/* Secondary Button - Learn More */}
          <div className="relative group/btn2">
            <button 
              onClick={handleLearnMore}
              className="relative w-56 h-12 bg-gradient-to-r from-black/70 to-black/50 border-2 border-[#7c3aed]/30 text-[#9333ea] font-bold tracking-wider uppercase transition-all duration-300 hover:border-[#9333ea]/40 hover:bg-gradient-to-r hover:from-[#9333ea]/05 hover:to-[#a855f7]/05 hover:text-[#a855f7] hover:shadow-[0_0_10px_rgba(147,51,234,0.2)] hover:scale-105 active:scale-95 flex items-center justify-center rounded-lg backdrop-blur-sm cursor-pointer"
            >
              
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#7c3aed] transition-all duration-300 group-hover/btn2:border-[#9333ea] group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#7c3aed] transition-all duration-300 group-hover/btn2:border-[#a855f7] group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#7c3aed] transition-all duration-300 group-hover/btn2:border-[#9333ea] group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#7c3aed] transition-all duration-300 group-hover/btn2:border-[#a855f7] group-hover/btn2:w-5 group-hover/btn2:h-5"></div>

              {/* Glass highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-20" />

              <span className="text-base relative z-10">Learn More</span>

              {/* Data stream effect */}
              <div className="absolute left-0 top-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7c3aed]/0 to-transparent group-hover/btn2:via-[#9333ea]/30 transition-all duration-500"></div>
            </button>
          </div>
        </div>

        {/* Bottom accent elements */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          <div className="w-2 h-2 bg-[#9333ea] rotate-45 shadow-[0_0_2px_rgba(147,51,234,0.4)] animate-pulse"></div>
          <div className="w-2 h-2 bg-[#a855f7] rotate-45 shadow-[0_0_2px_rgba(168,85,247,0.4)] animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-2 h-2 bg-[#7c3aed] rotate-45 shadow-[0_0_2px_rgba(124,58,237,0.4)] animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes footerFlow {
          0% { 
            transform: translateY(-2%) rotate(0deg) scale(1); 
            filter: blur(60px);
          }
          100% { 
            transform: translateY(2%) rotate(2deg) scale(1.05); 
            filter: blur(40px);
          }
        }
      `}</style>
    </div>
  );
};

export default MainFooter;