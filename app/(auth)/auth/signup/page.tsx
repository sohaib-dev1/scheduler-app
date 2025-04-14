import type { Metadata } from "next"
import SignUpForm from "@/components/auth/sign-up-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign Up - Employee Dashboard",
  description: "Create a new account",
}

export default function SignUp() {
  return (
    <div>
      <SignUpForm />
      <div className="mt-6 text-center text-sm">
        <p>
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:text-primary/90">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
