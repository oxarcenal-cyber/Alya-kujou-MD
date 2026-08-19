import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { parseCard, findCard, TIER_EMOJI, TIER_NAME, cardSales } from '../../lib/CardData'
import { t } from '../../lib'

@Command('salecard', {
    description: 'Put your card up for sale',
    usage: 'salecard <index>|<price>',
    category: 'cards',
    aliases: ['sellcard', 'csell'],
    cooldown: 10,
    dm: false,
    exp: 0
})
export default class SaleCardCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang   = await this.getLang(M)

        if (!context.trim()) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `*🏪 SELL CARD*\n\n` +
                    `*Usage:* \`${prefix}salecard <index>|<price>\`\n` +
                    `*Example:* \`${prefix}salecard 3|50000\``,
                footer: 'View your deck to find the card index.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const parts = context.trim().split('|')
        if (parts.length !== 2) {
            return void await this.client.sendMessage(M.from, {
                text: t('card_sale_fmt', lang, { p: prefix }),
                footer: 'Format: salecard <index>|<price>',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const idx   = parseInt(parts[0]) - 1
        const price = parseInt(parts[1])

        if (isNaN(idx) || idx < 0)
            return void M.reply(t('card_sale_valid_idx', lang))
        if (isNaN(price) || price <= 0)
            return void M.reply(t('card_sale_valid_price', lang))

        if (cardSales.has(M.from)) {
            return void await this.client.sendMessage(M.from, {
                text: t('sale_already_active', lang, { p: prefix }),
                footer: 'Cancel existing sale first.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '❌ Cancel Sale', id: `${prefix}cancelsale` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const user           = await this.client.DB.getUser(M.sender.jid)
        const deck: string[] = (user as any).deck ?? []

        if (deck.length === 0)
            return void M.reply(t('card_empty_deck', lang))
        if (idx >= deck.length)
            return void M.reply(t('card_invalid_idx', lang, { max: String(deck.length) }))

        const cardStr         = deck[idx]
        const { title, tier } = parseCard(cardStr)
        const cardData        = findCard(title, tier)
        if (!cardData) return void M.reply(t('card_not_found_msg', lang))

        const te     = (TIER_EMOJI as any)[tier] ?? '🃏'
        const tn     = (TIER_NAME as any)[tier] ?? tier
        const shopId = Math.floor(Math.random() * 90000) + 10000

        cardSales.set(M.from, {
            seller:    M.sender.jid,
            cardIdx:   idx,
            price,
            cardTitle: title,
            cardTier:  tier,
            shopId
        })

        const caption =
            `*💎 Card on Sale!*\n\n` +
            `${te} *${title}*\n` +
            `🏷️ Tier: ${tier} — ${tn}\n` +
            `💰 Price: *${price.toLocaleString()}* gold\n` +
            `🎫 Shop ID: \`${shopId}\`\n\n` +
            `_\`${prefix}buycard ${shopId}\` to buy!_ 🛒`

        try {
            const buffer = await this.client.utils.getBuffer(cardData.url)
            await M.reply(buffer, 'image', undefined, undefined, caption)
            // Add action buttons after the image
            return void await this.client.sendMessage(M.from, {
                text: `📋 *Sale active!* Cancel anytime or wait for a buyer.`,
                footer: `Shop ID: ${shopId}`,
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '❌ Cancel Sale', id: `${prefix}cancelsale` },
                    { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
                ]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        } catch {
            return void await this.client.sendMessage(M.from, {
                text: caption,
                footer: `Shop ID: ${shopId}`,
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '❌ Cancel Sale', id: `${prefix}cancelsale` },
                    { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
                ]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }
    }
}
