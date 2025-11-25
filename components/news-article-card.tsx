import Link from "next/link"

interface NewsArticleCardProps {
  article: {
    id: number
    title: string
    content: string
    featured_image_url?: string
    tags: string
    published_at: string
  }
}

export default function NewsArticleCard({ article }: NewsArticleCardProps) {
  const publishedDate = new Date(article.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="bg-card rounded-lg border border-border overflow-hidden hover:border-accent transition">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
            {article.tags}
          </span>
          <span className="text-xs text-muted-foreground">{publishedDate}</span>
        </div>

        <h2 className="text-2xl font-bold mb-3 line-clamp-2">
          <Link href={`/news/${article.id}`} className="hover:text-accent transition">
            {article.title}
          </Link>
        </h2>

        <p className="text-muted-foreground mb-4 line-clamp-3">{article.content}</p>

        <Link
          href={`/news/${article.id}`}
          className="inline-block text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Read More →
        </Link>
      </div>
    </article>
  )
}
