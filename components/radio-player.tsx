"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2 } from "lucide-react"

interface NowPlaying {
  now_playing?: {
    song: {
      artist: string
      title: string
    }
  }
}

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch("https://admin.stream.timewave.org.uk/api/nowplaying/timewave_radio")
        const data = await response.json()
        setNowPlaying(data)
      } catch (error) {
        console.error("Failed to fetch now playing:", error)
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 10000)
    return () => clearInterval(interval)
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="bg-primary border-t border-border">
      <audio
        ref={audioRef}
        src="https://admin.stream.timewave.org.uk/listen/timewave_radio/radio.mp3"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={togglePlay}
            className="flex-shrink-0 p-2 rounded-lg bg-primary-foreground text-primary hover:opacity-90 transition-opacity"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-primary-foreground text-sm font-medium">Now Playing</p>
            <p className="text-primary-foreground/80 text-sm truncate">
              {nowPlaying?.now_playing
                ? `${nowPlaying.now_playing.song.artist} - ${nowPlaying.now_playing.song.title}`
                : "Loading..."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary-foreground flex-shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const newVolume = Number.parseFloat(e.target.value)
                setVolume(newVolume)
                if (audioRef.current) {
                  audioRef.current.volume = newVolume
                }
              }}
              className="w-16 h-1 bg-primary-foreground/30 rounded-lg appearance-none cursor-pointer accent-primary-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
