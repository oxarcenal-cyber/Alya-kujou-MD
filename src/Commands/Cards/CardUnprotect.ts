import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { normalize, getStats } from '../../lib/CardBattleState'
import { parseCard, TIER_EMOJI } from '../../lib/CardData'

@Command('cardunprotect', {
    description: 'Remove protection from a card',
    usage: 'cardunprotect <protected slot>',
    category: 'cards',
    aliases: ['cunprotect'],
    cooldown: 5, exp: 5, dm: false
})
export default class CardUnprotectCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const idx = parseInt(context.trim()) - 1

        if (isNaN(idx)) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `🔓 *CARD UNPROTECT*\n\n` +
                    `*Usage:* \`${prefix}cardunprotect <slot>\`\n` +
                    `*Example:* \`${prefix}cardunprotect 1\``,
                footer: 'See your protected cards first.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🛡️ Protected List', id: `${prefix}cardprotected` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const jid = normalize(M.sender.jid)
        const user = await this.client.DB.getUser(jid)
        const stats = getStats(user)

        if (idx < 0 || idx >= stats.protectedCards.length) {
            return void await this.client.sendMessage(M.from, {
                text: `❌ Invalid slot. You have *${stats.protectedCards.length}* protected card(s).`,
                footer: 'Check your protected cards.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🛡️ Protected List', id: `${prefix}cardprotected` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const [card] = stats.protectedCards.splice(idx, 1)
        await this.client.DB.updateUser(jid, 'cardBattle', 'set', stats as any)
        const { title, tier } = parseCard(card)

        return void await this.client.sendMessage(M.from, {
            text: `🔓 Unprotected *${(TIER_EMOJI as any)[tier]??'🃏'} ${title} (T${tier})*.\n_Card can now be won/lost in battles._`,
            footer: `${stats.protectedCards.length}/3 slots used.`,
            buttonsFormat: 'buttons',
            buttons: [{ text: '🛡️ Protected List', id: `${prefix}cardprotected` }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
