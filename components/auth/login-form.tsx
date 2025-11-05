"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { validateEmail } from "@/lib/validation"
import { loginUser } from "@/lib/auth-client"

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError.message
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = loginUser(formData.email, formData.password)

      if (!result.success) {
        setErrors({ submit: result.error || "Login failed" })
        return
      }

      localStorage.setItem("isAuthenticated", "true")
      router.push("/dashboard")
    } catch (err) {
      setErrors({ submit: "An error occurred. Please try again." })
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 ${
            errors.email ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"
          }`}
        />
        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 ${
            errors.password ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"
          }`}
        />
        {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
      </div>

      {errors.submit && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
          {errors.submit}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading ? "Logging in..." : "Log In"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </form>
  )
}
