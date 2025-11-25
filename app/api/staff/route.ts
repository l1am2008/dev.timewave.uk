import { query } from "@/lib/db"

export async function GET() {
  try {
    const results = await query("SELECT * FROM staff ORDER BY department, name")
    return Response.json(results)
  } catch (error) {
    return Response.json({ error: "Failed to fetch staff" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, role, department, bio, email, photo_url } = body

    console.log("[v0] Staff POST body:", body)

    const values = [name ?? null, role ?? null, department ?? null, bio ?? null, email ?? null, photo_url ?? null]

    console.log("[v0] Staff POST values:", values)

    const results = await query(
      "INSERT INTO staff (name, role, department, bio, email, photo_url) VALUES (?, ?, ?, ?, ?, ?)",
      values,
    )

    return Response.json({ id: (results as any).insertId, ...body })
  } catch (error) {
    console.error("[v0] Staff POST error:", error)
    return Response.json({ error: "Failed to create staff", details: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, role, department, bio, email, photo_url } = body

    console.log("[v0] Staff PUT body:", body)

    const values = [name ?? null, role ?? null, department ?? null, bio ?? null, email ?? null, photo_url ?? null, id]

    console.log("[v0] Staff PUT values:", values)

    await query("UPDATE staff SET name=?, role=?, department=?, bio=?, email=?, photo_url=? WHERE id=?", values)

    return Response.json({ id, ...body })
  } catch (error) {
    console.error("[v0] Staff PUT error:", error)
    return Response.json({ error: "Failed to update staff", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    await query("DELETE FROM staff WHERE id=?", [id])

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to delete staff" }, { status: 500 })
  }
}
