"use client";
import React, { memo, useMemo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileView from "./components/MobileView"; // Import your mobile component
import MainHeroCont from "./components/MainHeroCont";
import {
  Badge,
  ChevronLeft,
  ChevronRight,
  Code,
  FileText,
  Image,
  Music,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Card from "./components/Card";
import img from "../public/coderAgent.webp";
import img1 from "../public/gimg2.webp";
import img2 from "../public/finAgent.webp";
import img3 from "../public/videogen.png";
import AiAgentsCard from "./components/AiAgentsCard";
import BadgeCard from "./components/Badge";
import MainFooter from "./components/MainFooter";

// Static data moved outside component to prevent recreation
const cardData = [
  { Icon: FileText, title: "Voice Models", description: "+1Agents" },
  { Icon: Image, title: "Autonomous Agents", description: "+3 Agents" },
  { Icon: Code, title: "github agents", description: "+1 Agents" },
  { Icon: Music, title: "Code Generation", description: "+1 Agents" }
];

const featuredAgentsData = [
  {
    url: "/agent/codeGen",
    img: img,
    title: "Lana codes",
    description: "autonomous code generator that builds dapp",
    price: "2.5 ZLAG",
    owner: "",
    agentId: 1,
  },
  {
    url: "/agent/trading",
    img: img2,
    title: "Quickie Trader",
    description: "autonomous ai assistant that helps you trade",
    price: "2.5 ZLAG",
    owner: "",
    agentId: 1,
  },
  {
    url: "/agent/pushit",
    img: img1,
    title: "PushIt",
    description: "autonomous github ai agent that works 24/7",
    price: "2.5 ZLAG",
    owner: "",
    agentId: 1,
  }
];

console.log(featuredAgentsData)

const statsData = [
  {
    title: "total models",
    number: "245",
    highlight: "+12%",
    Icon: Zap,
  },
  {
    title: "Active Users",
    number: "45",
    highlight: "+8%",
    Icon: Users,
  },
  {
    title: "api calls",
    number: "798",
    highlight: "+24%",
    Icon: TrendingUp,
  },
  {
    title: "Agents created",
    number: "564",
    highlight: "+15%",
    Icon: Sparkles,
  },
];

// Memoized Stats Section Component
const StatsSection = memo(() => (
  <div className="w-full h-[20vh] flex items-end justify-between">
    {statsData.map((e, i) => (
      <Card
        key={`${e.title}-${i}`}
        title={e.title}
        number={e.number}
        highlight={e.highlight}
        Icon={e.Icon}
      />
    ))}
  </div>
));

StatsSection.displayName = "StatsSection";

// Memoized Featured Agents Section
const FeaturedAgentsSection = memo(() => (
  <div className="w-full h-[60vh] pt-8">
    <div className="w-full h-[10vh] flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Featured AI Agents
        </h1>
        <p className="text-base text-white/60 mt-1 font-medium">
          Discover the most popular AI Agents
        </p>
      </div>

      <div className="flex h-full gap-3 items-center text-white">
        <button className="h-[50%] px-4 border flex items-center justify-center border-white/40 rounded-lg hover:border-white/70 hover:bg-white/5 transition-all duration-200 hover:scale-105 active:scale-95">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button className="h-[50%] px-4 border flex items-center justify-center border-white/40 rounded-lg hover:border-white/70 hover:bg-white/5 transition-all duration-200 hover:scale-105 active:scale-95">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>

    <div className="w-full h-[50vh] flex gap-7 items-start pt-5">
      {featuredAgentsData.map((agent) => (
        <AiAgentsCard
          key={`${agent.title}-${agent.agentId}`}
          url={agent.url}
          img={agent.img}
          title={agent.title}
          description={agent.description}
          price={agent.price}
          owner={agent.owner}
          agentId={agent.agentId}
        />
      ))}
    </div>
  </div>
));

FeaturedAgentsSection.displayName = "FeaturedAgentsSection";

// Memoized Category Section
// @ts-ignore
const CategorySection = memo(({ onNavigateToMarketPlace }) => (
  <div className="w-full h-[40vh] pt-10 mt-10">
    <div className="w-full h-[10vh] flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Category of AI Agents
        </h1>
        <p className="text-base text-white/60 mt-1 font-medium">
          Explore different types of AI Agents
        </p>
      </div>

      <div className="flex h-full gap-3 items-center text-white">
        <button 
          onClick={onNavigateToMarketPlace} 
          className="h-[60%] px-4 border flex gap-3 items-center justify-center border-white/40 rounded-lg hover:border-white/70 hover:bg-white/5 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <h1>View all</h1>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>

    <div className="w-full h-[35vh] flex items-start pt-10 justify-start gap-5">
      {cardData.map((card, index) => (
        <BadgeCard
          key={`${card.title}-${index}`}
          Icon={card.Icon}
          title={card.title}
          description={card.description}
        />
      ))}
    </div>
  </div>
));

CategorySection.displayName = "CategorySection";

// Desktop component (your existing layout)
const DesktopView = memo(() => {
  const router = useRouter();
  
  const handleNavigateToMarketPlace = useCallback(() => {
    router.push("/marketplace");
  }, [router]);

  return (
    <div className="w-full relative min-h-screen px-6 pt-6 performance-optimization">
      <MainHeroCont />
      <StatsSection />
      <FeaturedAgentsSection />
      {/* @ts-ignore */}
      <CategorySection onNavigateToMarketPlace={handleNavigateToMarketPlace} />
      <MainFooter />
    </div>
  );
});

DesktopView.displayName = "DesktopView";

// Main Home component with responsive logic
export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // You can adjust this breakpoint
    };

    // Check on component mount
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <>
      {/* CSS for smooth scrolling and performance optimizations */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        * {
          scroll-behavior: smooth;
        }

        /* Enable hardware acceleration for better performance */
        body {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        /* Optimize transforms for better performance */
        button {
          will-change: transform;
        }

        /* Reduce paint and layout thrashing */
        .performance-optimization {
          contain: layout style paint;
        }
      `}</style>

      {/* Conditional rendering based on screen size */}
      {isMobile ? <MobileView /> : <DesktopView />}
    </>
  );
}
