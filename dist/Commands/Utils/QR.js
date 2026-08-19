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
            const prefix = this.client.config.prefix;
            if (!context.trim())
                return void M.reply((0, lib_1.t)('qr_usage', lang, { p: prefix }));
            const text = context.trim();
            try {
                const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=400x400&format=png&margin=15`;
                const buffer = await this.client.utils.getBuffer(url);
                return void M.reply(buffer, 'image', undefined, undefined, `🔲 *QR CODE*\n\n📝 *Data:* ${text.length > 60 ? text.substring(0, 60) + '...' : text}\n\n📢 *How to use:* \`${prefix}qr <text/link>\``);
            }
            catch {
                return void M.reply((0, lib_1.t)('qr_error', lang, { p: prefix }));
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('qr', {
        description: 'Generate a QR code for any text or link 🔲',
        category: 'utils',
        usage: 'qr <text or link>',
        aliases: ['qrcode', 'qrgen'],
        cooldown: 10,
        exp: 15,
        dm: true
    })
], default_1);
exports.default = default_1;
