"use client";
import React, { useState, useCallback, useRef, useMemo, memo } from "react";

// Memoized components to prevent unnecessary re-renders
const BetaBanner = memo(() => (
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
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/10 via-purple-300/10 to-purple-400/10 animate-pulse" />
    </div>
  </div>
));
BetaBanner.displayName = 'BetaBanner';

// Optimized star generation with useMemo to prevent recalculation
const StarField = memo(() => {
  const stars = useMemo(() => {
    const starArray = [];
    
    // Distant stars
    for (let i = 0; i < 300; i++) {
      starArray.push({
        id: `star-${i}`,
        type: 'distant',
        width: Math.random() * 2 + 0.3,
        height: Math.random() * 2 + 0.3,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.9 + 0.1,
        animationDuration: Math.random() * 3 + 1.5,
        animationDelay: Math.random() * 3,
        className: 'bg-white'
      });
    }
    
    // Accent stars
    for (let i = 0; i < 80; i++) {
      starArray.push({
        id: `accent-star-${i}`,
        type: 'accent',
        width: Math.random() * 4 + 1,
        height: Math.random() * 4 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.8 + 0.2,
        animationDuration: Math.random() * 2.5 + 1,
        animationDelay: Math.random() * 2.5,
        className: 'bg-purple-200',
        boxShadow: "0 0 8px rgba(196,124,255,0.7)"
      });
    }
    
    // Bright stars
    for (let i = 0; i < 40; i++) {
      starArray.push({
        id: `bright-star-${i}`,
        type: 'bright',
        width: Math.random() * 3 + 2,
        height: Math.random() * 3 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.9 + 0.1,
        animationDuration: Math.random() * 2 + 0.8,
        animationDelay: Math.random() * 2,
        className: 'bg-purple-100',
        boxShadow: "0 0 12px rgba(196,124,255,0.9), 0 0 24px rgba(147,51,234,0.5)"
      });
    }
    
    return starArray;
  }, []);

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${star.className}`}
          style={{
            width: `${star.width}px`,
            height: `${star.height}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            opacity: star.opacity,
            animation: star.type === 'bright' 
              ? `intenseTwinkle ${star.animationDuration}s ease-in-out infinite`
              : `twinkle ${star.animationDuration}s ease-in-out infinite`,
            animationDelay: `${star.animationDelay}s`,
            boxShadow: star.boxShadow || 'none'
          }}
        />
      ))}
    </>
  );
});
StarField.displayName = 'StarField';

const CosmicBackground = memo(() => (
  <div className="absolute inset-0">
    {/* Deep space gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-950/15 via-black to-indigo-950/10" />
    
    {/* Star field */}
    <StarField />
    
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
    />
    
    {/* Grid overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `linear-gradient(rgba(147,51,234,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.03) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        animation: "grid-move 40s linear infinite",
      }}
    />
  </div>
));
CosmicBackground.displayName = 'CosmicBackground';

const LoadingSpinner = memo(() => (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-6 mx-auto" />
      <p className="text-purple-300 text-2xl font-semibold mb-4">
        INITIALIZING QUANTUM COMPILER
      </p>
      <div className="flex space-x-2 justify-center">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>
    </div>
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

const FeatureCard = memo(({ title, description }: { title: string; description: string }) => (
  <div 
    className="p-8 bg-black border border-gray-800 rounded-xl backdrop-blur-sm hover:border-purple-400/30 transition-all duration-300 group"
    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
  >
    <h3 className="text-purple-300 font-semibold text-lg mb-3 group-hover:text-purple-200 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
));
FeatureCard.displayName = 'FeatureCard';

const Features = memo(() => {
  const features = useMemo(() => [
    {
      title: "SMART CONTRACTS",
      description: "AI-powered contract generation with security auditing"
    },
    {
      title: "MULTI-CHAIN",
      description: "Deploy seamlessly across blockchain networks"
    },
    {
      title: "NO-CODE",
      description: "Visual development with intuitive interface"
    }
  ], []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-16">
      {features.map((feature) => (
        <FeatureCard 
          key={feature.title}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
});
Features.displayName = 'Features';

// CSS animations moved to a separate component to prevent inline recalculation
const StyleSheet = memo(() => (
  <style jsx>{`
    @keyframes grid-move {
      0% { transform: translate(0, 0); }
      100% { transform: translate(80px, 80px); }
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0.2; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    @keyframes intenseTwinkle {
      0%, 100% { opacity: 0.2; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.3); }
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
    @keyframes brightGlow {
      0% { 
        text-shadow: 0 0 40px rgba(147,51,234,0.8), 0 0 80px rgba(196,124,255,0.6);
        filter: drop-shadow(0 0 20px rgba(147,51,234,0.7));
      }
      100% {
        text-shadow: 0 0 60px rgba(147,51,234,1), 0 0 120px rgba(196,124,255,0.8);
        filter: drop-shadow(0 0 40px rgba(147,51,234,1));
      }
    }
    @keyframes walletGlow {
      0% { box-shadow: 0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(147,51,234,0.2); }
      100% { box-shadow: 0 0 50px rgba(99,102,241,0.6), 0 0 100px rgba(147,51,234,0.4); }
    }
  `}</style>
));
StyleSheet.displayName = 'StyleSheet';

const Page: React.FC = () => {
  const promptRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Optimized submit handler with proper dependency array
  const handleSubmit = useCallback(() => {
    const prompt = promptRef.current?.value?.trim();
    if (!prompt) return;

    setLoading(true);

    // Use requestIdleCallback for better performance if available
    const executeNavigation = () => {
      window.location.href = `/agent/codeGen/gen?prompt=${encodeURIComponent(prompt)}`;
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setTimeout(executeNavigation, 2000);
      });
    } else {
      setTimeout(executeNavigation, 2000);
    }
  }, []);

  // Optimized key handler with proper debouncing
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit, loading]);

  // Memoized inline styles to prevent object recreation
  const titleStyle = useMemo(() => ({
    textShadow: "0 0 40px rgba(147,51,234,0.8), 0 0 80px rgba(196,124,255,0.6)",
    animation: "brightGlow 2s ease-in-out infinite alternate",
    filter: "drop-shadow(0 0 20px rgba(147,51,234,0.7))"
  }), []);

  const inputStyle = useMemo(() => ({
    boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(147,51,234,0.1)",
  }), []);

  const buttonStyle = useMemo(() => ({
    boxShadow: "0 0 20px rgba(147,51,234,0.4)",
  }), []);

  return (
    <div className="w-full h-[110vh] bg-black overflow-hidden relative">
      <BetaBanner />
      <CosmicBackground />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Logo/Title */}
        <div className="text-center mb-6">
          <h1
            className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent"
            style={titleStyle}
          >
            NEXUS
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-widest">
            DECENTRALIZED DAPP BUILDER
          </p>
          <div className="w-40 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6" />
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
                onKeyPress={handleKeyPress}
                style={inputStyle}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/5 via-purple-300/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold tracking-wide"
              style={buttonStyle}
              aria-label={loading ? "Processing" : "Build application"}
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>PROCESSING</span>
                </div>
              ) : (
                "BUILD"
              )}
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && <LoadingSpinner />}

        {/* Features */}
        <Features />

        {/* Bottom Text */}
        <div className="absolute bottom-10 text-center text-gray-500 text-sm">
          <p className="tracking-wide">Enter your vision. Watch it materialize.</p>
        </div>
      </div>

      <StyleSheet />
    </div>
  );
};

export default Page;