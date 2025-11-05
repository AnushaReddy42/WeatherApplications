"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, AlertCircle } from "lucide-react"
import { SearchBar } from "@/components/weather/search-bar"
import { WeatherCard } from "@/components/weather/weather-card"
import { SearchHistory } from "@/components/weather/search-history"
import { Button } from "@/components/ui/button"
import { isUserAuthenticated, logoutUser } from "@/lib/auth-client"
import {
  fetchWeather,
  getSearchHistory,
  type WeatherData,
  type SearchHistory as SearchHistoryType,
} from "@/lib/weather-client"

export default function DashboardPage() {
  const router = useRouter()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [history, setHistory] = useState<SearchHistoryType[]>([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isUserAuthenticated()) {
      router.push("/login")
      return
    }
    setHistory(getSearchHistory())
    setHistoryLoading(false)
  }, [router])

  const handleSearch = async (city: string) => {
    setLoading(true)
    setError("")
    setWeather(null)

    const result = await fetchWeather(city)

    if (!result.success) {
      setError(result.error || "Failed to fetch weather data")
    } else {
      setWeather(result.data || null)
      setHistory(getSearchHistory())
    }

    setLoading(false)
  }

  const handleHistoryClick = (city: string) => {
    handleSearch(city)
  }

  const handleLogout = () => {
    logoutUser()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Weather Report</h1>
            <p className="text-muted-foreground text-xs md:text-sm">Real-time weather information</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {!historyLoading && <SearchHistory items={history} onItemClick={handleHistoryClick} />}

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg flex flex-col md:flex-row items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm md:text-base">Error</p>
              <p className="text-xs md:text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-muted-foreground text-sm md:text-base">Fetching weather data...</p>
            </div>
          </div>
        )}

        {weather && !loading && <WeatherCard data={weather} />}

        {!weather && !loading && !error && (
          <div className="text-center py-12">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Search for a City</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Enter a city name above to get the current weather
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
