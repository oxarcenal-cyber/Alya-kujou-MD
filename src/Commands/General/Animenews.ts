import { BaseCommand, Command, Message } from '../../Structures'

interface JikanAnime {
    mal_id: number
    title: string
    score: number | null
    episodes: number | null
    status: string
    genres: { name: string }[]
    images: { jpg: { image_url: string } }
    synopsis: string | null
    aired: { string: string }
}

@Command('animenews', {
    description: 'Get latest top airing anime 📺',
    aliases: ['topanime', 'airing', 'trending'],
    usage: 'animenews',
    cooldown: 15,
    exp: 5,
    category: 'general',
    dm: true
})
export default class extends BaseCommand {
    private fetchWithRetry = async (url: string, retries = 3): Promise<{ data: JikanAnime[] } | null> => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
                if (res.status === 429) {
                    // Rate limited — wait 2s and retry
                    if (attempt < retries) await new Promise(r => setTimeout(r, 2000 * attempt))
                    continue
                }
                if (!res.ok) return null
                return await res.json() as { data: JikanAnime[] }
            } catch {
                if (attempt < retries) await new Promise(r => setTimeout(r, 1000 * attempt))
            }
        }
        return null
    }

    public override execute = async (M: Message): Promise<void> => {
        await M.reply(`📡 Fetching latest anime... please wait~`)

        try {
            const data = await this.fetchWithRetry(
                'https://api.jikan.moe/v4/top/anime?filter=airing&limit=5'
            )

            if (!data?.data?.length)
                return void M.reply(`❌ Could not fetch anime data. Jikan API busy hai, thodi der baad try karo!`)

            const NUMS = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣']
            let text = `📺 *TOP AIRING ANIME*\n`
            text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n`

            for (let i = 0; i < data.data.length; i++) {
                const anime = data.data[i]
                const genres = anime.genres.slice(0, 3).map(g => g.name).join(' · ') || 'N/A'
                const synopsis = anime.synopsis
                    ? anime.synopsis.slice(0, 80) + (anime.synopsis.length > 80 ? '...' : '')
                    : 'No synopsis available.'

                text += `${NUMS[i]} *${anime.title}*\n`
                text += `   ⭐ *Score:* ${anime.score ?? 'N/A'}\n`
                text += `   🎬 *Episodes:* ${anime.episodes ?? 'Ongoing'}\n`
                text += `   🏷️ *Genres:* ${genres}\n`
                text += `   📝 _${synopsis}_\n\n`
            }

            text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`
            text += `_Data from MyAnimeList via Jikan API_`

            return void M.reply(text)
        } catch {
            return void M.reply(`❌ Failed to fetch anime data. The API might be busy, try again!`)
        }
    }
}
