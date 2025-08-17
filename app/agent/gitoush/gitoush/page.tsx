"use client"

import { useState, useEffect } from "react"
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"

export default function GitoushLanding() {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  const demoCommand = "$ git push origin main → 🐦 Tweet posted!"

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let charIndex = 0
    const typeInterval = setInterval(() => {
      if (charIndex <= demoCommand.length) {
        setDisplayText(demoCommand.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeInterval)
      }
    }, 80)

    return () => clearInterval(typeInterval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="border-b border-green-400/30 p-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-green-400/70">gitoush.dev</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Gitoush</h1>
          <p className="text-xl text-green-300 mb-6">Turn GitHub commits into tweets automatically</p>
          <p className="text-green-400/80 text-lg">Code more. Share more. Grow your audience.</p>
        </div>

        <Card className="bg-gray-900/50 border-green-400/30 p-8 mb-16">
          <div className="text-center">
            <div className="text-green-400/70 mb-4">Live Demo:</div>
            <div className="flex items-center justify-center text-lg">
              <span className="text-green-400">{displayText}</span>
              <span className={`ml-1 ${showCursor ? "opacity-100" : "opacity-0"} transition-opacity`}>█</span>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-900/30 border-green-400/20 p-6 text-center">
            <div className="text-2xl mb-3">🔗</div>
            <h3 className="text-cyan-400 font-semibold mb-2">Connect</h3>
            <p className="text-green-300/80 text-sm">Link GitHub & Twitter in 30 seconds</p>
          </Card>

          <Card className="bg-gray-900/30 border-green-400/20 p-6 text-center">
            <div className="text-2xl mb-3">💻</div>
            <h3 className="text-cyan-400 font-semibold mb-2">Code</h3>
            <p className="text-green-300/80 text-sm">Push commits like you always do</p>
          </Card>

          <Card className="bg-gray-900/30 border-green-400/20 p-6 text-center">
            <div className="text-2xl mb-3">🐦</div>
            <h3 className="text-cyan-400 font-semibold mb-2">Share</h3>
            <p className="text-green-300/80 text-sm">Auto-tweets with smart formatting</p>
          </Card>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-green-400 hover:bg-cyan-400 text-black font-mono font-bold px-12 py-4 text-lg transition-all duration-300 hover:scale-105 mb-4"
          >
            Start Automating →
          </Button>
          <p className="text-green-400/60 text-sm">Free for your first 100 commits</p>
        </div>

        <div className="mt-20 pt-8 border-t border-green-400/20 text-center">
          <p className="text-green-400/60 text-sm">Built for developers who #BuildInPublic</p>
        </div>
      </div>
    </div>
  )
}
