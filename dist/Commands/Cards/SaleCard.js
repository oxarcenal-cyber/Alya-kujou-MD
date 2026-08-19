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
let SaleCardCommand = class SaleCardCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            if (!context.trim()) {
                return void await this.client.sendMessage(M.from, {
                    text: `*🏪 SELL CARD*\n\n` +
                        `*Usage:* \`${prefix}salecard <index>|<price>\`\n` +
                        `*Example:* \`${prefix}salecard 3|50000\``,
                    footer: 'View your deck to find the card index.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                }, { quoted: M.message });
            }
            const parts = context.trim().split('|');
            if (parts.length !== 2) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('card_sale_fmt', lang, { p: prefix }),
                    footer: 'Format: salecard <index>|<price>',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                }, { quoted: M.message });
            }
            const idx = parseInt(parts[0]) - 1;
            const price = parseInt(parts[1]);
            if (isNaN(idx) || idx < 0)
                return void M.reply((0, lib_1.t)('card_sale_valid_idx', lang));
            if (isNaN(price) || price <= 0)
                return void M.reply((0, lib_1.t)('card_sale_valid_price', lang));
            if (CardData_1.cardSales.has(M.from)) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('sale_already_active', lang, { p: prefix }),
                    footer: 'Cancel existing sale first.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '❌ Cancel Sale', id: `${prefix}cancelsale` }]
                }, { quoted: M.message });
            }
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
            const shopId = Math.floor(Math.random() * 90000) + 10000;
            CardData_1.cardSales.set(M.from, {
                seller: M.sender.jid,
                cardIdx: idx,
                price,
                cardTitle: title,
                cardTier: tier,
                shopId
            });
            const caption = `*💎 Card on Sale!*\n\n` +
                `${te} *${title}*\n` +
                `🏷️ Tier: ${tier} — ${tn}\n` +
                `💰 Price: *${price.toLocaleString()}* gold\n` +
                `🎫 Shop ID: \`${shopId}\`\n\n` +
                `_\`${prefix}buycard ${shopId}\` to buy!_ 🛒`;
            try {
                const buffer = await this.client.utils.getBuffer(cardData.url);
                await M.reply(buffer, 'image', undefined, undefined, caption);
                // Add action buttons after the image
                return void await this.client.sendMessage(M.from, {
                    text: `📋 *Sale active!* Cancel anytime or wait for a buyer.`,
                    footer: `Shop ID: ${shopId}`,
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '❌ Cancel Sale', id: `${prefix}cancelsale` },
                        { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
                    ]
                }, { quoted: M.message });
            }
            catch {
                return void await this.client.sendMessage(M.from, {
                    text: caption,
                    footer: `Shop ID: ${shopId}`,
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '❌ Cancel Sale', id: `${prefix}cancelsale` },
                        { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
                    ]
                }, { quoted: M.message });
            }
        };
    }
};
SaleCardCommand = __decorate([
    (0, Structures_1.Command)('salecard', {
        description: 'Put your card up for sale',
        usage: 'salecard <index>|<price>',
        category: 'cards',
        aliases: ['sellcard', 'csell'],
        cooldown: 10,
        dm: false,
        exp: 0
    })
], SaleCardCommand);
exports.default = SaleCardCommand;
