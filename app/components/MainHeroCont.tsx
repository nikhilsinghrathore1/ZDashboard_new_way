"use client"
import React, { useRef, useCallback } from 'react'
import { ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const MainHeroCont = () => {
  const containerRef = useRef(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const trailIdRef = useRef(0);
  const activeTrails = useRef(new Map());
  const router = useRouter();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !trailContainerRef.current) return;
    
    // @ts-ignore
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate which grid block we're hovering (30px grid)
    const blockX = Math.floor(x / 30);
    const blockY = Math.floor(y / 30);
    const blockKey = `${blockX}-${blockY}`;
    
    // Don't create duplicate blocks at same position
    if (activeTrails.current.has(blockKey)) return;
    
    // Create trail block element directly
    const trailBlock = document.createElement('div');
    const trailId = trailIdRef.current++;
    
    trailBlock.className = 'absolute pointer-events-none';
    trailBlock.style.cssText = `
      left: ${blockX * 30}px;
      top: ${blockY * 30}px;
      width: 30px;
      height: 30px;
      background: linear-gradient(45deg, rgba(76,201,255,0.24), rgba(0,255,240,0.16));
      border: 1px solid rgba(76,201,255,0.64);
      box-shadow: 0 0 12px rgba(76,201,255,0.48), inset 0 0 6px rgba(0,255,240,0.32);
      transform: scale(1);
      transition: all 0.1s ease-out;
      opacity: 0.8;
      border-radius: 4px;
      animation: trailFadeOut 1s ease-out forwards;
    `;
    
    // Add to DOM and track it
    trailContainerRef.current.appendChild(trailBlock);
    activeTrails.current.set(blockKey, trailBlock);
    
    // Remove after animation
    setTimeout(() => {
      if (trailBlock.parentNode) {
        trailBlock.parentNode.removeChild(trailBlock);
      }
      activeTrails.current.delete(blockKey);
    }, 1000);
    
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Clear all trails
    if (trailContainerRef.current) {
      trailContainerRef.current.innerHTML = '';
    }
    activeTrails.current.clear();
  }, []);

  // Navigation handlers
  const handleCreateAgent = useCallback(() => {
    router.push('/createAgent');
  }, [router]);

  const handleExploreMarketplace = useCallback(() => {
    router.push('/marketplace');
  }, [router]);

  return (
    <div                 
      ref={containerRef}
      className="w-full h-[50vh] flex flex-col justify-center items-start px-12 rounded-2xl relative overflow-hidden"                
      style={{                    
        background: 'linear-gradient(135deg, #020204 0%, #0a0a0f 25%, #0f0f1a 50%, #0a0a0f 75%, #020204 100%)'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Liquid background overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `
              radial-gradient(60% 80% at 20% 30%, rgba(76,201,255,0.2), transparent 70%),
              radial-gradient(70% 60% at 80% 70%, rgba(0,255,240,0.15), transparent 70%),
              radial-gradient(50% 90% at 50% 50%, rgba(122,92,255,0.1), transparent 80%)
            `,
            animation: 'heroFlow 12s ease-in-out infinite alternate'
          }}
        />
      </div>

      {/* Grid pattern with interactive hover */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(76,201,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,240,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      />
      
      {/* Trail container - no state, direct DOM manipulation */}
      <div 
        ref={trailContainerRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Neon laser beams */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#4cc9ff] to-transparent opacity-70"
          style={{
            top: '15%',
            animation: 'laserSweep1 4s infinite linear',
            boxShadow: '0 0 10px rgba(76,201,255,0.8)'
          }}
        />
        <div 
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#00fff0] to-transparent opacity-50"
          style={{
            top: '35%',
            animation: 'laserSweep2 5s infinite linear',
            boxShadow: '0 0 8px rgba(0,255,240,0.6)'
          }}
        />
        <div 
          className="absolute w-full h-[3px] bg-gradient-to-r from-transparent via-[#7a5cff] to-transparent opacity-40"
          style={{
            top: '55%',
            animation: 'laserSweep3 6s infinite linear',
            boxShadow: '0 0 12px rgba(122,92,255,0.7)'
          }}
        />
        <div 
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#4cc9ff] to-transparent opacity-60"
          style={{
            top: '75%',
            animation: 'laserSweep4 4.5s infinite linear',
            boxShadow: '0 0 6px rgba(76,201,255,0.5)'
          }}
        />
        <div 
          className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#00fff0] to-transparent opacity-45"
          style={{
            top: '85%',
            animation: 'laserSweep5 7s infinite linear',
            boxShadow: '0 0 9px rgba(0,255,240,0.6)'
          }}
        />
        <div 
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#7a5cff] to-transparent opacity-35"
          style={{
            top: '25%',
            animation: 'laserSweep6 5.5s infinite linear',
            boxShadow: '0 0 7px rgba(122,92,255,0.5)'
          }}
        />
        <div 
          className="absolute w-full h-[4px] bg-gradient-to-r from-transparent via-[#4cc9ff] to-transparent opacity-25"
          style={{
            top: '65%',
            animation: 'laserSweep7 6.5s infinite linear',
            boxShadow: '0 0 15px rgba(76,201,255,0.4)'
          }}
        />
      </div>
      
      {/* Floating energy particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: i % 3 === 0 ? '#4cc9ff' : i % 3 === 1 ? '#00fff0' : '#7a5cff',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.3,
              animation: `energyFloat${i % 6 + 1} ${Math.random() * 3 + 4}s infinite ease-in-out`,
              boxShadow: `0 0 ${Math.random() * 8 + 4}px currentColor`
            }}
          />
        ))}
      </div>
      
      {/* CSS animations */}
      <style jsx>{`
        @keyframes trailFadeOut {
          0% { 
            opacity: 0.8; 
            transform: scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.7); 
          }
        }
        @keyframes heroFlow {
          0% { 
            transform: translateX(-3%) rotate(0deg) scale(1); 
            filter: blur(60px);
          }
          100% { 
            transform: translateX(3%) rotate(3deg) scale(1.05); 
            filter: blur(40px);
          }
        }
        @keyframes laserSweep1 {
          0%, 90%, 100% { transform: translateX(-100%); opacity: 0; }
          5%, 85% { transform: translateX(100vw); opacity: 0.7; }
        }
        @keyframes laserSweep2 {
          0%, 85%, 100% { transform: translateX(100vw); opacity: 0; }
          10%, 75% { transform: translateX(-100%); opacity: 0.5; }
        }
        @keyframes laserSweep3 {
          0%, 88%, 100% { transform: translateX(-100%); opacity: 0; }
          15%, 78% { transform: translateX(100vw); opacity: 0.4; }
        }
        @keyframes laserSweep4 {
          0%, 82%, 100% { transform: translateX(100vw); opacity: 0; }
          20%, 72% { transform: translateX(-100%); opacity: 0.6; }
        }
        @keyframes laserSweep5 {
          0%, 87%, 100% { transform: translateX(-100%); opacity: 0; }
          25%, 77% { transform: translateX(100vw); opacity: 0.45; }
        }
        @keyframes laserSweep6 {
          0%, 83%, 100% { transform: translateX(100vw); opacity: 0; }
          18%, 73% { transform: translateX(-100%); opacity: 0.35; }
        }
        @keyframes laserSweep7 {
          0%, 89%, 100% { transform: translateX(-100%); opacity: 0; }
          22%, 79% { transform: translateX(100vw); opacity: 0.25; }
        }
        @keyframes energyFloat1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.4); }
        }
        @keyframes energyFloat2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(0.8); }
        }
        @keyframes energyFloat3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.6); }
        }
        @keyframes energyFloat4 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-22px) scale(1.2); }
        }
        @keyframes energyFloat5 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-28px) scale(1.5); }
        }
        @keyframes energyFloat6 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(0.9); }
        }
      `}</style>
                    
      <p className="text-[3.7rem] leading-none text-white font-bold relative z-10">         
        <span            
          className="text-[#4cc9ff] text-[3.7rem]"           
          style={{             
            textShadow: '0 0 8px rgba(76,201,255,0.8), 0 0 25px rgba(76,201,255,0.5), 0 0 50px rgba(76,201,255,0.3)',             
            filter: 'drop-shadow(0 0 15px rgba(76,201,255,0.6))'           
          }}         
        >           
          Decentralized AI <br />         
        </span>         
        <span className="bg-gradient-to-r from-white via-[#00fff0] to-white bg-clip-text text-transparent">
          Studio & Marketplace
        </span>       
      </p>                       
      
      <p className="text-[#94A3B8] text-[1.3rem] w-[60%] leading-[1.7rem] tracking-wide mt-2 relative z-10">         
        Create, own, and monetize AI models as NFTs. Your AI, Your Rules — No Middlemen.       
      </p>                  
      
      <div className="w-full flex gap-5 items-center mt-6 relative z-10">                          
        <div            
          onClick={handleCreateAgent}
          className="w-[20%] h-[40px] rounded-lg gap-3 bg-gradient-to-r from-[#4cc9ff] to-[#049e94] items-center justify-center text-white flex cursor-pointer transition-all duration-300 ease-out hover:from-[#4cc9ff]/80 hover:to-[#00fff0]/80 hover:scale-105 active:scale-95 group relative overflow-hidden"           
          style={{             
            boxShadow: '0 0 20px rgba(76,201,255,0.4)'           
          }}           
          onMouseEnter={(e) => {             
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(76,201,255,0.6), 0 0 30px rgba(0,255,240,0.4)';           
          }}           
          onMouseLeave={(e) => {             
            e.currentTarget.style.boxShadow = '0 0 20px rgba(76,201,255,0.4)';           
          }}         
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
          <Zap size={23} className="transition-transform duration-300 group-hover:rotate-12 relative z-10"/>                              
          <h1 className="text-[1.1rem] tracking-wide relative z-10">Create Agents</h1>                          
        </div>                                   
        
        <div            
          onClick={handleExploreMarketplace}
          className="w-[25%] h-[40px] rounded-lg gap-3 border border-white/20 items-center justify-center text-white flex cursor-pointer transition-all duration-300 ease-out hover:border-[#4cc9ff]/60 hover:bg-gradient-to-r hover:from-[#4cc9ff]/10 hover:to-[#00fff0]/10 hover:scale-105 active:scale-95 group relative overflow-hidden"           
          style={{             
            backdropFilter: 'blur(15px)',
            background: 'rgba(255,255,255,0.02)'           
          }}         
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
          <ShoppingBag className="mr-2 h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110 relative z-10" />                              
          <h1 className="text-[1.1rem] tracking-wide relative z-10">Explore Marketplace</h1>                          
        </div>                
      </div>            
    </div>
  )
}

export default MainHeroCont
