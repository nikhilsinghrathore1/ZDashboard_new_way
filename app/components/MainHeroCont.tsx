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
    
    // Create trail block element directly with lighter purple colors
    const trailBlock = document.createElement('div');
    const trailId = trailIdRef.current++;
    
    trailBlock.className = 'absolute pointer-events-none';
    trailBlock.style.cssText = `
      left: ${blockX * 30}px;
      top: ${blockY * 30}px;
      width: 30px;
      height: 30px;
      background: linear-gradient(45deg, rgba(196,124,255,0.25), rgba(221,170,255,0.15));
      border: 1px solid rgba(196,124,255,0.6);
      box-shadow: 0 0 8px rgba(196,124,255,0.4), inset 0 0 4px rgba(221,170,255,0.3);
      transform: scale(1);
      transition: all 0.1s ease-out;
      opacity: 0.7;
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
      className="w-full h-[50vh] flex flex-col justify-center items-start px-12 rounded-2xl relative overflow-hidden bg-black"                
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        boxShadow: '0 12px 48px rgba(88,28,135,0.4), 0 0 0 1px rgba(88,28,135,0.3), 0 4px 16px rgba(88,28,135,0.2)'
      }}
    >
      {/* Starry background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div 
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              background: '#ffffff',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `starTwinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: `0 0 ${Math.random() * 3 + 1}px rgba(255,255,255,0.5)`
            }}
          />
        ))}
      </div>

      {/* Subtle background overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `
              radial-gradient(60% 80% at 20% 30%, rgba(147,51,234,0.08), transparent 70%),
              radial-gradient(70% 60% at 80% 70%, rgba(168,85,247,0.06), transparent 70%)
            `,
            animation: 'heroFlow 15s ease-in-out infinite alternate'
          }}
        />
      </div>

      {/* Minimal grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(147,51,234,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147,51,234,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      />
      
      {/* Trail container - no state, direct DOM manipulation */}
      <div 
        ref={trailContainerRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Floating energy particles - increased number and lighter colors */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(350)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              background: i % 3 === 0 ? '#c47cff' : i % 3 === 1 ? '#daaaff' : '#e4c1ff',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.3,
              animation: `energyFloat${i % 3 + 1} ${Math.random() * 4 + 6}s infinite ease-in-out`,
              boxShadow: `0 0 ${Math.random() * 4 + 2}px currentColor`
            }}
          />
        ))}
      </div>
      
      {/* CSS animations */}
      <style jsx>{`
        @keyframes trailFadeOut {
          0% { 
            opacity: 0.7; 
            transform: scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.8); 
          }
        }
        @keyframes heroFlow {
          0% { 
            transform: translateX(-2%) rotate(0deg) scale(1); 
            filter: blur(80px);
          }
          100% { 
            transform: translateX(2%) rotate(2deg) scale(1.02); 
            filter: blur(60px);
          }
        }
        @keyframes energyFloat1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.2); }
        }
        @keyframes energyFloat2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(0.8); }
        }
        @keyframes energyFloat3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.1); }
        }
        @keyframes starTwinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2);
          }
        }
      `}</style>
                    
      <p className="text-[3.7rem] leading-none text-white font-bold relative z-10">         
        <span            
          className="text-purple-400 text-[3.7rem]"           
          style={{             
            textShadow: '0 0 6px rgba(147,51,234,0.6), 0 0 20px rgba(147,51,234,0.4), 0 0 40px rgba(147,51,234,0.2)',             
            filter: 'drop-shadow(0 0 10px rgba(147,51,234,0.5))'           
          }}         
        >           
          Decentralized AI <br />         
        </span>         
        <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          Studio & Marketplace
        </span>       
      </p>                       
      
      <p className="text-gray-400 text-[1.3rem] w-[60%] leading-[1.7rem] tracking-wide mt-2 relative z-10">         
        Create, own, and monetize AI models as NFTs. Your AI, Your Rules — No Middlemen.       
      </p>                  
      
      <div className="w-full flex gap-5 items-center mt-6 relative z-10">                          
        <div            
          onClick={handleCreateAgent}
          className="w-[20%] h-[40px] rounded-lg gap-3 bg-gradient-to-r from-purple-600 to-purple-500 items-center justify-center text-white flex cursor-pointer transition-all duration-300 ease-out hover:from-purple-500 hover:to-purple-400 hover:scale-105 active:scale-95 group relative overflow-hidden"           
          style={{             
            boxShadow: '0 0 15px rgba(147,51,234,0.3)'           
          }}           
          onMouseEnter={(e) => {             
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(147,51,234,0.5), 0 0 25px rgba(168,85,247,0.3)';           
          }}           
          onMouseLeave={(e) => {             
            e.currentTarget.style.boxShadow = '0 0 15px rgba(147,51,234,0.3)';           
          }}         
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
          <Zap size={23} className="transition-transform duration-300 group-hover:rotate-12 relative z-10"/>                              
          <h1 className="text-[1.1rem] tracking-wide relative z-10">Create Agents</h1>                          
        </div>                                   
        
        <div            
          onClick={handleExploreMarketplace}
          className="w-[25%] h-[40px] rounded-lg gap-3 border border-gray-700 items-center justify-center text-white flex cursor-pointer transition-all duration-300 ease-out hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-purple-800/20 hover:scale-105 active:scale-95 group relative overflow-hidden"           
          style={{             
            backdropFilter: 'blur(10px)',
            background: 'rgba(255,255,255,0.02)'           
          }}         
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-30" />
          <ShoppingBag className="mr-2 h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110 relative z-10" />                              
          <h1 className="text-[1.1rem] tracking-wide relative z-10">Explore Marketplace</h1>                          
        </div>                
      </div>            
    </div>
  )
}

export default MainHeroCont