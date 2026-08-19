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
function rankTier(r) {
    const t = [
        { l: '🥉 Bronze', m: 0 }, { l: '🥈 Silver', m: 1100 }, { l: '🥇 Gold', m: 1300 },
        { l: '💎 Platinum', m: 1500 }, { l: '💠 Diamond', m: 1700 }, { l: '👑 Champion', m: 2000 }
    ];
    let out = t[0].l;
    for (const x of t) {
        if (r >= x.m)
            out = x.l;
    }
    ;
    return out;
}
let CardStatsCommand = class CardStatsCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const targetJid = M.mentioned.length > 0 ? (0, CardBattleState_1.normalize)(M.mentioned[0]) : (0, CardBattleState_1.normalize)(M.sender.jid);
            const user = await this.client.DB.getUser(targetJid);
            const stats = (0, CardBattleState_1.getStats)(user);
            const name = this.client.contact.getContact(targetJid).username || user.username?.name || targetJid.split('@')[0];
            const wr = stats.wins + stats.losses > 0 ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100) : 0;
            return void await this.client.sendMessage(M.from, {
                text: `📊 *CARD STATS* — ${name}\n\n` +
                    `Wins: *${stats.wins}* · Losses: *${stats.losses}* · Win Rate: *${wr}%*\n` +
                    `Rating: *${stats.rating}* (${rankTier(stats.rating)})\n` +
                    `Streak: *${stats.streak}*\n\n` +
                    `Cards Won: *${stats.cardsWon}* · Cards Lost: *${stats.cardsLost}*\n` +
                    `Protected: *${stats.protectedCards.length}/3*`,
                footer: 'Tap Open Menu for more options.',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Quick Links',
                                rows: [
                                    { title: '📜 Battle History', description: 'Recent battle log', id: `${prefix}cardhistory` },
                                    { title: '🏆 Leaderboard', description: 'Top players', id: `${prefix}cardlb` },
                                    { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
CardStatsCommand = __decorate([
    (0, Structures_1.Command)('cardstats', {
        description: 'View your card battle stats',
        usage: 'cardstats [@user]',
        category: 'cards',
        aliases: ['cbstats'],
        cooldown: 5, exp: 5, dm: false
    })
], CardStatsCommand);
exports.default = CardStatsCommand;
