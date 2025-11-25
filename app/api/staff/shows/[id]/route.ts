import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { staffId, bio, picture_url } = await request.json()

    if (!staffId) {
      return NextResponse.json({ error: "Staff ID required" }, { status: 400 })
    }

    // Update the schedule with new bio and picture
    await query("UPDATE schedule SET bio = ?, picture_url = ? WHERE id = ?", [
      bio ?? null,
      picture_url ?? null,
      params.id,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update show error:", error)
    return NextResponse.json({ error: "Failed to update show" }, { status: 500 })
  }
}
