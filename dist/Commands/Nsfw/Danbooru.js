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
const PRESET_TAGS = {
    waifu: 'rating:e 1girl solo',
    yuri: 'rating:e yuri 2girls',
    milf: 'rating:e mature_female',
    ecchi: 'rating:q 1girl',
    hentai: 'rating:e 1boy 1girl hetero',
    trap: 'rating:e trap',
    neko: 'rating:e cat_ears 1girl',
    maid: 'rating:e maid 1girl',
    ahegao: 'rating:e ahegao',
    femdom: 'rating:e femdom',
};
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const lang = await this.getLang(M);
            const p = this.client.config.prefix;
            const raw = context.trim().toLowerCase();
            if (!raw) {
                const presets = Object.keys(PRESET_TAGS).join(', ');
                return void M.reply((0, lib_1.t)('nsfw_danbooru_usage', lang, { p, presets }));
            }
            const tags = PRESET_TAGS[raw] ?? `rating:e ${raw}`;
            await M.reply((0, lib_1.t)('nsfw_fetching', lang));
            const url = `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(tags)}&limit=100`;
            const posts = await this.client.utils
                .fetch(url)
                .catch(() => null);
            if (!posts || !Array.isArray(posts) || posts.length === 0)
                return void M.reply((0, lib_1.t)('nsfw_danbooru_no_result', lang, { query: raw }));
            const valid = posts.filter((p) => !p.is_deleted && !p.is_banned && p.file_url && ['jpg', 'png', 'webp'].includes(p.file_ext));
            if (valid.length === 0)
                return void M.reply((0, lib_1.t)('nsfw_danbooru_no_result', lang, { query: raw }));
            const post = valid[Math.floor(Math.random() * valid.length)];
            const imageUrl = post.large_file_url || post.file_url;
            const chars = post.tag_string_character
                ? post.tag_string_character.split(' ').slice(0, 3).map((s) => s.replace(/_/g, ' ')).join(', ')
                : '?';
            const copy = post.tag_string_copyright
                ? post.tag_string_copyright.split(' ')[0].replace(/_/g, ' ')
                : '';
            const caption = (0, lib_1.t)('nsfw_danbooru_caption', lang, {
                chars,
                copy: copy || '?',
                id: String(post.id),
                p
            });
            return void (await this.client.sendMessage(M.from, {
                image: { url: imageUrl },
                caption
            }));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('danbooru', {
        description: 'Fetch a random explicit/NSFW image from Danbooru by tag or preset',
        usage: 'danbooru [tag/preset]',
        category: 'nsfw',
        aliases: ['booru'],
        exp: 25,
        cooldown: 8
    })
], default_1);
exports.default = default_1;
