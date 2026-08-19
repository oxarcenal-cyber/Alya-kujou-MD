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
            const p = this.client.config.prefix;
            if (!context?.trim()) {
                const user = await this.client.DB.getUser(M.sender.jid);
                const current = user.trainerName || '(not set)';
                return void await this.client.sendMessage(M.from, {
                    text: `✏️ *Trainer Name*\n\n` +
                        `Current: *${current}*\n\n` +
                        `To change it: *${p}trainername <your name>*\n` +
                        `Example: *${p}trainername Ash*\n\n` +
                        `📝 Max 16 characters, letters & numbers only.`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Trainer Setup',
                                    rows: [
                                        { title: '🃏 Trainer Card', description: 'View your current card', id: `${p}trainercard` },
                                        { title: '👤 Select Trainer', description: 'Change trainer character', id: `${p}selecttrainer` },
                                        { title: '🌍 Set Region', description: 'Change your region', id: `${p}setregion` },
                                        { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            const raw = context.trim();
            const name = raw.replace(/[^a-zA-Z0-9 _\-]/g, '').trim().slice(0, 16);
            if (!name) {
                return void M.reply(`❌ *Invalid name!* Use only letters, numbers, spaces, underscores, or hyphens. Max 16 characters.`);
            }
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { trainerName: name, journeyStarted: true } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            return void await this.client.sendMessage(M.from, {
                text: `✅ *Trainer name set to: ${name}*\n\n` +
                    `🃏 View your updated card below!`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🃏 Trainer Card', id: `${p}trainercard` },
                    { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                ]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('trainername', {
        description: '✏️ Set your trainer name shown on your Trainer\'s Card',
        category: 'pokemon',
        usage: 'trainername <name>',
        cooldown: 30,
        exp: 5,
        aliases: ['setname', 'tname']
    })
], default_1);
exports.default = default_1;
