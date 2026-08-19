"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const { prefix, name } = this.client.config;
            const caption = `🌸 *${name}* 🌸\n\n` +
                `👑 *Owner:* REDZEOX\n` +
                `🔑 *Prefix:* \`${prefix}\`\n` +
                `💬 *Commands:* 200+\n\n` +
                `🎮 *Games*\n` +
                `▸ 🃏 Blackjack, Poker, Slots\n` +
                `▸ 🎰 Casino & Economy\n` +
                `▸ 🐾 Pokémon Catch & Battle\n` +
                `▸ 🃏 Pokémon TCG Cards\n` +
                `▸ 🧩 Quiz, Wordle & more\n\n` +
                `⚠️ *Private bot — no public repo*\n` +
                `❌ Do not share or redistribute.\n\n` +
                `🎬 *Pro Tip:* _Type just_ \`${prefix}\` _for a surprise intro video!_ 🎥\n\n` +
                `© REDZEOX 2024–2026`;
            // Send as ONE message — random intro video + caption (same as prefix-only trigger)
            const introVideo = (0, lib_1.getRandomIntroVideo)();
            if (introVideo) {
                return void (await M.reply(introVideo.buffer, 'video', true, undefined, caption));
            }
            // Fallback: image with caption if video asset missing
            const banner = this.client.assets.get('chisato');
            if (banner) {
                return void (await M.reply(banner, 'image', undefined, undefined, caption));
            }
            // Final fallback: text only
            return void M.reply(caption);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('repo', {
        description: 'Bot info & source details',
        category: 'general',
        aliases: ['script', 'botinfo', 'source'],
        usage: 'repo',
        cooldown: 10,
        exp: 50
    })
], default_1);
exports.default = default_1;
