import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to environment variables. Set MONGODB_URI in the Vars section.")
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db("weather-app")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function initializeDatabase() {
  const { db } = await connectToDatabase()

  // Create users collection if it doesn't exist
  const collections = await db.listCollections().toArray()
  const collectionNames = collections.map((c) => c.name)

  if (!collectionNames.includes("users")) {
    await db.createCollection("users")
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
  }

  if (!collectionNames.includes("search_history")) {
    await db.createCollection("search_history")
    await db.collection("search_history").createIndex({ userId: 1, timestamp: -1 })
  }

  console.log("Database initialized successfully")
}
