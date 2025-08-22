"use client";
import React, { useState, useCallback, ChangeEvent, KeyboardEvent, useRef } from "react";

const Page: React.FC = () => {
  const promptRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(() => {
    if (!promptRef.current || !promptRef.current.value.trim()) return;

    setLoading(true);

    setTimeout(() => {
      window.location.href = `/agent/codeGen/gen?prompt=${encodeURIComponent(promptRef.current!.value)}`;
    }, 2000);
  }, []);
 
  return (
    <div className="w-full h-[110vh] bg-black overflow-hidden relative">

      {/* Beta Banner */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-4">
        <div className="relative">
          <div 
            className="px-4 py-1 bg-gradient-to-r from-purple-600/20 via-purple-500/30 to-purple-600/20 border border-purple-400/40 rounded-full backdrop-blur-sm"
            style={{
              boxShadow: "0 0 20px rgba(147,51,234,0.3), inset 0 0 20px rgba(147,51,234,0.1)",
            }}
          >
            <span className="text-purple-200 text-xs font-semibold tracking-widest">
              BETA VERSION
            </span>
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/10 via-purple-300/10 to-purple-400/10 animate-pulse"></div>
        </div>
      </div>

      {/* Cosmic Starry Background */}
      <div className="absolute inset-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/15 via-black to-indigo-950/10"></div>
        
        {/* Distant stars */}
        {[...Array(300)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2 + 0.3}px`,
              height: `${Math.random() * 2 + 0.3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.9 + 0.1,
              animation: `twinkle ${Math.random() * 3 + 1.5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
        
        {/* Brighter accent stars */}
        {[...Array(80)].map((_, i) => (
          <div
            key={`accent-star-${i}`}
            className="absolute bg-purple-200 rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 2.5 + 1}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2.5}s`,
              boxShadow: "0 0 8px rgba(196,124,255,0.7)"
            }}
          />
        ))}
        
        {/* Ultra bright stars */}
        {[...Array(40)].map((_, i) => (
          <div
            key={`bright-star-${i}`}
            className="absolute bg-purple-100 rounded-full"
            style={{
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.9 + 0.1,
              animation: `intenseTwinkle ${Math.random() * 2 + 0.8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: "0 0 12px rgba(196,124,255,0.9), 0 0 24px rgba(147,51,234,0.5)"
            }}
          />
        ))}
        
        {/* Nebula clouds */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(40% 60% at 20% 30%, rgba(88,28,135,0.1), transparent 70%),
              radial-gradient(50% 40% at 80% 70%, rgba(67,56,202,0.08), transparent 70%),
              radial-gradient(60% 50% at 40% 80%, rgba(147,51,234,0.06), transparent 70%)
            `,
            animation: "nebula-drift 30s ease-in-out infinite alternate",
          }}
        ></div>
        
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(147,51,234,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.03) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            animation: "grid-move 40s linear infinite",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Logo/Title */}
        <div className="text-center mb-6">
          <h1
            className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent"
            style={{
              textShadow: "0 0 40px rgba(147,51,234,0.8), 0 0 80px rgba(196,124,255,0.6)",
              animation: "brightGlow 2s ease-in-out infinite alternate",
              filter: "drop-shadow(0 0 20px rgba(147,51,234,0.7))"
            }}
          >
            NEXUS
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-widest">
            DECENTRALIZED DAPP BUILDER
          </p>
          <div className="w-40 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6"></div>
        </div>
        <div >
          
            <a
              href="https://www.wander.app/download"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300 font-bold tracking-wide text-lg group transform hover:scale-105"
              style={{
                boxShadow: "0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(147,51,234,0.2)",
                animation: "walletGlow 3s ease-in-out infinite alternate"
              }}
            >
              <svg 
                className="w-6 h-6 mr-3 group-hover:animate-bounce" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              INSTALL WANDER WALLET
              <div className="ml-3  w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </a>
          </div>

        {/* Input Section */}
        <div className="w-full mt-10 max-w-3xl mb-12">
          <div className="relative">
            <div className="relative group">
              <input
                ref={promptRef}
                type="text"
                placeholder="Describe your decentralized application..."
                className="w-full px-8 py-5 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 text-lg focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-400/20 transition-all duration-300"
                disabled={loading}
                style={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(147,51,234,0.1)",
                }}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/5 via-purple-300/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold tracking-wide"
              style={{
                boxShadow: "0 0 20px rgba(147,51,234,0.4)",
              }}
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>PROCESSING</span>
                </div>
              ) : (
                "BUILD"
              )}
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
              <p className="text-purple-300 text-2xl font-semibold mb-4">
                INITIALIZING QUANTUM COMPILER
              </p>
              <div className="flex space-x-2 justify-center">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-16">
          <div className="p-8 bg-black border border-gray-800 rounded-xl backdrop-blur-sm hover:border-purple-400/30 transition-all duration-300 group"
               style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <h3 className="text-purple-300 font-semibold text-lg mb-3 group-hover:text-purple-200 transition-colors duration-300">
              SMART CONTRACTS
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">AI-powered contract generation with security auditing</p>
          </div>
          <div className="p-8 bg-black border border-gray-800 rounded-xl backdrop-blur-sm hover:border-purple-400/30 transition-all duration-300 group"
               style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <h3 className="text-purple-300 font-semibold text-lg mb-3 group-hover:text-purple-200 transition-colors duration-300">
              MULTI-CHAIN
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">Deploy seamlessly across blockchain networks</p>
          </div>
          <div className="p-8 bg-black border border-gray-800 rounded-xl backdrop-blur-sm hover:border-purple-400/30 transition-all duration-300 group"
               style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <h3 className="text-purple-300 font-semibold text-lg mb-3 group-hover:text-purple-200 transition-colors duration-300">
              NO-CODE
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">Visual development with intuitive interface</p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-10 text-center text-gray-500 text-sm">
          <p className="tracking-wide">Enter your vision. Watch it materialize.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(80px, 80px);
          }
        }

        @keyframes glow {
          0% {
            text-shadow: 0 0 30px rgba(88, 28, 135, 0.4);
          }
          100% {
            text-shadow: 0 0 40px rgba(88, 28, 135, 0.6),
              0 0 60px rgba(147, 51, 234, 0.3);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes nebula-drift {
          0% {
            transform: translateX(-5%) translateY(-5%) rotate(0deg);
            filter: blur(40px);
          }
          100% {
            transform: translateX(5%) translateY(5%) rotate(3deg);
            filter: blur(60px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-15px) rotate(90deg);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default Page;