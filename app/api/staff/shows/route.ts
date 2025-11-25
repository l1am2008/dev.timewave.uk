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
      `SELECT ss.id, s.day, s.start_time, s.end_time, s.show_name, s.bio, s.id as schedule_id
       FROM staff_shows ss
       JOIN schedule s ON ss.schedule_id = s.id
       WHERE ss.staff_id = ?
       ORDER BY s.day, s.start_time`,
      [staffId],
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Get shows error:", error)
    return NextResponse.json({ error: "Failed to fetch shows" }, { status: 500 })
  }
}
