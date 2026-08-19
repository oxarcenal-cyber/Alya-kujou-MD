import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { parseCard, TIER_EMOJI } from '../../lib/CardData'
import { t } from '../../lib'

@Command('todeck', {
    description: 'Move a card from collection to deck',
    usage: 'todeck <collection index>',
    category: 'cards',
    aliases: ['t2deck', '2deck', 'colltodeck'],
    cooldown: 5,
    dm: false,
    exp: 0
})
export default class ToDeckCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang   = await this.getLang(M)
        const idx    = parseInt(context.trim()) - 1

        if (isNaN(idx) || idx < 0) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `*📦 MOVE TO DECK*\n\n` +
                    `*Usage:* \`${prefix}todeck <collection index>\`\n` +
                    `*Example:* \`${prefix}todeck 3\``,
                footer: 'View your collection to find the index.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🗃️ View Collection', id: `${prefix}coll` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const user           = await this.client.DB.getUser(M.sender.jid)
        const deck: string[] = (user as any).deck ?? []
        const coll: string[] = (user as any).cardCollection ?? []

        if (coll.length === 0) {
            return void await this.client.sendMessage(M.from, {
                text: t('card_empty_coll', lang),
                footer: 'Win or buy packs to grow your collection.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🛒 Card Shop', id: `${prefix}cardshop` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        if (idx >= coll.length)
            return void M.reply(t('card_invalid_idx', lang, { max: String(coll.length) }))

        if (deck.length >= 12) {
            return void await this.client.sendMessage(M.from, {
                text: t('card_deck_full', lang, { p: prefix }),
                footer: 'Move a card to collection first.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📦 View Deck', id: `${prefix}deck` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const cardStr       = coll[idx]
        const { title, tier } = parseCard(cardStr)
        const te            = (TIER_EMOJI as any)[tier] ?? '🃏'

        coll.splice(idx, 1)
        deck.push(cardStr)

        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { deck, cardCollection: coll } })
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        return void await this.client.sendMessage(M.from, {
            text: t('card_moved_to_deck', lang, {
                te, title, tier,
                deck: String(deck.length),
                coll: String(coll.length)
            }),
            footer: 'Tap to view your cards.',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '📦 View Deck', id: `${prefix}deck` },
                { text: '🗃️ View Collection', id: `${prefix}coll` }
            ]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
