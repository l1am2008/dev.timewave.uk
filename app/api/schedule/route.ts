import { query } from "@/lib/db"

export async function GET() {
  try {
    const results = await query(
      'SELECT id, day, show_name as name, start_time, end_time, host, bio, picture_url as image_url FROM schedule ORDER BY FIELD(day, "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"), start_time',
    )
    console.log("[v0] Schedule results:", results)
    return Response.json(Array.isArray(results) ? results : [])
  } catch (error) {
    console.error("[v0] Schedule API error:", error)
    return Response.json({ error: "Failed to fetch schedule", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { day, name, start_time, end_time, host, bio, image_url } = body

    console.log("[v0] Schedule POST body:", body)

    const values = [
      day ?? null,
      name ?? null,
      start_time ?? null,
      end_time ?? null,
      host ?? null,
      bio ?? null,
      image_url ?? null,
    ]

    console.log("[v0] Schedule POST values:", values)

    const results = await query(
      "INSERT INTO schedule (day, show_name, start_time, end_time, host, bio, picture_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      values,
    )

    return Response.json({ id: (results as any).insertId, ...body })
  } catch (error) {
    console.error("[v0] Schedule POST error:", error)
    return Response.json({ error: "Failed to create schedule", details: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, day, name, start_time, end_time, host, bio, image_url } = body

    console.log("[v0] Schedule PUT body:", body)

    const values = [
      day ?? null,
      name ?? null,
      start_time ?? null,
      end_time ?? null,
      host ?? null,
      bio ?? null,
      image_url ?? null,
      id,
    ]

    console.log("[v0] Schedule PUT values:", values)

    await query(
      "UPDATE schedule SET day=?, show_name=?, start_time=?, end_time=?, host=?, bio=?, picture_url=? WHERE id=?",
      values,
    )

    return Response.json({ id, ...body })
  } catch (error) {
    console.error("[v0] Schedule PUT error:", error)
    return Response.json({ error: "Failed to update schedule", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    await query("DELETE FROM schedule WHERE id=?", [id])

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to delete schedule" }, { status: 500 })
  }
}
