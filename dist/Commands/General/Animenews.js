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
        this.fetchWithRetry = async (url, retries = 3) => {
            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
                    if (res.status === 429) {
                        // Rate limited — wait 2s and retry
                        if (attempt < retries)
                            await new Promise(r => setTimeout(r, 2000 * attempt));
                        continue;
                    }
                    if (!res.ok)
                        return null;
                    return await res.json();
                }
                catch {
                    if (attempt < retries)
                        await new Promise(r => setTimeout(r, 1000 * attempt));
                }
            }
            return null;
        };
        this.execute = async (M) => {
            await M.reply(`📡 Fetching latest anime... please wait~`);
            try {
                const data = await this.fetchWithRetry('https://api.jikan.moe/v4/top/anime?filter=airing&limit=5');
                if (!data?.data?.length)
                    return void M.reply(`❌ Could not fetch anime data. Jikan API busy hai, thodi der baad try karo!`);
                const NUMS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
                let text = `📺 *TOP AIRING ANIME*\n`;
                text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n`;
                for (let i = 0; i < data.data.length; i++) {
                    const anime = data.data[i];
                    const genres = anime.genres.slice(0, 3).map(g => g.name).join(' · ') || 'N/A';
                    const synopsis = anime.synopsis
                        ? anime.synopsis.slice(0, 80) + (anime.synopsis.length > 80 ? '...' : '')
                        : 'No synopsis available.';
                    text += `${NUMS[i]} *${anime.title}*\n`;
                    text += `   ⭐ *Score:* ${anime.score ?? 'N/A'}\n`;
                    text += `   🎬 *Episodes:* ${anime.episodes ?? 'Ongoing'}\n`;
                    text += `   🏷️ *Genres:* ${genres}\n`;
                    text += `   📝 _${synopsis}_\n\n`;
                }
                text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
                text += `_Data from MyAnimeList via Jikan API_`;
                return void M.reply(text);
            }
            catch {
                return void M.reply(`❌ Failed to fetch anime data. The API might be busy, try again!`);
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('animenews', {
        description: 'Get latest top airing anime 📺',
        aliases: ['topanime', 'airing', 'trending'],
        usage: 'animenews',
        cooldown: 15,
        exp: 5,
        category: 'general',
        dm: true
    })
], default_1);
exports.default = default_1;
