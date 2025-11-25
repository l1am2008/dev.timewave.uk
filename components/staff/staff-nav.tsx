"use client"

import Link from "next/link"

interface StaffNavProps {
  staffName: string
  onLogout: () => void
}

export default function StaffNav({ staffName, onLogout }: StaffNavProps) {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/staff/portal" className="font-bold text-xl text-blue-600">
            Timewave Staff
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to Site
          </Link>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
