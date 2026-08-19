import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { cardSales } from '../../lib/CardData'
import { t } from '../../lib'

@Command('buycard', {
    description: 'Buy a card listed for sale',
    usage: 'buycard <shopID>',
    category: 'cards',
    aliases: ['buycrd'],
    cooldown: 5,
    dm: false,
    exp: 0
})
export default class BuyCardCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang   = await this.getLang(M)
        const shopId = parseInt(context.trim())

        if (isNaN(shopId)) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `*🛒 BUY CARD*\n\n` +
                    `*Usage:* \`${prefix}buycard <shop ID>\`\n` +
                    `*Example:* \`${prefix}buycard 45231\`\n\n` +
                    `_Get the Shop ID from the sale listing_`,
                footer: 'Shop ID is shown in the salecard message.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const sale = cardSales.get(M.from)
        if (!sale) {
            return void await this.client.sendMessage(M.from, {
                text: t('sale_none', lang),
                footer: 'No active sale in this group.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        if (sale.shopId !== shopId)
            return void M.reply(t('card_wrong_shop_id', lang))

        if (this.client.correctJid(sale.seller) === this.client.correctJid(M.sender.jid))
            return void M.reply(t('sale_own', lang))

        const buyer = await this.client.DB.getUser(M.sender.jid)
        if (buyer.wallet < sale.price) {
            return void await this.client.sendMessage(M.from, {
                text: t('sale_no_gold', lang, {
                    price:  sale.price.toLocaleString(),
                    wallet: buyer.wallet.toLocaleString()
                }),
                footer: 'Not enough gold.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎯 Daily Missions', id: `${prefix}cardmissions` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const sellerUser    = await this.client.DB.getUser(sale.seller)
        const sellerDeck: string[] = (sellerUser as any).deck ?? []
        if (sale.cardIdx >= sellerDeck.length) {
            cardSales.delete(M.from)
            return void M.reply(t('sale_stale', lang))
        }

        const cardStr = sellerDeck[sale.cardIdx]

        await this.client.DB.setCrystal(M.sender.jid, -sale.price)
        await this.client.DB.setCrystal(sale.seller, sale.price)

        sellerDeck.splice(sale.cardIdx, 1)
        await this.client.DB.updateUser(sale.seller, 'deck', 'set', sellerDeck)

        const buyerDeck: string[] = (buyer as any).deck ?? []
        const buyerColl: string[] = (buyer as any).cardCollection ?? []
        let storedIn = 'deck'

        if (buyerDeck.length < 12) {
            buyerDeck.push(cardStr)
            await this.client.DB.updateUser(M.sender.jid, 'deck', 'set', buyerDeck)
        } else {
            buyerColl.push(cardStr)
            await this.client.DB.updateUser(M.sender.jid, 'cardCollection', 'set', buyerColl)
            storedIn = 'collection'
        }

        cardSales.delete(M.from)
        const sellerName = this.client.contact.getContact(sale.seller).username

        return void await this.client.sendMessage(M.from, {
            text: t('sale_success', lang, {
                title:  sale.cardTitle,
                tier:   sale.cardTier,
                paid:   sale.price.toLocaleString(),
                seller: sellerName,
                stored: storedIn
            }),
            footer: 'Card added to your ' + storedIn + '.',
            buttonsFormat: 'buttons',
            buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
