"use client"

import { useState } from "react"
import { Plus, Trash2, Edit2 } from "lucide-react"
import useSWR from "swr"

interface Show {
  id: number
  day: string
  name: string
  start_time: string
  end_time: string
  host: string
  bio: string
  image_url?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const cleanData = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""))
}

export default function ScheduleManager() {
  const { data: shows = [], mutate } = useSWR("/api/schedule", fetcher)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Show>>({})

  const handleAddShow = async () => {
    const newShow = {
      day: "Monday",
      name: "New Show",
      start_time: "12:00",
      end_time: "14:00",
      host: "Host Name",
      bio: "Show description",
    }

    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShow),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("[v0] Schedule add error:", response.status, error)
        alert(`Error adding show: ${response.status}. Check console for details.`)
        return
      }

      mutate()
    } catch (error) {
      console.error("[v0] Schedule add exception:", error)
      alert("Failed to add show. Check console for details.")
    }
  }

  const handleEdit = (show: Show) => {
    setEditingId(show.id)
    setFormData(show)
  }

  const handleSave = async () => {
    if (editingId) {
      try {
        const cleanedData = cleanData(formData)
        const response = await fetch("/api/schedule", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...cleanedData }),
        })

        if (!response.ok) {
          const error = await response.text()
          console.error("[v0] Schedule save error:", response.status, error)
          alert(`Error saving show: ${response.status}. Check console for details.`)
          return
        }

        mutate()
        setEditingId(null)
        setFormData({})
      } catch (error) {
        console.error("[v0] Schedule save exception:", error)
        alert("Failed to save show. Check console for details.")
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        const response = await fetch("/api/schedule", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })

        if (!response.ok) {
          const error = await response.text()
          console.error("[v0] Schedule delete error:", response.status, error)
          alert(`Error deleting show: ${response.status}. Check console for details.`)
          return
        }

        mutate()
      } catch (error) {
        console.error("[v0] Schedule delete exception:", error)
        alert("Failed to delete show. Check console for details.")
      }
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddShow}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        Add Show
      </button>

      <div className="space-y-3">
        {shows.map((show) => (
          <div key={show.id} className="bg-card border border-border rounded-lg p-4">
            {editingId === show.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Show name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={formData.day || ""}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={formData.start_time || ""}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="time"
                    value={formData.end_time || ""}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Host name"
                  value={formData.host || ""}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Show bio"
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{show.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {show.day} • {show.start_time} - {show.end_time}
                  </p>
                  <p className="text-sm text-accent mt-1">{show.host}</p>
                  <p className="text-sm text-foreground/80 mt-1">{show.bio}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(show)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(show.id)}
                    className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
