"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface StaffAccount {
  id: number
  staff_id: number
  email: string
  is_active: boolean
  name: string
}

export default function StaffAccountManager() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    staff_id: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { data: accounts, mutate } = useSWR<StaffAccount[]>("/api/admin/staff-accounts", fetcher, {
    refreshInterval: 5000,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.staff_id || !formData.email || !formData.password) {
      setError("All fields required")
      return
    }

    try {
      const response = await fetch("/api/admin/staff-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create account")
        return
      }

      setSuccess("Staff account created successfully")
      setFormData({ staff_id: "", email: "", password: "" })
      setShowForm(false)
      mutate()
    } catch (err) {
      setError("An error occurred")
      console.error(err)
    }
  }

  const handleToggleActive = async (accountId: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/staff-accounts/${accountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      })

      if (!response.ok) {
        setError("Failed to update account")
        return
      }

      setSuccess("Account updated")
      mutate()
    } catch (err) {
      setError("Error updating account")
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Staff Accounts</h2>
          <p className="text-muted-foreground">Manage staff login credentials and access</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition"
        >
          {showForm ? "Cancel" : "Create Account"}
        </button>
      </div>

      {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-md border border-red-500/20">{error}</div>}
      {success && (
        <div className="bg-green-500/10 text-green-500 p-4 rounded-md border border-green-500/20">{success}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 border border-border space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Staff Member</label>
            <input
              type="number"
              value={formData.staff_id}
              onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
              placeholder="Enter Staff ID"
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition"
          >
            Create Account
          </button>
        </form>
      )}

      <div className="space-y-3">
        {accounts?.map((account) => (
          <div
            key={account.id}
            className="bg-card rounded-lg p-4 border border-border flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{account.name}</p>
              <p className="text-sm text-muted-foreground">{account.email}</p>
            </div>
            <div className="flex gap-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  account.is_active ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
                }`}
              >
                {account.is_active ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => handleToggleActive(account.id, account.is_active)}
                className="px-3 py-1 text-sm bg-blue-600/20 text-blue-600 hover:bg-blue-600/30 rounded transition"
              >
                {account.is_active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
        {!accounts ||
          (accounts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No staff accounts created yet</p>
          ))}
      </div>
    </div>
  )
}
