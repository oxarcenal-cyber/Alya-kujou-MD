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
            const { pc, party } = await this.client.DB.getUser(M.sender.jid);
            if (pc.length < 1) {
                return void await this.client.sendMessage(M.from, {
                    text: `📦 *Your PC Box is empty!*\n\nCatch more Pokémon to fill it up. 🎣`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🎒 My Party', id: `${p}party` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            }
            if (party.length >= 6) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *Party is full!* (6/6)\n\n` +
                        `Move a Pokémon to PC first with *${p}t2pc <party_slot>*`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🎒 My Party', id: `${p}party` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            }
            if (M.numbers.length < 2) {
                // Show PC list so they can pick
                let msg = `↕️ *Transfer PC → Party*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
                pc.forEach((x, i) => {
                    msg += `*${i + 1}.* ${this.client.utils.capitalize(x.name)} — Lv. ${x.level} ⭐ ${x.rarity || 'common'}\n`;
                });
                msg += `\n💡 Usage: *${p}t2party <pc_slot>*\nExample: *${p}t2party 1 3* (pc slot 3)`;
                return void await this.client.sendMessage(M.from, {
                    text: msg,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '📦 My PC', id: `${p}pc` },
                        { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                    ]
                }, { quoted: M.message });
            }
            const i = M.numbers[1];
            if (i < 1 || i > pc.length) {
                return void M.reply(`❌ *Invalid slot!* Your PC has *${pc.length}* Pokémon.\n\nPick a slot between *1* and *${pc.length}*.`);
            }
            const pokemon = pc[i - 1];
            party.push(pokemon);
            pc.splice(i - 1, 1);
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { pc, party } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            return void await this.client.sendMessage(M.from, {
                text: `✅ *${this.client.utils.capitalize(pokemon.name)}* transferred to your party!\n\n` +
                    `🎒 *Party:* ${party.length}/6  |  📦 *PC:* ${pc.length} Pokémon`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Manage Pokémon',
                                rows: [
                                    { title: '🎒 My Party', description: 'View updated party', id: `${p}party` },
                                    { title: '📦 My PC Box', description: 'View remaining PC Pokémon', id: `${p}pc` },
                                    { title: '↕️ Move to PC', description: 'Transfer party → PC', id: `${p}t2pc` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('t2party', {
        category: 'pokemon',
        description: 'Transfer a Pokémon from PC box to your active party',
        usage: 't2party <pc_slot>',
        cooldown: 15,
        exp: 35
    })
], command);
exports.default = command;
