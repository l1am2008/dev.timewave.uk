"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScheduleManager from "@/components/admin/schedule-manager"
import StaffManager from "@/components/admin/staff-manager"
import JobsManager from "@/components/admin/jobs-manager"
import NewsApprovalManager from "@/components/admin/news-approval-manager"
import StaffAccountManager from "@/components/admin/staff-account-manager"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.isValid) {
        setIsAuthenticated(true)
        setPassword("")
      } else {
        alert("Incorrect password")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Error verifying password")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6">Admin Portal</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-secondary">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="news">News Approval</TabsTrigger>
          <TabsTrigger value="accounts">Staff Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <ScheduleManager />
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <StaffManager />
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          <JobsManager />
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <NewsApprovalManager />
        </TabsContent>

        <TabsContent value="accounts" className="mt-6">
          <StaffAccountManager />
        </TabsContent>
      </Tabs>

      <button
        onClick={() => setIsAuthenticated(false)}
        className="mt-8 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        Logout
      </button>
    </main>
  )
}
