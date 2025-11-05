export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: "email", message: "Please enter a valid email address" }
  }
  return null
}

export function validatePassword(password: string): ValidationError | null {
  if (password.length < 6) {
    return { field: "password", message: "Password must be at least 6 characters long" }
  }
  return null
}

export function validateCity(city: string): ValidationError | null {
  if (!city.trim()) {
    return { field: "city", message: "Please enter a city name" }
  }
  if (city.trim().length < 2) {
    return { field: "city", message: "City name must be at least 2 characters" }
  }
  return null
}
