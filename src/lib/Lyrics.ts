import axios from 'axios'

export class Lyrics {
    /**
     * Search for a song using lrclib.net (no auth required, returns lyrics directly).
     * Falls back to iTunes Search API for album art since lrclib doesn't provide images.
     */
    public search = async (query: string): Promise<ILyrics[]> => {
        try {
            const res = await axios.get(`https://lrclib.net/api/search`, {
                params: { q: query },
                timeout: 10000
            })
            const hits: LrclibResult[] = res.data
            if (!hits || !hits.length) return []

            const data: ILyrics[] = []
            for (const hit of hits.slice(0, 5)) {
                if (hit.instrumental || !hit.plainLyrics) continue
                // fetch album art from iTunes
                const image = await this._getAlbumArt(`${hit.trackName} ${hit.artistName}`)
                data.push({
                    title: hit.trackName,
                    fullTitle: `${hit.trackName} — ${hit.artistName}`,
                    artist: hit.artistName,
                    image,
                    lyrics: hit.plainLyrics,
                    url: `https://lrclib.net/api/get/${hit.id}`
                })
            }
            return data
        } catch (err) {
            console.error(`[Lyrics.search] Failed to search for "${query}":`, (err as Error).message)
            return []
        }
    }

    /** No-op kept for compatibility — lyrics already included in search result */
    public parseLyrics = async (_url: string): Promise<string> => ''

    private _getAlbumArt = async (query: string): Promise<string> => {
        try {
            const res = await axios.get(`https://itunes.apple.com/search`, {
                params: { term: query, media: 'music', limit: 1 },
                timeout: 8000
            })
            const results = res.data?.results
            if (results?.length) {
                // upgrade to 500x500 art
                return (results[0].artworkUrl100 as string).replace('100x100bb', '500x500bb')
            }
        } catch {
            // ignore — will use fallback image below
        }
        return 'https://i.imgur.com/vKBBXvQ.png' // generic music note placeholder
    }
}

interface LrclibResult {
    id: number
    trackName: string
    artistName: string
    albumName: string
    duration: number
    instrumental: boolean
    plainLyrics: string | null
    syncedLyrics: string | null
}

export interface ILyrics {
    title: string
    fullTitle: string
    artist: string
    image: string
    lyrics: string
    url: string
}
