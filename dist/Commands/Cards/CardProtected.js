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
let CardProtectedCommand = class CardProtectedCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const user = await this.client.DB.getUser((0, CardBattleState_1.normalize)(M.sender.jid));
            const protectedCards = (0, CardBattleState_1.getStats)(user).protectedCards;
            if (!protectedCards.length) {
                return void await this.client.sendMessage(M.from, {
                    text: `🛡️ *No protected cards yet.*\n_Protect up to 3 cards from battle losses._\n\n*Usage:* \`${prefix}cardprotect <index>\``,
                    footer: 'Use cards to find your card index.',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🃏 View All Cards', id: `${prefix}cards` },
                        { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
                    ]
                }, { quoted: M.message });
            }
            const lines = protectedCards.map((card, i) => {
                const { title, tier } = (0, CardData_1.parseCard)(card);
                return `${i + 1}. ${CardData_1.TIER_EMOJI[tier] ?? '🃏'} *${title}* (T${tier})`;
            });
            return void await this.client.sendMessage(M.from, {
                text: `🛡️ *PROTECTED CARDS* (${protectedCards.length}/3)\n\n${lines.join('\n')}\n\n_\`${prefix}cardunprotect <slot>\` to remove protection_`,
                footer: 'Tap Open Menu for more options.',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Protection Actions',
                                rows: [
                                    { title: '🔓 Unprotect Card', description: 'Remove a card\'s protection', id: `${prefix}cardunprotect` },
                                    { title: '🛡️ Protect New Card', description: 'Add protection to a card', id: `${prefix}cardprotect` },
                                    { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
CardProtectedCommand = __decorate([
    (0, Structures_1.Command)('cardprotected', {
        description: 'List your protected cards',
        usage: 'cardprotected',
        category: 'cards',
        aliases: ['cprotected', 'myprotected'],
        cooldown: 5, exp: 5, dm: false
    })
], CardProtectedCommand);
exports.default = CardProtectedCommand;
