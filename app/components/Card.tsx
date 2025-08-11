"use client"
import { Zap } from 'lucide-react'
import React from 'react'

const Card = ({title , number , highlight ,Icon}) => {
  return (
    <div className="relative h-[80%] w-[24%] rounded-lg flex items-center justify-between px-5 overflow-hidden group"
    style={{
      background: 'linear-gradient(135deg, #000000 0%, #031920 100%)',
      border: '1px solid rgba(0, 255, 65, 0.3)',
      boxShadow: '0 0 20px rgba(0, 255, 65, 0.15), inset 0 1px 0 rgba(0, 255, 65, 0.1)'
    }}>
 
 {/* Animated border glow */}
 <div className="absolute inset-0 rounded-lg"
      style={{
        background: 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 65, 0.1) 50%, transparent 70%)',
        animation: 'border-glow 3s linear infinite'
      }}></div>
 
 {/* Moving laser line */}
 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-60"
      style={{
        animation: 'laser-sweep 2s linear infinite'
      }}></div>
 
 <div className="relative z-10">
   <h2 className="text-sm text-white/50 font-mono capitalize tracking-wider">{title}</h2>
   <h1 className="text-xl text-white my-1 font-bold"
       style={{
         textShadow: '0 0 8px rgba(0, 255, 65, 0.3)'
       }}>{number}</h1>
   <h3 className="text-[#22C45E] text-xs font-semibold"
       style={{
         textShadow: '0 0 6px #22C45E'
       }}>{highlight}</h3>
 </div>
 
 <div className="relative z-10 p-2 text-white rounded-lg bg-gradient-to-br from-[#052524] to-[#031920] border border-[#00ff41]/30"
      style={{
        boxShadow: '0 0 12px rgba(0, 255, 65, 0.2), inset 0 0 8px rgba(0, 255, 65, 0.1)'
      }}>
   <Icon className="w-5 h-5"
        style={{
          filter: 'drop-shadow(0 0 4px #00ff41)'
        }} />
 </div>
 
 <style jsx>{`
   @keyframes laser-sweep {
     0% { transform: translateX(-100%); }
     100% { transform: translateX(200%); }
   }
   
   @keyframes border-glow {
     0% { transform: rotate(0deg); opacity: 0.3; }
     50% { opacity: 0.6; }
     100% { transform: rotate(360deg); opacity: 0.3; }
   }
 `}</style>
</div>
  )
}

export default Card