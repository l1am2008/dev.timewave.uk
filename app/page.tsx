import type { Metadata } from "next"
import HomeClient from "./page-client"
import { query } from "@/lib/db"

export const metadata: Metadata = {
  title: "Timewave Radio - Live Community Radio",
  description: "Listen to Timewave Radio live stream with schedule and latest news",
}

export default async function Home() {
  try {
    // Fetch featured news article
    const featuredArticles = (await query(
      `SELECT id, title, content, featured_image_url, tags, published_at, staff_id
       FROM news_articles
       WHERE is_approved = TRUE AND is_featured = TRUE
       LIMIT 1`,
    )) as any[]

    const featuredArticle = featuredArticles[0] || null

    return <HomeClient featuredArticle={featuredArticle} />
  } catch (error) {
    console.error("[v0] Homepage error:", error)
    return <HomeClient featuredArticle={null} />
  }
}
