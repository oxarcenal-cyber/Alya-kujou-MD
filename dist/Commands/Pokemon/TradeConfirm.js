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
        this.execute = async (M) => {
            const p = this.client.config.prefix;
            if (!this.handler.pokemonTradeResponse.has(M.from)) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *No active trade offer in this group!*\n\nStart one with *${p}trade <slot> <pokemon>*`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🎒 My Party', id: `${p}party` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            }
            const trade = this.handler.pokemonTradeResponse.get(M.from);
            if (trade?.creator === M.sender.jid) {
                return void M.reply(`😅 *You can't confirm your own trade offer!* Wait for someone else to accept it.`);
            }
            const { party } = await this.client.DB.getUser(M.sender.jid);
            const i = party.findIndex((x) => x.name === trade?.with);
            if (i < 0) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *You don't have ${this.client.utils.capitalize(trade?.with)} in your party!*\n\nThis trade requires that specific Pokémon.`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🎒 My Party', id: `${p}party` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            }
            const pkmn = trade?.offer;
            const pokemon = party[i];
            const { party: creatorParty } = await this.client.DB.getUser(trade?.creator);
            const index = creatorParty.findIndex((x) => x.name === pkmn.name && x.level === pkmn.level);
            party[i] = pkmn;
            creatorParty[index] = pokemon;
            await this.client.DB.user.updateOne({ jid: trade?.creator }, { $set: { party: creatorParty } });
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { party } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            this.client.DB.cacheInvalidate(`user:${trade?.creator}`);
            this.handler.pokemonTradeResponse.delete(M.from);
            await this.client.sendMessage(M.from, {
                text: `🎉 *Trade Complete!*\n\n` +
                    `🔄 *@${trade?.creator.split('@')[0]}* gave: *${this.client.utils.capitalize(pkmn.name)}*\n` +
                    `🔄 *@${M.sender.jid.split('@')[0]}* gave: *${this.client.utils.capitalize(pokemon.name)}*`,
                mentions: [M.sender.jid, trade?.creator]
            }, { quoted: M.message });
            return void await this.client.sendMessage(M.from, {
                text: `Check your updated party! 🎒`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🎒 My Party', id: `${p}party` },
                    { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                ]
            });
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('trade-confirm', {
        description: 'Confirm a pending Pokémon trade with another user',
        category: 'pokemon',
        usage: 'trade-confirm',
        cooldown: 15,
        aliases: []
    })
], command);
exports.default = command;
