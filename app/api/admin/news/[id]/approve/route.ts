import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await query("UPDATE news_articles SET is_approved = TRUE, published_at = NOW() WHERE id = ?", [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Approve news error:", error)
    return NextResponse.json({ error: "Failed to approve article" }, { status: 500 })
  }
}
