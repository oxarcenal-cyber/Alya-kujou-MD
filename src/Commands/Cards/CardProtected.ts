import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { normalize, getStats } from '../../lib/CardBattleState'
import { parseCard, TIER_EMOJI } from '../../lib/CardData'

@Command('cardprotected', {
    description: 'List your protected cards',
    usage: 'cardprotected',
    category: 'cards',
    aliases: ['cprotected', 'myprotected'],
    cooldown: 5, exp: 5, dm: false
})
export default class CardProtectedCommand extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const user = await this.client.DB.getUser(normalize(M.sender.jid))
        const protectedCards = getStats(user).protectedCards

        if (!protectedCards.length) {
            return void await this.client.sendMessage(M.from, {
                text: `🛡️ *No protected cards yet.*\n_Protect up to 3 cards from battle losses._\n\n*Usage:* \`${prefix}cardprotect <index>\``,
                footer: 'Use cards to find your card index.',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🃏 View All Cards', id: `${prefix}cards` },
                    { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
                ]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const lines = protectedCards.map((card, i) => {
            const { title, tier } = parseCard(card)
            return `${i+1}. ${(TIER_EMOJI as any)[tier]??'🃏'} *${title}* (T${tier})`
        })

        return void await this.client.sendMessage(M.from, {
            text: `🛡️ *PROTECTED CARDS* (${protectedCards.length}/3)\n\n${lines.join('\n')}\n\n_\`${prefix}cardunprotect <slot>\` to remove protection_`,
            footer: 'Tap Open Menu for more options.',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Protection Actions',
                    rows: [
                        { title: '🔓 Unprotect Card', description: 'Remove a card\'s protection', id: `${prefix}cardunprotect` },
                        { title: '🛡️ Protect New Card', description: 'Add protection to a card', id: `${prefix}cardprotect` },
                        { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
