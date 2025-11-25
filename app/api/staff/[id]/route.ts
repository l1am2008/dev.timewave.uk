import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const results = (await query("SELECT * FROM staff WHERE id = ?", [params.id])) as any[]

    if (results.length === 0) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 })
    }

    return NextResponse.json(results[0])
  } catch (error) {
    console.error("[v0] Get staff error:", error)
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { bio, photo_url } = await request.json()

    await query("UPDATE staff SET bio = ?, photo_url = ? WHERE id = ?", [bio ?? null, photo_url ?? null, params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update staff error:", error)
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 })
  }
}
