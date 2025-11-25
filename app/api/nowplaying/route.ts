export async function GET() {
  try {
    const response = await fetch("https://admin.stream.timewave.org.uk/api/nowplaying/timewave_radio")
    const data = await response.json()

    console.log("[v0] API response structure:", JSON.stringify(data, null, 2))

    // Extract recently played songs - the structure depends on your API
    // This handles the common AzuraCast format which includes song history
    const recentSongs = []

    if (data.song_history && Array.isArray(data.song_history)) {
      // AzuraCast format - song_history array
      recentSongs.push(
        ...data.song_history.slice(0, 5).map((entry: any) => ({
          artist: entry.song?.artist || entry.artist || "Unknown Artist",
          title: entry.song?.title || entry.title || "Unknown Title",
          playedAt: entry.played_at || entry.timestamp,
        })),
      )
    } else if (data.now_playing?.song) {
      // Fallback - just use currently playing song
      recentSongs.push({
        artist: data.now_playing.song.artist || "Unknown Artist",
        title: data.now_playing.song.title || "Unknown Title",
        playedAt: new Date().toISOString(),
      })
    }

    return Response.json({
      recentSongs: recentSongs.slice(0, 5),
      now_playing: data.now_playing,
    })
  } catch (error) {
    console.error("[v0] Error fetching now playing:", error)
    return Response.json({ recentSongs: [], now_playing: null }, { status: 500 })
  }
}
