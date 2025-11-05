import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    if (!process.env.MONGODB_URI) {
      console.error("[v0] MONGODB_URI is not set")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const { db } = await connectToDatabase()
    const history = await db
      .collection("search_history")
      .find({ userId: decoded.userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({ history })
  } catch (error) {
    console.error("[v0] History fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
