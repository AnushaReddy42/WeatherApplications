"use client"

import type React from "react"
import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (city: string) => void // Changed to sync function since weather-client is client-side
  isLoading: boolean
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [city, setCity] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    // Removed async keyword
    e.preventDefault()
    if (city.trim()) {
      onSearch(city) // Removed await keyword
      setCity("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6 w-full">
      <div className="flex-1 relative">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city..."
          disabled={isLoading}
          className="w-full px-4 py-3 pl-12 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-sm md:text-base"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !city.trim()}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 w-full sm:w-auto"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
      </Button>
    </form>
  )
}
