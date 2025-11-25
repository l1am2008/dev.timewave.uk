"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import StaffNav from "@/components/staff/staff-nav"
import NewsArticleManager from "@/components/staff/news-article-manager"
import StaffProfileManager from "@/components/staff/staff-profile-manager"
import StaffShowManager from "@/components/staff/staff-show-manager"

type TabType = "news" | "profile" | "shows"

export default function StaffPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>("news")
  const [staffAuth, setStaffAuth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("staffAuth")
    if (!auth) {
      router.push("/staff/login")
      return
    }
    setStaffAuth(JSON.parse(auth))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("staffAuth")
    router.push("/staff/login")
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!staffAuth) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <StaffNav staffName={staffAuth.name} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {staffAuth.name}</h1>
          <p className="text-muted-foreground">Manage your news articles, profile, and shows</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("news")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "news"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            News Articles
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "profile"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab("shows")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "shows"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            My Shows
          </button>
        </div>

        {activeTab === "news" && <NewsArticleManager staffId={staffAuth.staffId} />}
        {activeTab === "profile" && <StaffProfileManager staffId={staffAuth.staffId} />}
        {activeTab === "shows" && <StaffShowManager staffId={staffAuth.staffId} />}
      </main>
    </div>
  )
}
