import { FileText } from 'lucide-react'
import React from 'react'

const BadgeCard = ({Icon , title , description}) => {
  return (
    <div className="w-[24%] h-[60%] relative group cursor-pointer">
    {/* Main card with cyberpunk styling */}
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-sm border-2 border-green-500/80 rounded-none shadow-lg transition-all duration-500 hover:shadow-green-400/40 hover:shadow-2xl hover:scale-105 hover:border-green-400 group-hover:bg-gradient-to-br group-hover:from-green-950/20 group-hover:via-black group-hover:to-green-950/10">
      
      {/* Animated corner brackets */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-500 transition-all duration-500 group-hover:border-green-400 group-hover:w-8 group-hover:h-8"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-500 transition-all duration-500 group-hover:border-green-400 group-hover:w-8 group-hover:h-8"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-500 transition-all duration-500 group-hover:border-green-400 group-hover:w-8 group-hover:h-8"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-500 transition-all duration-500 group-hover:border-green-400 group-hover:w-8 group-hover:h-8"></div>
      
      {/* Pulsing border glow */}
      <div className="absolute inset-0 rounded-none border-2 border-green-500/20 group-hover:border-green-400/40 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-500"></div>
      
      {/* Matrix-style overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center gap-6 p-6">
        
        {/* Icon container with cyberpunk styling */}
        <div className="relative">
          {/* Icon glow background */}
          <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-3 bg-black border border-green-500/60 text-green-400 rounded-sm transition-all duration-500 group-hover:border-green-400 group-hover:text-green-300 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] group-hover:scale-110">
            <Icon className="w-6 h-6" />
          </div>
          {/* Corner accents on icon */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        {/* Text content with cyberpunk theme */}
        <div className="flex-1 space-y-1">
          <h1 className="text-xl font-bold text-green-400 leading-tight transition-colors duration-500 group-hover:text-green-300 group-hover:text-shadow-[0_0_8px_rgba(34,197,94,0.8)] font-mono tracking-wide">
            {title}
          </h1>
          <h2 className="text-sm font-medium text-green-600 transition-colors duration-500 group-hover:text-green-400 font-mono tracking-wider uppercase">
            {description}
          </h2>
        </div>
      </div>
      
      {/* Side accent bars */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-16 bg-gradient-to-b from-transparent via-green-500 to-transparent opacity-60 group-hover:opacity-100 group-hover:h-24 transition-all duration-500"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-16 bg-gradient-to-b from-transparent via-green-500 to-transparent opacity-60 group-hover:opacity-100 group-hover:h-24 transition-all duration-500"></div>
    </div>
  </div>
  )
}

export default BadgeCard