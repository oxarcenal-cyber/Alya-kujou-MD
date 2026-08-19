"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsHandler = void 0;
const node_cron_1 = require("node-cron");
const rss_parser_1 = __importDefault(require("rss-parser"));
const chalk_1 = __importDefault(require("chalk"));
// ─── RSS Sources ──────────────────────────────────────────────────────────────
const ANIME_RSS = 'https://animecorner.me/feed/'; // AnimeCorner — accessible ✅
const MANGA_RSS = 'https://www.cbr.com/feed/category/anime/'; // CBR Anime — has images ✅
const GENERAL_RSS = 'https://feeds.bbci.co.uk/news/world/rss.xml'; // BBC World ✅
// ─── Breaking News Keywords ───────────────────────────────────────────────────
const BREAKING_KW = [
    'cancelled', 'cancellation', 'canceled', 'ended', 'ending', 'postponed',
    'delayed', 'announced', 'confirmed', 'renewed', 'season 2', 'season 3',
    'season 4', 'live action', 'hiatus', 'final chapter', 'final episode',
    'last episode', 'death', 'bankrupt', 'leaked', 'trailer', 'release date',
    'premiere', 'breaking', 'exclusive', 'gets anime', 'gets manga', 'adaptation'
];
class NewsHandler {
    constructor(client) {
        this.client = client;
        this.parser = new rss_parser_1.default({
            customFields: {
                item: [
                    ['media:content', 'media'],
                    ['media:thumbnail', 'thumbnail']
                ]
            }
        });
        this.seenAnime = new Set();
        this.seenManga = new Set();
        this.seenGeneral = new Set();
        this.ready = false; // prevents flood on first run
        // ─── Public entry point ────────────────────────────────────────────────────
        this.start = () => {
            this.warmUp().then(() => {
                this.ready = true;
                this.client.log(chalk_1.default.greenBright('[NEWS] Warm-up done — ready to broadcast'));
            });
            // Anime + Manga news: every 30 minutes
            (0, node_cron_1.schedule)('*/30 * * * *', async () => {
                this.client.log(chalk_1.default.blueBright('[NEWS] Checking anime/manga feed...'));
                await this.checkAnimeFeed();
                await this.checkMangaFeed();
            });
            // General World News: daily at 7:00 AM IST (01:30 UTC)
            (0, node_cron_1.schedule)('30 1 * * *', async () => {
                this.client.log(chalk_1.default.blueBright('[NEWS] Sending daily world news digest...'));
                await this.sendDailyDigest();
            });
            this.client.log(chalk_1.default.greenBright('[NEWS] NewsHandler started ✅'));
        };
        // ─── Warm-up: seed seen-IDs without sending ────────────────────────────────
        this.warmUp = async () => {
            try {
                const [animeFeed, mangaFeed, genFeed] = await Promise.all([
                    this.parser.parseURL(ANIME_RSS).catch(() => null),
                    this.parser.parseURL(MANGA_RSS).catch(() => null),
                    this.parser.parseURL(GENERAL_RSS).catch(() => null)
                ]);
                animeFeed?.items.slice(0, 30).forEach(i => { const id = this.itemId(i); if (id)
                    this.seenAnime.add(id); });
                mangaFeed?.items.slice(0, 30).forEach(i => { const id = this.itemId(i); if (id)
                    this.seenManga.add(id); });
                genFeed?.items.slice(0, 20).forEach(i => { const id = this.itemId(i); if (id)
                    this.seenGeneral.add(id); });
                this.client.log(`[NEWS] Seeded — anime:${this.seenAnime.size} manga:${this.seenManga.size} general:${this.seenGeneral.size}`);
            }
            catch (e) {
                this.client.log(`[NEWS] Warm-up error: ${e}`);
            }
        };
        // ─── Anime feed (AnimeCorner) ──────────────────────────────────────────────
        this.checkAnimeFeed = async () => {
            if (!this.ready)
                return;
            try {
                const feed = await this.parser.parseURL(ANIME_RSS);
                const groups = await this.subscribedGroups();
                if (!groups.length)
                    return;
                for (const item of feed.items.slice(0, 10)) {
                    const id = this.itemId(item);
                    if (!id || this.seenAnime.has(id))
                        continue;
                    this.seenAnime.add(id);
                    this.trimSet(this.seenAnime);
                    const breaking = this.isBreaking(item.title ?? '');
                    const caption = this.buildCaption('anime', item, breaking);
                    await this.broadcast(groups, caption, this.imageUrl(item));
                }
            }
            catch (e) {
                this.client.log(`[NEWS] Anime feed error: ${e}`);
            }
        };
        // ─── Manga feed (CBR Anime) ────────────────────────────────────────────────
        this.checkMangaFeed = async () => {
            if (!this.ready)
                return;
            try {
                const feed = await this.parser.parseURL(MANGA_RSS);
                const groups = await this.subscribedGroups();
                if (!groups.length)
                    return;
                for (const item of feed.items.slice(0, 10)) {
                    const id = this.itemId(item);
                    if (!id || this.seenManga.has(id))
                        continue;
                    this.seenManga.add(id);
                    this.trimSet(this.seenManga);
                    const breaking = this.isBreaking(item.title ?? '');
                    const caption = this.buildCaption('manga', item, breaking);
                    await this.broadcast(groups, caption, this.imageUrl(item));
                }
            }
            catch (e) {
                this.client.log(`[NEWS] Manga feed error: ${e}`);
            }
        };
        // ─── Daily world news digest ───────────────────────────────────────────────
        this.sendDailyDigest = async () => {
            try {
                const feed = await this.parser.parseURL(GENERAL_RSS);
                const groups = await this.subscribedGroups();
                if (!groups.length)
                    return;
                const top = feed.items.slice(0, 6);
                const date = new Date().toLocaleDateString('en-IN', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                });
                let msg = `📰 *DAILY WORLD NEWS DIGEST* 📰\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `📅 *${date}*\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                top.forEach((item, i) => {
                    const brk = this.isBreaking(item.title ?? '');
                    const icon = brk ? '🚨' : i === 0 ? '🔴' : '🔷';
                    msg += `${icon} *${i + 1}. ${item.title ?? 'No title'}*\n`;
                    if (item.contentSnippet)
                        msg += `   _${item.contentSnippet.slice(0, 120).trim()}..._\n`;
                    msg += '\n';
                });
                msg += `_Source: BBC World News_`;
                await this.broadcast(groups, msg, this.imageUrl(top[0]));
            }
            catch (e) {
                this.client.log(`[NEWS] Daily digest error: ${e}`);
            }
        };
        // ─── Caption builder ───────────────────────────────────────────────────────
        this.buildCaption = (type, item, breaking) => {
            const headers = {
                anime: breaking
                    ? `🚨🚨 *BREAKING ANIME NEWS* 🚨🚨\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
                    : `🎌 *ANIME NEWS UPDATE* 🎌\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`,
                manga: breaking
                    ? `🚨🚨 *BREAKING MANGA/ANIME NEWS* 🚨🚨\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
                    : `📖 *ANIME & MANGA NEWS* 📖\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
            };
            const title = item.title ?? 'No title';
            const snippet = (item.contentSnippet ?? item.content ?? '')
                .replace(/<[^>]+>/g, '').trim().slice(0, 220);
            const date = item.pubDate
                ? new Date(item.pubDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : '';
            const link = item.link ?? '';
            return (headers[type] +
                `📰 *${title}*\n\n` +
                (snippet ? `📝 _${snippet}_\n\n` : '') +
                (date ? `📅 ${date}\n\n` : '') +
                (link ? `🔗 ${link}` : ''));
        };
        // ─── Broadcast to all subscribed groups ────────────────────────────────────
        this.broadcast = async (groups, caption, imgUrl) => {
            let imgBuf = null;
            if (imgUrl) {
                try {
                    const res = await fetch(imgUrl, { signal: AbortSignal.timeout(8000) });
                    if (res.ok)
                        imgBuf = Buffer.from(await res.arrayBuffer());
                }
                catch { /* image optional */ }
            }
            for (const jid of groups) {
                try {
                    if (imgBuf) {
                        await this.client.sendMessage(jid, { image: imgBuf, caption });
                    }
                    else {
                        await this.client.sendMessage(jid, { text: caption });
                    }
                    await new Promise(r => setTimeout(r, 600));
                }
                catch { /* skip failed group */ }
            }
        };
        // ─── Helpers ───────────────────────────────────────────────────────────────
        this.subscribedGroups = async () => {
            try {
                const docs = await this.client.DB.group.find({ newsEnabled: true }).lean();
                return docs.map(d => d.jid);
            }
            catch {
                return [];
            }
        };
        this.itemId = (item) => item.guid ?? item.link ?? item.title ?? '';
        this.isBreaking = (title) => BREAKING_KW.some(kw => title.toLowerCase().includes(kw));
        this.imageUrl = (item) => item?.media?.$.url ?? item?.thumbnail?.$.url ?? item?.enclosure?.url;
        this.trimSet = (s) => {
            if (s.size < 500)
                return;
            const iter = s.values();
            for (let i = 0; i < 100; i++) {
                const next = iter.next();
                if (next.done)
                    break;
                s.delete(next.value);
            }
        };
    }
}
exports.NewsHandler = NewsHandler;
