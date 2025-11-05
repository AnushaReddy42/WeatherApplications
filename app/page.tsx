"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Cloud } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      setIsLoggedIn(true)
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center min-h-screen gap-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="w-10 h-10 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Weather Report
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
            Get real-time weather updates for any city in the world. Check temperature, humidity, wind speed, and more.
          </p>

          <p className="text-muted-foreground text-lg">
            Sign up or log in to start searching for weather information and save your recent searches.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-12 text-base font-semibold">
              Get Started
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full h-12 text-base font-semibold bg-transparent">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-3xl">
          <div className="bg-card p-6 rounded-lg border border-border/50">
            <h3 className="font-semibold text-foreground mb-2">Real-time Data</h3>
            <p className="text-sm text-muted-foreground">
              Get current weather data updated instantly from OpenWeatherMap API
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border/50">
            <h3 className="font-semibold text-foreground mb-2">Search History</h3>
            <p className="text-sm text-muted-foreground">Your recent searches are saved for quick access anytime</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border/50">
            <h3 className="font-semibold text-foreground mb-2">Mobile Friendly</h3>
            <p className="text-sm text-muted-foreground">Works seamlessly on desktop, tablet, and mobile devices</p>
          </div>
        </div>
      </div>
    </div>
  )
}
