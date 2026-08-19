import { schedule } from 'node-cron'
import Parser from 'rss-parser'
import chalk from 'chalk'
import { Client } from '../Structures'

// ─── RSS Sources ──────────────────────────────────────────────────────────────
const ANIME_RSS   = 'https://animecorner.me/feed/'          // AnimeCorner — accessible ✅
const MANGA_RSS   = 'https://www.cbr.com/feed/category/anime/' // CBR Anime — has images ✅
const GENERAL_RSS = 'https://feeds.bbci.co.uk/news/world/rss.xml' // BBC World ✅

// ─── Breaking News Keywords ───────────────────────────────────────────────────
const BREAKING_KW = [
    'cancelled', 'cancellation', 'canceled', 'ended', 'ending', 'postponed',
    'delayed', 'announced', 'confirmed', 'renewed', 'season 2', 'season 3',
    'season 4', 'live action', 'hiatus', 'final chapter', 'final episode',
    'last episode', 'death', 'bankrupt', 'leaked', 'trailer', 'release date',
    'premiere', 'breaking', 'exclusive', 'gets anime', 'gets manga', 'adaptation'
]

type RSSItem = {
    title?: string
    link?: string
    guid?: string
    pubDate?: string
    contentSnippet?: string
    content?: string
    categories?: string[]
    media?: { $: { url: string } }
    thumbnail?: { $: { url: string } }
    enclosure?: { url: string }
}

export class NewsHandler {
    private parser = new Parser<Record<string, unknown>, RSSItem>({
        customFields: {
            item: [
                ['media:content',   'media'],
                ['media:thumbnail', 'thumbnail']
            ]
        }
    })

    private seenAnime   = new Set<string>()
    private seenManga   = new Set<string>()
    private seenGeneral = new Set<string>()
    private ready       = false   // prevents flood on first run

    constructor(private client: Client) {}

    // ─── Public entry point ────────────────────────────────────────────────────
    public start = (): void => {
        this.warmUp().then(() => {
            this.ready = true
            this.client.log(chalk.greenBright('[NEWS] Warm-up done — ready to broadcast'))
        })

        // Anime + Manga news: every 30 minutes
        schedule('*/30 * * * *', async () => {
            this.client.log(chalk.blueBright('[NEWS] Checking anime/manga feed...'))
            await this.checkAnimeFeed()
            await this.checkMangaFeed()
        })

        // General World News: daily at 7:00 AM IST (01:30 UTC)
        schedule('30 1 * * *', async () => {
            this.client.log(chalk.blueBright('[NEWS] Sending daily world news digest...'))
            await this.sendDailyDigest()
        })

        this.client.log(chalk.greenBright('[NEWS] NewsHandler started ✅'))
    }

    // ─── Warm-up: seed seen-IDs without sending ────────────────────────────────
    private warmUp = async (): Promise<void> => {
        try {
            const [animeFeed, mangaFeed, genFeed] = await Promise.all([
                this.parser.parseURL(ANIME_RSS).catch(() => null),
                this.parser.parseURL(MANGA_RSS).catch(() => null),
                this.parser.parseURL(GENERAL_RSS).catch(() => null)
            ])
            animeFeed?.items.slice(0, 30).forEach(i => { const id = this.itemId(i); if (id) this.seenAnime.add(id) })
            mangaFeed?.items.slice(0, 30).forEach(i => { const id = this.itemId(i); if (id) this.seenManga.add(id) })
            genFeed?.items.slice(0, 20).forEach(i => { const id = this.itemId(i); if (id) this.seenGeneral.add(id) })
            this.client.log(`[NEWS] Seeded — anime:${this.seenAnime.size} manga:${this.seenManga.size} general:${this.seenGeneral.size}`)
        } catch (e) {
            this.client.log(`[NEWS] Warm-up error: ${e}`)
        }
    }

    // ─── Anime feed (AnimeCorner) ──────────────────────────────────────────────
    private checkAnimeFeed = async (): Promise<void> => {
        if (!this.ready) return
        try {
            const feed   = await this.parser.parseURL(ANIME_RSS)
            const groups = await this.subscribedGroups()
            if (!groups.length) return

            for (const item of feed.items.slice(0, 10)) {
                const id = this.itemId(item)
                if (!id || this.seenAnime.has(id)) continue
                this.seenAnime.add(id)
                this.trimSet(this.seenAnime)

                const breaking = this.isBreaking(item.title ?? '')
                const caption  = this.buildCaption('anime', item, breaking)
                await this.broadcast(groups, caption, this.imageUrl(item))
            }
        } catch (e) {
            this.client.log(`[NEWS] Anime feed error: ${e}`)
        }
    }

    // ─── Manga feed (CBR Anime) ────────────────────────────────────────────────
    private checkMangaFeed = async (): Promise<void> => {
        if (!this.ready) return
        try {
            const feed   = await this.parser.parseURL(MANGA_RSS)
            const groups = await this.subscribedGroups()
            if (!groups.length) return

            for (const item of feed.items.slice(0, 10)) {
                const id = this.itemId(item)
                if (!id || this.seenManga.has(id)) continue
                this.seenManga.add(id)
                this.trimSet(this.seenManga)

                const breaking = this.isBreaking(item.title ?? '')
                const caption  = this.buildCaption('manga', item, breaking)
                await this.broadcast(groups, caption, this.imageUrl(item))
            }
        } catch (e) {
            this.client.log(`[NEWS] Manga feed error: ${e}`)
        }
    }

    // ─── Daily world news digest ───────────────────────────────────────────────
    private sendDailyDigest = async (): Promise<void> => {
        try {
            const feed   = await this.parser.parseURL(GENERAL_RSS)
            const groups = await this.subscribedGroups()
            if (!groups.length) return

            const top  = feed.items.slice(0, 6)
            const date = new Date().toLocaleDateString('en-IN', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })

            let msg =
                `📰 *DAILY WORLD NEWS DIGEST* 📰\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `📅 *${date}*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

            top.forEach((item, i) => {
                const brk  = this.isBreaking(item.title ?? '')
                const icon = brk ? '🚨' : i === 0 ? '🔴' : '🔷'
                msg += `${icon} *${i + 1}. ${item.title ?? 'No title'}*\n`
                if (item.contentSnippet)
                    msg += `   _${item.contentSnippet.slice(0, 120).trim()}..._\n`
                msg += '\n'
            })
            msg += `_Source: BBC World News_`

            await this.broadcast(groups, msg, this.imageUrl(top[0]))
        } catch (e) {
            this.client.log(`[NEWS] Daily digest error: ${e}`)
        }
    }

    // ─── Caption builder ───────────────────────────────────────────────────────
    private buildCaption = (type: 'anime' | 'manga', item: RSSItem, breaking: boolean): string => {
        const headers = {
            anime: breaking
                ? `🚨🚨 *BREAKING ANIME NEWS* 🚨🚨\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
                : `🎌 *ANIME NEWS UPDATE* 🎌\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`,
            manga: breaking
                ? `🚨🚨 *BREAKING MANGA/ANIME NEWS* 🚨🚨\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
                : `📖 *ANIME & MANGA NEWS* 📖\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
        }

        const title   = item.title ?? 'No title'
        const snippet = (item.contentSnippet ?? item.content ?? '')
            .replace(/<[^>]+>/g, '').trim().slice(0, 220)
        const date    = item.pubDate
            ? new Date(item.pubDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : ''
        const link    = item.link ?? ''

        return (
            headers[type] +
            `📰 *${title}*\n\n` +
            (snippet ? `📝 _${snippet}_\n\n` : '') +
            (date    ? `📅 ${date}\n\n`      : '') +
            (link    ? `🔗 ${link}`          : '')
        )
    }

    // ─── Broadcast to all subscribed groups ────────────────────────────────────
    private broadcast = async (groups: string[], caption: string, imgUrl?: string): Promise<void> => {
        let imgBuf: Buffer | null = null
        if (imgUrl) {
            try {
                const res = await fetch(imgUrl, { signal: AbortSignal.timeout(8000) })
                if (res.ok) imgBuf = Buffer.from(await res.arrayBuffer())
            } catch { /* image optional */ }
        }

        for (const jid of groups) {
            try {
                if (imgBuf) {
                    await this.client.sendMessage(jid, { image: imgBuf, caption })
                } else {
                    await this.client.sendMessage(jid, { text: caption })
                }
                await new Promise(r => setTimeout(r, 600))
            } catch { /* skip failed group */ }
        }
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────
    private subscribedGroups = async (): Promise<string[]> => {
        try {
            const docs = await this.client.DB.group.find({ newsEnabled: true }).lean()
            return (docs as { jid: string }[]).map(d => d.jid)
        } catch {
            return []
        }
    }

    private itemId = (item: RSSItem): string =>
        item.guid ?? item.link ?? item.title ?? ''

    private isBreaking = (title: string): boolean =>
        BREAKING_KW.some(kw => title.toLowerCase().includes(kw))

    private imageUrl = (item?: RSSItem): string | undefined =>
        item?.media?.$.url ?? item?.thumbnail?.$.url ?? item?.enclosure?.url

    private trimSet = (s: Set<string>): void => {
        if (s.size < 500) return
        const iter = s.values()
        for (let i = 0; i < 100; i++) {
            const next = iter.next()
            if (next.done) break
            s.delete(next.value)
        }
    }
}
