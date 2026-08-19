import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { parseCard, findCard, TIER_EMOJI, TIER_NAME, cardAuctions } from '../../lib/CardData'
import { t } from '../../lib'

@Command('auction', {
    description: 'Start or end a card auction',
    usage: 'auction start|<idx>|<price>  /  auction end  /  auction status',
    category: 'cards',
    aliases: ['auc', 'cardauction'],
    cooldown: 10,
    dm: false,
    exp: 0
})
export default class AuctionCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang   = await this.getLang(M)
        const arg    = context.trim()

        // ── Start auction ──────────────────────────────────────────────────────
        if (arg.startsWith('start')) {
            if (cardAuctions.has(M.from)) {
                return void await this.client.sendMessage(M.from, {
                    text: t('auction_already_active', lang, { p: prefix }),
                    footer: 'End the current auction first.',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '📊 Auction Status', id: `${prefix}auction status` },
                        { text: '🛑 End Auction', id: `${prefix}auction end` }
                    ]
                } as unknown as AnyMessageContent, { quoted: M.message as any })
            }

            const parts = arg.split('|')
            if (parts.length !== 3) {
                return void await this.client.sendMessage(M.from, {
                    text:
                        `*🔨 AUCTION*\n\n` +
                        `*Usage:* \`${prefix}auction start|<deck index>|<price>\`\n` +
                        `*Example:* \`${prefix}auction start|2|10000\``,
                    footer: 'View your deck to find the card index.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                } as unknown as AnyMessageContent, { quoted: M.message as any })
            }

            const idx        = parseInt(parts[1]) - 1
            const startPrice = parseInt(parts[2])

            if (isNaN(idx) || idx < 0)
                return void M.reply(t('card_valid_deck_idx', lang))
            if (isNaN(startPrice) || startPrice <= 0)
                return void M.reply(t('card_valid_start_price', lang))

            const user           = await this.client.DB.getUser(M.sender.jid)
            const deck: string[] = (user as any).deck ?? []

            if (deck.length === 0)
                return void M.reply(t('card_empty_deck', lang))
            if (idx >= deck.length)
                return void M.reply(t('card_invalid_idx', lang, { max: String(deck.length) }))

            const cardStr         = deck[idx]
            const { title, tier } = parseCard(cardStr)
            const cardData        = findCard(title, tier)
            if (!cardData) return void M.reply(t('card_not_found_msg', lang))

            const te = (TIER_EMOJI as any)[tier] ?? '🃏'
            const tn = (TIER_NAME as any)[tier] ?? tier

            cardAuctions.set(M.from, {
                seller:        M.sender.jid,
                senderJid:     M.sender.jid,
                cardIdx:       idx,
                startPrice,
                currentBid:    startPrice,
                highestBidder: null,
                cardTitle:     title,
                cardTier:      tier
            })

            const caption =
                `*🔨 AUCTION STARTED!*\n\n` +
                `${te} *${title}*\n` +
                `🏷️ Tier: ${tier} — ${tn}\n` +
                `💰 Starting Price: *${startPrice.toLocaleString()}* gold\n` +
                `👤 Seller: ${M.sender.username}\n\n` +
                `_\`${prefix}bid <amount>\` to place a bid!_`

            try {
                const buffer = await this.client.utils.getBuffer(cardData.url)
                return void await M.reply(buffer, 'image', undefined, undefined, caption)
            } catch {
                return void await this.client.sendMessage(M.from, {
                    text: caption,
                    footer: 'Tap Open Menu for auction options.',
                    buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                            title: 'Auction Options',
                            rows: [
                                { title: '💰 Place a Bid', description: 'Bid on this card', id: `${prefix}bid` },
                                { title: '📊 Auction Status', description: 'Check current bids', id: `${prefix}auction status` },
                                { title: '🛑 End Auction', description: 'Close auction (seller only)', id: `${prefix}auction end` }
                            ]
                        }]
                    }]
                } as unknown as AnyMessageContent, { quoted: M.message as any })
            }
        }

        // ── End auction ────────────────────────────────────────────────────────
        if (arg === 'end') {
            const auc = cardAuctions.get(M.from)
            if (!auc) {
                return void await this.client.sendMessage(M.from, {
                    text: t('auction_none', lang),
                    footer: 'Start an auction with auction start.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                } as unknown as AnyMessageContent, { quoted: M.message as any })
            }

            const isMod = this.client.config.mods.some(
                m => this.client.correctJid(m) === this.client.correctJid(M.sender.jid)
            )
            if (
                this.client.correctJid(auc.seller) !== this.client.correctJid(M.sender.jid) &&
                !M.sender.isAdmin && !isMod
            )
                return void M.reply(t('auction_no_permission', lang))

            if (!auc.highestBidder) {
                cardAuctions.delete(M.from)
                return void await this.client.sendMessage(M.from, {
                    text: t('auction_ended_no_bid', lang),
                    footer: 'No bids were placed.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
                } as unknown as AnyMessageContent, { quoted: M.message as any })
            }

            const sellerUser    = await this.client.DB.getUser(auc.seller)
            const sellerDeck: string[] = (sellerUser as any).deck ?? []
            if (auc.cardIdx >= sellerDeck.length) {
                cardAuctions.delete(M.from)
                return void M.reply(t('auction_seller_gone', lang))
            }

            const cardStr = sellerDeck[auc.cardIdx]
            sellerDeck.splice(auc.cardIdx, 1)
            await this.client.DB.updateUser(auc.seller, 'deck', 'set', sellerDeck)

            const winnerUser    = await this.client.DB.getUser(auc.highestBidder)
            const winnerDeck: string[] = (winnerUser as any).deck ?? []
            const winnerColl: string[] = (winnerUser as any).cardCollection ?? []
            let storedIn = 'deck'

            if (winnerDeck.length < 12) {
                winnerDeck.push(cardStr)
                await this.client.DB.updateUser(auc.highestBidder, 'deck', 'set', winnerDeck)
            } else {
                winnerColl.push(cardStr)
                await this.client.DB.updateUser(auc.highestBidder, 'cardCollection', 'set', winnerColl)
                storedIn = 'collection'
            }

            await this.client.DB.setCrystal(auc.highestBidder, -auc.currentBid)
            await this.client.DB.setCrystal(auc.seller, auc.currentBid)
            cardAuctions.delete(M.from)

            return void await this.client.sendMessage(M.from, {
                text: t('auction_ended', lang, {
                    te:     (TIER_EMOJI as any)[auc.cardTier] ?? '🃏',
                    title:  auc.cardTitle,
                    tier:   auc.cardTier,
                    winner: auc.highestBidder.split('@')[0],
                    bid:    auc.currentBid.toLocaleString(),
                    stored: storedIn
                }),
                footer: 'Auction complete.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
            } as unknown as AnyMessageContent, {
                quoted: M.message as any,
                ...([auc.highestBidder] as any)
            })
        }

        // ── Status ─────────────────────────────────────────────────────────────
        if (arg === 'status' || arg === '') {
            const auc = cardAuctions.get(M.from)
            if (!auc) {
                return void await this.client.sendMessage(M.from, {
                    text:
                        `*🔨 Auction Commands*\n\n` +
                        `\`${prefix}auction start|<index>|<price>\` — start\n` +
                        `\`${prefix}auction end\` — end (seller/admin)\n` +
                        `\`${prefix}auction status\` — current status`,
                    footer: 'No active auction right now.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                } as unknown as AnyMessageContent, { quoted: M.message as any })
            }

            const te         = (TIER_EMOJI as any)[auc.cardTier] ?? '🃏'
            const bidderName = auc.highestBidder
                ? this.client.contact.getContact(auc.highestBidder).username
                : t('auction_status_no_bids', lang)

            return void await this.client.sendMessage(M.from, {
                text:
                    `*🔨 Active Auction*\n\n` +
                    `${te} *${auc.cardTitle}* _(Tier ${auc.cardTier})_\n` +
                    `💰 Current Bid: *${auc.currentBid.toLocaleString()}* gold\n` +
                    `🥇 Highest Bidder: ${bidderName}`,
                footer: 'Tap Open Menu for auction actions.',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Auction Actions',
                        rows: [
                            { title: '💰 Place a Bid', description: `Current: ${auc.currentBid.toLocaleString()} gold`, id: `${prefix}bid` },
                            { title: '🛑 End Auction', description: 'Close & transfer card (seller only)', id: `${prefix}auction end` },
                            { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        // ── Unknown subcommand ─────────────────────────────────────────────────
        return void await this.client.sendMessage(M.from, {
            text:
                `*🔨 Auction Commands:*\n\n` +
                `\`${prefix}auction start|<index>|<price>\` — start\n` +
                `\`${prefix}auction end\` — end (seller/admin)\n` +
                `\`${prefix}auction status\` — current status`,
            footer: 'Tap Open Menu for options.',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Auction',
                    rows: [
                        { title: '📊 Auction Status', description: 'Check current auction', id: `${prefix}auction status` },
                        { title: '📦 My Deck', description: 'Find a card to auction', id: `${prefix}deck` },
                        { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
