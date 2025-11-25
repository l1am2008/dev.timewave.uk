"use client"

import useSWR from "swr"

interface Song {
  artist: string
  title: string
  playedAt?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ClientRecentSongs() {
  const { data: nowPlayingData, isLoading: isLoadingSongs } = useSWR("/api/nowplaying", fetcher, {
    refreshInterval: 10000,
  })

  const recentSongs: Song[] = nowPlayingData?.recentSongs || []

  return (
    <div className="grid gap-4">
      {recentSongs.length > 0 ? (
        recentSongs.map((song, idx) => (
          <div key={idx} className="bg-card p-4 rounded-lg border border-border hover:bg-muted transition-colors">
            <p className="font-semibold text-foreground">{song.title}</p>
            <p className="text-muted-foreground text-sm">{song.artist}</p>
          </div>
        ))
      ) : isLoadingSongs ? (
        <div className="bg-card p-4 rounded-lg border border-border text-muted-foreground">Loading recent songs...</div>
      ) : (
        <div className="bg-card p-4 rounded-lg border border-border text-muted-foreground">No songs available</div>
      )}
    </div>
  )
}
