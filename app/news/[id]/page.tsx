import { query } from "@/lib/db"
import Link from "next/link"
import { notFound } from "next/navigation"

interface NewsArticlePageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: NewsArticlePageProps) {
  try {
    const articles = (await query("SELECT title, content FROM news_articles WHERE id = ? AND is_approved = TRUE", [
      params.id,
    ])) as any[]

    if (articles.length === 0) {
      return { title: "Article Not Found" }
    }

    const article = articles[0]
    return {
      title: article.title,
      description: article.content.substring(0, 160),
    }
  } catch {
    return { title: "Article Not Found" }
  }
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  try {
    const articles = (await query(
      `SELECT na.id, na.title, na.content, na.featured_image_url, na.tags, na.published_at, s.name as author_name
       FROM news_articles na
       JOIN staff s ON na.staff_id = s.id
       WHERE na.id = ? AND na.is_approved = TRUE`,
      [params.id],
    )) as any[]

    if (articles.length === 0) {
      notFound()
    }

    const article = articles[0]
    const publishedDate = new Date(article.published_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link href="/news" className="text-blue-600 hover:text-blue-700 font-medium mb-8 inline-block">
            ← Back to News
          </Link>

          <article className="bg-card rounded-lg border border-border p-8">
            <div className="mb-6">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                {article.tags}
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <span>By {article.author_name}</span>
              <span>{publishedDate}</span>
            </div>

            {article.featured_image_url && (
              <img
                src={article.featured_image_url || "/placeholder.svg"}
                alt={article.title}
                className="w-full rounded-lg mb-8 max-h-96 object-cover"
              />
            )}

            <div className="prose prose-invert max-w-none mb-8">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">{article.content}</p>
            </div>

            <div className="bg-secondary rounded-lg p-6 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Written by</p>
              <p className="font-semibold">{article.author_name}</p>
            </div>
          </article>
        </div>
      </main>
    )
  } catch (error) {
    console.error("[v0] News article error:", error)
    notFound()
  }
}
