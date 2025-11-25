"use client"

import { X, Mail } from "lucide-react"

interface StaffModalProps {
  member: {
    id: string
    name: string
    role: string
    department: string
    bio: string
    email: string
    photo?: string
  }
  onClose: () => void
}

export default function StaffModal({ member, onClose }: StaffModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{member.name}</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {member.photo && (
            <img
              src={member.photo || "/placeholder.svg"}
              alt={member.name}
              className="w-full h-40 object-cover rounded-lg"
            />
          )}
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-semibold">{member.role}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Department</p>
            <p className="font-semibold">{member.department}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">About</p>
            <p className="text-sm">{member.bio}</p>
          </div>
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2 text-accent hover:opacity-80 transition-opacity"
          >
            <Mail className="w-4 h-4" />
            {member.email}
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Close
        </button>
      </div>
    </div>
  )
}
