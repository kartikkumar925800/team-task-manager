"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface DashboardStats {
  total: number
  todo: number
  in_progress: number
  done: number
  overdue: number
}

interface Task {
  id: number
  title: string
  status: string
  due_date: string
  project_id: number
}

export default function DashboardPage() {
  const { user, token, loading, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        
        const [statsRes, tasksRes] = await Promise.all([
          fetch(`${baseUrl}/tasks/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${baseUrl}/tasks/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        if (statsRes.ok) setStats(await statsRes.json())
        if (tasksRes.ok) setTasks(await tasksRes.json())
        else setError("Failed to load dashboard data")
      } catch (err) {
        setError("Network error connecting to API")
      }
    }
    fetchData()
  }, [token])

  if (loading) return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
        <p className="text-sm font-medium text-gray-500">Connecting to API...</p>
      </div>
    </div>
  )
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/projects"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Manage Projects
            </Link>
            <button
              onClick={logout}
              className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="Total Tasks" value={stats?.total ?? 0} />
          <StatCard title="To Do" value={stats?.todo ?? 0} />
          <StatCard title="In Progress" value={stats?.in_progress ?? 0} color="text-blue-600" />
          <StatCard title="Done" value={stats?.done ?? 0} color="text-green-600" />
        </div>
        
        {stats && stats.overdue > 0 && (
          <div className="mb-8 rounded-md bg-red-100 p-4 border-l-4 border-red-500">
            <p className="text-red-700 font-bold">Attention: You have {stats.overdue} overdue tasks!</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Assigned Tasks</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {tasks.map(task => (
              <li key={task.id} className="p-6 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    task.status === "DONE" ? "bg-green-100 text-green-800" :
                    task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {task.status.replace("_", " ")}
                  </span>
                  <Link 
                    href={`/projects/${task.project_id}`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    View Project &rarr;
                  </Link>
                </div>
              </li>
            ))}
            {tasks.length === 0 && (
              <li className="p-6 text-center text-gray-500">No tasks assigned yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color = "text-gray-900" }: { title: string; value: number; color?: string }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white p-5 shadow">
      <div className="truncate text-sm font-medium text-gray-500">{title}</div>
      <div className={`mt-1 text-3xl font-semibold ${color}`}>{value}</div>
    </div>
  )
}