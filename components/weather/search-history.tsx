"use client"

import { Clock } from "lucide-react"

interface SearchHistoryItem {
  city: string
  timestamp: number
}

interface SearchHistoryProps {
  items: SearchHistoryItem[]
  onItemClick: (city: string) => void
}

export function SearchHistory({ items, onItemClick }: SearchHistoryProps) {
  if (items.length === 0) {
    return null
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Recent Searches</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {items.map((item, index) => (
          <button
            key={`${item.city}-${index}`}
            onClick={() => onItemClick(item.city)}
            className="group relative bg-card hover:bg-primary/10 border border-border hover:border-primary rounded-lg p-3 transition-colors cursor-pointer"
          >
            <p className="font-medium text-foreground truncate">{item.city}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatTime(item.timestamp)}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
