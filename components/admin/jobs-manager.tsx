"use client"

import { useState } from "react"
import { Plus, Trash2, Edit2, ExternalLink } from "lucide-react"
import useSWR from "swr"

interface Vacancy {
  id: number
  title: string
  department: string
  description: string
  doc_url: string
  form_url: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const cleanData = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""))
}

export default function JobsManager() {
  const { data: vacancies = [], mutate } = useSWR("/api/jobs", fetcher)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Vacancy>>({})

  const handleAddVacancy = async () => {
    const newVacancy = {
      title: "New Position",
      department: "On-Air Programming",
      description: "Job description",
      doc_url: "#",
      form_url: "#",
    }

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVacancy),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("[v0] Jobs add error:", response.status, error)
        alert(`Error adding vacancy: ${response.status}. Check console for details.`)
        return
      }

      mutate()
    } catch (error) {
      console.error("[v0] Jobs add exception:", error)
      alert("Failed to add vacancy. Check console for details.")
    }
  }

  const handleEdit = (vacancy: Vacancy) => {
    setEditingId(vacancy.id)
    setFormData(vacancy)
  }

  const handleSave = async () => {
    if (editingId) {
      try {
        const cleanedData = cleanData(formData)
        const response = await fetch("/api/jobs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...cleanedData }),
        })

        if (!response.ok) {
          const error = await response.text()
          console.error("[v0] Jobs save error:", response.status, error)
          alert(`Error saving vacancy: ${response.status}. Check console for details.`)
          return
        }

        mutate()
        setEditingId(null)
        setFormData({})
      } catch (error) {
        console.error("[v0] Jobs save exception:", error)
        alert("Failed to save vacancy. Check console for details.")
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        const response = await fetch("/api/jobs", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })

        if (!response.ok) {
          const error = await response.text()
          console.error("[v0] Jobs delete error:", response.status, error)
          alert(`Error deleting vacancy: ${response.status}. Check console for details.`)
          return
        }

        mutate()
      } catch (error) {
        console.error("[v0] Jobs delete exception:", error)
        alert("Failed to delete vacancy. Check console for details.")
      }
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddVacancy}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        Add Vacancy
      </button>

      <div className="space-y-3">
        {vacancies.map((vacancy) => (
          <div key={vacancy.id} className="bg-card border border-border rounded-lg p-4">
            {editingId === vacancy.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Job title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department || ""}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Job description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
                <input
                  type="url"
                  placeholder="Job description document URL"
                  value={formData.doc_url || ""}
                  onChange={(e) => setFormData({ ...formData, doc_url: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="url"
                  placeholder="Application form URL"
                  value={formData.form_url || ""}
                  onChange={(e) => setFormData({ ...formData, form_url: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <p className="font-semibold">{vacancy.title}</p>
                  <p className="text-sm text-accent">{vacancy.department}</p>
                  <p className="text-sm text-foreground/80 mt-2">{vacancy.description}</p>
                  <div className="flex gap-3 mt-2">
                    <a
                      href={vacancy.doc_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:opacity-80 transition-opacity text-sm flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Description
                    </a>
                    <a
                      href={vacancy.form_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:opacity-80 transition-opacity text-sm flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Form
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(vacancy)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vacancy.id)}
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
