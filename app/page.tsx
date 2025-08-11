'use client'
import React from "react";
import MainHeroCont from "./components/MainHeroCont";
import { Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import Card from "./components/Card";

export default function Home() {



  return (
    <div className="w-full min-h-screen overflow-y-auto px-6 pt-6">
      <MainHeroCont/>
      <div className="w-full h-[20vh]   flex items-end justify-between">

      {[
  {title: "total models", number: "1,245", highlight: "+12%", Icon: Zap}, 
  {title: "Active Users", number: "465", highlight: "+8%", Icon: Users}, 
  {title: "total volume", number: "798 Zlag", highlight: "+24%", Icon: TrendingUp}, 
  {title: "Agents created", number: "564", highlight: "+15%", Icon: Sparkles}
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
    </div>
  );
}