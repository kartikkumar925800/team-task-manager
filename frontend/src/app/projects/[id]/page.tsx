"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useParams, useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
}

interface Task {
  id: number
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  due_date: string
  project_id: number
  assignee_id: number
}

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const { user, token, loading } = useAuth()
  const router = useRouter()
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState("")

  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [assigneeId, setAssigneeId] = useState("")

  useEffect(() => {
    if (!loading && !user) router.push("/login")
    if (token && id) {
      fetchTasks()
      if (user?.role === "ADMIN") fetchUsers()
    }
  }, [user, loading, token, id])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        // Filter tasks for this specific project
        setTasks(data.filter((t: Task) => t.project_id === Number(id)))
      }
    } catch (err) {
      console.error("Failed to fetch tasks")
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        setUsers(await response.json())
      }
    } catch (err) {
      console.error("Failed to fetch users")
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!assigneeId) {
      setError("Please select an assignee")
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          due_date: new Date(dueDate).toISOString(),
          project_id: Number(id),
          assignee_id: Number(assigneeId)
        })
      })

      if (response.ok) {
        setTitle("")
        setDescription("")
        setDueDate("")
        setAssigneeId("")
        fetchTasks()
      } else {
        setError("Failed to create task")
      }
    } catch (err) {
      setError("Network error")
    }
  }

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (response.ok) fetchTasks()
    } catch (err) {
      console.error("Failed to update status")
    }
  }

  if (loading) return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
        <p className="text-sm font-medium text-gray-500">Loading task board...</p>
      </div>
    </div>
  )
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
          <button
            onClick={() => router.push("/projects")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            &larr; Back to Projects
          </button>
        </div>

        {user.role === "ADMIN" && (
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
            <h2 className="text-xl font-semibold mb-4">Assign New Task</h2>
            <form onSubmit={handleCreateTask} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Task Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2"
              />
              <select
                required
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2"
              >
                <option value="">Select Assignee</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <textarea
                placeholder="Description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 sm:col-span-2"
                rows={2}
              />
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 sm:col-span-2"
              />
              {error && <div className="text-red-600 text-sm sm:col-span-2">{error}</div>}
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-medium sm:col-span-2"
              >
                Create Task
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-white p-5 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                <p className="text-xs text-gray-500 mt-2">Due: {new Date(task.due_date).toLocaleString()}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  task.status === "DONE" ? "bg-green-100 text-green-800" :
                  task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {task.status.replace("_", " ")}
                </span>
                
                {(user.role === "ADMIN" || user.id === task.assignee_id) && (
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="text-sm rounded border border-gray-300 px-2 py-1"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                )}
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow">
              No tasks assigned to this project yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}