"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const baileys_1 = require("@adiwajshing/baileys");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }, arr = []) => {
            try {
                let type = 'text';
                let buffer;
                if (M.hasSupportedMediaMessage) {
                    if (M.type === 'imageMessage')
                        type = 'image';
                    if (M.type === 'videoMessage')
                        type = 'video';
                    buffer = await M.downloadMediaMessage(M.message.message);
                }
                else if (!M.hasSupportedMediaMessage && M.quoted && M.quoted.hasSupportedMediaMessage) {
                    if (M.quoted.type === 'imageMessage')
                        type = 'image';
                    if (M.quoted.type === 'videoMessage')
                        type = 'video';
                    buffer = await M.downloadMediaMessage(M.quoted.message);
                }
                let caption;
                if ((!context && !M.quoted?.content) || (!context && M.quoted?.content === ''))
                    return void M.reply('🟥 *Provide the text to be broadcasted*');
                if (context)
                    caption = context.trim();
                else
                    caption = M.quoted?.content.trim();
                if (!arr.length)
                    arr = await this.client.getAllGroups();
                const text = `💰🏮 CELESTIC BROADCAST 💰🏮\n\n🎉 *Author:* ${M.sender.username}\n\n🎋 *Message* ${caption}`;
                for (const group of arr) {
                    await (0, baileys_1.delay)(5000);
                    await this.client.sendMessage(group, {
                        [type]: type === 'text' ? text : buffer,
                        caption: type === 'text' ? undefined : text,
                        gifPlayback: type === 'video' ? true : undefined
                    });
                    arr.splice(arr.indexOf(group), 1);
                }
                return void M.reply('Done!');
            }
            catch {
                return await this.execute(M, { context, flags: [], args: [] }, arr);
            }
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('broadcast', {
        description: 'Send a broadcast message to all groups',
        aliases: ['bc'],
        category: 'dev',
        usage: 'broadcast <message>'
    })
], command);
exports.default = command;
