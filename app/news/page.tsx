import { query } from "@/lib/db"
import NewsArticleCard from "@/components/news-article-card"
import Link from "next/link"

export const metadata = {
  title: "News - Timewave Radio",
  description: "Latest news from Timewave Radio",
}

export default async function NewsPage() {
  try {
    const articles = (await query(
      `SELECT id, staff_id, title, content, featured_image_url, tags, is_approved, published_at, created_at
       FROM news_articles
       WHERE is_approved = TRUE AND published_at IS NOT NULL
       ORDER BY published_at DESC`,
    )) as any[]

    const categories = ["Radio News", "Local News", "Global News", "Other News"]

    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Timewave News</h1>
            <p className="text-lg text-muted-foreground">Stay updated with the latest stories from Timewave Radio</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
              <div className="bg-card rounded-lg p-6 border border-border sticky top-20">
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <nav className="space-y-2">
                  <Link href="/news" className="block text-sm text-blue-600 hover:text-blue-700 font-medium">
                    All News
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/news?category=${encodeURIComponent(cat)}`}
                      className="block text-sm text-muted-foreground hover:text-foreground transition"
                    >
                      {cat}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="md:col-span-3 space-y-8">
              {articles.length > 0 ? (
                articles.map((article) => <NewsArticleCard key={article.id} article={article} />)
              ) : (
                <p className="text-center text-muted-foreground py-12">No news articles published yet</p>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("[v0] News page error:", error)
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Error loading news</p>
      </main>
    )
  }
}
