export function WeatherCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-blue-500/50 to-blue-600/50 rounded-3xl p-8 animate-pulse">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-10 bg-white/20 rounded-lg w-48" />
          <div className="h-4 bg-white/20 rounded-lg w-32" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/20 rounded-2xl p-4 space-y-2">
              <div className="h-4 bg-white/10 rounded w-20" />
              <div className="h-8 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
