"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            if (!M.quoted || (M.quoted && M.quoted.type !== 'stickerMessage'))
                return void M.reply('*Quote the sticker that you want to convert, Baka!*');
            const buffer = await M.downloadMediaMessage(M.quoted.message);
            const animated = M.quoted?.message?.stickerMessage?.isAnimated;
            try {
                const result = animated
                    ? await this.client.utils.webpToMp4(buffer)
                    : await this.client.utils.webpToPng(buffer);
                return void (await M.reply(result, animated ? 'video' : 'image', animated, animated ? 'video/mp4' : undefined));
            }
            catch (error) {
                return void (await M.reply('Conversion failed as animated stickers are not supported'));
            }
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('img', {
        description: 'Converts sticker to image',
        exp: 35,
        category: 'utils',
        aliases: ['toimg'],
        usage: 'img [quote_sticker]',
        cooldown: 25
    })
], command);
exports.default = command;
