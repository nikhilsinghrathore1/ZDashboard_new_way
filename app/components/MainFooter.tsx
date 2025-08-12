import { Zap } from "lucide-react";
import React from "react";

const MainFooter = () => {
  return (
    <div className="w-full h-[40vh] relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black border-2 border-orange-500/60 mt-10 mb-5 group">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500/80"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500/80"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500/80"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500/80"></div>

      {/* Glowing border overlay */}
      <div className="absolute inset-0 border border-orange-400/20 shadow-[0_0_30px_rgba(249,115,22,0.15)]"></div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
                   linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)
                 `,
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Orange accent lines */}
      <div className="absolute top-4 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent"></div>
      <div className="absolute bottom-4 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent"></div>

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-orange-400 font-mono tracking-wider text-center">
            READY TO CREATE?
          </h1>
          {/* Glitch effect on title */}
        </div>

        {/* Description */}
        <div className="mb-8 max-w-3xl">
          <p className="text-orange-300/80 text-center text-lg font-mono tracking-wide leading-relaxed">
            Join thousands of creators building the future of decentralized AI.
            <br />
            Start creating, sharing, and monetizing your AI Agents today.
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full flex gap-6 justify-center items-center relative z-10">
          {/* Primary Button - Launch AI Studio */}
          <div className="relative group/btn">
            {/* Button glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-orange-500/20 blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-sm"></div>

            <button className="relative w-64 h-12 bg-gradient-to-r from-green-600 to-orange-600 border border-green-500/60 text-black font-bold font-mono tracking-wider uppercase transition-all duration-300 hover:from-green-500 hover:to-orange-500 hover:border-green-400/80 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-green-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

              <Zap
                size={20}
                className="transition-transform duration-300 group-hover/btn:rotate-12 text-black"
              />
              <span className="text-base">Launch AI Studio</span>
            </button>
          </div>

          {/* Secondary Button - Learn More */}
          <div className="relative group/btn2">
            <button className="relative w-56 h-12 bg-black border-2 border-orange-500/60 text-orange-400 font-bold font-mono tracking-wider uppercase transition-all duration-300 hover:border-orange-400 hover:bg-orange-500/10 hover:text-orange-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-orange-500 transition-all duration-300 group-hover/btn2:border-orange-400 group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-orange-500 transition-all duration-300 group-hover/btn2:border-orange-400 group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-orange-500 transition-all duration-300 group-hover/btn2:border-orange-400 group-hover/btn2:w-5 group-hover/btn2:h-5"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-orange-500 transition-all duration-300 group-hover/btn2:border-orange-400 group-hover/btn2:w-5 group-hover/btn2:h-5"></div>

              <span className="text-base">Learn More</span>

              {/* Data stream effect */}
              <div className="absolute left-0 top-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover/btn2:via-orange-400/60 transition-all duration-500"></div>
            </button>
          </div>
        </div>

        {/* Bottom accent elements */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div className="w-2 h-2 bg-orange-500/60 rotate-45"></div>
          <div className="w-2 h-2 bg-green-500/60 rotate-45"></div>
          <div className="w-2 h-2 bg-orange-500/60 rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default MainFooter;
