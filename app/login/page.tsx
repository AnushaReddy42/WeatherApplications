import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Log in to your Weather Report account</p>
        </div>

        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
