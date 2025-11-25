import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

    console.log("[v0] Received password:", password)
    console.log("[v0] Admin password from env:", adminPassword)
    console.log("[v0] Password match:", password === adminPassword)

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin password not configured" }, { status: 500 })
    }

    const isValid = password === adminPassword
    return NextResponse.json({ isValid })
  } catch (error) {
    console.error("[v0] Password verification error:", error)
    return NextResponse.json({ error: "Password verification failed" }, { status: 500 })
  }
}
