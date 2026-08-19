"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            if (!context) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *Provide a Pokémon name or ID!*\n\nExample: *${p}pokemon pikachu*`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            }
            const term = context.trim().split(' ')[0].toLowerCase().trim();
            const res = await this.client.utils.fetch(`https://pokeapi.co/api/v2/pokemon/${term}`);
            if (!res) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *"${term}"* not found! Check the name/ID and try again.`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            }
            try {
                const text = `*📛 Name:* ${this.client.utils.capitalize(res.name)}\n\n` +
                    `*🔢 ID:* #${String(res.id).padStart(3, '0')}\n\n` +
                    `*${res.types.length > 1 ? '👾 Types' : '👾 Type'}:* ${res.types.map((t) => this.client.utils.capitalize(t.type.name)).join(', ')}\n\n` +
                    `*${res.abilities.length > 1 ? '🀄 Abilities' : '🀄 Ability'}:* ${res.abilities.map((a) => this.client.utils.capitalize(a.ability.name)).join(', ')}`;
                const image = await this.client.utils.getBuffer(res.sprites.other['official-artwork'].front_default);
                await M.reply(image, 'image', undefined, undefined, text);
                return void await this.client.sendMessage(M.from, {
                    text: `_Use \`${p}pokedex ${term}\` for full stats, or \`${p}pokecard ${term}\` for a TCG card!_`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'More for this Pokémon',
                                    rows: [
                                        { title: '📖 Pokédex Entry', description: `Full stats & Pokédex for ${this.client.utils.capitalize(res.name)}`, id: `${p}pokedex ${term}` },
                                        { title: '🃏 TCG Card', description: `Generate ${this.client.utils.capitalize(res.name)} card`, id: `${p}pokecard ${term}` },
                                        { title: '🎒 My Party', description: 'View your Pokémon team', id: `${p}party` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                });
            }
            catch {
                return void M.reply('Could not load Pokémon data. Try again later.');
            }
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('pokemon', {
        description: 'Look up a Pokémon by name or ID',
        usage: 'pokemon <name|id>',
        category: 'pokemon',
        cooldown: 10,
        exp: 5
    })
], command);
exports.default = command;
