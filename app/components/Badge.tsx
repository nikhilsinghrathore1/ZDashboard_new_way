import { FileText } from 'lucide-react'
import React from 'react'

const BadgeCard = ({Icon , title , description}) => {
  return (
    <div className="w-[24%] h-[60%] relative group cursor-pointer">
    {/* Main card with dark gradient background */}
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-[#03171D] backdrop-blur-sm border border-gray-700/30 rounded-xl shadow-lg transition-all duration-500 hover:shadow-green-500/20 hover:shadow-2xl hover:-translate-y-1 hover:border-green-500/30">
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-transparent to-[#03171D]/50"></div>
      
      {/* Green glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-green-500/5 via-transparent to-green-400/10"></div>
      
      {/* Content container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center gap-6 p-6">
        
        {/* Icon container with dark theme styling */}
        <div className="relative">
          <div className="p-3 bg-green-700 text-gray-300 rounded-lg transition-all duration-500 group-hover:bg-green-500/20 group-hover:text-green-400 group-hover:shadow-lg group-hover:shadow-green-500/25 group-hover:scale-110">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        {/* Text content with dark theme */}
        <div className="flex-1 space-y-1">
          <h1 className="text-xl font-semibold text-white leading-tight transition-colors duration-500 group-hover:text-green-100">
            {title}
          </h1>
          <h2 className="text-sm font-medium text-gray-400 transition-colors duration-500 group-hover:text-green-300/80">
            {description}
          </h2>
        </div>
      </div>
      
      {/* Subtle accent line with green glow on hover */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-gray-600/40 to-transparent opacity-50 group-hover:via-green-400/60 group-hover:opacity-100 transition-all duration-500"></div>
      
      {/* Bottom subtle glow line on hover */}
      <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-green-400/0 to-transparent group-hover:via-green-400/40 transition-all duration-500"></div>
    </div>
      </div>
  )
}

export default BadgeCard