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
            const lang = await this.getLang(M);
            const p = this.client.config.prefix;
            const current = (0, lib_1.langName)(lang);
            const SAMPLES = [
                { key: 'cooldown', label: '⏳ Cooldown' },
                { key: 'banned', label: '🚫 Banned' },
                { key: 'group_only', label: '👥 Group only' },
                { key: 'admin_only', label: '⚔️ Admin only' },
                { key: 'nsfw_only', label: '🔞 NSFW only' },
                { key: 'weeb_no_query', label: '🔍 No query (weeb)' },
                { key: 'weeb_fetch_error', label: '❌ Fetch error' },
                { key: 'media_lyrics_no_query', label: '🎵 No song name' },
                { key: 'media_yts_no_query', label: '📺 No YT query' },
                { key: 'chara_nothing_to_claim', label: '🎭 Nothing to claim' },
                { key: 'chara_no_gallery', label: '📭 Empty gallery' },
                { key: 'nsfw_loli_caption', label: '🔞 Loli reply' },
            ];
            const vars = { time: '5', p, prefix: p, cmd: 'example' };
            let text = (0, lib_1.t)('langlist_header', lang, { current });
            text += (0, lib_1.t)('langlist_section_en', lang) + '\n';
            for (const { key, label } of SAMPLES) {
                const en = (0, lib_1.t)(key, 'en', vars);
                text += `\n*${label}*\n${en}\n`;
            }
            text += '\n' + (0, lib_1.t)('langlist_section_hi', lang) + '\n';
            for (const { key, label } of SAMPLES) {
                const hi = (0, lib_1.t)(key, 'hi', vars);
                text += `\n*${label}*\n${hi}\n`;
            }
            text += (0, lib_1.t)('langlist_footer', lang, { p });
            return void M.reply(text);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('langlist', {
        description: 'Preview how bot messages look in English and Hindi side-by-side',
        category: 'moderation',
        usage: 'langlist',
        aliases: ['langpreview', 'langshow'],
        exp: 5,
        cooldown: 10
    })
], default_1);
exports.default = default_1;
