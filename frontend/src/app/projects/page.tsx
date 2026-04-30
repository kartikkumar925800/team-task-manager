"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Project {
  id: number
  name: string
  description: string
  owner_id: number
}

export default function ProjectsPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      fetchProjects()
    }
  }, [user, loading, router])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (err) {
      console.error("Failed to fetch projects")
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (user?.role !== "ADMIN") {
      setError("Only administrators can create projects.")
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      })

      if (response.ok) {
        setName("")
        setDescription("")
        fetchProjects()
      } else {
        setError("Failed to create project")
      }
    } catch (err) {
      setError("Network error")
    }
  }

  if (loading) return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
        <p className="text-sm font-medium text-gray-500">Loading projects...</p>
      </div>
    </div>
  )
  if (!user) return null


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            &larr; Back to Dashboard
          </button>
        </div>

        {user.role === "ADMIN" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Project Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <textarea
                  placeholder="Project Description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  rows={3}
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
              >
                Create Project
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map((project) => (
    <Link 
      href={`/projects/${project.id}`} 
      key={project.id} 
      className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600 hover:shadow-lg transition-shadow block"
    >
      <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
      <p className="mt-2 text-gray-600">{project.description}</p>
      <div className="mt-4 text-blue-600 text-sm font-medium">
        Open Task Board &rarr;
      </div>
    </Link>
  ))}
  {projects.length === 0 && (
    <div className="col-span-full text-center text-gray-500 py-8">
      No projects found.
    </div>
  )}
</div>
      </div>
    </div>
  )
}