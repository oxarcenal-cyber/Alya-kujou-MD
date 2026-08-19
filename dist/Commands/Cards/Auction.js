"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const CardData_1 = require("../../lib/CardData");
const lib_1 = require("../../lib");
let AuctionCommand = class AuctionCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const arg = context.trim();
            // ── Start auction ──────────────────────────────────────────────────────
            if (arg.startsWith('start')) {
                if (CardData_1.cardAuctions.has(M.from)) {
                    return void await this.client.sendMessage(M.from, {
                        text: (0, lib_1.t)('auction_already_active', lang, { p: prefix }),
                        footer: 'End the current auction first.',
                        buttonsFormat: 'buttons',
                        buttons: [
                            { text: '📊 Auction Status', id: `${prefix}auction status` },
                            { text: '🛑 End Auction', id: `${prefix}auction end` }
                        ]
                    }, { quoted: M.message });
                }
                const parts = arg.split('|');
                if (parts.length !== 3) {
                    return void await this.client.sendMessage(M.from, {
                        text: `*🔨 AUCTION*\n\n` +
                            `*Usage:* \`${prefix}auction start|<deck index>|<price>\`\n` +
                            `*Example:* \`${prefix}auction start|2|10000\``,
                        footer: 'View your deck to find the card index.',
                        buttonsFormat: 'buttons',
                        buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                    }, { quoted: M.message });
                }
                const idx = parseInt(parts[1]) - 1;
                const startPrice = parseInt(parts[2]);
                if (isNaN(idx) || idx < 0)
                    return void M.reply((0, lib_1.t)('card_valid_deck_idx', lang));
                if (isNaN(startPrice) || startPrice <= 0)
                    return void M.reply((0, lib_1.t)('card_valid_start_price', lang));
                const user = await this.client.DB.getUser(M.sender.jid);
                const deck = user.deck ?? [];
                if (deck.length === 0)
                    return void M.reply((0, lib_1.t)('card_empty_deck', lang));
                if (idx >= deck.length)
                    return void M.reply((0, lib_1.t)('card_invalid_idx', lang, { max: String(deck.length) }));
                const cardStr = deck[idx];
                const { title, tier } = (0, CardData_1.parseCard)(cardStr);
                const cardData = (0, CardData_1.findCard)(title, tier);
                if (!cardData)
                    return void M.reply((0, lib_1.t)('card_not_found_msg', lang));
                const te = CardData_1.TIER_EMOJI[tier] ?? '🃏';
                const tn = CardData_1.TIER_NAME[tier] ?? tier;
                CardData_1.cardAuctions.set(M.from, {
                    seller: M.sender.jid,
                    senderJid: M.sender.jid,
                    cardIdx: idx,
                    startPrice,
                    currentBid: startPrice,
                    highestBidder: null,
                    cardTitle: title,
                    cardTier: tier
                });
                const caption = `*🔨 AUCTION STARTED!*\n\n` +
                    `${te} *${title}*\n` +
                    `🏷️ Tier: ${tier} — ${tn}\n` +
                    `💰 Starting Price: *${startPrice.toLocaleString()}* gold\n` +
                    `👤 Seller: ${M.sender.username}\n\n` +
                    `_\`${prefix}bid <amount>\` to place a bid!_`;
                try {
                    const buffer = await this.client.utils.getBuffer(cardData.url);
                    return void await M.reply(buffer, 'image', undefined, undefined, caption);
                }
                catch {
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
                    }, { quoted: M.message });
                }
            }
            // ── End auction ────────────────────────────────────────────────────────
            if (arg === 'end') {
                const auc = CardData_1.cardAuctions.get(M.from);
                if (!auc) {
                    return void await this.client.sendMessage(M.from, {
                        text: (0, lib_1.t)('auction_none', lang),
                        footer: 'Start an auction with auction start.',
                        buttonsFormat: 'buttons',
                        buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                    }, { quoted: M.message });
                }
                const isMod = this.client.config.mods.some(m => this.client.correctJid(m) === this.client.correctJid(M.sender.jid));
                if (this.client.correctJid(auc.seller) !== this.client.correctJid(M.sender.jid) &&
                    !M.sender.isAdmin && !isMod)
                    return void M.reply((0, lib_1.t)('auction_no_permission', lang));
                if (!auc.highestBidder) {
                    CardData_1.cardAuctions.delete(M.from);
                    return void await this.client.sendMessage(M.from, {
                        text: (0, lib_1.t)('auction_ended_no_bid', lang),
                        footer: 'No bids were placed.',
                        buttonsFormat: 'buttons',
                        buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
                    }, { quoted: M.message });
                }
                const sellerUser = await this.client.DB.getUser(auc.seller);
                const sellerDeck = sellerUser.deck ?? [];
                if (auc.cardIdx >= sellerDeck.length) {
                    CardData_1.cardAuctions.delete(M.from);
                    return void M.reply((0, lib_1.t)('auction_seller_gone', lang));
                }
                const cardStr = sellerDeck[auc.cardIdx];
                sellerDeck.splice(auc.cardIdx, 1);
                await this.client.DB.updateUser(auc.seller, 'deck', 'set', sellerDeck);
                const winnerUser = await this.client.DB.getUser(auc.highestBidder);
                const winnerDeck = winnerUser.deck ?? [];
                const winnerColl = winnerUser.cardCollection ?? [];
                let storedIn = 'deck';
                if (winnerDeck.length < 12) {
                    winnerDeck.push(cardStr);
                    await this.client.DB.updateUser(auc.highestBidder, 'deck', 'set', winnerDeck);
                }
                else {
                    winnerColl.push(cardStr);
                    await this.client.DB.updateUser(auc.highestBidder, 'cardCollection', 'set', winnerColl);
                    storedIn = 'collection';
                }
                await this.client.DB.setCrystal(auc.highestBidder, -auc.currentBid);
                await this.client.DB.setCrystal(auc.seller, auc.currentBid);
                CardData_1.cardAuctions.delete(M.from);
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('auction_ended', lang, {
                        te: CardData_1.TIER_EMOJI[auc.cardTier] ?? '🃏',
                        title: auc.cardTitle,
                        tier: auc.cardTier,
                        winner: auc.highestBidder.split('@')[0],
                        bid: auc.currentBid.toLocaleString(),
                        stored: storedIn
                    }),
                    footer: 'Auction complete.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
                }, {
                    quoted: M.message,
                    ...[auc.highestBidder]
                });
            }
            // ── Status ─────────────────────────────────────────────────────────────
            if (arg === 'status' || arg === '') {
                const auc = CardData_1.cardAuctions.get(M.from);
                if (!auc) {
                    return void await this.client.sendMessage(M.from, {
                        text: `*🔨 Auction Commands*\n\n` +
                            `\`${prefix}auction start|<index>|<price>\` — start\n` +
                            `\`${prefix}auction end\` — end (seller/admin)\n` +
                            `\`${prefix}auction status\` — current status`,
                        footer: 'No active auction right now.',
                        buttonsFormat: 'buttons',
                        buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                    }, { quoted: M.message });
                }
                const te = CardData_1.TIER_EMOJI[auc.cardTier] ?? '🃏';
                const bidderName = auc.highestBidder
                    ? this.client.contact.getContact(auc.highestBidder).username
                    : (0, lib_1.t)('auction_status_no_bids', lang);
                return void await this.client.sendMessage(M.from, {
                    text: `*🔨 Active Auction*\n\n` +
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
                }, { quoted: M.message });
            }
            // ── Unknown subcommand ─────────────────────────────────────────────────
            return void await this.client.sendMessage(M.from, {
                text: `*🔨 Auction Commands:*\n\n` +
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
            }, { quoted: M.message });
        };
    }
};
AuctionCommand = __decorate([
    (0, Structures_1.Command)('auction', {
        description: 'Start or end a card auction',
        usage: 'auction start|<idx>|<price>  /  auction end  /  auction status',
        category: 'cards',
        aliases: ['auc', 'cardauction'],
        cooldown: 10,
        dm: false,
        exp: 0
    })
], AuctionCommand);
exports.default = AuctionCommand;
