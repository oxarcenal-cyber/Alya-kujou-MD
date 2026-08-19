import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { parseCard, TIER_EMOJI } from '../../lib/CardData'
import { t } from '../../lib'

@Command('swapcard', {
    description: 'Swap positions of 2 cards in your deck',
    usage: 'swapcard <index1> <index2>',
    category: 'cards',
    aliases: ['cswap', 'swapcards', 'cardswap'],
    cooldown: 5,
    dm: false,
    exp: 0
})
export default class SwapCardsCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang   = await this.getLang(M)
        const parts  = context.trim().split(/\s+/)

        if (parts.length < 2) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `*🔀 SWAP CARDS*\n\n` +
                    `*Usage:* \`${prefix}swapcard <index1> <index2>\`\n` +
                    `*Example:* \`${prefix}swapcard 2 5\``,
                footer: 'View your deck to see position numbers.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const a = parseInt(parts[0]) - 1
        const b = parseInt(parts[1]) - 1

        if (isNaN(a) || isNaN(b) || a < 0 || b < 0)
            return void M.reply(t('card_valid_idx_nums', lang))

        if (a === b)
            return void M.reply(t('card_same_idx', lang))

        const user           = await this.client.DB.getUser(M.sender.jid)
        const deck: string[] = (user as any).deck ?? []

        if (deck.length === 0) {
            return void await this.client.sendMessage(M.from, {
                text: t('card_empty_deck', lang),
                footer: 'Buy packs to get cards.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🛒 Card Shop', id: `${prefix}cardshop` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        if (a >= deck.length || b >= deck.length)
            return void M.reply(t('card_invalid_idx', lang, { max: String(deck.length) }))

        const tmp = deck[a]; deck[a] = deck[b]; deck[b] = tmp
        await this.client.DB.updateUser(M.sender.jid, 'deck', 'set', deck)

        const { title: ta, tier: ra } = parseCard(deck[a])
        const { title: tb, tier: rb } = parseCard(deck[b])
        const ea = (TIER_EMOJI as any)[ra] ?? '🃏'
        const eb = (TIER_EMOJI as any)[rb] ?? '🃏'

        return void await this.client.sendMessage(M.from, {
            text: t('card_swap_done', lang, {
                a: String(a + 1), ea, ta, ra,
                b: String(b + 1), eb, tb, rb,
                p: prefix
            }),
            footer: 'Tap to view your updated deck.',
            buttonsFormat: 'buttons',
            buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
