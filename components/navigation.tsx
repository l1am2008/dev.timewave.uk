"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-secondary border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image
                src="https://us-east-1.tixte.net/uploads/liam.needs.rest/TimewaveTransparent.png"
                alt="Timewave Radio"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold hidden sm:inline">Timewave Radio</span>
          </Link>

          <div className="flex gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive("/") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              Home
            </Link>
            <Link
              href="/news"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive("/news") || pathname.startsWith("/news/")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              News
            </Link>
            <Link
              href="/jobs"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive("/jobs") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              Jobs
            </Link>
            <Link
              href="/staff"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive("/staff") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              Staff
            </Link>
            <Link
              href="/staff/login"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive("/staff/login") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
