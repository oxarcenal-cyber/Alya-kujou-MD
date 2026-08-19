"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            if (M.chat !== 'group')
                return void M.reply('This command only works in groups!');
            const { gymHistory } = await this.client.DB.getGroup(M.from);
            if (!gymHistory || gymHistory.length < 1) {
                return void await this.client.sendMessage(M.from, {
                    text: `📭 *No Gym battles recorded yet!*\n\n` +
                        `Use *${prefix}wild on* and wait for a Gym Leader to appear. Defeat it to write history! 🏆`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🏟️ Gym Status', id: `${prefix}gymstatus` },
                        { text: '🎮 Pokémon Hub', id: `${prefix}pokegame` }
                    ]
                }, { quoted: M.message });
            }
            const medals = ['🥇', '🥈', '🥉'];
            const rows = gymHistory
                .slice(0, 5)
                .map((h, i) => {
                const date = new Date(h.date);
                const timeStr = `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
                const medal = medals[i] ?? `${i + 1}.`;
                return `${medal} *${h.winner}*\n　🐾 ${this.client.utils.capitalize(h.pokemon)} · ${h.type} · 🎁 ${h.reward}\n　🕐 ${timeStr}`;
            })
                .join('\n\n');
            return void await this.client.sendMessage(M.from, {
                text: `🏟️ *GYM BATTLE HISTORY*\n\n${rows}`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Gym Actions',
                                rows: [
                                    { title: '🏟️ Gym Status', description: 'See active Gym Leader', id: `${prefix}gymstatus` },
                                    { title: '⚔️ Challenge Gym', description: 'Battle the Gym Leader', id: `${prefix}challenge` },
                                    { title: '🎖️ My Badges', description: 'View your badge collection', id: `${prefix}badges` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${prefix}pokegame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('gymhistory', {
        description: 'Shows the last 5 Gym Leader battles in this group',
        usage: 'gymhistory',
        category: 'pokemon',
        cooldown: 5,
        exp: 0,
        aliases: ['gymlog']
    })
], default_1);
exports.default = default_1;
