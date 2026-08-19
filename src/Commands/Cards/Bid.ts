import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { TIER_EMOJI, cardAuctions } from '../../lib/CardData'
import { t } from '../../lib'

@Command('bid', {
    description: 'Place a bid on an active auction',
    usage: 'bid <amount>',
    category: 'cards',
    aliases: ['placebid', 'cbid'],
    cooldown: 5,
    dm: false,
    exp: 0
})
export default class BidCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang   = await this.getLang(M)
        const amount = parseInt(context.trim())

        if (isNaN(amount) || amount <= 0) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `*💰 PLACE A BID*\n\n` +
                    `*Usage:* \`${prefix}bid <amount>\`\n` +
                    `*Example:* \`${prefix}bid 15000\`\n\n` +
                    t('bid_exceed_hint', lang),
                footer: 'Check the auction status first.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📊 Auction Status', id: `${prefix}auction status` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const auc = cardAuctions.get(M.from)
        if (!auc) {
            return void await this.client.sendMessage(M.from, {
                text: t('auction_none', lang),
                footer: 'No active auction in this group.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        if (this.client.correctJid(auc.seller) === this.client.correctJid(M.sender.jid))
            return void M.reply(t('auction_own', lang))

        if (amount <= auc.currentBid) {
            return void await this.client.sendMessage(M.from, {
                text: t('auction_low_bid', lang, { current: auc.currentBid.toLocaleString() }),
                footer: 'Bid must exceed the current highest bid.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📊 Auction Status', id: `${prefix}auction status` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const user = await this.client.DB.getUser(M.sender.jid)
        if (user.wallet < amount) {
            return void await this.client.sendMessage(M.from, {
                text: t('auction_no_gold', lang, {
                    wallet: user.wallet.toLocaleString(),
                    bid:    amount.toLocaleString()
                }),
                footer: 'Not enough gold.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎯 Daily Missions', id: `${prefix}cardmissions` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const prevBidder   = auc.highestBidder
        auc.currentBid     = amount
        auc.highestBidder  = M.sender.jid

        const te       = (TIER_EMOJI as any)[auc.cardTier] ?? '🃏'
        const outbid   = prevBidder
            ? t('auction_outbid', lang, { prev: prevBidder.split('@')[0] })
            : ''

        const mentions: string[] = prevBidder ? [prevBidder] : []

        return void await this.client.sendMessage(M.from, {
            text: t('auction_bid_placed', lang, {
                te,
                title:  auc.cardTitle,
                tier:   auc.cardTier,
                bidder: M.sender.username,
                amount: amount.toLocaleString(),
                outbid,
                p:      prefix
            }),
            footer: 'Tap to check auction status.',
            buttonsFormat: 'buttons',
            buttons: [{ text: '📊 Auction Status', id: `${prefix}auction status` }]
        } as unknown as AnyMessageContent, {
            quoted: M.message as any,
            ...(mentions.length > 0 ? { mentions } : {})
        })
    }
}
