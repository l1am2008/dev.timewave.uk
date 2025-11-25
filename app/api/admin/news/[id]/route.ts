import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await query("DELETE FROM news_articles WHERE id = ?", [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete news error:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
