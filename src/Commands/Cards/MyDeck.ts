import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { parseCard, findCard, TIER_EMOJI, TIER_NAME, isGif } from '../../lib/CardData'
import { t } from '../../lib'

@Command('deck', {
    description: 'View your deck — all cards shown as images/GIFs',
    usage: 'deck  /  deck <index>',
    category: 'cards',
    aliases: ['mydeck', 'viewdeck'],
    cooldown: 5,
    dm: false,
    exp: 0
})
export default class MyDeckCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang   = await this.getLang(M)
        const user   = await this.client.DB.getUser(M.sender.jid)
        const deck: string[] = (user as any).deck ?? []

        if (deck.length === 0)
            return void M.reply(t('card_empty_deck_hint', lang, { p: prefix }))

        const ctx = context.trim()
        const idx = parseInt(ctx)

        // ── Specific card view ──────────────────────────────────────────────
        if (!isNaN(idx) && idx >= 1 && idx <= deck.length) {
            const { title, tier } = parseCard(deck[idx - 1])
            const cardData = findCard(title, tier)
            if (!cardData) return void M.reply(t('card_not_found_msg', lang))

            const te = (TIER_EMOJI as any)[tier] ?? '🃏'
            const tn = (TIER_NAME as any)[tier] ?? tier
            const caption =
                `${te} *${title}*\n` +
                `🏷️ *Tier:* ${tier} — ${tn}\n` +
                `📍 *Deck position:* #${idx}\n` +
                `📦 *Total deck:* ${deck.length}/12`

            try {
                const gif = isGif(cardData.url)
                if (gif) {
                    const gifBuf = await this.client.utils.getBuffer(cardData.url)
                    const mp4Buf = await this.client.utils.gifToMp4(gifBuf)
                    return void await this.client.sendMessage(M.from, {
                        video: mp4Buf, caption, gifPlayback: true, mimetype: 'video/mp4'
                    } as any)
                } else {
                    const buffer = await this.client.utils.getBufferCapped(cardData.url, 5 * 1024 * 1024)
                    if (buffer)
                        return void await M.reply(buffer, 'image', undefined, undefined, caption)
                    return void M.reply(caption + `\n\n⚠️ _Image unavailable_\n🔗 ${cardData.url}`)
                }
            } catch {
                return void M.reply(caption + `\n\n${t('card_image_failed', lang)}\n🔗 ${cardData.url}`)
            }
        }

        // ── Full deck — Open Menu list button ──────────────────────────────
        const rows = deck.map((c, i) => {
            const { title, tier } = parseCard(c)
            const te = (TIER_EMOJI as any)[tier] ?? '🃏'
            const tn = (TIER_NAME as any)[tier] ?? tier
            return {
                title:       `${te} ${title}`,
                description: `Tier ${tier} — ${tn} • Slot #${i + 1}`,
                id:          `${prefix}deck ${i + 1}`
            }
        })

        await this.client.sendMessage(
            M.from,
            {
                text:   `📦 *${M.sender.username}'s Deck* (${deck.length}/12)\n\n💡 Tap a card below to view it`,
                footer: '⚡ RedzeoX',
                title:  '🃏 My Deck',
                buttons: [
                    {
                        text:     '📋 Open Deck',
                        sections: [{ title: '🃏 Your Cards', rows }]
                    }
                ]
            } as any,
            { quoted: M.message }
        )
    }
}
