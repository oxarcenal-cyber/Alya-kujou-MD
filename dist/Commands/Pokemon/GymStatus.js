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
                return void M.reply('Gym challenges only happen in groups!');
            const gym = this.handler.gymChallenge.get(M.from);
            if (!gym || gym.expiresAt < Date.now()) {
                return void await this.client.sendMessage(M.from, {
                    text: `🌫️ *No Gym Leader active right now.*\n\n` +
                        `Make sure *${prefix}wild on* is enabled.\n` +
                        `A Gym Leader appears roughly every 2–3 hours.\n\n` +
                        `Type *${prefix}challenge info* for full rules.`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${prefix}pokegame` }]
                }, { quoted: M.message });
            }
            const remainingMs = gym.expiresAt - Date.now();
            const minutes = Math.floor(remainingMs / 60000);
            const seconds = Math.floor((remainingMs % 60000) / 1000);
            return void await this.client.sendMessage(M.from, {
                text: `🏟️ *GYM LEADER ACTIVE!* 🏟️\n\n` +
                    `${gym.type.emoji} *Type:* ${gym.type.type}\n` +
                    `🐉 *Pokémon:* ${this.client.utils.capitalize(gym.name)}\n` +
                    `🀄 *Level:* ${gym.level}\n` +
                    `⏳ *Time left:* ${minutes}m ${seconds}s\n\n` +
                    `⚔️ Use *${prefix}challenge* to battle it now!`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Battle Options',
                                rows: [
                                    { title: '⚔️ Challenge Gym', description: 'Battle the active Gym Leader', id: `${prefix}challenge` },
                                    { title: '🎒 My Party', description: 'Check your Pokémon party', id: `${prefix}party` },
                                    { title: '⚔️ PVP Battle', description: 'Challenge another trainer', id: `${prefix}pvp` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${prefix}pokegame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('gymstatus', {
        description: 'Shows the currently active Gym Leader in this group, if any',
        usage: 'gymstatus',
        category: 'pokemon',
        cooldown: 5,
        exp: 0,
        aliases: ['gym']
    })
], default_1);
exports.default = default_1;
