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
function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60)
        return `${s}s ago`;
    if (s < 3600)
        return `${Math.floor(s / 60)}m ago`;
    if (s < 86400)
        return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}
let CardHistoryCommand = class CardHistoryCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const user = await this.client.DB.getUser((0, CardBattleState_1.normalize)(M.sender.jid));
            const history = (0, CardBattleState_1.getStats)(user).history;
            if (!history.length) {
                return void await this.client.sendMessage(M.from, {
                    text: `📜 No battles yet!\n_Start one: \`${prefix}cardbattle @user\`_`,
                    footer: 'Challenge someone to get started.',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '⚔️ Battle Help', id: `${prefix}cardbattle help` }
                    ]
                }, { quoted: M.message });
            }
            const lines = history.slice(0, 8).map((x, i) => {
                const icon = x.result === 'win' ? '✅' : '❌';
                const reward = x.reward ? `  · 🎁 ${x.reward.split('-')[0]}` : '';
                return `${i + 1}. ${icon} vs *${x.opponent}* · ${(0, CardBattleState_1.modeLabel)(x.mode)} · ${timeAgo(x.date)}${reward}`;
            });
            return void await this.client.sendMessage(M.from, {
                text: `📜 *BATTLE HISTORY*\n\n${lines.join('\n')}`,
                footer: 'Tap Open Menu for more options.',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Quick Links',
                                rows: [
                                    { title: '📊 Full Stats', description: 'Wins, rating & streak', id: `${prefix}cardstats` },
                                    { title: '🏆 Leaderboard', description: 'Top players', id: `${prefix}cardlb` },
                                    { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
CardHistoryCommand = __decorate([
    (0, Structures_1.Command)('cardhistory', {
        description: 'View your recent card battle history',
        usage: 'cardhistory',
        category: 'cards',
        aliases: ['cbhistory', 'battlelog'],
        cooldown: 5, exp: 5, dm: false
    })
], CardHistoryCommand);
exports.default = CardHistoryCommand;
