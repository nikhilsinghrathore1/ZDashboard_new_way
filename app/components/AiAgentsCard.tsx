import Image from 'next/image'
import React from 'react'

const AiAgentsCard = ({img , title , description , price , owner  }) => {
  return (
               <div className="w-[25%] h-[95%] relative group cursor-pointer">
               {/* Main card with cyberpunk shape - clipped corners */}
               <div 
                 className="w-full h-full relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:rotate-1"
                 style={{
                   clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                 }}
               >
                 {/* Background image */}
                 <div className="w-full h-full">
                   <Image
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                     src={img} 
                     alt="AI Agent Background" 
                   />
                   {/* Cyberpunk overlay gradient - Green theme */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-green-900/20 to-transparent"></div>
                   <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10"></div>
                 </div>
                 
                 {/* Glassmorphism info panel - Green theme */}
                 <div className="absolute bottom-0 left-0 right-0 h-[45%] backdrop-blur-xl bg-gradient-to-t from-black/70 via-gray-900/50 to-transparent border-t border-green-400/30">
                   {/* Glowing top border */}
                   <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                   
                   {/* Content */}
                   <div className="p-4 h-full flex flex-col justify-between text-white relative z-10">
                     <div className="space-y-2">
                       <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 tracking-wider">
                         {title}
                       </h1>
                       <p className="text-sm text-gray-300 leading-relaxed font-light">
                        {description}
                       </p>
                     </div>
                     
                     <div className="flex items-end justify-between">
                       <div className="space-y-1">
                         <h1 className="text-lg font-bold text-green-400 glow-text">{price}</h1>
                         <h2 className="text-xs text-gray-400 uppercase tracking-wider">{owner}</h2>
                       </div>
                       
                       <button className="relative px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 transition-all duration-300 font-semibold uppercase tracking-wider text-sm transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/25"
                         style={{
                           clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                         }}
                       >
                         <span className="relative z-10">BUY</span>
                         {/* Glowing effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                       </button>
                     </div>
                   </div>
                   
                   {/* Ambient light effects - Green theme */}
                   <div className="absolute bottom-0 left-4 w-20 h-20 bg-green-500/20 rounded-full blur-xl"></div>
                   <div className="absolute top-4 right-4 w-16 h-16 bg-emerald-500/20 rounded-full blur-lg"></div>
                 </div>
                 
                 {/* Cyberpunk corner accents - Green theme */}
                 <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-400/60"></div>
                 <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400/60"></div>
               </div>
               
               {/* Holographic scan line effect - Green theme */}
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/10 to-transparent h-8 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               
               {/* Green glow effect on hover */}
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                      boxShadow: '0 0 30px rgba(34, 197, 94, 0.3), 0 0 60px rgba(34, 197, 94, 0.2), inset 0 0 30px rgba(34, 197, 94, 0.1)'
                    }}>
               </div>
             </div>
  )
}

export default AiAgentsCard