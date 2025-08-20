import React from 'react'

const BadgeCard = ({Icon, title, description}) => {
  return (
    <div className="w-[24%] h-[60%] relative cursor-pointer">
      {/* Main card with liquid neon styling */}
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#020204] via-[#0f0f1a] to-[#020204] backdrop-blur-sm border border-[#4cc9ff]/40 rounded-lg shadow-[0_0_25px_rgba(76,201,255,0.2)]">
        
        {/* Static corner brackets */}
        <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-[#4cc9ff]/60"></div>
        <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-[#00fff0]/60"></div>
        <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-[#7a5cff]/60"></div>
        <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-[#4cc9ff]/60"></div>
        
        {/* Static border glow */}
        <div className="absolute inset-0 rounded-lg border border-[#4cc9ff]/10"></div>
        
        {/* Glass highlights */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
        
        {/* Content container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center gap-6 p-6">
          
          {/* Icon container with static neon styling */}
          <div className="relative">
            <div className="relative p-3 bg-gradient-to-br from-black/80 to-black/60 border border-[#4cc9ff]/40 text-[#4cc9ff] rounded-lg backdrop-blur-sm">
              <Icon className="w-6 h-6" style={{
                filter: 'drop-shadow(0 0 4px rgba(76,201,255,0.5))'
              }} />
            </div>
          </div>
          
          {/* Text content with neon theme */}
          <div className="flex-1 space-y-2">
            <h1 className="text-xl font-bold text-[#4cc9ff] leading-tight tracking-wide"
                style={{
                  textShadow: '0 0 8px rgba(76,201,255,0.4)',
                  filter: 'drop-shadow(0 0 6px rgba(76,201,255,0.3))'
                }}>
              {title}
            </h1>
            <h2 className="text-sm font-medium text-[#4cc9ff]/70 tracking-wider uppercase"
                style={{
                  textShadow: '0 0 4px rgba(76,201,255,0.2)'
                }}>
              {description}
            </h2>
          </div>
        </div>
        
        {/* Side accent bars */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-16 bg-gradient-to-b from-transparent via-[#4cc9ff]/60 to-transparent opacity-60"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-16 bg-gradient-to-b from-transparent via-[#00fff0]/60 to-transparent opacity-60"></div>
      </div>
    </div>
  )
}

export default BadgeCard