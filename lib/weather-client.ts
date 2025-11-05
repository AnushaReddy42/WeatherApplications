"use client"

export interface WeatherData {
  city: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  pressure: number
  visibility: number
  description: string
  icon: string
  timestamp: number
}

export interface SearchHistory {
  city: string
  timestamp: number
}

const SEARCH_HISTORY_KEY = "weather_app_search_history"

const WEATHER_API = "https://api.open-meteo.com/v1/forecast"
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search"

export async function fetchWeather(city: string): Promise<{ success: boolean; data?: WeatherData; error?: string }> {
  try {
    const geoResponse = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)

    if (!geoResponse.ok) {
      return { success: false, error: "Failed to find city" }
    }

    const geoData = await geoResponse.json()

    if (!geoData.results || geoData.results.length === 0) {
      return { success: false, error: "City not found. Please check the spelling." }
    }

    const location = geoData.results[0]
    const baseCityName = location.name
    const cityName =
      location.name +
      (location.admin1 ? `, ${location.admin1}` : "") +
      (location.country ? `, ${location.country}` : "")

    const weatherResponse = await fetch(
      `${WEATHER_API}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=kmh`,
    )

    if (!weatherResponse.ok) {
      return { success: false, error: "Failed to fetch weather data" }
    }

    const weatherData = await weatherResponse.json()
    const current = weatherData.current

    const weatherDescriptions: Record<number, { description: string; icon: string }> = {
      0: { description: "Clear sky", icon: "☀️" },
      1: { description: "Mainly clear", icon: "🌤️" },
      2: { description: "Partly cloudy", icon: "⛅" },
      3: { description: "Overcast", icon: "☁️" },
      45: { description: "Foggy", icon: "🌫️" },
      48: { description: "Foggy with rime", icon: "🌫️" },
      51: { description: "Light drizzle", icon: "🌦️" },
      53: { description: "Moderate drizzle", icon: "🌦️" },
      55: { description: "Dense drizzle", icon: "🌧️" },
      61: { description: "Slight rain", icon: "🌧️" },
      63: { description: "Moderate rain", icon: "🌧️" },
      65: { description: "Heavy rain", icon: "⛈️" },
      71: { description: "Slight snow", icon: "🌨️" },
      73: { description: "Moderate snow", icon: "🌨️" },
      75: { description: "Heavy snow", icon: "❄️" },
      80: { description: "Slight rain showers", icon: "🌧️" },
      81: { description: "Moderate rain showers", icon: "⛈️" },
      82: { description: "Violent rain showers", icon: "⛈️" },
      85: { description: "Slight snow showers", icon: "🌨️" },
      86: { description: "Heavy snow showers", icon: "❄️" },
      95: { description: "Thunderstorm", icon: "⛈️" },
      96: { description: "Thunderstorm with hail", icon: "⛈️" },
      99: { description: "Thunderstorm with hail", icon: "⛈️" },
    }

    const weatherCode = current.weather_code
    const weather = weatherDescriptions[weatherCode] || { description: "Unknown", icon: "🌐" }

    const weatherInfo: WeatherData = {
      city: cityName,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.temperature_2m - 2), // Approximation
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      pressure: 1013, // Standard pressure
      visibility: 10, // Default visibility
      description: weather.description,
      icon: weather.icon,
      timestamp: Date.now(),
    }

    addToSearchHistory(baseCityName)
    return { success: true, data: weatherInfo }
  } catch (error) {
    console.log("[v0] Weather fetch error:", error)
    return { success: false, error: "Unable to fetch weather. Please check your connection." }
  }
}

export function getSearchHistory(): SearchHistory[] {
  if (typeof window === "undefined") return []
  const history = localStorage.getItem(SEARCH_HISTORY_KEY)
  return history ? JSON.parse(history) : []
}

export function addToSearchHistory(city: string): void {
  const history = getSearchHistory()
  history.unshift({ city, timestamp: Date.now() })
  const uniqueHistory = Array.from(new Map(history.map((h) => [h.city, h])).values()).slice(0, 10)
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(uniqueHistory))
}

export function clearSearchHistory(): void {
  localStorage.removeItem(SEARCH_HISTORY_KEY)
}
