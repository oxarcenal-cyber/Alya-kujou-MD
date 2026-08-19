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
const PokemonImages_1 = require("../../lib/PokemonImages");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, _args) => {
            const user = await this.client.DB.getUser(M.sender.jid);
            const p = this.client.config.prefix;
            if (user.journeyStarted) {
                const regionKey = user.region || '';
                const trainerName = user.trainerName || M.sender.jid.split('@')[0];
                const regionInfo = PokemonRegions_1.REGIONS.find(r => r.key === regionKey);
                return void await this.client.sendMessage(M.from, {
                    text: `🌟 *Journey Already Started!*\n\n` +
                        `You're already on your adventure, *${trainerName}*! 🎒\n` +
                        `📍 *Region:* ${regionInfo ? `${regionInfo.emoji} ${regionInfo.name}` : 'Not set yet'}\n\n` +
                        `Tap *Open Menu* to continue your adventure!`,
                    footer: '🎮 Pokémon Hub',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Your Journey',
                                    rows: [
                                        { title: '🃏 Trainer Card', description: 'View your Trainer\'s Card', id: `${p}trainercard` },
                                        { title: '🎒 My Party', description: 'View your Pokémon party', id: `${p}party` },
                                        { title: '🌍 Change Region', description: 'Switch your adventure region', id: `${p}setregion` },
                                        { title: '👤 Change Trainer', description: 'Choose a new character', id: `${p}selecttrainer` },
                                        { title: '🌱 Choose Starter', description: 'Pick your starter Pokémon', id: `${p}choosestarter` },
                                        { title: '🎮 Pokémon Hub', description: 'Full menu', id: `${p}pokegame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            // ── Mark journey as started ───────────────────────────────────────────
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { journeyStarted: true } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            // ── Welcome message ───────────────────────────────────────────────────
            let msg = `🌟 *Your Pokémon Journey Begins!* 🌟\n`;
            msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
            msg += `A world of adventure awaits you, Trainer! 🎒\n\n`;
            msg += `📝 *STEP 1 — Set Your Name*\n`;
            msg += `\`${p}trainername <name>\` → Shown on your Trainer's Card\n\n`;
            msg += `👤 *STEP 2 — Choose Trainer Character*\n`;
            msg += `\`${p}selecttrainer <1-12>\`\n`;
            PokemonRegions_1.TRAINER_SPRITES.forEach(t => {
                msg += `  *${t.id}.* ${t.gender} ${t.name} (${t.game})\n`;
            });
            msg += `\n`;
            msg += `🌍 *STEP 3 — Choose Your Region*\n`;
            msg += `\`${p}setregion <name>\` → Sends region poster!\n`;
            PokemonRegions_1.REGIONS.forEach(r => {
                msg += `  ${r.emoji} *${r.name}* — ${r.starters.map(s => s.name).join(', ')}\n`;
            });
            msg += `\n`;
            msg += `🌱 *STEP 4 — Pick Your Starter*\n`;
            msg += `\`${p}choosestarter <1/2/3>\` → After picking a region\n\n`;
            msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
            msg += `⚔️ Catch Pokémon, defeat Gym Leaders & become Champion! 🏆`;
            await (0, PokemonImages_1.replyWithPokemonImage)(M, 'welcome', msg);
            // Setup guide buttons
            return void await this.client.sendMessage(M.from, {
                text: `Complete these 4 steps to set up your trainer! 👇`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Setup Steps',
                        sections: [{
                                title: 'Setup Your Trainer',
                                rows: [
                                    { title: '✏️ Step 1 — Trainer Name', description: 'Set your display name', id: `${p}trainername` },
                                    { title: '👤 Step 2 — Choose Character', description: 'Pick your trainer sprite', id: `${p}selecttrainer` },
                                    { title: '🌍 Step 3 — Set Region', description: 'Choose your home region', id: `${p}setregion` },
                                    { title: '🌱 Step 4 — Choose Starter', description: 'Pick your first Pokémon', id: `${p}choosestarter` },
                                    { title: '🎮 Pokémon Hub', description: 'Full game menu', id: `${p}pokegame` }
                                ]
                            }]
                    }]
            });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('startjourney', {
        description: '🌟 Begin your Pokémon adventure — choose your trainer, region & starter!',
        category: 'pokemon',
        usage: 'startjourney',
        cooldown: 5,
        exp: 50,
        aliases: ['journey', 'adventure']
    })
], default_1);
exports.default = default_1;
