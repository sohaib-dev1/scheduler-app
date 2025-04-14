import type React from "react"
import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Authentication - Employee Dashboard",
  description: "Sign in to your account",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="Company Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">Employee Dashboard</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card text-card-foreground py-8 px-4 shadow sm:rounded-lg sm:px-10">{children}</div>
      </div>
    </div>
  )
}
