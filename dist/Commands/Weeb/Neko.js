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
            const data = await this.client.utils.fetch('https://nekos.life/api/v2/img/neko');
            if (!data?.url)
                return void (await M.reply((0, lib_1.t)('weeb_fetch_error', lang)));
            const url = data.url;
            const buffer = await this.client.utils.getBuffer(url);
            if (url.toLowerCase().endsWith('.gif')) {
                const mp4 = await this.client.utils.gifToMp4(buffer);
                return void await this.client.sendMessage(M.from, { video: mp4, gifPlayback: true, mimetype: 'video/mp4' });
            }
            return void (await M.reply(buffer, 'image'));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('neko', {
        description: 'Sends a random neko image',
        category: 'weeb',
        usage: 'neko',
        exp: 20,
        cooldown: 5
    })
], default_1);
exports.default = default_1;
