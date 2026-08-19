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
        this.execute = async (M) => {
            const lang = await this.getLang(M);
            M.urls = M.urls.filter((url) => url.includes('open.spotify.com'));
            if (!M.urls.length)
                return void M.reply((0, lib_1.t)('media_spotify_no_url', lang));
            const spotify = new lib_1.Spotify(M.urls[0]);
            const info = await spotify.getInfo();
            if (info.error)
                return void M.reply((0, lib_1.t)('media_spotify_invalid', lang));
            const { name, artists, album_name, release_date, cover_url } = info;
            const text = `🎧 *Title:* ${name || ''}\n🎤 *Artists:* ${(artists || []).join(',')}\n💽 *Album:* ${album_name}\n📆 *Release Date:* ${release_date || ''}`;
            await M.reply(await this.client.utils.getBuffer(cover_url), 'image', undefined, undefined, text);
            const buffer = await spotify.download();
            return void (await M.reply(buffer, 'audio'));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('spotify', {
        description: 'Downloads and sends the track of the given spotify track URL',
        aliases: ['sp'],
        usage: 'spotify [track_url]',
        cooldown: 10,
        category: 'media',
        exp: 25
    })
], default_1);
exports.default = default_1;
