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
let SwapCardsCommand = class SwapCardsCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const parts = context.trim().split(/\s+/);
            if (parts.length < 2) {
                return void await this.client.sendMessage(M.from, {
                    text: `*🔀 SWAP CARDS*\n\n` +
                        `*Usage:* \`${prefix}swapcard <index1> <index2>\`\n` +
                        `*Example:* \`${prefix}swapcard 2 5\``,
                    footer: 'View your deck to see position numbers.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                }, { quoted: M.message });
            }
            const a = parseInt(parts[0]) - 1;
            const b = parseInt(parts[1]) - 1;
            if (isNaN(a) || isNaN(b) || a < 0 || b < 0)
                return void M.reply((0, lib_1.t)('card_valid_idx_nums', lang));
            if (a === b)
                return void M.reply((0, lib_1.t)('card_same_idx', lang));
            const user = await this.client.DB.getUser(M.sender.jid);
            const deck = user.deck ?? [];
            if (deck.length === 0) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('card_empty_deck', lang),
                    footer: 'Buy packs to get cards.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🛒 Card Shop', id: `${prefix}cardshop` }]
                }, { quoted: M.message });
            }
            if (a >= deck.length || b >= deck.length)
                return void M.reply((0, lib_1.t)('card_invalid_idx', lang, { max: String(deck.length) }));
            const tmp = deck[a];
            deck[a] = deck[b];
            deck[b] = tmp;
            await this.client.DB.updateUser(M.sender.jid, 'deck', 'set', deck);
            const { title: ta, tier: ra } = (0, CardData_1.parseCard)(deck[a]);
            const { title: tb, tier: rb } = (0, CardData_1.parseCard)(deck[b]);
            const ea = CardData_1.TIER_EMOJI[ra] ?? '🃏';
            const eb = CardData_1.TIER_EMOJI[rb] ?? '🃏';
            return void await this.client.sendMessage(M.from, {
                text: (0, lib_1.t)('card_swap_done', lang, {
                    a: String(a + 1), ea, ta, ra,
                    b: String(b + 1), eb, tb, rb,
                    p: prefix
                }),
                footer: 'Tap to view your updated deck.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
            }, { quoted: M.message });
        };
    }
};
SwapCardsCommand = __decorate([
    (0, Structures_1.Command)('swapcard', {
        description: 'Swap positions of 2 cards in your deck',
        usage: 'swapcard <index1> <index2>',
        category: 'cards',
        aliases: ['cswap', 'swapcards', 'cardswap'],
        cooldown: 5,
        dm: false,
        exp: 0
    })
], SwapCardsCommand);
exports.default = SwapCardsCommand;
