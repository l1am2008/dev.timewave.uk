import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const results = await query(
      `SELECT na.id, na.staff_id, na.title, na.content, na.featured_image_url, na.tags, na.is_approved, na.is_featured, na.published_at, na.created_at, s.name as staff_name
       FROM news_articles na
       JOIN staff s ON na.staff_id = s.id
       ORDER BY na.created_at DESC`,
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Get news error:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
