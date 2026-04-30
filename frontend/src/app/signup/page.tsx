"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const response = await fetch(`${baseUrl}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role: "MEMBER" }),
    })
    if (response.ok) {
      setSuccess(true)
      setTimeout(() => router.push("/login"), 2000)
    } else {
      const errData = await response.json()
      if (Array.isArray(errData.detail)) {
        setError(errData.detail[0]?.msg || "Signup failed")
      } else {
        setError(typeof errData.detail === "string" ? errData.detail : "Signup failed")
      }
    }
  } catch (err) {
    setError("Network error connecting to server")
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create an Account
          </h2>
        </div>
        
        {success ? (
          <div className="rounded-md bg-green-50 p-4 text-center text-sm text-green-800">
            Account created successfully! Redirecting to login...
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <input
                type="text"
                required
                className="relative block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                required
                className="relative block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                className="relative block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Sign up
            </button>
            
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}