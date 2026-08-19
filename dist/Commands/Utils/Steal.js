"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const wa_sticker_formatter_1 = require("wa-sticker-formatter");
const os_1 = require("os");
const fs_extra_1 = require("fs-extra");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { flags, context }) => {
            if (!M.quoted || M.quoted.type !== 'stickerMessage')
                return void M.reply('Sticker?');
            const pack = context.split('|');
            const buffer = await M.downloadMediaMessage(M.quoted.message);
            const filename = `${(0, os_1.tmpdir)()}/${Math.random().toString(36)}.webp`;
            const getQuality = () => {
                const qualityFlag = context.match(/--(\d+)/g) || '';
                return qualityFlag.length
                    ? parseInt(qualityFlag[0].split('--')[1], 10)
                    : flags.includes('--broke')
                        ? 1
                        : flags.includes('--low')
                            ? 10
                            : flags.includes('--high')
                                ? 100
                                : 50;
            };
            let quality = getQuality();
            if (quality > 100 || quality < 1)
                quality = 50;
            flags.forEach((flag) => (context = context.replace(flag, '')));
            const getOptions = () => {
                const categories = (() => {
                    const categories = flags.reduce((categories, flag) => {
                        switch (flag) {
                            case '--angry':
                                categories.push('💢');
                                break;
                            case '--love':
                                categories.push('💕');
                                break;
                            case '--sad':
                                categories.push('😭');
                                break;
                            case '--happy':
                                categories.push('😂');
                                break;
                            case '--greet':
                                categories.push('👋');
                                break;
                            case '--celebrate':
                                categories.push('🎊');
                                break;
                        }
                        return categories;
                    }, new Array());
                    categories.length = 2;
                    if (!categories[0])
                        categories.push('❤', '🌹');
                    return categories;
                })();
                return {
                    categories,
                    pack: pack[1]?.trim() || '🎴 Sticker',
                    author: pack[2]?.trim() || M.sender.username,
                    quality,
                    type: wa_sticker_formatter_1.StickerTypes[flags.includes('--crop') || flags.includes('--c')
                        ? 'CROPPED'
                        : flags.includes('--stretch') || flags.includes('--s')
                            ? 'DEFAULT'
                            : 'FULL']
                };
            };
            flags.forEach((flag) => (context = context.replace(flag, '')));
            const sticker = await new wa_sticker_formatter_1.Sticker(buffer, getOptions()).build();
            await (0, fs_extra_1.writeFile)(filename, sticker);
            const result = await (0, fs_extra_1.readFile)(filename);
            await (0, fs_extra_1.unlink)(filename);
            return void (await M.reply(result, 'sticker'));
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('steal', {
        description: 'Steal a sticker or media from a quoted message',
        category: 'utils',
        usage: 'steal',
        exp: 10,
        cooldown: 15
    })
], command);
exports.default = command;
