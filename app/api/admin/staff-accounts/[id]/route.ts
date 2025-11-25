import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { is_active } = await request.json()

    await query("UPDATE staff_accounts SET is_active = ? WHERE id = ?", [is_active, params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update account error:", error)
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 })
  }
}
