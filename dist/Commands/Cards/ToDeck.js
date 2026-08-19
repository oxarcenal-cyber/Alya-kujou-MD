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
let ToDeckCommand = class ToDeckCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const idx = parseInt(context.trim()) - 1;
            if (isNaN(idx) || idx < 0) {
                return void await this.client.sendMessage(M.from, {
                    text: `*📦 MOVE TO DECK*\n\n` +
                        `*Usage:* \`${prefix}todeck <collection index>\`\n` +
                        `*Example:* \`${prefix}todeck 3\``,
                    footer: 'View your collection to find the index.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🗃️ View Collection', id: `${prefix}coll` }]
                }, { quoted: M.message });
            }
            const user = await this.client.DB.getUser(M.sender.jid);
            const deck = user.deck ?? [];
            const coll = user.cardCollection ?? [];
            if (coll.length === 0) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('card_empty_coll', lang),
                    footer: 'Win or buy packs to grow your collection.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🛒 Card Shop', id: `${prefix}cardshop` }]
                }, { quoted: M.message });
            }
            if (idx >= coll.length)
                return void M.reply((0, lib_1.t)('card_invalid_idx', lang, { max: String(coll.length) }));
            if (deck.length >= 12) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('card_deck_full', lang, { p: prefix }),
                    footer: 'Move a card to collection first.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📦 View Deck', id: `${prefix}deck` }]
                }, { quoted: M.message });
            }
            const cardStr = coll[idx];
            const { title, tier } = (0, CardData_1.parseCard)(cardStr);
            const te = CardData_1.TIER_EMOJI[tier] ?? '🃏';
            coll.splice(idx, 1);
            deck.push(cardStr);
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { deck, cardCollection: coll } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            return void await this.client.sendMessage(M.from, {
                text: (0, lib_1.t)('card_moved_to_deck', lang, {
                    te, title, tier,
                    deck: String(deck.length),
                    coll: String(coll.length)
                }),
                footer: 'Tap to view your cards.',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '📦 View Deck', id: `${prefix}deck` },
                    { text: '🗃️ View Collection', id: `${prefix}coll` }
                ]
            }, { quoted: M.message });
        };
    }
};
ToDeckCommand = __decorate([
    (0, Structures_1.Command)('todeck', {
        description: 'Move a card from collection to deck',
        usage: 'todeck <collection index>',
        category: 'cards',
        aliases: ['t2deck', '2deck', 'colltodeck'],
        cooldown: 5,
        dm: false,
        exp: 0
    })
], ToDeckCommand);
exports.default = ToDeckCommand;
