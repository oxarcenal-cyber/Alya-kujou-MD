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
let BidCommand = class BidCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const amount = parseInt(context.trim());
            if (isNaN(amount) || amount <= 0) {
                return void await this.client.sendMessage(M.from, {
                    text: `*💰 PLACE A BID*\n\n` +
                        `*Usage:* \`${prefix}bid <amount>\`\n` +
                        `*Example:* \`${prefix}bid 15000\`\n\n` +
                        (0, lib_1.t)('bid_exceed_hint', lang),
                    footer: 'Check the auction status first.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📊 Auction Status', id: `${prefix}auction status` }]
                }, { quoted: M.message });
            }
            const auc = CardData_1.cardAuctions.get(M.from);
            if (!auc) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('auction_none', lang),
                    footer: 'No active auction in this group.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
                }, { quoted: M.message });
            }
            if (this.client.correctJid(auc.seller) === this.client.correctJid(M.sender.jid))
                return void M.reply((0, lib_1.t)('auction_own', lang));
            if (amount <= auc.currentBid) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('auction_low_bid', lang, { current: auc.currentBid.toLocaleString() }),
                    footer: 'Bid must exceed the current highest bid.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📊 Auction Status', id: `${prefix}auction status` }]
                }, { quoted: M.message });
            }
            const user = await this.client.DB.getUser(M.sender.jid);
            if (user.wallet < amount) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('auction_no_gold', lang, {
                        wallet: user.wallet.toLocaleString(),
                        bid: amount.toLocaleString()
                    }),
                    footer: 'Not enough gold.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎯 Daily Missions', id: `${prefix}cardmissions` }]
                }, { quoted: M.message });
            }
            const prevBidder = auc.highestBidder;
            auc.currentBid = amount;
            auc.highestBidder = M.sender.jid;
            const te = CardData_1.TIER_EMOJI[auc.cardTier] ?? '🃏';
            const outbid = prevBidder
                ? (0, lib_1.t)('auction_outbid', lang, { prev: prevBidder.split('@')[0] })
                : '';
            const mentions = prevBidder ? [prevBidder] : [];
            return void await this.client.sendMessage(M.from, {
                text: (0, lib_1.t)('auction_bid_placed', lang, {
                    te,
                    title: auc.cardTitle,
                    tier: auc.cardTier,
                    bidder: M.sender.username,
                    amount: amount.toLocaleString(),
                    outbid,
                    p: prefix
                }),
                footer: 'Tap to check auction status.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📊 Auction Status', id: `${prefix}auction status` }]
            }, {
                quoted: M.message,
                ...(mentions.length > 0 ? { mentions } : {})
            });
        };
    }
};
BidCommand = __decorate([
    (0, Structures_1.Command)('bid', {
        description: 'Place a bid on an active auction',
        usage: 'bid <amount>',
        category: 'cards',
        aliases: ['placebid', 'cbid'],
        cooldown: 5,
        dm: false,
        exp: 0
    })
], BidCommand);
exports.default = BidCommand;
