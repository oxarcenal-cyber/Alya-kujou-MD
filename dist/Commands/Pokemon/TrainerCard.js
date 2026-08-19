"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const TrainerCardGen_1 = require("../../lib/TrainerCardGen");
const PokemonRegions_1 = require("../../lib/PokemonRegions");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, _args) => {
            const p = this.client.config.prefix;
            const user = await this.client.DB.getUser(M.sender.jid);
            const trainerName = user.trainerName?.trim() || M.sender.jid.split('@')[0];
            const spriteId = user.trainerSprite ?? 7;
            const regionKey = user.region || 'sinnoh';
            const sprite = (0, PokemonRegions_1.getTrainerSprite)(spriteId);
            const region = (0, PokemonRegions_1.getRegion)(regionKey) ?? PokemonRegions_1.REGIONS[3];
            const party = (user.party ?? []).slice(0, 6).map(p => ({
                id: p.id,
                name: p.name,
                level: p.level,
                rarity: p.rarity
            }));
            const gymBadges = user.badges ?? [];
            try {
                const cardBuffer = await (0, TrainerCardGen_1.buildTrainerCard)({
                    trainerName,
                    trainerSprite: sprite.url,
                    region: region.name,
                    regionEmoji: region.emoji,
                    party,
                    gymBadges,
                });
                await this.client.sendMessage(M.from, {
                    image: cardBuffer,
                    caption: this.buildCaption(trainerName, sprite, region.name, party, gymBadges),
                    mimetype: 'image/jpeg',
                }, { quoted: M.message });
            }
            catch {
                return void M.reply(`❌ Couldn't generate your Trainer Card. Try again in a moment!`);
            }
            // Post-card action buttons
            return void await this.client.sendMessage(M.from, {
                text: `Customize your card or check your progress! 👇`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Customize & Explore',
                                rows: [
                                    { title: '👤 Select Trainer', description: 'Change your trainer character', id: `${p}selecttrainer` },
                                    { title: '🌍 Set Region', description: 'Change your region', id: `${p}setregion` },
                                    { title: '🎖️ My Badges', description: 'View your gym badge collection', id: `${p}badges` },
                                    { title: '🎒 My Party', description: 'View your Pokémon team', id: `${p}party` },
                                    { title: '🎮 Pokémon Hub', description: 'Back to main menu', id: `${p}pokegame` }
                                ]
                            }]
                    }]
            });
        };
    }
    buildCaption(name, sprite, region, party, badges) {
        let txt = `🃏 *${name}'s Trainer Card*\n`;
        txt += `👤 *Character:* ${sprite.gender} ${sprite.name} (${sprite.game})\n`;
        txt += `🌍 *Region:* ${region}\n`;
        txt += `🎒 *Party:* ${party.length}/6\n`;
        if (party.length > 0) {
            txt += party.map((p, i) => `  ${i + 1}. ${p.name.charAt(0).toUpperCase() + p.name.slice(1)} (Lv.${p.level})`).join('\n') + '\n';
        }
        txt += `⚔️ *Badges:* ${badges.length}/8\n`;
        if (badges.length > 0)
            txt += badges.map(b => `  🏅 ${b}`).join('\n') + '\n';
        txt += `\n💡 *Tip:* Catch Pokémon, beat Gym Leaders & become Champion! 🏆`;
        return txt;
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('trainercard', {
        description: '🃏 View your Pokémon Trainer\'s Card with your party & badges',
        category: 'pokemon',
        usage: 'trainercard',
        cooldown: 15,
        exp: 10,
        aliases: ['tc', 'mycard', 'profile']
    })
], default_1);
exports.default = default_1;
