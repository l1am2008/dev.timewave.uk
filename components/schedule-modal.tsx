"use client"

import { X } from "lucide-react"

interface ScheduleModalProps {
  show: any
  onClose: () => void
}

export default function ScheduleModal({ show, onClose }: ScheduleModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{show.name}</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {show.image && (
            <img
              src={show.image || "/placeholder.svg"}
              alt={show.name}
              className="w-full h-40 object-cover rounded-lg"
            />
          )}
          <div>
            <p className="text-sm text-muted-foreground">Host</p>
            <p className="font-semibold">{show.host}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">About</p>
            <p className="text-sm">{show.bio}</p>
          </div>
          {show.start_time && (
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-semibold">
                {show.start_time} - {show.end_time}
              </p>
            </div>
          )}
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
