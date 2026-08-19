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
            const prefix = this.client.config.prefix;
            const { pc } = await this.client.DB.getUser(M.sender.jid);
            if (pc.length < 1) {
                return void await this.client.sendMessage(M.from, {
                    text: `📦 *Your PC Box is empty!*\n\n` +
                        `Catch more wild Pokémon to fill it up.\n` +
                        `Use *${prefix}catch <name>* when they appear! 🎣`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${prefix}pokegame` }]
                }, { quoted: M.message });
            }
            let text = `📦 *${M.sender.username}'s PC Box*\n━━━━━━━━━━━━━━━━━━━━\n`;
            pc.forEach((x, y) => (text += `\n*#${y + 1}* — ${this.client.utils.capitalize(x.name)}\n` +
                `　├ 🏮 Level: *${x.level}*\n` +
                `　└ ⭐ Rarity: *${x.rarity || 'common'}*\n`));
            text += `\n━━━━━━━━━━━━━━━━━━━━\n` +
                `🗃️ *Total stored:* ${pc.length} Pokémon\n` +
                `_Tip: Use \`${prefix}t2party <slot>\` to move one to your party._`;
            return void await this.client.sendMessage(M.from, {
                text,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Manage PC',
                                rows: [
                                    { title: '🎒 My Party', description: 'View active party', id: `${prefix}party` },
                                    { title: '↕️ Move to Party', description: 'Transfer PC → Party', id: `${prefix}t2party` },
                                    { title: '↕️ Move to PC', description: 'Transfer Party → PC', id: `${prefix}t2pc` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${prefix}pokegame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('pc', {
        description: 'View all Pokemon in your PC storage box',
        exp: 10,
        category: 'pokemon',
        cooldown: 10,
        usage: 'pc'
    })
], command);
exports.default = command;
