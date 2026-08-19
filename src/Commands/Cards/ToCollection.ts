import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { parseCard, TIER_EMOJI } from '../../lib/CardData'
import { t } from '../../lib'

@Command('tocoll', {
    description: 'Move a card from deck to collection',
    usage: 'tocoll <deck index>',
    category: 'cards',
    aliases: ['t2coll', '2coll', 'decktocoll'],
    cooldown: 5,
    dm: false,
    exp: 0
})
export default class ToCollectionCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang   = await this.getLang(M)
        const idx    = parseInt(context.trim()) - 1

        if (isNaN(idx) || idx < 0) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `*🗃️ MOVE TO COLLECTION*\n\n` +
                    `*Usage:* \`${prefix}tocoll <deck index>\`\n` +
                    `*Example:* \`${prefix}tocoll 5\``,
                footer: 'View your deck to find the index.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const user           = await this.client.DB.getUser(M.sender.jid)
        const deck: string[] = (user as any).deck ?? []
        const coll: string[] = (user as any).cardCollection ?? []

        if (deck.length === 0) {
            return void await this.client.sendMessage(M.from, {
                text: t('card_empty_deck', lang),
                footer: 'Get cards from the shop.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🛒 Card Shop', id: `${prefix}cardshop` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        if (idx >= deck.length)
            return void M.reply(t('card_invalid_idx', lang, { max: String(deck.length) }))

        const cardStr         = deck[idx]
        const { title, tier } = parseCard(cardStr)
        const te              = (TIER_EMOJI as any)[tier] ?? '🃏'

        deck.splice(idx, 1)
        coll.push(cardStr)

        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { deck, cardCollection: coll } })
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        return void await this.client.sendMessage(M.from, {
            text: t('card_moved_to_coll', lang, {
                te, title, tier,
                deck: String(deck.length),
                coll: String(coll.length)
            }),
            footer: 'Tap to view your cards.',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '🗃️ View Collection', id: `${prefix}coll` },
                { text: '📦 View Deck', id: `${prefix}deck` }
            ]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
