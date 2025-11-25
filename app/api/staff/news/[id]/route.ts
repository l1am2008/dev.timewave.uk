import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, content, featured_image_url, tags } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await query("UPDATE news_articles SET title = ?, content = ?, featured_image_url = ?, tags = ? WHERE id = ?", [
      title,
      content,
      featured_image_url ?? null,
      tags ?? "Other News",
      params.id,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update news error:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await query("DELETE FROM news_articles WHERE id = ?", [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete news error:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
