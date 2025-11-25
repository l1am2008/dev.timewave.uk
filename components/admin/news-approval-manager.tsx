"use client"

import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface NewsArticle {
  id: number
  title: string
  content: string
  tags: string
  is_approved: boolean
  published_at: string
  created_at: string
  staff_name: string
}

export default function NewsApprovalManager() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { data: articles, mutate } = useSWR<NewsArticle[]>("/api/admin/news", fetcher, { refreshInterval: 5000 })

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/news/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        setError("Failed to approve article")
        return
      }

      setSuccess("Article approved")
      mutate()
    } catch (err) {
      setError("Error approving article")
      console.error(err)
    }
  }

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        setError("Failed to reject article")
        return
      }

      setSuccess("Article rejected")
      mutate()
    } catch (err) {
      setError("Error rejecting article")
      console.error(err)
    }
  }

  const handleFeature = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/news/${id}/feature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        setError("Failed to feature article")
        return
      }

      setSuccess("Article featured")
      mutate()
    } catch (err) {
      setError("Error featuring article")
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">News Article Approvals</h2>
        <p className="text-muted-foreground">Review and approve staff-submitted news articles</p>
      </div>

      {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-md border border-red-500/20">{error}</div>}
      {success && (
        <div className="bg-green-500/10 text-green-500 p-4 rounded-md border border-green-500/20">{success}</div>
      )}

      <div className="space-y-4">
        {articles?.map((article) => (
          <div key={article.id} className="bg-card rounded-lg p-6 border border-border">
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{article.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    article.is_approved ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"
                  }`}
                >
                  {article.is_approved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                By {article.staff_name} • {article.tags}
              </p>
              <p className="text-sm text-muted-foreground">
                Submitted: {new Date(article.created_at).toLocaleDateString()}
              </p>
            </div>

            <p className="text-sm mb-4">{article.content.substring(0, 200)}...</p>

            {!article.is_approved && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(article.id)}
                  className="px-4 py-2 text-sm bg-green-600/20 text-green-600 hover:bg-green-600/30 rounded transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(article.id)}
                  className="px-4 py-2 text-sm bg-red-600/20 text-red-600 hover:bg-red-600/30 rounded transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleFeature(article.id)}
                  className="px-4 py-2 text-sm bg-blue-600/20 text-blue-600 hover:bg-blue-600/30 rounded transition"
                >
                  Approve & Feature
                </button>
              </div>
            )}
            {article.is_approved && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeature(article.id)}
                  className="px-4 py-2 text-sm bg-blue-600/20 text-blue-600 hover:bg-blue-600/30 rounded transition"
                >
                  Toggle Featured
                </button>
              </div>
            )}
          </div>
        ))}
        {!articles ||
          (articles.length === 0 && <p className="text-center text-muted-foreground py-8">No articles to approve</p>)}
      </div>
    </div>
  )
}
