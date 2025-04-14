import type { Metadata } from "next"
import SignInForm from "@/components/auth/sign-in-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign In - Employee Dashboard",
  description: "Sign in to your account",
}

export default function SignIn() {
  return (
    <div>
      <SignInForm />
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm">
          <Link href="/auth/forgot-password" className="font-medium text-primary hover:text-primary/90">
            Forgot your password?
          </Link>
        </div>
        <div className="text-sm">
          <Link href="/auth/signup" className="font-medium text-primary hover:text-primary/90">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
