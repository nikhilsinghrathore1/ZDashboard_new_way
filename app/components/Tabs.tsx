// "use client"

// import * as React from "react"
// import * as TabsPrimitive from "@radix-ui/react-tabs"

// import { cn } from "../lib/utils"

// const Tabs = TabsPrimitive.Root

// const TabsList = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.List>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
// >(({ className, ...props }, ref) => (
//   <TabsPrimitive.List
//     ref={ref}
//     className={cn(
//       "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
//       className
//     )}
//     {...props}
//   />
// ))
// TabsList.displayName = TabsPrimitive.List.displayName

// const TabsTrigger = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Trigger>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
// >(({ className, ...props }, ref) => (
//   <TabsPrimitive.Trigger
//     ref={ref}
//     className={cn(
//       "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
//       className
//     )}
//     {...props}
//   />
// ))
// TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

// const TabsContent = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
// >(({ className, ...props }, ref) => (
//   <TabsPrimitive.Content
//     ref={ref}
//     className={cn(
//       "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
//       className
//     )}
//     {...props}
//   />
// ))
// TabsContent.displayName = TabsPrimitive.Content.displayName

// export { Tabs, TabsList, TabsTrigger, TabsContent }



//  version 2.0.0
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "../lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-lg border border-white/10 p-1.5 relative overflow-hidden bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent backdrop-blur-sm shadow-[0_0_25px_rgba(76,201,255,0.15)]",
      className
    )}
    {...props}
  >
    {/* Liquid background overlay */}
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'radial-gradient(70% 100% at 50% 50%, rgba(76,201,255,0.1), rgba(0,255,240,0.08) 50%, transparent 80%)',
          animation: 'tabsFlow 4s ease-in-out infinite alternate'
        }}
      />
    </div>
    
    {/* Glass highlight */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
    
    <style jsx>{`
      @keyframes tabsFlow {
        0% { transform: translateX(-10%) rotate(0deg); }
        100% { transform: translateX(10%) rotate(1deg); }
      }
    `}</style>
  </TabsPrimitive.List>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-300 relative z-10 group overflow-hidden border border-transparent hover:border-[#4cc9ff]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4cc9ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 text-white/70 hover:text-[#4cc9ff] data-[state=active]:text-white data-[state=active]:border-[#4cc9ff]/60 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4cc9ff]/20 data-[state=active]:via-[#7a5cff]/15 data-[state=active]:to-[#00fff0]/20 data-[state=active]:shadow-[0_0_20px_rgba(76,201,255,0.3)] data-[state=active]:backdrop-blur-sm",
      className
    )}
    {...props}
  >
    {/* Active state liquid background */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-40 data-[state=active]:opacity-50 transition-opacity duration-300 pointer-events-none">
      <div
        className="absolute inset-0 rounded-md"
        style={{
          background: 'radial-gradient(80% 120% at 30% 50%, rgba(76,201,255,0.2), rgba(0,255,240,0.15) 40%, transparent 70%)',
          animation: 'triggerFlow 3s ease-in-out infinite alternate'
        }}
      />
    </div>
    
    {/* Glass highlight for active state */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 data-[state=active]:opacity-60 transition-opacity duration-300" />
    
    {/* Corner glow indicator */}
    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full transition-all duration-300 opacity-0 data-[state=active]:opacity-100 bg-[#4cc9ff] shadow-[0_0_4px_rgba(76,201,255,0.6)]" />
    
    {/* Content wrapper */}
    <span className="relative z-10">{children}</span>
    
    <style jsx>{`
      @keyframes triggerFlow {
        0% { transform: translateX(-5%) scale(1); }
        100% { transform: translateX(5%) scale(1.02); }
      }
    `}</style>
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4cc9ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent backdrop-blur-sm p-6 shadow-[0_0_30px_rgba(76,201,255,0.1)]",
      className
    )}
    {...props}
  >
    {/* Content background flow */}
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, rgba(76,201,255,0.08), rgba(0,255,240,0.06), rgba(122,92,255,0.04), rgba(76,201,255,0.08))',
          animation: 'contentFlow 6s linear infinite'
        }}
      />
    </div>
    
    {/* Glass borders */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60" />
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-40" />
    
    {/* Content with relative positioning */}
    <div className="relative z-10">{children}</div>
    
    <style jsx>{`
      @keyframes contentFlow {
        0% { transform: rotate(0deg) scale(1); }
        100% { transform: rotate(360deg) scale(1.01); }
      }
    `}</style>
  </TabsPrimitive.Content>
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
