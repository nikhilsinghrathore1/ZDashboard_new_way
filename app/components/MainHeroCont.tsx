"use client"
import React, { useRef, useCallback, useMemo, memo } from 'react'
import { ShoppingBag, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

// Memoized floating particles component
const FloatingParticles = memo(({ count = 280 }: { count?: number }) => {
  const particles = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      color: i % 3 === 0 ? '#c47cff' : i % 3 === 1 ? '#daaaff' : '#e4c1ff',
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.4 + 0.3,
      animationDuration: Math.random() * 4 + 6,
      animationType: i % 3 + 1,
      blur: Math.random() * 4 + 2
    })), [count]
  )

  return (
    <div className="absolute inset-0 pointer-events-none will-change-transform">
      {particles.map((particle) => (
        <div 
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            opacity: particle.opacity,
            animation: `energyFloat${particle.animationType} ${particle.animationDuration}s infinite ease-in-out`,
            boxShadow: `0 0 ${particle.blur}px currentColor`,
            willChange: 'transform'
          }}
        />
      ))}
    </div>
  )
})

FloatingParticles.displayName = 'FloatingParticles'

// Memoized starry background component
const StarryBackground = memo(({ count = 40 }: { count?: number }) => {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.8 + 0.2,
      animationDuration: Math.random() * 3 + 2,
      animationDelay: Math.random() * 2,
      blur: Math.random() * 3 + 1
    })), [count]
  )

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star) => (
        <div 
          key={star.id}
          className="absolute rounded-full will-change-transform"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: '#ffffff',
            top: `${star.top}%`,
            left: `${star.left}%`,
            opacity: star.opacity,
            animation: `starTwinkle ${star.animationDuration}s infinite ease-in-out`,
            animationDelay: `${star.animationDelay}s`,
            boxShadow: `0 0 ${star.blur}px rgba(255,255,255,0.5)`,
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </div>
  )
})

StarryBackground.displayName = 'StarryBackground'

// Optimized button component
const OptimizedButton = memo(({ 
  onClick, 
  variant = 'primary',
  icon: Icon,
  children,
  width = '20%'
}: {
  onClick: () => void
  variant?: 'primary' | 'secondary'
  icon: React.ComponentType<{ size?: number; className?: string }>
  children: React.ReactNode
  width?: string
}) => {
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (variant === 'primary') {
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(147,51,234,0.5), 0 0 25px rgba(168,85,247,0.3)'
    }
  }, [variant])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (variant === 'primary') {
      e.currentTarget.style.boxShadow = '0 0 15px rgba(147,51,234,0.3)'
    }
  }, [variant])

  const baseClasses = "h-[40px] rounded-lg gap-3 items-center justify-center text-white flex cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95 group relative overflow-hidden will-change-transform"
  
  const variantClasses = variant === 'primary' 
    ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400"
    : "border border-gray-700 hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-purple-800/20"

  const variantStyles = variant === 'primary' 
    ? { boxShadow: '0 0 15px rgba(147,51,234,0.3)' }
    : { 
        backdropFilter: 'blur(10px)',
        background: 'rgba(255,255,255,0.02)'
      }

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
      style={{ width, ...variantStyles }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-${variant === 'primary' ? '50' : '30'} ${variant === 'primary' ? 'via-white/30' : 'via-gray-600'}`} />
      <Icon 
        size={variant === 'primary' ? 23 : 18} 
        className={`transition-transform duration-300 relative z-10 ${variant === 'primary' ? 'group-hover:rotate-12' : 'group-hover:scale-110 mr-2'}`}
      />
      <h1 className="text-[1.1rem] tracking-wide relative z-10">{children}</h1>
    </div>
  )
})

OptimizedButton.displayName = 'OptimizedButton'

const MainHeroCont = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trailContainerRef = useRef<HTMLDivElement>(null)
  const trailIdRef = useRef(0)
  const activeTrails = useRef(new Map<string, HTMLElement>())
  const animationFrameRef = useRef<number>(0)
  const router = useRouter()

  // Throttled mouse move handler for better performance
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Cancel previous animation frame to prevent excessive calls
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (!containerRef.current || !trailContainerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Calculate grid position (30px grid)
      const blockX = Math.floor(x / 30)
      const blockY = Math.floor(y / 30)
      const blockKey = `${blockX}-${blockY}`
      
      // Prevent duplicate blocks
      if (activeTrails.current.has(blockKey)) return
      
      // Create optimized trail block
      const trailBlock = document.createElement('div')
      trailBlock.className = 'absolute pointer-events-none will-change-transform'
      trailBlock.style.cssText = `
        left: ${blockX * 30}px;
        top: ${blockY * 30}px;
        width: 30px;
        height: 30px;
        background: linear-gradient(45deg, rgba(196,124,255,0.25), rgba(221,170,255,0.15));
        border: 1px solid rgba(196,124,255,0.6);
        box-shadow: 0 0 8px rgba(196,124,255,0.4), inset 0 0 4px rgba(221,170,255,0.3);
        transform: scale(1);
        transition: all 0.1s ease-out;
        opacity: 0.7;
        border-radius: 4px;
        animation: trailFadeOut 1s ease-out forwards;
        will-change: transform, opacity;
      `
      
      trailContainerRef.current.appendChild(trailBlock)
      activeTrails.current.set(blockKey, trailBlock)
      
      // Cleanup with timeout
      const timeoutId = setTimeout(() => {
        if (trailBlock.parentNode) {
          trailBlock.parentNode.removeChild(trailBlock)
        }
        activeTrails.current.delete(blockKey)
      }, 1000)
      
      // Store timeout ID for potential cleanup
      trailBlock.dataset.timeoutId = timeoutId.toString()
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Clear all trails and their timeouts
    activeTrails.current.forEach((element) => {
      if (element.dataset.timeoutId) {
        clearTimeout(parseInt(element.dataset.timeoutId))
      }
    })
    
    if (trailContainerRef.current) {
      trailContainerRef.current.innerHTML = ''
    }
    activeTrails.current.clear()
  }, [])

  // Navigation handlers with useCallback for optimization
  const handleCreateAgent = useCallback(() => {
    router.push('/createAgent')
  }, [router])

  const handleExploreMarketplace = useCallback(() => {
    router.push('/marketplace')
  }, [router])

  // Memoized inline styles
  const containerStyles = useMemo(() => ({
    boxShadow: '0 12px 48px rgba(88,28,135,0.4), 0 0 0 1px rgba(88,28,135,0.3), 0 4px 16px rgba(88,28,135,0.2)'
  }), [])

  const backgroundOverlayStyles = useMemo(() => ({
    background: `
      radial-gradient(60% 80% at 20% 30%, rgba(147,51,234,0.08), transparent 70%),
      radial-gradient(70% 60% at 80% 70%, rgba(168,85,247,0.06), transparent 70%)
    `,
    animation: 'heroFlow 15s ease-in-out infinite alternate'
  }), [])

  const gridStyles = useMemo(() => ({
    backgroundImage: `
      linear-gradient(rgba(147,51,234,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(147,51,234,0.08) 1px, transparent 1px)
    `,
    backgroundSize: '30px 30px'
  }), [])

  const titleTextShadow = useMemo(() => ({
    textShadow: '0 0 6px rgba(147,51,234,0.6), 0 0 20px rgba(147,51,234,0.4), 0 0 40px rgba(147,51,234,0.2)',
    filter: 'drop-shadow(0 0 10px rgba(147,51,234,0.5))'
  }), [])

  return (
    <div                 
      ref={containerRef}
      className="w-full h-[50vh] flex flex-col justify-center items-start px-12 rounded-2xl relative overflow-hidden bg-black will-change-transform"                
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={containerStyles}
    >
      {/* Optimized Starry background */}
      <StarryBackground count={40} />

      {/* Subtle background overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0 rounded-2xl will-change-transform"
          style={backgroundOverlayStyles}
        />
      </div>

      {/* Minimal grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={gridStyles}
      />
      
      {/* Trail container */}
      <div 
        ref={trailContainerRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Optimized floating energy particles */}
      <FloatingParticles count={280} />
      
      {/* CSS animations - using CSS-in-JS for better performance */}
      <style jsx>{`
        @keyframes trailFadeOut {
          0% { 
            opacity: 0.7; 
            transform: scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.8); 
          }
        }
        @keyframes heroFlow {
          0% { 
            transform: translateX(-2%) rotate(0deg) scale(1); 
            filter: blur(80px);
          }
          100% { 
            transform: translateX(2%) rotate(2deg) scale(1.02); 
            filter: blur(60px);
          }
        }
        @keyframes energyFloat1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.2); }
        }
        @keyframes energyFloat2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(0.8); }
        }
        @keyframes energyFloat3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.1); }
        }
        @keyframes starTwinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2);
          }
        }
      `}</style>
                    
      <p className="text-[3.7rem] leading-none text-white font-bold relative z-10">         
        <span            
          className="text-purple-400 text-[3.7rem]"           
          style={titleTextShadow}         
        >           
          Decentralized AI <br />         
        </span>         
        <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          Studio & Marketplace
        </span>       
      </p>                       
      
      <p className="text-gray-400 text-[1.3rem] w-[60%] leading-[1.7rem] tracking-wide mt-2 relative z-10">         
        Create, own, and monetize AI models as NFTs. Your AI, Your Rules — No Middlemen.       
      </p>                  
      
      <div className="w-full flex gap-5 items-center mt-6 relative z-10">                          
        <OptimizedButton
          onClick={handleCreateAgent}
          variant="primary"
          icon={Zap}
          width="20%"
        >
          Create Agents
        </OptimizedButton>
        
        <OptimizedButton
          onClick={handleExploreMarketplace}
          variant="secondary"
          icon={ShoppingBag}
          width="25%"
        >
          Explore Marketplace
        </OptimizedButton>               
      </div>            
    </div>
  )
})

MainHeroCont.displayName = 'MainHeroCont'

export default MainHeroCont
