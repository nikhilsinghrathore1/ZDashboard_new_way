"use client";
import React, { useState, useCallback, ChangeEvent, KeyboardEvent, useRef } from "react";

const Page: React.FC = () => {
  const promptRef = useRef<HTMLInputElement>(null);  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(() => {
    if (!promptRef.current || !promptRef.current.value.trim()) return;

    setLoading(true);

    setTimeout(() => {
      window.location.href = `/agent/codeGen/gen?prompt=${encodeURIComponent(promptRef.current!.value)}`;
    }, 2000);
  }, []);
 
  return (
    <div
      className="w-full h-screen bg-black overflow-hidden relative"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-lime-900/20"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1
            className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent"
            style={{
              textShadow: "0 0 30px rgba(34,197,94,0.5)",
              animation: "glow 2s ease-in-out infinite alternate",
            }}
          >
            NEXUS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wider">
            DECENTRALIZED DAPP BUILDER
          </p>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto mt-4"></div>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-2xl mb-8">
          <div className="relative">
            <div className="relative group">
              <input
                ref={promptRef}
                type="text"
                placeholder="Describe your decentralized application..."
                className="w-full px-6 py-4 bg-black/50 border border-green-400/50 rounded-lg text-white placeholder-gray-400 text-lg backdrop-blur-sm focus:outline-none focus:border-green-400 focus:shadow-lg focus:shadow-green-400/25 transition-all duration-300"
                disabled={loading}
                style={{
                  boxShadow: "0 0 20px rgba(34,197,94,0.1)",
                }}
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-lime-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
              style={{
                boxShadow: "0 0 15px rgba(34,197,94,0.3)",
              }}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-green-400 text-xl font-semibold mb-2">
                INITIALIZING QUANTUM COMPILER
              </p>
              <div className="flex space-x-1 justify-center">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
          <div className="p-6 bg-black/30 border border-gray-700/50 rounded-lg backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 group">
            <h3 className="text-green-400 font-semibold mb-2 group-hover:text-green-300">
              SMART CONTRACTS
            </h3>
            <p className="text-gray-400 text-sm">AI-powered contract generation</p>
          </div>
          <div className="p-6 bg-black/30 border border-gray-700/50 rounded-lg backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 group">
            <h3 className="text-green-400 font-semibold mb-2 group-hover:text-green-300">
              MULTI-CHAIN
            </h3>
            <p className="text-gray-400 text-sm">Deploy across networks</p>
          </div>
          <div className="p-6 bg-black/30 border border-gray-700/50 rounded-lg backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 group">
            <h3 className="text-green-400 font-semibold mb-2 group-hover:text-green-300">
              NO-CODE
            </h3>
            <p className="text-gray-400 text-sm">Visual development interface</p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-8 text-center text-gray-500 text-sm">
          <p>Enter your vision. Watch it materialize.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes glow {
          0% {
            text-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
          }
          100% {
            text-shadow: 0 0 40px rgba(34, 197, 94, 0.8),
              0 0 60px rgba(16, 185, 129, 0.3);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
