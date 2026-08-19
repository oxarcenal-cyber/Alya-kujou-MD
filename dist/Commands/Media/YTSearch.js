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
        this.execute = async (M, { context }) => {
            const lang = await this.getLang(M);
            if (!context)
                return void M.reply((0, lib_1.t)('media_yts_no_query', lang));
            const query = context.trim();
            await M.react('🔍');
            const videos = await this.client.utils
                .fetch(`https://weeb-api.vercel.app/ytsearch?query=${query}`)
                .catch(() => null);
            if (!videos || !videos.length) {
                await M.react('❌');
                return void M.reply((0, lib_1.t)('media_yts_not_found', lang, { query }));
            }
            const top = videos[0];
            const thumb = await this.client.utils.getBuffer(top.thumbnail).catch(() => null);
            // Short text — top 5 results only
            const length = Math.min(videos.length, 5);
            let text = `🔍 *YouTube Search Results*\n━━━━━━━━━━━━━━━━━━━━━\n\n`;
            for (let i = 0; i < length; i++) {
                text +=
                    `*${i + 1}.* ${videos[i].title}\n` +
                        `   📺 ${videos[i].author.name}  •  ⏱️ ${videos[i].seconds}s\n` +
                        `   🔗 ${videos[i].url}\n\n`;
            }
            text += `🔱 _Powered by RedzeoX_`;
            await M.react('✅');
            return void await this.client.sendMessage(M.from, {
                text,
                footer: '🔍 RedzeoX Search',
                buttons: [
                    { text: '▶️ Watch Top Result', url: top.url }
                ]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('yts', {
        description: 'Searches the video of the given query in YouTube',
        category: 'media',
        cooldown: 10,
        exp: 10,
        usage: 'yts [query]',
        aliases: ['ytsearch']
    })
], default_1);
exports.default = default_1;
