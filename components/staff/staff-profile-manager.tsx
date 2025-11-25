"use client"

import type React from "react"

import { useState, useEffect } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface StaffProfileManagerProps {
  staffId: number
}

export default function StaffProfileManager({ staffId }: StaffProfileManagerProps) {
  const [formData, setFormData] = useState({
    bio: "",
    photo_url: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { data: staff, mutate } = useSWR(`/api/staff/${staffId}`, fetcher)

  useEffect(() => {
    if (staff) {
      setFormData({
        bio: staff.bio || "",
        photo_url: staff.photo_url || "",
      })
    }
  }, [staff])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/staff/${staffId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update profile")
        return
      }

      setSuccess("Profile updated successfully")
      mutate()
    } catch (err) {
      setError("An error occurred")
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Profile</h2>

      {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-md border border-red-500/20">{error}</div>}
      {success && (
        <div className="bg-green-500/10 text-green-500 p-4 rounded-md border border-green-500/20">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 border border-border space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={staff?.name || ""}
            disabled
            className="w-full px-4 py-2 rounded-md border border-border bg-muted-foreground/10 text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Contact admin to change name</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Photo URL</label>
          <input
            type="url"
            value={formData.photo_url}
            onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
          Save Changes
        </button>
      </form>
    </div>
  )
}
