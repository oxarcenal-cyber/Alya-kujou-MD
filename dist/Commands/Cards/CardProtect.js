"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const CardBattleState_1 = require("../../lib/CardBattleState");
const CardData_1 = require("../../lib/CardData");
let CardProtectCommand = class CardProtectCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const idx = parseInt(context.trim()) - 1;
            if (isNaN(idx)) {
                return void await this.client.sendMessage(M.from, {
                    text: `🛡️ *CARD PROTECT*\n\n` +
                        `Protect up to *3 cards* from being lost in Card-mode battles.\n\n` +
                        `*Usage:* \`${prefix}cardprotect <index>\`\n` +
                        `*Example:* \`${prefix}cardprotect 2\``,
                    footer: 'Use cards command to find your card index.',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🃏 View All Cards', id: `${prefix}cards` },
                        { text: '🛡️ Protected List', id: `${prefix}cardprotected` }
                    ]
                }, { quoted: M.message });
            }
            const jid = (0, CardBattleState_1.normalize)(M.sender.jid);
            const user = await this.client.DB.getUser(jid);
            const cards = [...(user.deck ?? []), ...(user.cardCollection ?? [])];
            if (idx < 0 || idx >= cards.length) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ Invalid index. You have *${cards.length}* cards.`,
                    footer: 'Use cards to see your card list.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🃏 View All Cards', id: `${prefix}cards` }]
                }, { quoted: M.message });
            }
            const stats = (0, CardBattleState_1.getStats)(user);
            if (stats.protectedCards.includes(cards[idx])) {
                return void await this.client.sendMessage(M.from, {
                    text: `🛡️ This card is already protected.`,
                    footer: 'Max 3 cards can be protected.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🛡️ Protected List', id: `${prefix}cardprotected` }]
                }, { quoted: M.message });
            }
            if (stats.protectedCards.length >= 3) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ Max 3 protected cards reached.\n_Unprotect one to add another._`,
                    footer: 'Unprotect a card first.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🛡️ Protected List', id: `${prefix}cardprotected` }]
                }, { quoted: M.message });
            }
            stats.protectedCards.push(cards[idx]);
            await this.client.DB.updateUser(jid, 'cardBattle', 'set', stats);
            const { title, tier } = (0, CardData_1.parseCard)(cards[idx]);
            return void await this.client.sendMessage(M.from, {
                text: `🛡️ Protected *${CardData_1.TIER_EMOJI[tier] ?? '🃏'} ${title} (T${tier})*\n_Safe from Card-mode battle rewards._`,
                footer: `${stats.protectedCards.length}/3 slots used.`,
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🛡️ Protected List', id: `${prefix}cardprotected` },
                    { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
                ]
            }, { quoted: M.message });
        };
    }
};
CardProtectCommand = __decorate([
    (0, Structures_1.Command)('cardprotect', {
        description: 'Protect a card from being taken in Card-mode battles (max 3)',
        usage: 'cardprotect <card index>',
        category: 'cards',
        aliases: ['cprotect'],
        cooldown: 5, exp: 5, dm: false
    })
], CardProtectCommand);
exports.default = CardProtectCommand;
