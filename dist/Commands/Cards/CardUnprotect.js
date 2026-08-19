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
let CardUnprotectCommand = class CardUnprotectCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const idx = parseInt(context.trim()) - 1;
            if (isNaN(idx)) {
                return void await this.client.sendMessage(M.from, {
                    text: `🔓 *CARD UNPROTECT*\n\n` +
                        `*Usage:* \`${prefix}cardunprotect <slot>\`\n` +
                        `*Example:* \`${prefix}cardunprotect 1\``,
                    footer: 'See your protected cards first.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🛡️ Protected List', id: `${prefix}cardprotected` }]
                }, { quoted: M.message });
            }
            const jid = (0, CardBattleState_1.normalize)(M.sender.jid);
            const user = await this.client.DB.getUser(jid);
            const stats = (0, CardBattleState_1.getStats)(user);
            if (idx < 0 || idx >= stats.protectedCards.length) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ Invalid slot. You have *${stats.protectedCards.length}* protected card(s).`,
                    footer: 'Check your protected cards.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🛡️ Protected List', id: `${prefix}cardprotected` }]
                }, { quoted: M.message });
            }
            const [card] = stats.protectedCards.splice(idx, 1);
            await this.client.DB.updateUser(jid, 'cardBattle', 'set', stats);
            const { title, tier } = (0, CardData_1.parseCard)(card);
            return void await this.client.sendMessage(M.from, {
                text: `🔓 Unprotected *${CardData_1.TIER_EMOJI[tier] ?? '🃏'} ${title} (T${tier})*.\n_Card can now be won/lost in battles._`,
                footer: `${stats.protectedCards.length}/3 slots used.`,
                buttonsFormat: 'buttons',
                buttons: [{ text: '🛡️ Protected List', id: `${prefix}cardprotected` }]
            }, { quoted: M.message });
        };
    }
};
CardUnprotectCommand = __decorate([
    (0, Structures_1.Command)('cardunprotect', {
        description: 'Remove protection from a card',
        usage: 'cardunprotect <protected slot>',
        category: 'cards',
        aliases: ['cunprotect'],
        cooldown: 5, exp: 5, dm: false
    })
], CardUnprotectCommand);
exports.default = CardUnprotectCommand;
