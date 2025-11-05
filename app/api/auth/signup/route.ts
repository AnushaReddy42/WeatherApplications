import { connectToDatabase } from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
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

    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    })

    const token = generateToken(result.insertedId.toString())

    return NextResponse.json(
      {
        message: "User created successfully",
        token,
        user: { id: result.insertedId, email, name },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
