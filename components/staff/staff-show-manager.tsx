"use client"

import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface StaffShowManagerProps {
  staffId: number
}

export default function StaffShowManager({ staffId }: StaffShowManagerProps) {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { data: shows, mutate } = useSWR(`/api/staff/shows?staffId=${staffId}`, fetcher, { refreshInterval: 5000 })

  const handleUpdateShow = async (showId: number) => {
    try {
      const response = await fetch(`/api/staff/shows/${showId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId }),
      })

      if (!response.ok) {
        setError("Failed to update show")
        return
      }

      setSuccess("Show updated")
      mutate()
    } catch (err) {
      setError("Error updating show")
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Shows</h2>

      {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-md border border-red-500/20">{error}</div>}
      {success && (
        <div className="bg-green-500/10 text-green-500 p-4 rounded-md border border-green-500/20">{success}</div>
      )}

      <div className="space-y-4">
        {shows?.map((show: any) => (
          <div key={show.id} className="bg-card rounded-lg p-4 border border-border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{show.show_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {show.day} • {show.start_time} - {show.end_time}
                </p>
                <p className="text-sm mt-2">{show.bio}</p>
              </div>
              <button
                onClick={() => handleUpdateShow(show.schedule_id)}
                className="px-4 py-2 bg-blue-600/20 text-blue-600 hover:bg-blue-600/30 rounded transition"
              >
                Update Info
              </button>
            </div>
          </div>
        ))}
        {!shows ||
          (shows.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No shows assigned yet. Contact admin to add you to a show schedule.
            </p>
          ))}
      </div>
    </div>
  )
}
