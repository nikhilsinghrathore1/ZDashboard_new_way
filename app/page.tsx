"use client";
import React from "react";
import { useRouter } from "next/navigation";
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
import img from "../public/coderAgent.jpg"
import img1 from "../public/gimg2.png"
import img2 from "../public/finAgent.jpg"
import AiAgentsCard from "./components/AiAgentsCard";
import BadgeCard from "./components/Badge";
import MainFooter from "./components/MainFooter";

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
    owner: "by TeamZ",
    agentId: 3,
  },
  {
    url: "/agent/trading",
    img: img2,
    title: "Quickie Trader",
    description: "autonomous ai assistant that helps you trade",
    price: "2.5 ZLAG",
    owner: "by TeamZ",
    agentId: 2,
  },
  {
    url: "/agent/pushit",
    img: img1,
    title: "PushIt",
    description: "autonomous github ai agent that works 24/7",
    price: "2.5 ZLAG",
    owner: "by TeamZ",
    agentId: 1,
  }
];

export default function Home() {
  const router = useRouter();

  const handleNavigateToMarketPlace = () => {
    router.push("/marketplace");
  };

  return (
    <div className="w-full relative min-h-screen  px-6 pt-6">
      <MainHeroCont />
      <div className="w-full h-[20vh]   flex items-end justify-between">
        {[
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
        ].map((e, i) => (
          <Card
            key={i}
            title={e.title}
            number={e.number}
            highlight={e.highlight}
            Icon={e.Icon}
          />
        ))}
      </div>

      {/* Featured Ai agents section */}

      <div className="w-full h-[60vh] pt-8">
        {/* top section */}
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
              key={agent.title}
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

      {/* Check the category section  */}

      <div className=" w-full h-[40vh] pt-10 mt-10 ">
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
              onClick={handleNavigateToMarketPlace} 
              className="h-[60%] px-4 border flex gap-3 items-center justify-center border-white/40 rounded-lg hover:border-white/70 hover:bg-white/5 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <h1>View all</h1>
              <ChevronRight className="h-5  w-5" />
            </button>
          </div>
        </div>

        <div className="w-full h-[35vh] flex items-start pt-10 justify-start gap-5">
          {cardData.map((card, index) => (
            <BadgeCard
              key={index}
              Icon={card.Icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>

      {/* Start creating your Ai Agent section  */}
      <MainFooter/>
    </div>
  );
}