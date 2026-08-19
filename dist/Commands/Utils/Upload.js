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
            if (!M.hasSupportedMediaMessage && !M.quoted?.hasSupportedMediaMessage)
                return void M.reply('Provide an image/gif/video by captioning it as a message or by quoting it');
            let buffer;
            if (M.hasSupportedMediaMessage)
                buffer = await M.downloadMediaMessage(M.message.message);
            else if (M.quoted && M.quoted.hasSupportedMediaMessage)
                buffer = await M.downloadMediaMessage(M.quoted.message);
            try {
                const result = await this.client.utils.bufferToUrl(buffer);
                return void (await M.reply(`*Media Uploaded To Telegraph* \n\n*Link:* ${result}`));
            }
            catch (error) {
                return void (await M.reply('An error occurred. Try again later'));
            }
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('upload', {
        description: 'convert media to direct links limit 5MB for media.',
        category: 'utils',
        usage: 'upload [provide image/video/gif the message you want to upload]',
        aliases: ['tourl'],
        exp: 20,
        cooldown: 3
    })
], command);
exports.default = command;
