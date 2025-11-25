"use client"

import { useState } from "react"
import { Plus, Trash2, Edit2 } from "lucide-react"
import useSWR from "swr"

interface StaffMember {
  id: number
  name: string
  role: string
  department: string
  bio: string
  email: string
  photo_url?: string
}

const departments = [
  "Governance & Strategic Leadership",
  "Volunteer & People Management",
  "Data Protection & Compliance",
  "News & Journalism",
  "On-Air Programming",
]

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const cleanData = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""))
}

export default function StaffManager() {
  const { data: staff = [], mutate } = useSWR("/api/staff", fetcher)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<StaffMember>>({})

  const handleAddStaff = async () => {
    const newMember = {
      name: "New Staff Member",
      role: "Role",
      department: departments[0],
      bio: "Bio",
      email: "email@timewave.co.uk",
    }

    try {
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("[v0] Staff add error:", response.status, error)
        alert(`Error adding staff: ${response.status}. Check console for details.`)
        return
      }

      mutate()
    } catch (error) {
      console.error("[v0] Staff add exception:", error)
      alert("Failed to add staff. Check console for details.")
    }
  }

  const handleEdit = (member: StaffMember) => {
    setEditingId(member.id)
    setFormData(member)
  }

  const handleSave = async () => {
    if (editingId) {
      try {
        const cleanedData = cleanData(formData)
        const response = await fetch("/api/staff", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...cleanedData }),
        })

        if (!response.ok) {
          const error = await response.text()
          console.error("[v0] Staff save error:", response.status, error)
          alert(`Error saving staff: ${response.status}. Check console for details.`)
          return
        }

        mutate()
        setEditingId(null)
        setFormData({})
      } catch (error) {
        console.error("[v0] Staff save exception:", error)
        alert("Failed to save staff. Check console for details.")
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        const response = await fetch("/api/staff", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })

        if (!response.ok) {
          const error = await response.text()
          console.error("[v0] Staff delete error:", response.status, error)
          alert(`Error deleting staff: ${response.status}. Check console for details.`)
          return
        }

        mutate()
      } catch (error) {
        console.error("[v0] Staff delete exception:", error)
        alert("Failed to delete staff. Check console for details.")
      }
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddStaff}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        Add Staff Member
      </button>

      <div className="space-y-3">
        {staff.map((member) => (
          <div key={member.id} className="bg-card border border-border rounded-lg p-4">
            {editingId === member.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={formData.department || ""}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Bio"
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
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-accent">{member.role}</p>
                  <p className="text-sm text-muted-foreground mt-1">{member.department}</p>
                  <p className="text-sm text-foreground/80 mt-1">{member.bio}</p>
                  <p className="text-sm text-foreground/60 mt-1">{member.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
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
