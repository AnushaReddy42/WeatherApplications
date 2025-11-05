"use client"

export interface User {
  id: string
  email: string
  password: string // In real app, never store plain passwords
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const USERS_KEY = "weather_app_users"
const CURRENT_USER_KEY = "weather_app_current_user"

export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export function findUser(email: string): User | undefined {
  return getAllUsers().find((u) => u.email === email)
}

export function signupUser(email: string, password: string): { success: boolean; error?: string } {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  if (email.length < 5 || !email.includes("@")) {
    return { success: false, error: "Invalid email format" }
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  if (findUser(email)) {
    return { success: false, error: "Email already registered" }
  }

  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password,
  }

  const users = getAllUsers()
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  return { success: true }
}

export function loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  const user = findUser(email)
  if (!user || user.password !== password) {
    return { success: false, error: "Invalid email or password" }
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  return { success: true, user }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function isUserAuthenticated(): boolean {
  return getCurrentUser() !== null
}
