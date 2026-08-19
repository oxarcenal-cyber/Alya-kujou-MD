"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
const Structures_1 = require("../../Structures");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const lang = await this.getLang(M);
            if (!context)
                return void (await M.reply((0, lib_1.t)('media_lyrics_no_query', lang)));
            const term = context.trim();
            const lyrics = new lib_1.Lyrics();
            const data = await lyrics.search(term);
            if (!data.length)
                return void (await M.reply((0, lib_1.t)('media_lyrics_not_found', lang, { term })));
            const buffer = await this.client.utils.getBuffer(data[0].image);
            let text = `🌿 *Title:* ${data[0].title} *(${data[0].fullTitle})*\n🍥 *Artist:* ${data[0].artist}`;
            text += `\n\n${data[0].lyrics}`;
            return void (await M.reply(buffer, 'image', undefined, undefined, text, undefined, {
                title: data[0].title,
                body: data[0].fullTitle,
                thumbnail: buffer,
                sourceUrl: data[0].url,
                mediaType: 1,
                mediaUrl: data[0].url
            }));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('lyrics', {
        description: 'Sends the lyrics of a given song',
        usage: 'lyrics [song]',
        cooldown: 10,
        exp: 20,
        category: 'media'
    })
], default_1);
exports.default = default_1;
