"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import ScheduleModal from "@/components/schedule-modal"
import useSWR from "swr"

interface Show {
  id: number
  name: string
  start_time: string
  end_time: string
  host: string
  bio: string
  day: string
  image_url?: string
}

interface Schedule {
  day: string
  shows: Show[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ClientScheduleSection() {
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const { data: allShows = [], isLoading: isLoadingSchedule } = useSWR("/api/schedule", fetcher)

  const schedule: Schedule[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
    (day) => ({
      day,
      shows: (allShows as Show[])
        .filter((show) => show.day === day)
        .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    }),
  )

  return (
    <>
      {isLoadingSchedule ? (
        <div className="text-muted-foreground">Loading schedule...</div>
      ) : (
        <div className="space-y-3">
          {schedule.map((daySchedule) => (
            <div
              key={daySchedule.day}
              className="bg-card border border-border rounded-lg p-4 hover:bg-muted transition-colors cursor-pointer group"
              onClick={() => setSelectedDay(selectedDay === daySchedule.day ? null : daySchedule.day)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{daySchedule.day}</h3>
                  <p className="text-muted-foreground text-sm">{daySchedule.shows.length} show(s)</p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground group-hover:text-accent transition-all ${
                    selectedDay === daySchedule.day ? "rotate-180" : ""
                  }`}
                />
              </div>

              {selectedDay === daySchedule.day && (
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  {daySchedule.shows.map((show) => (
                    <button
                      key={show.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedShow(show)
                      }}
                      className="w-full text-left p-3 rounded-lg bg-muted hover:bg-accent/10 transition-colors"
                    >
                      <p className="font-semibold text-accent">{show.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {show.start_time} - {show.end_time}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedShow && <ScheduleModal show={selectedShow} onClose={() => setSelectedShow(null)} />}
    </>
  )
}
