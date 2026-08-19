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
            if (this.handler.pokemonTradeResponse.has(M.from)) {
                return void await this.client.sendMessage(M.from, {
                    text: `🔄 *A trade is already ongoing in this group!*\n\n` +
                        `Wait for it to complete or expire before starting a new one.\n\n` +
                        `✅ *${p}trade-confirm* — Accept the current trade\n` +
                        `❌ *${p}trade-delete* — Cancel it (only the creator)`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '✅ Confirm Trade', id: `${p}trade-confirm` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            }
            if (M.numbers.length < 1) {
                const { party } = await this.client.DB.getUser(M.sender.jid);
                if (party.length < 1) {
                    return void await this.client.sendMessage(M.from, {
                        text: `❌ *No Pokémon in party to trade!*`,
                        footer: '🎮 Pokémon Hub',
                        buttonsFormat: 'buttons',
                        buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                    }, { quoted: M.message });
                }
                let msg = `🔄 *Trade a Pokémon*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
                party.forEach((x, i) => {
                    msg += `*${i + 1}.* ${this.client.utils.capitalize(x.name)} — Lv. ${x.level}\n`;
                });
                msg += `\n💡 Usage: *${p}trade <slot> <pokemon_you_want>*\nExample: *${p}trade 1 2 charizard*`;
                return void await this.client.sendMessage(M.from, {
                    text: msg,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🎒 My Party', id: `${p}party` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            }
            const { party } = await this.client.DB.getUser(M.sender.jid);
            M.numbers.forEach((x) => (context = context.replace(x.toString(), '')));
            if (M.numbers[0] > party.length || M.numbers[0] < 1)
                return void M.reply('❌ *Invalid slot index!* Use a valid party slot number.');
            const index = M.numbers[0] - 1;
            const term = context.trim().split(' ')[0].toLowerCase().trim();
            if (term === '')
                return void M.reply('❌ *Provide a Pokémon name to trade for!*');
            const res = await this.client.utils.fetch(`https://pokeapi.co/api/v2/pokemon/${term}`);
            if (!res)
                return void M.reply(`❌ *"${term}"* not found! Check the Pokémon name.`);
            const { name } = res;
            this.handler.pokemonTradeResponse.set(M.from, {
                offer: party[index],
                creator: M.sender.jid,
                with: name
            });
            await this.client.sendMessage(M.from, {
                text: `🔄 *Trade Offer!*\n\n` +
                    `📤 *Offering:* ${this.client.utils.capitalize(party[index].name)}\n` +
                    `📥 *Wants:* ${this.client.utils.capitalize(name)}\n\n` +
                    `Anyone with *${this.client.utils.capitalize(name)}* can accept!`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Trade Actions',
                                rows: [
                                    { title: '✅ Confirm Trade', description: 'Accept this trade offer', id: `${p}trade-confirm` },
                                    { title: '❌ Cancel Trade', description: 'Cancel this trade (creator only)', id: `${p}trade-delete` },
                                    { title: '🎒 My Party', description: 'View your Pokémon', id: `${p}party` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
            setTimeout(() => {
                if (!this.handler.pokemonTradeResponse.has(M.from))
                    return;
                this.handler.pokemonTradeResponse.delete(M.from);
                M.reply('⏰ Trade offer expired and was cancelled.');
            }, 6 * 10000);
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('trade', {
        description: 'Offer a Pokémon trade in the group',
        category: 'pokemon',
        usage: 'trade <slot#> <pokemon>',
        cooldown: 35,
        aliases: ['t'],
        exp: 10
    })
], command);
exports.default = command;
