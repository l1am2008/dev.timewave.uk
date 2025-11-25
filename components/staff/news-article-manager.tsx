"use client"

import type React from "react"

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
}

interface NewsArticleManagerProps {
  staffId: number
}

export default function NewsArticleManager({ staffId }: NewsArticleManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    featured_image_url: "",
    tags: "Other News",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { data: articles, mutate } = useSWR<NewsArticle[]>(`/api/staff/news?staffId=${staffId}`, fetcher, {
    refreshInterval: 5000,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/staff/news/${editingId}` : "/api/staff/news"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          staffId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to save article")
        return
      }

      setSuccess(editingId ? "Article updated successfully" : "Article created successfully")
      setFormData({ title: "", content: "", featured_image_url: "", tags: "Other News" })
      setEditingId(null)
      setShowForm(false)
      mutate()
    } catch (err) {
      setError("An error occurred")
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const response = await fetch(`/api/staff/news/${id}`, { method: "DELETE" })
      if (!response.ok) {
        setError("Failed to delete article")
        return
      }
      setSuccess("Article deleted")
      mutate()
    } catch (err) {
      setError("Error deleting article")
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your News Articles</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ title: "", content: "", featured_image_url: "", tags: "Other News" })
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          {showForm ? "Cancel" : "Create Article"}
        </button>
      </div>

      {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-md border border-red-500/20">{error}</div>}
      {success && (
        <div className="bg-green-500/10 text-green-500 p-4 rounded-md border border-green-500/20">{success}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 border border-border space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Featured Image URL</label>
              <input
                type="url"
                value={formData.featured_image_url}
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Radio News</option>
                <option>Local News</option>
                <option>Global News</option>
                <option>Other News</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            {editingId ? "Update Article" : "Create Article"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {articles?.map((article) => (
          <div key={article.id} className="bg-card rounded-lg p-4 border border-border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{article.tags}</p>
                <p className="text-sm mb-2">{article.content.substring(0, 100)}...</p>
                <div className="flex gap-2 text-xs">
                  <span className={article.is_approved ? "text-green-600" : "text-yellow-600"}>
                    {article.is_approved ? "✓ Approved" : "⏳ Pending"}
                  </span>
                  {article.published_at && <span className="text-muted-foreground">Published</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(article.id)
                    setFormData({
                      title: article.title,
                      content: article.content,
                      featured_image_url: article.featured_image_url || "",
                      tags: article.tags,
                    })
                    setShowForm(true)
                  }}
                  className="px-3 py-1 text-sm bg-blue-600/20 text-blue-600 hover:bg-blue-600/30 rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="px-3 py-1 text-sm bg-red-600/20 text-red-600 hover:bg-red-600/30 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {!articles ||
          (articles.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No articles yet. Create one to get started!</p>
          ))}
      </div>
    </div>
  )
}
