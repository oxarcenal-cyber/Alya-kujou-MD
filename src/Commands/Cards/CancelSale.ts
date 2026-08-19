import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { cardSales } from '../../lib/CardData'
import { t } from '../../lib'

@Command('cancelsale', {
    description: 'Cancel your active card sale',
    usage: 'cancelsale',
    category: 'cards',
    aliases: ['csale', 'cancelsell'],
    cooldown: 5,
    dm: false,
    exp: 0
})
export default class CancelSaleCommand extends BaseCommand {
    public override execute = async (M: Message, _: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang = await this.getLang(M)
        const sale = cardSales.get(M.from)

        if (!sale) {
            return void await this.client.sendMessage(M.from, {
                text: t('sale_none', lang),
                footer: 'No active sale in this group.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        if (this.client.correctJid(sale.seller) !== this.client.correctJid(M.sender.jid)) {
            const isMod = this.client.config.mods.some(
                m => this.client.correctJid(m) === this.client.correctJid(M.sender.jid)
            )
            if (!M.sender.isAdmin && !isMod)
                return void M.reply(t('sale_cancel_denied', lang))
        }

        cardSales.delete(M.from)
        return void await this.client.sendMessage(M.from, {
            text: t('sale_cancelled', lang, {
                title: sale.cardTitle,
                tier:  sale.cardTier
            }),
            footer: 'Card is back in your deck.',
            buttonsFormat: 'buttons',
            buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
