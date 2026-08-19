"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const PokemonRegions_1 = require("../../lib/PokemonRegions");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            // ── No arg: show list with Open Menu button ────────────────────────────
            if (!context?.trim()) {
                let msg = `👤 *Choose Your Trainer Character*\n`;
                msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                PokemonRegions_1.TRAINER_SPRITES.forEach(t => {
                    msg += `*${t.id}.* ${t.gender} *${t.name}* — ${t.game}\n`;
                });
                msg += `\n💡 Tap *Select Trainer* to pick one!`;
                return void await this.client.sendMessage(M.from, {
                    text: msg,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '👤 Select Trainer',
                            sections: [{
                                    title: '👤 Choose Your Character',
                                    rows: PokemonRegions_1.TRAINER_SPRITES.map(t => ({
                                        title: `${t.id}. ${t.gender} ${t.name}`,
                                        description: `Game: ${t.game}`,
                                        id: `${p}selecttrainer ${t.id}`
                                    }))
                                }]
                        }]
                }, { quoted: M.message });
            }
            const num = parseInt(context.trim());
            if (isNaN(num) || num < 1 || num > PokemonRegions_1.TRAINER_SPRITES.length) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *Invalid choice!* Pick a number between *1* and *${PokemonRegions_1.TRAINER_SPRITES.length}*.\n\n` +
                        `Use *${p}selecttrainer* (no number) to see the full list.`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '👤 Select Trainer', id: `${p}selecttrainer` }]
                }, { quoted: M.message });
            }
            const sprite = PokemonRegions_1.TRAINER_SPRITES[num - 1];
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { trainerSprite: sprite.id, journeyStarted: true } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            return void await this.client.sendMessage(M.from, {
                text: `✅ *Trainer updated!*\n\n` +
                    `👤 You are now *${sprite.gender} ${sprite.name}* (${sprite.game})!\n\n` +
                    `🃏 View your updated card with *${p}trainercard*`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Set Up Your Trainer',
                                rows: [
                                    { title: '🃏 Trainer Card', description: 'View your updated card', id: `${p}trainercard` },
                                    { title: '🌍 Set Region', description: 'Choose your adventure region', id: `${p}setregion` },
                                    { title: '🌱 Choose Starter', description: 'Pick your starter Pokémon', id: `${p}choosestarter` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('selecttrainer', {
        description: '👤 Choose your trainer character for your Trainer\'s Card',
        category: 'pokemon',
        usage: 'selecttrainer <1-12>',
        cooldown: 10,
        exp: 5,
        aliases: ['st', 'trainerselect', 'character']
    })
], default_1);
exports.default = default_1;
