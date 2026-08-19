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
const fs_1 = require("fs");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const p = this.client.config.prefix;
            // ── No arg: show region list with Open Menu ───────────────────────────
            if (!context?.trim()) {
                let msg = `🌍 *Choose Your Adventure Region*\n`;
                msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                PokemonRegions_1.REGIONS.forEach((r, i) => {
                    msg += `*${i + 1}.* ${r.emoji} *${r.name}*\n`;
                    msg += `   📝 ${r.desc}\n`;
                    msg += `   🏅 ${r.badgeCount} Badges | 🌱 ${r.starters.map(s => s.name).join(', ')}\n\n`;
                });
                msg += `💡 Tap *Pick Region* to choose!`;
                return void await this.client.sendMessage(M.from, {
                    text: msg,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '🌍 Pick Region',
                            sections: [{
                                    title: '🌍 Available Regions',
                                    rows: PokemonRegions_1.REGIONS.map(r => ({
                                        title: `${r.emoji} ${r.name}`,
                                        description: `${r.desc} · ${r.badgeCount} Badges`,
                                        id: `${p}setregion ${r.name.toLowerCase()}`
                                    }))
                                }]
                        }]
                }, { quoted: M.message });
            }
            const key = context.trim().toLowerCase().split(' ')[0];
            const region = (0, PokemonRegions_1.getRegion)(key);
            if (!region) {
                const names = PokemonRegions_1.REGIONS.map(r => `${r.emoji} ${r.name}`).join(' · ');
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *Unknown region!*\n\nAvailable:\n${names}\n\n` +
                        `Example: \`${p}setregion Sinnoh\``,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '🌍 Pick Region',
                            sections: [{
                                    title: '🌍 Available Regions',
                                    rows: PokemonRegions_1.REGIONS.map(r => ({
                                        title: `${r.emoji} ${r.name}`,
                                        description: `${r.badgeCount} Badges · ${r.starters.map(s => s.name).join(', ')}`,
                                        id: `${p}setregion ${r.name.toLowerCase()}`
                                    }))
                                }]
                        }]
                }, { quoted: M.message });
            }
            // ── Save region ───────────────────────────────────────────────────────
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { region: region.key, journeyStarted: true } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            // ── Build caption ─────────────────────────────────────────────────────
            let caption = `${region.emoji} *Welcome to ${region.name}!*\n\n`;
            caption += `📝 ${region.desc}\n\n`;
            caption += `🏅 *Gym Badges to collect:* ${region.badgeCount}\n\n`;
            caption += `🌱 *Choose your Starter:*\n`;
            region.starters.forEach((s, i) => {
                caption += `  *${i + 1}.* ${s.emoji} *${s.name}* — ${s.type}\n`;
            });
            caption += `\n💡 Pick your starter: \`${p}choosestarter <1/2/3>\``;
            // ── Send region poster ────────────────────────────────────────────────
            try {
                const imgBuffer = (0, fs_1.readFileSync)(region.image);
                await this.client.sendMessage(M.from, {
                    image: imgBuffer,
                    caption,
                    mimetype: 'image/jpeg',
                }, { quoted: M.message });
            }
            catch {
                await M.reply(caption);
            }
            // ── Next steps button ─────────────────────────────────────────────────
            return void await this.client.sendMessage(M.from, {
                text: `Next: pick your starter to begin your ${region.name} adventure! 👇`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Next Steps',
                                rows: [
                                    { title: `🌱 Choose Starter`, description: `Pick your ${region.name} starter`, id: `${p}choosestarter` },
                                    { title: '👤 Select Trainer', description: 'Choose your trainer character', id: `${p}selecttrainer` },
                                    { title: '🃏 Trainer Card', description: 'View your trainer profile', id: `${p}trainercard` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                ]
                            }]
                    }]
            });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('setregion', {
        description: '🌍 Choose your Pokémon adventure region',
        category: 'pokemon',
        usage: 'setregion <region name>',
        cooldown: 10,
        exp: 5,
        aliases: ['region', 'chooseregion']
    })
], default_1);
exports.default = default_1;
