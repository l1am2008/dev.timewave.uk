"use client"
import dynamic from "next/dynamic"
import Link from "next/link"

const ClientScheduleSection = dynamic(() => import("@/components/client-schedule-section"), {
  ssr: false,
})

const ClientRecentSongs = dynamic(() => import("@/components/client-recent-songs"), {
  ssr: false,
})

const ScheduleModal = dynamic(() => import("@/components/schedule-modal"), {
  ssr: false,
})

interface HomeClientProps {
  featuredArticle: any | null
}

export default function HomeClient({ featuredArticle }: HomeClientProps) {
  return (
    <>
      <section className="hero">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Timewave Radio</h1>
          <p className="text-xl mb-8">Your hub for live community radio, music, and news.</p>
          <Link href="/listen" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Listen Live Now
          </Link>
        </div>
      </section>

      <section className="featured-article py-16">
        <div className="container mx-auto px-4">
          {featuredArticle ? (
            <>
              <h2 className="text-4xl font-bold text-center mb-10">Featured Article</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <img
                    src={featuredArticle.featured_image_url || "/placeholder.svg"}
                    alt={featuredArticle.title}
                    className="rounded-lg shadow-xl w-full"
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-semibold mb-4">{featuredArticle.title}</h3>
                  <p className="text-lg mb-6">{featuredArticle.content.substring(0, 200)}...</p>
                  <Link href={`/news/${featuredArticle.id}`} className="text-blue-500 hover:underline">
                    Read More &rarr;
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">No featured article available at the moment.</div>
          )}
        </div>
      </section>

      <ClientScheduleSection />
      <ClientRecentSongs />
      <ScheduleModal />
    </>
  )
}
