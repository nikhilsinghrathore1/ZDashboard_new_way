// import { FileText } from 'lucide-react'
// import React from 'react'

// const BadgeCard = ({Icon , title , description}) => {
//   return (
//     <div className="w-[24%] h-[60%] relative group cursor-pointer">
//     {/* Main card with cyberpunk styling */}
//     <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-sm border-2 border-green-500/80 rounded-none shadow-lg transition-all duration-500 hover:shadow-green-400/40 hover:shadow-2xl hover:scale-105 hover:border-green-400 group-hover:bg-gradient-to-br group-hover:from-green-950/20 group-hover:via-black group-hover:to-green-950/10">
      
//       {/* Animated corner brackets */}
//       <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-500 transition-all duration-500 group-hover:border-green-400 group-hover:w-8 group-hover:h-8"></div>
//       <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-500 transition-all duration-500 group-hover:border-green-400 group-hover:w-8 group-hover:h-8"></div>
//       <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-500 transition-all duration-500 group-hover:border-green-400 group-hover:w-8 group-hover:h-8"></div>
//       <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-500 transition-all duration-500 group-hover:border-green-400 group-hover:w-8 group-hover:h-8"></div>
      
//       {/* Pulsing border glow */}
//       <div className="absolute inset-0 rounded-none border-2 border-green-500/20 group-hover:border-green-400/40 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-500"></div>
      
//       {/* Matrix-style overlay */}
//       <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
//       {/* Content container */}
//       <div className="relative z-10 w-full h-full flex items-center justify-center gap-6 p-6">
        
//         {/* Icon container with cyberpunk styling */}
//         <div className="relative">
//           {/* Icon glow background */}
//           <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//           <div className="relative p-3 bg-black border border-green-500/60 text-green-400 rounded-sm transition-all duration-500 group-hover:border-green-400 group-hover:text-green-300 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] group-hover:scale-110">
//             <Icon className="w-6 h-6" />
//           </div>
//           {/* Corner accents on icon */}
//           <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//           <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//           <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//           <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//         </div>
        
//         {/* Text content with cyberpunk theme */}
//         <div className="flex-1 space-y-1">
//           <h1 className="text-xl font-bold text-green-400 leading-tight transition-colors duration-500 group-hover:text-green-300 group-hover:text-shadow-[0_0_8px_rgba(34,197,94,0.8)] font-mono tracking-wide">
//             {title}
//           </h1>
//           <h2 className="text-sm font-medium text-green-600 transition-colors duration-500 group-hover:text-green-400 font-mono tracking-wider uppercase">
//             {description}
//           </h2>
//         </div>
//       </div>
      
//       {/* Side accent bars */}
//       <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-16 bg-gradient-to-b from-transparent via-green-500 to-transparent opacity-60 group-hover:opacity-100 group-hover:h-24 transition-all duration-500"></div>
//       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-16 bg-gradient-to-b from-transparent via-green-500 to-transparent opacity-60 group-hover:opacity-100 group-hover:h-24 transition-all duration-500"></div>
//     </div>
//   </div>
//   )
// }

// export default BadgeCard



import React from 'react'

const BadgeCard = ({Icon, title, description}) => {
  return (
    <div className="w-[24%] h-[60%] relative group cursor-pointer">
      {/* Main card with liquid neon styling */}
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#020204] via-[#0f0f1a] to-[#020204] backdrop-blur-sm border border-[#4cc9ff]/40 rounded-lg shadow-[0_0_25px_rgba(76,201,255,0.2)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(76,201,255,0.4)] hover:scale-105 hover:border-[#4cc9ff]/80 group-hover:bg-gradient-to-br group-hover:from-[#4cc9ff]/5 group-hover:via-black group-hover:to-[#00fff0]/5">
        
        {/* Liquid background overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none rounded-lg">
          <div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(70% 100% at 30% 50%, rgba(76,201,255,0.15), rgba(0,255,240,0.1) 50%, transparent 80%)',
              animation: 'cardPulse 3s ease-in-out infinite alternate'
            }}
          />
        </div>
        
        {/* Animated corner brackets */}
        <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-[#4cc9ff]/60 transition-all duration-500 group-hover:border-[#4cc9ff] group-hover:w-8 group-hover:h-8 group-hover:shadow-[0_0_8px_rgba(76,201,255,0.6)]"></div>
        <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-[#00fff0]/60 transition-all duration-500 group-hover:border-[#00fff0] group-hover:w-8 group-hover:h-8 group-hover:shadow-[0_0_8px_rgba(0,255,240,0.6)]"></div>
        <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-[#7a5cff]/60 transition-all duration-500 group-hover:border-[#7a5cff] group-hover:w-8 group-hover:h-8 group-hover:shadow-[0_0_8px_rgba(122,92,255,0.6)]"></div>
        <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-[#4cc9ff]/60 transition-all duration-500 group-hover:border-[#4cc9ff] group-hover:w-8 group-hover:h-8 group-hover:shadow-[0_0_8px_rgba(76,201,255,0.6)]"></div>
        
        {/* Neon border glow */}
        <div className="absolute inset-0 rounded-lg border border-[#4cc9ff]/10 group-hover:border-[#4cc9ff]/30 group-hover:shadow-[0_0_30px_rgba(76,201,255,0.3)] transition-all duration-500"></div>
        
        {/* Glass highlights */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
        
        {/* Liquid overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4cc9ff]/3 via-transparent to-[#00fff0]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
        
        {/* Content container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center gap-6 p-6">
          
          {/* Icon container with neon styling */}
          <div className="relative">
            {/* Icon glow background */}
            <div className="absolute inset-0 bg-[#4cc9ff]/20 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-3 bg-gradient-to-br from-black/80 to-black/60 border border-[#4cc9ff]/40 text-[#4cc9ff] rounded-lg transition-all duration-500 group-hover:border-[#4cc9ff]/80 group-hover:text-[#00fff0] group-hover:shadow-[0_0_20px_rgba(76,201,255,0.5)] group-hover:scale-110 backdrop-blur-sm">
              <Icon className="w-6 h-6" style={{
                filter: 'drop-shadow(0 0 4px rgba(76,201,255,0.5))'
              }} />
            </div>
            
            {/* Corner accents on icon */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#4cc9ff]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#00fff0]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-[#7a5cff]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#4cc9ff]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Text content with neon theme */}
          <div className="flex-1 space-y-2">
            <h1 className="text-xl font-bold text-[#4cc9ff] leading-tight transition-all duration-500 group-hover:text-[#00fff0] tracking-wide"
                style={{
                  textShadow: '0 0 8px rgba(76,201,255,0.4)',
                  filter: 'drop-shadow(0 0 6px rgba(76,201,255,0.3))'
                }}>
              {title}
            </h1>
            <h2 className="text-sm font-medium text-[#4cc9ff]/70 transition-all duration-500 group-hover:text-[#4cc9ff] tracking-wider uppercase"
                style={{
                  textShadow: '0 0 4px rgba(76,201,255,0.2)'
                }}>
              {description}
            </h2>
          </div>
        </div>
        
        {/* Side accent bars */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-16 bg-gradient-to-b from-transparent via-[#4cc9ff]/60 to-transparent opacity-60 group-hover:opacity-100 group-hover:h-24 group-hover:via-[#4cc9ff] transition-all duration-500 group-hover:shadow-[0_0_8px_rgba(76,201,255,0.6)]"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-16 bg-gradient-to-b from-transparent via-[#00fff0]/60 to-transparent opacity-60 group-hover:opacity-100 group-hover:h-24 group-hover:via-[#00fff0] transition-all duration-500 group-hover:shadow-[0_0_8px_rgba(0,255,240,0.6)]"></div>
        
        {/* Floating energy particles */}
        <div className="absolute top-2 right-8 w-1 h-1 bg-[#4cc9ff] rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 group-hover:animate-pulse"></div>
        <div className="absolute bottom-3 left-12 w-1 h-1 bg-[#00fff0] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 group-hover:animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute top-8 left-6 w-1 h-1 bg-[#7a5cff] rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-600 group-hover:animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        
        {/* CSS animations */}
        <style jsx>{`
          @keyframes cardPulse {
            0% { 
              transform: scale(1) rotate(0deg); 
              opacity: 0.2;
            }
            100% { 
              transform: scale(1.02) rotate(1deg); 
              opacity: 0.4;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default BadgeCard
