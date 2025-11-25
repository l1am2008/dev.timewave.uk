import { query } from "@/lib/db"
import { verifyPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const results = (await query(
      "SELECT sa.id, sa.staff_id, sa.password_hash, s.name FROM staff_accounts sa JOIN staff s ON sa.staff_id = s.id WHERE sa.email = ? AND sa.is_active = TRUE",
      [email],
    )) as any[]

    if (results.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const account = results[0]
    const isValidPassword = verifyPassword(password, account.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      staffId: account.staff_id,
      name: account.name,
      email: email,
    })
  } catch (error) {
    console.error("[v0] Staff login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
