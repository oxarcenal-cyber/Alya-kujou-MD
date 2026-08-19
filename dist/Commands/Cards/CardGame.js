"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
/**
 * Short, menu-first entry point for the complete card system.
 * Detailed battle interactions live in CardBattle.ts.
 */
let CardGameCommand = class CardGameCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const body = `🃏 *CARD GAME HUB*\n\n` +
                `Manage cards, battle players, and climb the leaderboard.\n` +
                `Tap *Open Menu* to continue.`;
            await this.client.sendMessage(M.from, {
                text: body,
                footer: 'Shortcuts: deck · coll · cardbattle help',
                title: '🃏 Card Game',
                buttons: [
                    {
                        text: '📋 Open Menu',
                        sections: [
                            {
                                title: 'Cards',
                                rows: [
                                    { title: '📦 My Deck', description: 'View and choose deck cards', id: `${prefix}deck` },
                                    { title: '🗃️ Collection', description: 'View collected cards', id: `${prefix}coll` },
                                    { title: '🔍 Card Info', description: 'Search a card by name', id: `${prefix}cardinfo` }
                                ]
                            },
                            {
                                title: 'Battle',
                                rows: [
                                    { title: '⚔️ Battle Help', description: 'Rules and quick usage', id: `${prefix}cardbattle help` },
                                    { title: '📊 My Stats', description: 'Wins, rating, and history', id: `${prefix}cardbattle stats` },
                                    { title: '🏆 Leaderboard', description: 'Top card battlers', id: `${prefix}cardbattle leaderboard` }
                                ]
                            },
                            {
                                title: 'Progression',
                                rows: [
                                    { title: '📊 Card Stats', description: 'Wins, rating, streak', id: `${prefix}cardstats` },
                                    { title: '📜 Battle History', description: 'Recent battle log', id: `${prefix}cardhistory` },
                                    { title: '🎯 Daily Missions', description: 'Earn gold & XP daily', id: `${prefix}cardmissions` }
                                ]
                            },
                            {
                                title: 'Shop & Upgrades',
                                rows: [
                                    { title: '🛒 Card Shop', description: 'Browse and buy packs', id: `${prefix}cardshop` },
                                    { title: '📦 Open Pack', description: 'Open your card packs', id: `${prefix}cardopen` },
                                    { title: '✨ Upgrade Card', description: 'Combine 2 cards → next tier', id: `${prefix}cardupgrade` }
                                ]
                            },
                            {
                                title: 'Management',
                                rows: [
                                    { title: '🛡️ Protected Cards', description: 'Cards safe from battle rewards', id: `${prefix}cardprotected` },
                                    { title: '🃏 Card Profile', description: 'Full card battle profile', id: `${prefix}cardprofile` }
                                ]
                            }
                        ]
                    }
                ]
            }, { quoted: M.message });
        };
    }
};
CardGameCommand = __decorate([
    (0, Structures_1.Command)('cardgame', {
        description: 'Open the card game hub',
        usage: 'cardgame',
        category: 'cards',
        aliases: ['cardhub', 'cgame'],
        cooldown: 5,
        exp: 5,
        dm: false
    })
], CardGameCommand);
exports.default = CardGameCommand;
