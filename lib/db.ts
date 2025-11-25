import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function query(sql: string, values?: any[]) {
  try {
    const connection = await pool.getConnection()
    const [results] = await connection.execute(sql, values || [])
    connection.release()
    return results
  } catch (error) {
    console.error("[v0] Database error:", error)
    console.error("[v0] Connection config - Host:", process.env.MYSQL_HOST, "Database:", process.env.MYSQL_DATABASE)
    throw error
  }
}

export default pool
