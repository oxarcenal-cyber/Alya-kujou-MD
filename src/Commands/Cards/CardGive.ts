import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { parseCard, TIER_EMOJI } from '../../lib/CardData'
import { t } from '../../lib'

@Command('cardgive', {
    description: 'Give one of your cards to someone',
    usage: 'cardgive <deck index> @user',
    category: 'cards',
    aliases: ['cgive', 'givecard'],
    cooldown: 10,
    dm: false,
    exp: 0
})
export default class CardGiveCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang   = await this.getLang(M)

        if (!M.mentioned || M.mentioned.length === 0) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `*🃏 CARD GIVE*\n\n` +
                    `*Usage:* \`${prefix}cardgive <deck index> @user\`\n` +
                    `*Example:* \`${prefix}cardgive 3 @someone\`\n\n` +
                    `_Use \`${prefix}deck\` to find your card number_`,
                footer: 'View your deck first.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const idx = parseInt(context.trim().split(' ')[0]) - 1
        if (isNaN(idx) || idx < 0) {
            return void await this.client.sendMessage(M.from, {
                text: t('card_valid_card_idx', lang, { p: prefix }),
                footer: 'View your deck to find the index.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const recipient = this.client.correctJid(M.mentioned[0])
        if (recipient === this.client.correctJid(M.sender.jid))
            return void M.reply(t('card_give_self', lang))

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

        if (idx >= deck.length) {
            return void await this.client.sendMessage(M.from, {
                text: t('card_invalid_idx', lang, { max: String(deck.length) }),
                footer: 'Check your deck.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        // Positions 9-11 (index 8-11) are protected
        if (idx >= 9)
            return void M.reply(t('card_give_protected', lang))

        const cardStr         = deck[idx]
        const { title, tier } = parseCard(cardStr)
        const te              = (TIER_EMOJI as any)[tier] ?? '🃏'

        // Remove from sender
        deck.splice(idx, 1)
        await this.client.DB.updateUser(M.sender.jid, 'deck', 'set', deck)

        // Add to recipient
        const recipientUser  = await this.client.DB.getUser(recipient)
        const recipientDeck: string[] = (recipientUser as any).deck ?? []
        const recipientColl: string[] = (recipientUser as any).cardCollection ?? []
        let storedIn = 'deck'

        if (recipientDeck.length < 12) {
            recipientDeck.push(cardStr)
            await this.client.DB.updateUser(recipient, 'deck', 'set', recipientDeck)
        } else {
            recipientColl.push(cardStr)
            await this.client.DB.updateUser(recipient, 'cardCollection', 'set', recipientColl)
            storedIn = 'collection'
        }

        return void await this.client.sendMessage(M.from, {
            text: t('card_give_success', lang, {
                te,
                title,
                tier,
                from:   M.sender.username,
                to:     recipient.split('@')[0],
                stored: storedIn
            }),
            footer: 'Tap Open Menu to manage your cards.',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '📦 My Deck', id: `${prefix}deck` },
                { text: '🗃️ Collection', id: `${prefix}coll` }
            ]
        } as unknown as AnyMessageContent, { quoted: M.message as any, ...([recipient] as any) })
    }
}
