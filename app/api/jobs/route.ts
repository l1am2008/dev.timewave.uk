import { query } from "@/lib/db"

export async function GET() {
  try {
    const results = await query("SELECT * FROM jobs ORDER BY created_at DESC")
    const mapped = (results as any[]).map((job) => ({
      ...job,
      doc_url: job.job_description_link,
      form_url: job.application_link,
    }))
    return Response.json(mapped)
  } catch (error) {
    console.error("[v0] Jobs GET error:", error)
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, department, description, doc_url, form_url } = body

    const values = [title ?? null, department ?? null, description ?? null, doc_url ?? null, form_url ?? null]

    const results = await query(
      "INSERT INTO jobs (title, department, description, job_description_link, application_link) VALUES (?, ?, ?, ?, ?)",
      values,
    )

    return Response.json({ id: (results as any).insertId, ...body })
  } catch (error) {
    console.error("[v0] Jobs POST error:", error)
    return Response.json({ error: "Failed to create job", details: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, department, description, doc_url, form_url } = body

    const values = [title ?? null, department ?? null, description ?? null, doc_url ?? null, form_url ?? null, id]

    await query(
      "UPDATE jobs SET title=?, department=?, description=?, job_description_link=?, application_link=? WHERE id=?",
      values,
    )

    return Response.json({ id, ...body })
  } catch (error) {
    console.error("[v0] Jobs PUT error:", error)
    return Response.json({ error: "Failed to update job", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    await query("DELETE FROM jobs WHERE id=?", [id])

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Jobs DELETE error:", error)
    return Response.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
