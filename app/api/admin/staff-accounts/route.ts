import { query } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const results = await query(
      `SELECT sa.id, sa.staff_id, sa.email, sa.is_active, s.name
       FROM staff_accounts sa
       JOIN staff s ON sa.staff_id = s.id
       ORDER BY s.name`,
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Get staff accounts error:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { staff_id, email, password } = await request.json()

    if (!staff_id || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const passwordHash = hashPassword(password)

    await query("INSERT INTO staff_accounts (staff_id, email, password_hash, is_active) VALUES (?, ?, ?, TRUE)", [
      staff_id,
      email,
      passwordHash,
    ])

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Create account error:", error)
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
