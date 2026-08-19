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
let CardLbCommand = class CardLbCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { flags }) => {
            const prefix = this.client.config.prefix;
            const groupOnly = flags.includes('--group') || flags.includes('group');
            let users;
            if (groupOnly && M.chat === 'group') {
                const meta = await this.client.groupMetadata(M.from).catch(() => null);
                const jids = (meta?.participants ?? []).map((p) => (0, CardBattleState_1.normalize)(p.id));
                users = jids.length ? await this.client.DB.user.find({ jid: { $in: jids } }).sort({ 'cardBattle.rating': -1 }).limit(10).lean() : [];
            }
            else {
                users = await this.client.DB.user.find({}).sort({ 'cardBattle.rating': -1 }).limit(10).lean();
            }
            if (!users.length) {
                return void await this.client.sendMessage(M.from, {
                    text: `🏆 No ranked players yet.\n_Be the first to battle!_`,
                    footer: 'Challenge someone to get ranked.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '⚔️ Battle Help', id: `${prefix}cardbattle help` }]
                }, { quoted: M.message });
            }
            const lines = users.map((u, i) => {
                const stats = (0, CardBattleState_1.getStats)(u);
                const name = u.username?.name || u.jid?.split('@')[0] || '?';
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
                return `${medal} *${name}* — ${stats.rating} · ${stats.wins}W ${stats.losses}L`;
            });
            return void await this.client.sendMessage(M.from, {
                text: `🏆 *CARD LEADERBOARD*${groupOnly ? ' (Group)' : ''}\n\n` +
                    lines.join('\n'),
                footer: 'Tap Open Menu for more options.',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Quick Links',
                                rows: [
                                    { title: '📊 My Stats', description: 'Your wins, rating & streak', id: `${prefix}cardstats` },
                                    { title: '📜 Battle History', description: 'Your recent battles', id: `${prefix}cardhistory` },
                                    { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
CardLbCommand = __decorate([
    (0, Structures_1.Command)('cardlb', {
        description: 'View the card battle leaderboard',
        usage: 'cardlb [--group]',
        category: 'cards',
        aliases: ['cardleaderboard', 'cblb'],
        cooldown: 10, exp: 5, dm: false
    })
], CardLbCommand);
exports.default = CardLbCommand;
