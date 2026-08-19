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
            const { badges } = await this.client.DB.getUser(M.sender.jid);
            if (!badges.length) {
                return void await this.client.sendMessage(M.from, {
                    text: `🌫️ *No Gym Badges yet!*\n\n` +
                        `Defeat a Gym Leader with *${prefix}challenge*\n` +
                        `and choose the badge reward to start your collection! 🏅`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Earn Badges',
                                    rows: [
                                        { title: '🏟️ Gym Status', description: 'See if a Gym Leader is active', id: `${prefix}gymstatus` },
                                        { title: '⚔️ Challenge Gym', description: 'Battle the active Gym Leader', id: `${prefix}challenge` },
                                        { title: '🎒 My Party', description: 'Check your Pokémon team', id: `${prefix}party` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${prefix}pokegame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            let text = `╭─────────────────╮\n   🎖️ *YOUR GYM BADGES* 🎖️\n╰─────────────────╯\n\n`;
            badges.forEach((badge, i) => (text += `${i + 1}. 🏅 ${badge}\n`));
            text += `\n✨ *Total:* ${badges.length} badge${badges.length > 1 ? 's' : ''}`;
            return void await this.client.sendMessage(M.from, {
                text,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Battle More',
                                rows: [
                                    { title: '🏟️ Gym Status', description: 'See active Gym Leader', id: `${prefix}gymstatus` },
                                    { title: '⚔️ Challenge Gym', description: 'Battle for more badges', id: `${prefix}challenge` },
                                    { title: '🃏 Trainer Card', description: 'View your full trainer profile', id: `${prefix}trainercard` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${prefix}pokegame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('badges', {
        description: 'Shows the Gym Badges you have collected',
        usage: 'badges',
        category: 'pokemon',
        cooldown: 10,
        exp: 0
    })
], default_1);
exports.default = default_1;
