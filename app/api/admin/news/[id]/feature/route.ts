import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get current featured status
    const results = (await query("SELECT is_featured FROM news_articles WHERE id = ?", [params.id])) as any[]

    if (results.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const currentStatus = results[0].is_featured

    // If featuring, unfeature all others
    if (!currentStatus) {
      await query("UPDATE news_articles SET is_featured = FALSE")
    }

    // Toggle this article
    await query("UPDATE news_articles SET is_featured = ?, is_approved = TRUE, published_at = NOW() WHERE id = ?", [
      !currentStatus,
      params.id,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Feature news error:", error)
    return NextResponse.json({ error: "Failed to feature article" }, { status: 500 })
  }
}
