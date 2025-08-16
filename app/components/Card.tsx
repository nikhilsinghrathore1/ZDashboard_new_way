// "use client"
// import { Zap } from 'lucide-react'
// import React from 'react'

// const Card = ({title , number , highlight ,Icon}) => {
//   return (
//     <div className="relative h-[80%] w-[24%] rounded-lg flex items-center justify-between px-5 overflow-hidden group"
//     style={{
//       background: 'linear-gradient(135deg, #000000 0%, #031920 100%)',
//       border: '1px solid rgba(0, 255, 65, 0.3)',
//       boxShadow: '0 0 20px rgba(0, 255, 65, 0.15), inset 0 1px 0 rgba(0, 255, 65, 0.1)'
//     }}>
 
//  {/* Animated border glow */}
//  <div className="absolute inset-0 rounded-lg"
//       style={{
//         background: 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 65, 0.1) 50%, transparent 70%)',
//         animation: 'border-glow 3s linear infinite'
//       }}></div>
 
//  {/* Moving laser line */}
//  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-60"
//       style={{
//         animation: 'laser-sweep 2s linear infinite'
//       }}></div>
 
//  <div className="relative z-10">
//    <h2 className="text-sm text-white/50 font-mono capitalize tracking-wider">{title}</h2>
//    <h1 className="text-xl text-white my-1 font-bold"
//        style={{
//          textShadow: '0 0 8px rgba(0, 255, 65, 0.3)'
//        }}>{number}</h1>
//    <h3 className="text-[#22C45E] text-xs font-semibold"
//        style={{
//          textShadow: '0 0 6px #22C45E'
//        }}>{highlight}</h3>
//  </div>
 
//  <div className="relative z-10 p-2 text-white rounded-lg bg-gradient-to-br from-[#052524] to-[#031920] border border-[#00ff41]/30"
//       style={{
//         boxShadow: '0 0 12px rgba(0, 255, 65, 0.2), inset 0 0 8px rgba(0, 255, 65, 0.1)'
//       }}>
//    <Icon className="w-5 h-5"
//         style={{
//           filter: 'drop-shadow(0 0 4px #00ff41)'
//         }} />
//  </div>
 
//  <style jsx>{`
//    @keyframes laser-sweep {
//      0% { transform: translateX(-100%); }
//      100% { transform: translateX(200%); }
//    }
   
//    @keyframes border-glow {
//      0% { transform: rotate(0deg); opacity: 0.3; }
//      50% { opacity: 0.6; }
//      100% { transform: rotate(360deg); opacity: 0.3; }
//    }
//  `}</style>
// </div>
//   )
// }

// export default Card

// version 2
"use client"
import { Zap } from 'lucide-react'
import React from 'react'

const Card = ({title, number, highlight, Icon}) => {
  return (
    <div className="relative h-[80%] w-[24%] rounded-lg flex items-center justify-between px-5 overflow-hidden group"
         style={{
           background: 'linear-gradient(135deg, #020204 0%, #0f0f1a 50%, #020204 100%)',
           border: '1px solid rgba(76, 201, 255, 0.3)',
           boxShadow: '0 0 25px rgba(76, 201, 255, 0.2), inset 0 1px 0 rgba(76, 201, 255, 0.1)'
         }}>
 
      {/* Liquid flow background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none rounded-lg">
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'radial-gradient(70% 100% at 30% 50%, rgba(76,201,255,0.15), rgba(0,255,240,0.1) 50%, transparent 80%)',
            animation: 'cardFlow 4s ease-in-out infinite alternate'
          }}
        />
      </div>

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-lg"
           style={{
             background: 'linear-gradient(45deg, transparent 30%, rgba(76, 201, 255, 0.2) 50%, rgba(0, 255, 240, 0.15) 70%, transparent 90%)',
             animation: 'borderGlow 4s linear infinite'
           }}></div>
 
      {/* Moving neon laser line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#4cc9ff] to-transparent opacity-70"
           style={{
             animation: 'laserSweep 3s linear infinite',
             boxShadow: '0 0 8px rgba(76, 201, 255, 0.8)'
           }}></div>

      {/* Glass highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
 
      <div className="relative z-10">
        <h2 className="text-sm text-white/50 tracking-wider capitalize mb-1">{title}</h2>
        <h1 className="text-2xl text-white my-1 font-bold"
            style={{
              textShadow: '0 0 12px rgba(76, 201, 255, 0.6), 0 0 25px rgba(76, 201, 255, 0.3)'
            }}>{number}</h1>
        <h3 className="text-[#00fff0] text-xs font-semibold"
            style={{
              textShadow: '0 0 8px rgba(0, 255, 240, 0.8)'
            }}>{highlight}</h3>
      </div>
 
      <div className="relative z-10 p-2.5 text-white rounded-lg bg-gradient-to-br from-[#4cc9ff]/10 via-black/60 to-[#7a5cff]/10 border border-[#4cc9ff]/40 backdrop-blur-sm"
           style={{
             boxShadow: '0 0 15px rgba(76, 201, 255, 0.3), inset 0 0 10px rgba(0, 255, 240, 0.1)'
           }}>
        <Icon className="w-5 h-5"
             style={{
               filter: 'drop-shadow(0 0 6px #4cc9ff) drop-shadow(0 0 12px rgba(76, 201, 255, 0.5))',
               color: '#4cc9ff'
             }} />
      </div>
 
      <style jsx>{`
        @keyframes laserSweep {
          0% { 
            transform: translateX(-100%); 
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% { 
            transform: translateX(200%); 
            opacity: 0;
          }
        }
        
        @keyframes borderGlow {
          0% { 
            transform: rotate(0deg); 
            opacity: 0.4; 
          }
          50% { 
            opacity: 0.8; 
          }
          100% { 
            transform: rotate(360deg); 
            opacity: 0.4; 
          }
        }

        @keyframes cardFlow {
          0% { 
            transform: translateX(-10%) rotate(0deg) scale(1); 
          }
          100% { 
            transform: translateX(10%) rotate(2deg) scale(1.02); 
          }
        }
      `}</style>
    </div>
  )
}

export default Card
