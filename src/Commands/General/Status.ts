import axios from 'axios'
import { connection } from 'mongoose'
import { BaseCommand, Command, Message } from '../../Structures'

interface ApiCheck {
    name: string
    url: string
}

const CHECKS: ApiCheck[] = [
    { name: 'MyAnimeList (anime/manga/character)', url: 'https://api.jikan.moe/v4/anime?q=one&limit=1' },
    { name: 'Nekos.best (waifu/kitsune)', url: 'https://nekos.best/api/v2/waifu' },
    { name: 'Nekos.life (neko)', url: 'https://nekos.life/api/v2/img/neko' },
    { name: 'GitHub API', url: 'https://api.github.com' },
    { name: 'Weather API', url: 'https://wttr.in/London?format=3' }
]

@Command('status', {
    description: 'Checks bot uptime, database, and external API health',
    category: 'general',
    aliases: ['apistatus', 'health'],
    usage: 'status',
    cooldown: 15,
    exp: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        await M.reply('Checking service status, please wait...')

        const results = await Promise.all(
            CHECKS.map(async (check) => {
                const start = Date.now()
                try {
                    await axios.get(check.url, { timeout: 8000 })
                    return { ...check, ok: true, ms: Date.now() - start }
                } catch (err) {
                    const status = (err as { response?: { status?: number } })?.response?.status
                    return { ...check, ok: false, ms: Date.now() - start, status }
                }
            })
        )

        const db = connection.readyState === 1

        let text = `🩺 *${this.client.config.name.toUpperCase()} - SERVICE STATUS*\n\n`
        text += `${db ? '🟢' : '🔴'} *Database:* ${db ? 'Connected' : 'Disconnected'}\n`
        text += `🟢 *WhatsApp:* Connected\n\n`
        text += `*External APIs:*\n`
        for (const result of results) {
            const icon = result.ok ? '🟢' : '🔴'
            const detail = result.ok
                ? `${result.ms}ms`
                : `${'status' in result && result.status ? `HTTP ${result.status}` : 'unreachable'}`
            text += `${icon} *${result.name}:* ${detail}\n`
        }

        const downCount = results.filter((r) => !r.ok).length
        text += `\n${downCount === 0 ? '✅ All systems operational' : `⚠️ ${downCount} service(s) degraded`}`

        return void (await M.reply(text))
    }
}
