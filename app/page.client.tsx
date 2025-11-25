"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"

const ClientScheduleSection = dynamic(() => import("@/components/client-schedule-section"), {
  ssr: false,
})

const ClientRecentSongs = dynamic(() => import("@/components/client-recent-songs"), {
  ssr: false,
})

const ScheduleModal = dynamic(() => import("@/components/schedule-modal"), {
  ssr: false,
})

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HomePageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section with Live Stream Info */}
      <section className="mb-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">Timewave Radio</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Your 24/7 stream of community-curated music and talk. Tune in live or explore our schedule.
          </p>
          <div className="flex gap-4">
            <Link
              href="/listen"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-primary-foreground bg-primary hover:opacity-90 transition"
            >
              Listen Live
            </Link>
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-primary bg-primary/10 hover:bg-primary/20 transition"
            >
              View Schedule
              <ChevronDown className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <img src="/radio-tower.svg" alt="Timewave Radio Tower" className="w-full h-auto" />
        </div>
      </section>

      {/* Recent Songs Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Recently Played</h2>
        <ClientRecentSongs />
      </section>

      {/* Schedule Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Weekly Schedule</h2>
        <ClientScheduleSection />
      </section>

      <ScheduleModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  )
}
