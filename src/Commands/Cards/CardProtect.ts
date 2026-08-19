import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { normalize, getStats } from '../../lib/CardBattleState'
import { parseCard, TIER_EMOJI } from '../../lib/CardData'

@Command('cardprotect', {
    description: 'Protect a card from being taken in Card-mode battles (max 3)',
    usage: 'cardprotect <card index>',
    category: 'cards',
    aliases: ['cprotect'],
    cooldown: 5, exp: 5, dm: false
})
export default class CardProtectCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const idx = parseInt(context.trim()) - 1

        if (isNaN(idx)) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `🛡️ *CARD PROTECT*\n\n` +
                    `Protect up to *3 cards* from being lost in Card-mode battles.\n\n` +
                    `*Usage:* \`${prefix}cardprotect <index>\`\n` +
                    `*Example:* \`${prefix}cardprotect 2\``,
                footer: 'Use cards command to find your card index.',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🃏 View All Cards', id: `${prefix}cards` },
                    { text: '🛡️ Protected List', id: `${prefix}cardprotected` }
                ]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const jid = normalize(M.sender.jid)
        const user = await this.client.DB.getUser(jid)
        const cards = [...(user.deck??[]), ...(user.cardCollection??[])]

        if (idx < 0 || idx >= cards.length) {
            return void await this.client.sendMessage(M.from, {
                text: `❌ Invalid index. You have *${cards.length}* cards.`,
                footer: 'Use cards to see your card list.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🃏 View All Cards', id: `${prefix}cards` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const stats = getStats(user)
        if (stats.protectedCards.includes(cards[idx])) {
            return void await this.client.sendMessage(M.from, {
                text: `🛡️ This card is already protected.`,
                footer: 'Max 3 cards can be protected.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🛡️ Protected List', id: `${prefix}cardprotected` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        if (stats.protectedCards.length >= 3) {
            return void await this.client.sendMessage(M.from, {
                text: `❌ Max 3 protected cards reached.\n_Unprotect one to add another._`,
                footer: 'Unprotect a card first.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🛡️ Protected List', id: `${prefix}cardprotected` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        stats.protectedCards.push(cards[idx])
        await this.client.DB.updateUser(jid, 'cardBattle', 'set', stats as any)
        const { title, tier } = parseCard(cards[idx])

        return void await this.client.sendMessage(M.from, {
            text: `🛡️ Protected *${(TIER_EMOJI as any)[tier]??'🃏'} ${title} (T${tier})*\n_Safe from Card-mode battle rewards._`,
            footer: `${stats.protectedCards.length}/3 slots used.`,
            buttonsFormat: 'buttons',
            buttons: [
                { text: '🛡️ Protected List', id: `${prefix}cardprotected` },
                { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
            ]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
