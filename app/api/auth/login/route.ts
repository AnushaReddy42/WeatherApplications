import { connectToDatabase } from "@/lib/mongodb"
import { comparePasswords, generateToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (!process.env.MONGODB_URI) {
      console.error("[v0] MONGODB_URI is not set")
      return NextResponse.json({ error: "Server configuration error: Missing MongoDB URI" }, { status: 500 })
    }

    if (!process.env.JWT_SECRET) {
      console.error("[v0] JWT_SECRET is not set")
      return NextResponse.json({ error: "Server configuration error: Missing JWT secret" }, { status: 500 })
    }

    const { db } = await connectToDatabase()
    const users = db.collection("users")

    const user = await users.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await comparePasswords(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(user._id.toString())

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: { id: user._id, email: user.email, name: user.name },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
