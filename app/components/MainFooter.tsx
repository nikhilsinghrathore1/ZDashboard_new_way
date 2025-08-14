// import { Zap } from "lucide-react";
// import React from "react";

// const MainFooter = () => {
//   return (
//     <div className="w-full h-[40vh] relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black border-2 border-orange-500/60 mt-10 mb-5 group">
//       {/* Corner brackets */}
//       <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500/80"></div>
//       <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500/80"></div>
//       <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500/80"></div>
//       <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500/80"></div>

//       {/* Glowing border overlay */}
//       <div className="absolute inset-0 border border-orange-400/20 shadow-[0_0_30px_rgba(249,115,22,0.15)]"></div>

//       {/* Grid pattern overlay */}
//       <div
//         className="absolute inset-0 opacity-10"
//         style={{
//           backgroundImage: `
//                    linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px),
//                    linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)
//                  `,
//           backgroundSize: "20px 20px",
//         }}
//       ></div>

//       {/* Orange accent lines */}
//       <div className="absolute top-4 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent"></div>
//       <div className="absolute bottom-4 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent"></div>

//       {/* Main content */}
//       <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">
//         {/* Title */}
//         <div className="mb-4">
//           <h1 className="text-4xl font-bold text-orange-400 font-mono tracking-wider text-center">
//             READY TO CREATE?
//           </h1>
//           {/* Glitch effect on title */}
//         </div>

//         {/* Description */}
//         <div className="mb-8 max-w-3xl">
//           <p className="text-orange-300/80 text-center text-lg font-mono tracking-wide leading-relaxed">
//             Join thousands of creators building the future of decentralized AI.
//             <br />
//             Start creating, sharing, and monetizing your AI Agents today.
//           </p>
//         </div>

//         {/* Buttons */}
//         <div className="w-full flex gap-6 justify-center items-center relative z-10">
//           {/* Primary Button - Launch AI Studio */}
//           <div className="relative group/btn">
//             {/* Button glow background */}
//             <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-orange-500/20 blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-sm"></div>

//             <button className="relative w-64 h-12 bg-gradient-to-r from-green-600 to-orange-600 border border-green-500/60 text-black font-bold font-mono tracking-wider uppercase transition-all duration-300 hover:from-green-500 hover:to-orange-500 hover:border-green-400/80 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
//               {/* Corner accents */}
//               <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
//               <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
//               <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-green-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
//               <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

//               <Zap
//                 size={20}
//                 className="transition-transform duration-300 group-hover/btn:rotate-12 text-black"
//               />
//               <span className="text-base">Launch AI Studio</span>
//             </button>
//           </div>

//           {/* Secondary Button - Learn More */}
//           <div className="relative group/btn2">
//             <button className="relative w-56 h-12 bg-black border-2 border-orange-500/60 text-orange-400 font-bold font-mono tracking-wider uppercase transition-all duration-300 hover:border-orange-400 hover:bg-orange-500/10 hover:text-orange-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center">
//               {/* Corner brackets */}
//               <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-orange-500 transition-all duration-300 group-hover/btn2:border-orange-400 group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
//               <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-orange-500 transition-all duration-300 group-hover/btn2:border-orange-400 group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
//               <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-orange-500 transition-all duration-300 group-hover/btn2:border-orange-400 group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
//               <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-orange-500 transition-all duration-300 group-hover/btn2:border-orange-400 group-hover/btn2:w-5 group-hover/btn2:h-5"></div>

//               <span className="text-base">Learn More</span>

//               {/* Data stream effect */}
//               <div className="absolute left-0 top-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover/btn2:via-orange-400/60 transition-all duration-500"></div>
//             </button>
//           </div>
//         </div>

//         {/* Bottom accent elements */}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
//           <div className="w-2 h-2 bg-orange-500/60 rotate-45"></div>
//           <div className="w-2 h-2 bg-green-500/60 rotate-45"></div>
//           <div className="w-2 h-2 bg-orange-500/60 rotate-45"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainFooter;



import { Zap } from "lucide-react";
import React from "react";

const MainFooter = () => {
  return (
    <div className="w-full h-[40vh] relative overflow-hidden bg-gradient-to-br from-[#020204] via-[#0f0f1a] to-[#020204] border border-white/10 rounded-lg mt-10 mb-5 group backdrop-blur-sm">
      
      {/* Liquid background overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: `
              radial-gradient(60% 80% at 20% 30%, rgba(76,201,255,0.2), transparent 70%),
              radial-gradient(70% 60% at 80% 70%, rgba(0,255,240,0.15), transparent 70%),
              radial-gradient(50% 90% at 50% 50%, rgba(122,92,255,0.1), transparent 80%)
            `,
            animation: 'footerFlow 10s ease-in-out infinite alternate'
          }}
        />
      </div>

      {/* Corner brackets with neon glow */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#4cc9ff]/80 shadow-[0_0_8px_rgba(76,201,255,0.6)]"></div>
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#00fff0]/80 shadow-[0_0_8px_rgba(0,255,240,0.6)]"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#7a5cff]/80 shadow-[0_0_8px_rgba(122,92,255,0.6)]"></div>
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#4cc9ff]/80 shadow-[0_0_8px_rgba(76,201,255,0.6)]"></div>

      {/* Flowing border overlay */}
      <div className="absolute inset-0 border border-[#4cc9ff]/20 rounded-lg shadow-[0_0_30px_rgba(76,201,255,0.15)]"></div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-15 rounded-lg"
        style={{
          backgroundImage: `
            linear-gradient(rgba(76,201,255,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,240,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Neon accent lines */}
      <div className="absolute top-4 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#4cc9ff]/70 to-transparent shadow-[0_0_6px_rgba(76,201,255,0.8)]"></div>
      <div className="absolute bottom-4 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#00fff0]/70 to-transparent shadow-[0_0_6px_rgba(0,255,240,0.8)]"></div>

      {/* Glass highlights */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40" />

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">
        
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4cc9ff] via-[#00fff0] to-[#7a5cff] bg-clip-text text-transparent tracking-wider text-center"
              style={{
                textShadow: '0 0 20px rgba(76,201,255,0.5), 0 0 40px rgba(0,255,240,0.3)',
                filter: 'drop-shadow(0 0 10px rgba(76,201,255,0.4))'
              }}>
            READY TO CREATE?
          </h1>
        </div>

        {/* Description */}
        <div className="mb-8 max-w-3xl">
          <p className="text-white/80 text-center text-lg tracking-wide leading-relaxed">
            Join thousands of creators building the future of decentralized AI.
            <br />
            <span className="text-[#4cc9ff]">Start creating, sharing, and monetizing</span> your AI Agents today.
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full flex gap-6 justify-center items-center relative z-10">
          
          {/* Primary Button - Launch AI Studio */}
          <div className="relative group/btn">
            {/* Button glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#4cc9ff]/20 to-[#00fff0]/20 blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-lg"></div>

            <button className="relative w-64 h-12 bg-gradient-to-r from-[#4cc9ff] to-[#00fff0] border border-[#4cc9ff]/60 text-white font-bold tracking-wider uppercase transition-all duration-300 hover:from-[#4cc9ff]/90 hover:to-[#00fff0]/90 hover:border-[#4cc9ff]/80 hover:shadow-[0_0_25px_rgba(76,201,255,0.6)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3 rounded-lg backdrop-blur-sm">
              
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#4cc9ff] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#00fff0] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#4cc9ff] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00fff0] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

              {/* Glass highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />

              <Zap
                size={20}
                className="transition-transform duration-300 group-hover/btn:rotate-12 text-white relative z-10"
              />
              <span className="text-base relative z-10">Launch AI Studio</span>
            </button>
          </div>

          {/* Secondary Button - Learn More */}
          <div className="relative group/btn2">
            <button className="relative w-56 h-12 bg-gradient-to-r from-black/60 to-black/40 border-2 border-[#7a5cff]/60 text-[#4cc9ff] font-bold tracking-wider uppercase transition-all duration-300 hover:border-[#4cc9ff]/80 hover:bg-gradient-to-r hover:from-[#4cc9ff]/10 hover:to-[#00fff0]/10 hover:text-[#00fff0] hover:shadow-[0_0_20px_rgba(76,201,255,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center rounded-lg backdrop-blur-sm">
              
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#7a5cff] transition-all duration-300 group-hover/btn2:border-[#4cc9ff] group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#7a5cff] transition-all duration-300 group-hover/btn2:border-[#00fff0] group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#7a5cff] transition-all duration-300 group-hover/btn2:border-[#4cc9ff] group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#7a5cff] transition-all duration-300 group-hover/btn2:border-[#00fff0] group-hover/btn2:w-5 group-hover/btn2:h-5"></div>

              {/* Glass highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40" />

              <span className="text-base relative z-10">Learn More</span>

              {/* Data stream effect */}
              <div className="absolute left-0 top-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7a5cff]/0 to-transparent group-hover/btn2:via-[#4cc9ff]/60 transition-all duration-500"></div>
            </button>
          </div>
        </div>

        {/* Bottom accent elements */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          <div className="w-2 h-2 bg-[#4cc9ff] rotate-45 shadow-[0_0_4px_rgba(76,201,255,0.8)] animate-pulse"></div>
          <div className="w-2 h-2 bg-[#00fff0] rotate-45 shadow-[0_0_4px_rgba(0,255,240,0.8)] animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-2 h-2 bg-[#7a5cff] rotate-45 shadow-[0_0_4px_rgba(122,92,255,0.8)] animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes footerFlow {
          0% { 
            transform: translateY(-2%) rotate(0deg) scale(1); 
            filter: blur(60px);
          }
          100% { 
            transform: translateY(2%) rotate(2deg) scale(1.05); 
            filter: blur(40px);
          }
        }
      `}</style>
    </div>
  );
};

export default MainFooter;
