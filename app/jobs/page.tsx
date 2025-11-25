"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import useSWR from "swr"

interface Vacancy {
  id: number
  title: string
  department: string
  description: string
  doc_url: string
  form_url: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Jobs() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const { data: vacancies = [], isLoading } = useSWR("/api/jobs", fetcher)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-2">Current Vacancies</h1>
      <p className="text-muted-foreground mb-8">Join the Timewave Radio team</p>

      {isLoading ? (
        <div className="text-muted-foreground">Loading vacancies...</div>
      ) : (vacancies as Vacancy[]).length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-6 text-muted-foreground text-center">
          No current vacancies. Check back soon!
        </div>
      ) : (
        <div className="grid gap-4">
          {(vacancies as Vacancy[]).map((vacancy) => (
            <div key={vacancy.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === vacancy.id ? null : vacancy.id)}
                className="w-full p-6 text-left hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{vacancy.title}</h3>
                    <p className="text-accent">{vacancy.department}</p>
                  </div>
                </div>
              </button>

              {expandedId === vacancy.id && (
                <div className="px-6 pb-6 border-t border-border pt-4">
                  <p className="text-foreground mb-4">{vacancy.description}</p>
                  <div className="flex gap-3">
                    <a
                      href={vacancy.doc_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Job Description
                    </a>
                    <a
                      href={vacancy.form_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Apply Now
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
