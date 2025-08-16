"use client"
import { Zap } from 'lucide-react'
import React from 'react'

const Card = ({title, number, highlight, Icon}) => {
  return (
    <div className="relative h-[80%] w-[24%] rounded-lg flex items-center justify-between px-5 overflow-hidden group"
         style={{
           background: 'linear-gradient(135deg, #020204 0%, #0a0a0a 50%, #020204 100%)',
           border: '1px solid rgba(147, 51, 234, 0.15)',
           boxShadow: '0 0 15px rgba(147, 51, 234, 0.1), inset 0 1px 0 rgba(147, 51, 234, 0.05)'
         }}>
        {/* Liquid flow background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none rounded-lg">
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'radial-gradient(70% 100% at 30% 50%, rgba(147,51,234,0.08), rgba(168,85,247,0.05) 50%, transparent 80%)',
            animation: 'cardFlow 4s ease-in-out infinite alternate'
          }}
        />
      </div>

       {/* Moving neon laser line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#9333ea] to-transparent opacity-40"
           style={{
             animation: 'laserSweep 3s linear infinite',
             boxShadow: '0 0 6px rgba(147, 51, 234, 0.4)'
           }}></div>

       {/* Glass highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />

        <div className="relative z-10">
        <h2 className="text-sm text-white/50 tracking-wider capitalize mb-1">{title}</h2>
        <h1 className="text-2xl text-white my-1 font-bold"
            style={{
              textShadow: '0 0 8px rgba(147, 51, 234, 0.3), 0 0 15px rgba(147, 51, 234, 0.15)'
            }}>{number}</h1>
        <h3 className="text-[#a855f7] text-xs font-semibold"
            style={{
              textShadow: '0 0 4px rgba(168, 85, 247, 0.5)'
            }}>{highlight}</h3>
      </div>

        <div className="relative z-10 p-2.5 text-white rounded-lg bg-gradient-to-br from-[#9333ea]/05 via-black/80 to-[#7c3aed]/05 border border-[#9333ea]/20 backdrop-blur-sm"
           style={{
             boxShadow: '0 0 8px rgba(147, 51, 234, 0.15), inset 0 0 5px rgba(168, 85, 247, 0.05)'
           }}>
        <Icon className="w-5 h-5"
             style={{
               filter: 'drop-shadow(0 0 4px #9333ea) drop-shadow(0 0 8px rgba(147, 51, 234, 0.3))',
               color: '#9333ea'
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