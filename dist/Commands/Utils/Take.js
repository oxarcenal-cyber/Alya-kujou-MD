"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const wa_sticker_formatter_1 = require("wa-sticker-formatter");
const Structures_1 = require("../../Structures");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { flags, context }) => {
            let buffer;
            if (M.quoted?.message?.stickerMessage)
                buffer = await await M.downloadMediaMessage(M.quoted.message);
            if (!buffer)
                return void M.reply('Provide a sticker to format, Baka!');
            flags.forEach((flag) => (context = context.replace(flag, '')));
            const numbersFlag = this.client.utils
                .extractNumbers(flags.join(' ').replace(/\--/g, ''))
                .filter((number) => number > 0 && number <= 100);
            const quality = numbersFlag[0] || this.getQualityFromType(flags.filter((flag) => this.qualityTypes.includes(flag))) || 50;
            const categories = this.getStickerEmojisFromCategories(flags);
            const pack = context.split('|');
            const sticker = new wa_sticker_formatter_1.Sticker(buffer, {
                categories,
                pack: pack[1] ? pack[1].trim() : 'Stealed By',
                author: pack[2] ? pack[2].trim() : M.sender.username,
                quality,
                type: flags.includes('--c') || flags.includes('--crop') || flags.includes('--cropped')
                    ? 'crop'
                    : flags.includes('--s') || flags.includes('--stretch') || flags.includes('--stretched')
                        ? 'default'
                        : flags.includes('--circle') ||
                            flags.includes('--r') ||
                            flags.includes('--round') ||
                            flags.includes('--rounded')
                            ? 'circle'
                            : 'full'
            });
            return void (await M.reply(await sticker.build(), 'sticker'));
        };
        this.qualityTypes = ['--low', '--broke', '--medium', '--high'];
        this.getQualityFromType = (types) => {
            if (!types[0])
                return;
            for (const type of types) {
                switch (type) {
                    case '--broke':
                        return 1;
                    case '--low':
                        return 10;
                    case '--medium':
                        return 50;
                    case '--high':
                        return 100;
                }
            }
        };
        this.getStickerEmojisFromCategories = (flags) => {
            const categories = [];
            for (const flag of flags) {
                if (categories.length >= 3)
                    return categories;
                switch (flag) {
                    case '--angry':
                        categories.push('💢');
                        break;
                    case '--happy':
                        categories.push('😄');
                        break;
                    case '--sad':
                        categories.push('😭');
                        break;
                    case '--love':
                        categories.push('❤️');
                        break;
                    case '--celebrate':
                        categories.push('🎉');
                        break;
                    case '--greet':
                        categories.push('👋');
                        break;
                }
            }
            if (categories.length < 1)
                categories.push('✨', '💗');
            return categories;
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('take', {
        description: 'Format the given stickers',
        category: 'utils',
        exp: 15,
        cooldown: 10,
        usage: 'take [quote sticker message [options] | <pack> | <author>',
        aliases: ['repack']
    })
], default_1);
exports.default = default_1;
