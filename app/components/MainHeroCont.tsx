"use client"
import React, { useRef, useState } from 'react'
import { ShoppingBag, Zap } from "lucide-react";

const MainHeroCont = () => {

               
                 const [trailBlocks, setTrailBlocks] = useState([]);
                 const containerRef = useRef(null);
                 const trailIdRef = useRef(0);
               
                 const handleMouseMove = (e:any) => {
                   if (!containerRef.current) return;
                   //@ts-ignore
                   const rect = containerRef.current.getBoundingClientRect();
                   const x = e.clientX - rect.left;
                   const y = e.clientY - rect.top;
                   
                   // Calculate which grid block we're hovering (30px grid)
                   const blockX = Math.floor(x / 30);
                   const blockY = Math.floor(y / 30);
                   const blockKey = `${blockX}-${blockY}`;
                   
                   // Add new trail block with unique ID and timestamp
                   const newBlock = {
                     id: trailIdRef.current++,
                     key: blockKey,
                     x: blockX * 30,
                     y: blockY * 30,
                     timestamp: Date.now()
                   };
                   //@ts-ignore
                   setTrailBlocks(prev => {
                     // Remove blocks older than 1 second and limit to 15 blocks for performance
                     const now = Date.now();
                    //  @ts-ignore
                    const filtered = prev.filter(block => now - block.timestamp < 1000);
                    
                    //  @ts-ignore
                     // Don't add duplicate blocks at same position
                     const isDuplicate = filtered.some(block => block.key === blockKey);
                     if (isDuplicate) return filtered;
                     
                     return [...filtered.slice(-14), newBlock]; // Keep max 15 blocks
                   });
                 };
               
                 const handleMouseLeave = () => {
                   // Gradually fade out trail blocks
                   setTimeout(() => setTrailBlocks([]), 1000);
                 };
  return (
               <div                 
               ref={containerRef}
               className="w-full h-[50vh] flex flex-col justify-center items-start px-12 rounded-2xl bg-gradient-to-b relative overflow-hidden"                
               style={{                    
                 background: 'linear-gradient(to top, #041f20, #062728)'                
               }}
               onMouseMove={handleMouseMove}
               onMouseLeave={handleMouseLeave}
             >
               {/* Cyberpunk background effects */}
               {/* Grid pattern with interactive hover */}
               <div 
                 className="absolute inset-0 pointer-events-none opacity-20"
                 style={{
                   backgroundImage: `
                     linear-gradient(rgba(14, 179, 125, 0.1) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(14, 179, 125, 0.1) 1px, transparent 1px)
                   `,
                   backgroundSize: '30px 30px'
                 }}
               />
               
               {/* Interactive trailing hover blocks */}
               {trailBlocks.map((block, index) => {
                //@ts-ignore
                 const age = Date.now() - block.timestamp;
                 const ageRatio = Math.min(age / 1000, 1); // 0 to 1 over 1 second
                 const opacity = Math.max(0.6 - (ageRatio * 0.6), 0);
                 const scale = Math.max(1 - (ageRatio * 0.3), 0.7);
                 
                 return (
                   <div
                  //  @ts-ignore
                     key={block.id}
                     className="absolute pointer-events-none"
                     style={{
                      // @ts-ignore
                      left: `${block.x}px`,
                      // @ts-ignore
                       top: `${block.y}px`,
                       width: '30px',
                       height: '30px',
                       background: `rgba(14, 179, 125, ${opacity * 0.4})`,
                       border: `1px solid rgba(14, 179, 125, ${opacity})`,
                       boxShadow: `0 0 ${10 * opacity}px rgba(14, 179, 125, ${opacity * 0.6}), inset 0 0 ${5 * opacity}px rgba(14, 179, 125, ${opacity * 0.3})`,
                       transform: `scale(${scale})`,
                       transition: 'all 0.1s ease-out',
                       opacity: opacity
                     }}
                   />
                 );
               })}
               
               {/* Glitch bars / Lasers */}
               <div className="absolute inset-0 pointer-events-none">
                 <div 
                   className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#09dc96] to-transparent opacity-60"
                   style={{
                     top: '15%',
                     animation: 'glitch1 3s infinite linear'
                   }}
                 />
                 <div 
                   className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#0EB37D] to-transparent opacity-40"
                   style={{
                     top: '35%',
                     animation: 'glitch2 4s infinite linear'
                   }}
                 />
                 <div 
                   className="absolute w-full h-[3px] bg-gradient-to-r from-transparent via-[#09dc96] to-transparent opacity-30"
                   style={{
                     top: '55%',
                     animation: 'glitch3 5s infinite linear'
                   }}
                 />
                 <div 
                   className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#1EB682] to-transparent opacity-50"
                   style={{
                     top: '75%',
                     animation: 'glitch4 3.5s infinite linear'
                   }}
                 />
                 <div 
                   className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#09dc96] to-transparent opacity-35"
                   style={{
                     top: '85%',
                     animation: 'glitch5 6s infinite linear'
                   }}
                 />
                 <div 
                   className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#0EB37D] to-transparent opacity-45"
                   style={{
                     top: '25%',
                     animation: 'glitch6 4.5s infinite linear'
                   }}
                 />
                 <div 
                   className="absolute w-full h-[4px] bg-gradient-to-r from-transparent via-[#09dc96] to-transparent opacity-25"
                   style={{
                     top: '65%',
                     animation: 'glitch7 5.5s infinite linear'
                   }}
                 />
               </div>
               
               {/* Floating particles */}
               <div className="absolute inset-0 pointer-events-none">
                 <div 
                   className="absolute w-1 h-1 bg-[#09dc96] rounded-full opacity-60"
                   style={{
                     top: '12%',
                     left: '8%',
                     animation: 'float1 6s infinite ease-in-out'
                   }}
                 />
                 <div 
                   className="absolute w-2 h-2 bg-[#0EB37D] rounded-full opacity-40"
                   style={{
                     top: '68%',
                     left: '85%',
                     animation: 'float2 4s infinite ease-in-out'
                   }}
                 />
                 <div 
                   className="absolute w-1 h-1 bg-[#09dc96] rounded-full opacity-50"
                   style={{
                     top: '42%',
                     left: '65%',
                     animation: 'float3 5s infinite ease-in-out'
                   }}
                 />
                 <div 
                   className="absolute w-2 h-2 bg-[#1EB682] rounded-full opacity-35"
                   style={{
                     top: '28%',
                     left: '15%',
                     animation: 'float4 7s infinite ease-in-out'
                   }}
                 />
                 <div 
                   className="absolute w-1 h-1 bg-[#09dc96] rounded-full opacity-45"
                   style={{
                     top: '78%',
                     left: '25%',
                     animation: 'float5 3.5s infinite ease-in-out'
                   }}
                 />
                 <div 
                   className="absolute w-3 h-3 bg-[#0EB37D] rounded-full opacity-30"
                   style={{
                     top: '55%',
                     left: '90%',
                     animation: 'float6 6.5s infinite ease-in-out'
                   }}
                 />
                 <div 
                   className="absolute w-1 h-1 bg-[#09dc96] rounded-full opacity-55"
                   style={{
                     top: '88%',
                     left: '45%',
                     animation: 'float7 4.8s infinite ease-in-out'
                   }}
                 />
                 <div 
                   className="absolute w-2 h-2 bg-[#1EB682] rounded-full opacity-40"
                   style={{
                     top: '18%',
                     left: '75%',
                     animation: 'float8 5.2s infinite ease-in-out'
                   }}
                 />
                 <div 
                   className="absolute w-1 h-1 bg-[#0EB37D] rounded-full opacity-50"
                   style={{
                     top: '38%',
                     left: '35%',
                     animation: 'float9 6.8s infinite ease-in-out'
                   }}
                 />
                 <div 
                   className="absolute w-2 h-2 bg-[#09dc96] rounded-full opacity-35"
                   style={{
                     top: '62%',
                     left: '55%',
                     animation: 'float10 4.2s infinite ease-in-out'
                   }}
                 />
                 <div 
                   className="absolute w-1 h-1 bg-[#1EB682] rounded-full opacity-45"
                   style={{
                     top: '82%',
                     left: '72%',
                     animation: 'float11 5.7s infinite ease-in-out'
                   }}
                 />
                 <div 
                   className="absolute w-3 h-3 bg-[#09dc96] rounded-full opacity-25"
                   style={{
                     top: '32%',
                     left: '92%',
                     animation: 'float12 7.3s infinite ease-in-out'
                   }}
                 />
               </div>
               
               {/* CSS animations */}
               <style jsx>{`
                 @keyframes blockPulse {
                   0% { 
                     opacity: 0; 
                     transform: scale(0.8);
                     boxShadow: 0 0 5px rgba(14, 179, 125, 0.2), inset 0 0 5px rgba(14, 179, 125, 0.1);
                   }
                   50% { 
                     opacity: 1; 
                     transform: scale(1.1);
                     boxShadow: 0 0 15px rgba(14, 179, 125, 0.6), inset 0 0 15px rgba(14, 179, 125, 0.3);
                   }
                   100% { 
                     opacity: 1; 
                     transform: scale(1);
                     boxShadow: 0 0 10px rgba(14, 179, 125, 0.4), inset 0 0 10px rgba(14, 179, 125, 0.2);
                   }
                 }
                 @keyframes glitch1 {
                   0%, 90%, 100% { transform: translateX(-100%); opacity: 0; }
                   5%, 85% { transform: translateX(100vw); opacity: 0.6; }
                 }
                 @keyframes glitch2 {
                   0%, 80%, 100% { transform: translateX(100vw); opacity: 0; }
                   10%, 70% { transform: translateX(-100%); opacity: 0.4; }
                 }
                 @keyframes glitch3 {
                   0%, 85%, 100% { transform: translateX(-100%); opacity: 0; }
                   15%, 75% { transform: translateX(100vw); opacity: 0.3; }
                 }
                 @keyframes glitch4 {
                   0%, 75%, 100% { transform: translateX(100vw); opacity: 0; }
                   20%, 65% { transform: translateX(-100%); opacity: 0.5; }
                 }
                 @keyframes glitch5 {
                   0%, 88%, 100% { transform: translateX(-100%); opacity: 0; }
                   25%, 78% { transform: translateX(100vw); opacity: 0.35; }
                 }
                 @keyframes glitch6 {
                   0%, 82%, 100% { transform: translateX(100vw); opacity: 0; }
                   12%, 72% { transform: translateX(-100%); opacity: 0.45; }
                 }
                 @keyframes glitch7 {
                   0%, 87%, 100% { transform: translateX(-100%); opacity: 0; }
                   18%, 77% { transform: translateX(100vw); opacity: 0.25; }
                 }
                 @keyframes float1 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-20px) scale(1.2); }
                 }
                 @keyframes float2 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-15px) scale(0.8); }
                 }
                 @keyframes float3 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-25px) scale(1.5); }
                 }
                 @keyframes float4 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-18px) scale(1.1); }
                 }
                 @keyframes float5 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-22px) scale(1.3); }
                 }
                 @keyframes float6 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-12px) scale(0.9); }
                 }
                 @keyframes float7 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-28px) scale(1.4); }
                 }
                 @keyframes float8 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-16px) scale(1.2); }
                 }
                 @keyframes float9 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-24px) scale(0.7); }
                 }
                 @keyframes float10 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-19px) scale(1.1); }
                 }
                 @keyframes float11 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-21px) scale(1.25); }
                 }
                 @keyframes float12 {
                   0%, 100% { transform: translateY(0px) scale(1); }
                   50% { transform: translateY(-14px) scale(0.85); }
                 }
               `}</style>
                         
               <p className="text-[3.7rem] leading-none text-white font-bold relative z-10">         
                 <span            
                   className="text-[#09dc96] text-[3.7rem]"           
                   style={{             
                     textShadow: '0 0 5px rgba(14, 179, 125, 0.5), 0 0 40px rgba(14, 179, 125, 0.3), 0 0 80px rgba(14, 179, 125, 0.1)',             
                     filter: 'drop-shadow(0 0 10px rgba(14, 179, 125, 0.4))'           
                   }}         
                 >           
                   Decenteralized AI <br />         
                 </span>         
                 Studio & Marketplace       
               </p>                       
               
               <p className="text-[#94A3B8] text-[1.3rem] w-[60%] leading-[1.7rem] tracking-wide mt-2 relative z-10">         
                 Create, own, and monetize AI models as NFTs. Your AI, Your Rules — No Middlemen.       
               </p>                  
               
               <div className="w-full flex gap-5 items-center mt-6 relative z-10">                          
                 <div            
                   className="w-[20%] h-[40px] rounded-lg gap-3 bg-[#1EB682] items-center justify-center text-white flex cursor-pointer transition-all duration-300 ease-out hover:bg-[#0EB37D] hover:shadow-lg hover:shadow-[#1EB682]/30 hover:scale-105 active:scale-95"           
                   style={{             
                     boxShadow: '0 0 0 rgba(14, 179, 125, 0)'           
                   }}           
                   onMouseEnter={(e) => {             
                     //@ts-ignore             
                     e.target.style.boxShadow = '0 8px 25px rgba(14, 179, 125, 0.4), 0 0 20px rgba(14, 179, 125, 0.2)';           
                   }}           
                   onMouseLeave={(e) => {             
                     //@ts-ignore             
                     e.target.style.boxShadow = '0 0 0 rgba(14, 179, 125, 0)';           
                   }}         
                 >                              
                   <Zap size={23} className="transition-transform duration-300 group-hover:rotate-12"/>                              
                   <h1 className="text-[1.1rem] tracking-wide">Create Agents</h1>                          
                 </div>                                   
                 
                 <div            
                   className="w-[25%] h-[40px] rounded-lg gap-3 border border-white/20 items-center justify-center text-white flex cursor-pointer transition-all duration-300 ease-out hover:border-white/40 hover:bg-white/5 hover:scale-105 active:scale-95"           
                   style={{             
                     backdropFilter: 'blur(10px)'           
                   }}         
                 >                            
                   <ShoppingBag className="mr-2 h-[18px] w-[18px] transition-transform duration-300 hover:scale-110" />                              
                   <h1 className="text-[1.1rem] tracking-wide">Explore Marketplace</h1>                          
                 </div>                
               </div>            
             </div>
  )
}

export default MainHeroCont