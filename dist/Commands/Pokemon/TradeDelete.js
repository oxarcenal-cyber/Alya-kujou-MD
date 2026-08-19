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
                    text: `❌ *No active trade to cancel!*`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                }, { quoted: M.message });
            }
            const trade = this.handler.pokemonTradeResponse.get(M.from);
            if (trade?.creator !== M.sender.jid) {
                return void M.reply(`❌ *Only the trade creator can cancel it!*`);
            }
            this.handler.pokemonTradeResponse.delete(M.from);
            return void await this.client.sendMessage(M.from, {
                text: `🚫 *Trade offer cancelled!*`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🎒 My Party', id: `${p}party` },
                    { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                ]
            }, { quoted: M.message });
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('trade-delete', {
        category: 'pokemon',
        description: 'Cancel your pending Pokémon trade offer',
        usage: 'trade-delete',
        cooldown: 10,
        exp: 0,
        aliases: []
    })
], command);
exports.default = command;
