"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const marika_1 = require("@shineiichijo/marika");
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const lang = await this.getLang(M);
            if (!context)
                return void M.reply((0, lib_1.t)('weeb_no_query', lang));
            const query = context.trim();
            await this.client.utils
                .withRetry(() => new marika_1.Manga().searchManga(query))
                .then(async ({ data }) => {
                const result = data[0];
                if (!result)
                    return void M.reply((0, lib_1.t)('weeb_manga_not_found', lang, { query }));
                let text = `🎀 *Title:* ${result.title}\n🎋 *Format:* ${result.type}\n📈 *Status:* ${this.client.utils.capitalize(result.status.toLowerCase().replace(/\_/g, ' '))}\n🍥 *Total chapters:* ${result.chapters}\n🎈 *Total volumes:* ${result.volumes}\n🧧 *Genres:* ${result.genres.map((genre) => genre.name).join(', ')}\n💫 *Published on:* ${result.published.from}\n🎗 *Ended on:* ${result.published.to}\n🎐 *Popularity:* ${result.popularity}\n🎏 *Favorites:* ${result.favorites}\n🏅 *Rank:* ${result.rank}\n\n`;
                if (result.background !== null)
                    text += `🎆 *Background:* ${result.background}\n\n`;
                text += `❄ *Description:* ${result.synopsis}`;
                const image = await this.client.utils.getBuffer(result.images.jpg.large_image_url);
                return void (await M.reply(image, 'image', undefined, undefined, text, undefined, {
                    title: result.title,
                    mediaType: 1,
                    thumbnail: image,
                    sourceUrl: result.url
                }));
            })
                .catch((error) => {
                console.error(`[Manga] Failed to fetch manga for "${query}":`, error?.message);
                return void M.reply((0, lib_1.t)('weeb_manga_not_found', lang, { query }));
            });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('manga', {
        description: 'Searches a manga of the given query in MyAnimeList',
        category: 'weeb',
        exp: 10,
        usage: 'manga [query]',
        cooldown: 20
    })
], default_1);
exports.default = default_1;
