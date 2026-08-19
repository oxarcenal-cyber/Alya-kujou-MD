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
                .withRetry(() => new marika_1.Character().searchCharacter(query))
                .then(async ({ data }) => {
                const chara = data[0];
                if (!chara)
                    return void M.reply((0, lib_1.t)('weeb_character_not_found', lang, { query }));
                let source = '';
                await this.client.utils
                    .withRetry(() => new marika_1.Character().getCharacterAnime(chara.mal_id))
                    .then((res) => (source = res.data[0].anime.title))
                    .catch(async () => {
                    await this.client.utils
                        .withRetry(() => new marika_1.Character().getCharacterManga(chara.mal_id.toString()))
                        .then((res) => (source = res.data[0].manga.title))
                        .catch(() => (source = ''));
                });
                let text = `💙 *Name:* ${chara.name}\n💚 *Nicknames:* ${chara.nicknames.join(', ')}\n💛 *Source:* ${source}`;
                if (chara.about !== null)
                    text += `\n\n❤ *Description:* ${chara.about}`;
                const image = await this.client.utils.getBuffer(chara.images.jpg.image_url);
                return void (await M.reply(image, 'image', undefined, undefined, text, undefined, {
                    title: chara.name,
                    mediaType: 1,
                    thumbnail: image,
                    sourceUrl: chara.url
                }));
            })
                .catch((error) => {
                console.error(`[Character] Failed to fetch character for "${query}":`, error?.message);
                return void M.reply((0, lib_1.t)('weeb_character_not_found', lang, { query }));
            });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('character', {
        description: 'Searches a character of the given query in MyAnimeList',
        usage: 'character [query]',
        category: 'weeb',
        aliases: ['chara'],
        exp: 20,
        cooldown: 15
    })
], default_1);
exports.default = default_1;
