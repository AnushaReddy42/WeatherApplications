import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from "lucide-react"
import type { WeatherData } from "@/lib/weather-client"

interface WeatherCardProps {
  data: WeatherData
}

export function WeatherCard({ data }: WeatherCardProps) {
  const getWeatherIcon = (iconUrl: string) => {
    // WeatherAPI returns full URLs, check the icon code in the URL
    if (iconUrl.includes("sunny") || iconUrl.includes("clear")) {
      return <Sun className="w-16 h-16 md:w-20 md:h-20 text-yellow-400" />
    } else if (iconUrl.includes("cloudy") || iconUrl.includes("cloud")) {
      return <Cloud className="w-16 h-16 md:w-20 md:h-20 text-gray-400" />
    } else if (iconUrl.includes("rain") || iconUrl.includes("drizzle") || iconUrl.includes("thunderstorm")) {
      return <CloudRain className="w-16 h-16 md:w-20 md:h-20 text-blue-400" />
    }
    return <Cloud className="w-16 h-16 md:w-20 md:h-20 text-gray-400" />
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-lg w-full">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">{data.city}</h2>
          <p className="text-blue-100 capitalize mt-1 text-sm md:text-base">{data.description}</p>
        </div>
        <div className="flex-shrink-0">{getWeatherIcon(data.icon)}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white/20 rounded-2xl p-3 md:p-4">
          <p className="text-blue-100 text-xs md:text-sm mb-1">Temperature</p>
          <p className="text-2xl md:text-3xl font-bold">{data.temperature}°C</p>
          <p className="text-blue-100 text-xs mt-1">Feels like {data.feelsLike}°C</p>
        </div>

        <div className="bg-white/20 rounded-2xl p-3 md:p-4">
          <p className="text-blue-100 text-xs md:text-sm mb-1">Humidity</p>
          <p className="text-2xl md:text-3xl font-bold flex items-center gap-1 md:gap-2">
            {data.humidity}%
            <Droplets className="w-5 h-5 md:w-6 md:h-6" />
          </p>
        </div>

        <div className="bg-white/20 rounded-2xl p-3 md:p-4">
          <p className="text-blue-100 text-xs md:text-sm mb-1">Wind Speed</p>
          <p className="text-2xl md:text-3xl font-bold flex items-center gap-1 md:gap-2">
            {data.windSpeed}
            <Wind className="w-5 h-5 md:w-6 md:h-6" />
          </p>
          <p className="text-blue-100 text-xs mt-1">km/h</p>
        </div>

        <div className="bg-white/20 rounded-2xl p-3 md:p-4">
          <p className="text-blue-100 text-xs md:text-sm mb-1">Visibility</p>
          <p className="text-2xl md:text-3xl font-bold flex items-center gap-1 md:gap-2">
            {data.visibility.toFixed(1)}
            <Eye className="w-5 h-5 md:w-6 md:h-6" />
          </p>
          <p className="text-blue-100 text-xs mt-1">km</p>
        </div>
      </div>

      <div className="bg-white/20 rounded-2xl p-3 md:p-4">
        <p className="text-blue-100 text-xs md:text-sm mb-1">Pressure</p>
        <p className="text-xl md:text-2xl font-bold">{data.pressure} hPa</p>
      </div>
    </div>
  )
}
