"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
const UA = 'AlYaMD/7.0.0';
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const lang = await this.getLang(M);
            const res = await axios_1.default.get('https://nekos.best/api/v2/waifu', { headers: { 'User-Agent': UA }, timeout: 10000 }).catch(() => null);
            if (!res?.data?.results?.[0]?.url)
                return void (await M.reply((0, lib_1.t)('weeb_fetch_error', lang)));
            const url = res.data.results[0].url;
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
    (0, Structures_1.Command)('waifu', {
        description: 'Sends a random waifu image',
        category: 'weeb',
        usage: 'waifu',
        exp: 10,
        cooldown: 5
    })
], default_1);
exports.default = default_1;
