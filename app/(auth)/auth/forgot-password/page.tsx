import type { Metadata } from "next"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Forgot Password - Employee Dashboard",
  description: "Reset your password",
}

export default function ForgotPassword() {
  return (
    <div>
      <ForgotPasswordForm />
      <div className="mt-6 text-center text-sm">
        <p>
          Remember your password?{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:text-primary/90">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
