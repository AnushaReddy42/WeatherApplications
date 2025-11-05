import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Get started with Weather Report</p>
        </div>

        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
