import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get("staffId")

    if (!staffId) {
      return NextResponse.json({ error: "Staff ID required" }, { status: 400 })
    }

    const results = await query(
      "SELECT id, staff_id, title, content, featured_image_url, tags, is_approved, published_at, created_at FROM news_articles WHERE staff_id = ? ORDER BY created_at DESC",
      [staffId],
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Get news error:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, featured_image_url, tags, staffId } = await request.json()

    if (!title || !content || !staffId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cleanedTags = tags ?? "Other News"

    await query(
      "INSERT INTO news_articles (staff_id, title, content, featured_image_url, tags, is_approved) VALUES (?, ?, ?, ?, ?, FALSE)",
      [staffId, title, content, featured_image_url ?? null, cleanedTags],
    )

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create news error:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
