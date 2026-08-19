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
        this.execute = async (M, { context }) => {
            const option = context?.trim().toLowerCase().split(' ')[0];
            const p = this.client.config.prefix;
            if (option === 'status') {
                const { wild } = await this.client.DB.getGroup(M.from);
                return void await this.client.sendMessage(M.from, {
                    text: `Wild Pokémon spawning is currently *${wild ? 'ON 🟩' : 'OFF 🟥'}* in this group.`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            }
            if (!M.sender.isAdmin && !this.client.config.mods.includes(M.sender.jid))
                return void M.reply('Only group admins can turn wild Pokémon spawning on or off.');
            const actions = ['on', 'off'];
            if (!option || !actions.includes(option)) {
                return void await this.client.sendMessage(M.from, {
                    text: `📖 *Wild Pokémon Spawning*\n\n` +
                        `*${p}wild on* — Wild Pokémon start appearing every few minutes.\n` +
                        `  Catch them with *${p}catch <pokemon_name>*.\n\n` +
                        `*${p}wild off* — Stop Pokémon from appearing.\n\n` +
                        `*${p}wild status* — Check if spawning is on or off.\n\n` +
                        `🏟️ *Bonus:* Turning ON also enables Gym Challenges every ~2-3 hours!\n\n` +
                        `⚠️ Only group admins or bot mods can toggle this.`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Wild Spawning Options',
                                    rows: [
                                        { title: '🟩 Turn ON', description: 'Enable wild Pokémon spawning', id: `${p}wild on` },
                                        { title: '🟥 Turn OFF', description: 'Disable wild Pokémon spawning', id: `${p}wild off` },
                                        { title: '🟨 Check Status', description: 'See if spawning is on or off', id: `${p}wild status` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            const enable = option === 'on';
            const { wild } = await this.client.DB.getGroup(M.from);
            if (wild === enable)
                return void M.reply(`🟨 Wild Pokémon spawning is already turned *${enable ? 'on' : 'off'}* here.`);
            await this.client.DB.updateGroup(M.from, 'wild', enable);
            if (enable)
                this.handler.wild.push(M.from);
            else {
                const index = this.handler.wild.indexOf(M.from);
                if (index >= 0)
                    this.handler.wild.splice(index, 1);
            }
            if (enable) {
                return void await this.client.sendMessage(M.from, {
                    text: `🟩 *Wild Pokémon spawning is now ON!*\n\n` +
                        `A wild Pokémon will appear every few minutes.\n` +
                        `Catch it with *${p}catch <pokemon_name>*! 🎣`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Now That It\'s ON',
                                    rows: [
                                        { title: '🏟️ Gym Status', description: 'See if a Gym Leader is active', id: `${p}gymstatus` },
                                        { title: '🎖️ My Badges', description: 'View your badge collection', id: `${p}badges` },
                                        { title: '🎒 My Party', description: 'Check your Pokémon team', id: `${p}party` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            return void await this.client.sendMessage(M.from, {
                text: `🟥 *Wild Pokémon spawning is now OFF.*\n\nNo more wild Pokémon will appear in this group.`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'What\'s Next?',
                                rows: [
                                    { title: '🟩 Turn ON Again', description: 'Re-enable wild Pokémon spawning', id: `${p}wild on` },
                                    { title: '🎒 My Party', description: 'Check your Pokémon team', id: `${p}party` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('wild', {
        description: 'Turns wild Pokémon spawning on or off in this group',
        usage: 'wild <on/off/status>',
        category: 'pokemon',
        aliases: ['wildpokemon', 'pokemontoggle'],
        cooldown: 5,
        exp: 5
    })
], default_1);
exports.default = default_1;
