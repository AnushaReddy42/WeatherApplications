import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const token = request.headers.get("authorization")?.split(" ")[1]

    if (!city) {
      return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
    }

    if (!OPENWEATHER_API_KEY) {
      return NextResponse.json({ error: "Weather API key not configured" }, { status: 500 })
    }

    // Fetch weather data from OpenWeatherMap
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`,
    )

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 404) {
        return NextResponse.json({ error: "City not found" }, { status: 404 })
      }
      throw new Error("Failed to fetch weather data")
    }

    const weatherData = await weatherResponse.json()

    // Save to search history if user is authenticated
    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        const { db } = await connectToDatabase()
        await db.collection("search_history").insertOne({
          userId: decoded.userId,
          city: weatherData.name,
          timestamp: new Date(),
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon,
        })
      }
    }

    return NextResponse.json({
      name: weatherData.name,
      country: weatherData.sys.country,
      temperature: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      wind_speed: weatherData.wind.speed,
      wind_deg: weatherData.wind.deg,
      clouds: weatherData.clouds.all,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      visibility: weatherData.visibility,
    })
  } catch (error) {
    console.error("Weather search error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
