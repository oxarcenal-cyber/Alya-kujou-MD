import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { ALL_CARDS, isGif } from '../../lib/CardData'

// ── Card pools ─────────────────────────────────────────────────────────────
const S_CARDS   = ALL_CARDS.filter(c => c.tier === 'S')
const EVT_CARDS = S_CARDS.filter(c => isGif(c.url)) // Event = animated S cards

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

// ── Caption builder ─────────────────────────────────────────────────────────
function buildCaption(
    isEvent: boolean,
    title: string,
    price: number,
    spawnedBy: string,
    prefix: string,
    status: string,
    series?: string
): string {
    const seriesLine = series ? `  ‧₊˚ 🎬 𝑺𝒆𝒓𝒊𝒆𝒔  ·❀·  ${series}\n` : ''

    if (isEvent) return (
        `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
        `  🌸✿ᰰ  *${title}*  ✿ᰰ🌸\n` +
        `      𐚁 🎉 𝑳𝒊𝒎𝒊𝒕𝒆𝒅 𝑬𝒗𝒆𝒏𝒕 𝑪𝒂𝒓𝒅 𝑺𝒑𝒂𝒘𝒏𝒆𝒅 🎉 𐚁\n\n` +
        `  ‧₊˚ 🌟 𝑻𝒊𝒆𝒓      ·❀·  EVENT — Limited\n` +
        seriesLine +
        `  ‧₊˚ 💰 𝑷𝒓𝒊𝒄𝒆    ·❀·  ${price.toLocaleString()} gold\n` +
        `  ‧₊˚ 🎖️  𝑺𝒑𝒂𝒘𝒏𝒆𝒅  ·❀·  ${spawnedBy}\n\n` +
        `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
        `  𖤐 Type *${prefix}collect* to claim! 𖤐\n` +
        `  🍃 ⁺. 15 mins left! .⁺ 🍃\n\n` +
        `  ${status}`
    )
    return (
        `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
        `  🌸✿ᰰ  *${title}*  ✿ᰰ🌸\n` +
        `      𐚁 💎 𝑻𝒊𝒆𝒓 𝑺 𝑪𝒂𝒓𝒅 𝑺𝒑𝒂𝒘𝒏𝒆𝒅 💎 𐚁\n\n` +
        `  ‧₊˚ 💎 𝑻𝒊𝒆𝒓      ·❀·  S — GOD TIER\n` +
        seriesLine +
        `  ‧₊˚ 💰 𝑷𝒓𝒊𝒄𝒆    ·❀·  ${price.toLocaleString()} gold\n` +
        `  ‧₊˚ 🎖️  𝑺𝒑𝒂𝒘𝒏𝒆𝒅  ·❀·  ${spawnedBy}\n\n` +
        `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
        `  𖤐 Type *${prefix}collect* to claim! 𖤐\n` +
        `  🍃 ⁺. 15 mins left! .⁺ 🍃\n\n` +
        `  ${status}`
    )
}

// ── Command ─────────────────────────────────────────────────────────────────
@Command('cardspawn', {
    description: 'Manually spawn a Tier S or Event card in the group (mods only)',
    usage: 'cardspawn [s|event]',
    category: 'dev',
    aliases: ['cspawn'],
    cooldown: 30,
    exp: 0,
    dm: false
})
export default class CardSpawnCommand extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix    = this.client.config.prefix
        const input     = (context || '').trim().toLowerCase()
        const isEvent   = input === 'event'
        const isS       = input === 's' || input === ''

        // ── Usage hint ─────────────────────────────────────────────────────
        if (!isEvent && !isS)
            return void M.reply(
                `📖 *CardSpawn — Mod Only Command*\n\n` +
                `*Usage:*\n` +
                `• \`${prefix}cardspawn s\` — Spawn a random Tier S 💎 card\n` +
                `• \`${prefix}cardspawn event\` — Spawn a Limited Event 🎉 card\n\n` +
                `*Notes:*\n` +
                `• Only mods can use this command\n` +
                `• Card stays available for 15 minutes\n` +
                `• Anyone can buy it using \`${prefix}collect\`\n` +
                `• Message auto-updates when time runs out\n` +
                `• Only one card can be active per group at a time`
            )

        // ── Pool check ─────────────────────────────────────────────────────
        const pool = isEvent ? EVT_CARDS : S_CARDS
        if (!pool.length)
            return void M.reply('❌ Card pool empty hai — card.json check karo.')

        // ── Already active? ─────────────────────────────────────────────────
        if (this.handler.cardResponse.has(M.from))
            return void M.reply(
                `⚠️ A card is already active in this group!\n` +
                `Wait for someone to \`${prefix}collect\` it or wait 15 minutes.`
            )

        // ── Pick card + price ───────────────────────────────────────────────
        const card      = pick(pool)
        const price     = isEvent
            ? Math.floor(Math.random() * (800_000 - 200_000) + 200_000)
            : Math.floor(Math.random() * (500_000 - 100_000) + 100_000)
        const tierLabel = isEvent ? 'EVENT' : 'S'
        const spawnedBy = M.sender.username || M.sender.jid.split('@')[0]
        const activeStatus = `🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑨𝒄𝒕𝒊𝒗𝒆 𖥻ִֶָ`

        // ── Register in cardResponse (Collect command reads this) ───────────
        this.handler.cardResponse.set(M.from, {
            card:      `${card.title}-${tierLabel}`,
            cardTitle: card.title,
            tier:      tierLabel,
            price
        })

        // ── Send spawn message ──────────────────────────────────────────────
        const caption = buildCaption(isEvent, card.title, price, spawnedBy, prefix, activeStatus)
        let sentKey: import('@adiwajshing/baileys').proto.IMessageKey | null = null

        const spawnBtns = [
            { text: '📦 Collect Card', id: `${prefix}collect` },
            { text: '💰 My Wallet',    id: `${prefix}wallet`  }
        ]
        const gifBtn = [
            { text: '📦 Collect Card', id: `${prefix}collect` }
        ]
        const gif = isGif(card.url)
        try {
            let buf: Buffer | null = null
            if (gif) {
                const gifBuf = await this.client.utils.getBuffer(card.url)
                buf = await this.client.utils.gifToMp4(gifBuf)
            } else {
                buf = await this.client.utils.getBufferCapped(card.url, 5 * 1024 * 1024)
            }

            if (buf) {
                if (gif) {
                    const sent = await this.client.sendMessage(M.from, {
                        video: buf, caption, gifPlayback: true, mimetype: 'video/mp4', buttonsFormat: 'buttons', buttons: gifBtn
                    } as any)
                    sentKey = sent?.key ?? null
                } else {
                    const sent = await this.client.sendMessage(M.from, {
                        image: buf, caption, buttonsFormat: 'buttons', buttons: spawnBtns
                    } as any)
                    sentKey = sent?.key ?? null
                }
            } else {
                const sent = await this.client.sendMessage(M.from, { text: caption, footer: '⚡ RedzeoX', buttonsFormat: 'buttons', buttons: spawnBtns } as any)
                sentKey = sent?.key ?? null
            }
        } catch {
            const sent = await this.client.sendMessage(M.from, { text: caption, footer: '⚡ RedzeoX', buttonsFormat: 'buttons', buttons: spawnBtns } as any)
            sentKey = sent?.key ?? null
        }

        // ── 15-min auto-expire timer ────────────────────────────────────────
        const TIMEOUT_MS = 15 * 60 * 1000

        const timer = setTimeout(async () => {
            const info = this.handler.specialSpawnInfo.get(M.from)
            this.handler.cardResponse.delete(M.from)
            this.handler.specialSpawnInfo.delete(M.from)

            const claimed   = info?.claimedBy ?? null
            const finalStatus = claimed
                ? `✅ ִֶָ𖥻 𝑪𝒍𝒂𝒊𝒎𝒆𝒅 𝒃𝒚: ${claimed} — 💰 ${price.toLocaleString()} gold 𖥻ִֶָ`
                : `⏰ ִֶָ𖥻 𝑻𝒊𝒎𝒆 𝑶𝒖𝒕 — 𝑵𝒐𝒃𝒐𝒅𝒚 𝒄𝒍𝒂𝒊𝒎𝒆𝒅! 𖥻ִֶָ`

            const finalCaption = buildCaption(isEvent, card.title, price, spawnedBy, prefix, finalStatus)

            try {
                if (sentKey) {
                    await this.client.sendMessage(M.from, { text: finalCaption, edit: sentKey })
                } else {
                    await this.client.sendMessage(M.from, { text: finalCaption })
                }
            } catch {
                await this.client.sendMessage(M.from, { text: finalCaption }).catch(() => {})
            }
        }, TIMEOUT_MS)

        // ── Store tracking info ─────────────────────────────────────────────
        this.handler.specialSpawnInfo.set(M.from, {
            msgKey:    sentKey,
            title:     card.title,
            tier:      tierLabel,
            price,
            spawnedBy,
            claimedBy: null,
            isEvent,
            timer
        })
    }
}
