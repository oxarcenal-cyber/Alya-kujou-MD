"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_chan_1 = require("@shineiichijo/canvas-chan");
const Structures_1 = require("../../Structures");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            let buffer;
            if (M.hasSupportedMediaMessage && Object.keys(M.message).includes('imageMessage'))
                buffer = await M.downloadMediaMessage(M.message.message);
            else if (M.mentioned.length) {
                let pfpUrl;
                try {
                    pfpUrl = await this.client.profilePictureUrl(M.mentioned[0], 'image');
                }
                catch (error) {
                    return void M.reply("Can't access to the tagged user's profile picture");
                }
                buffer = pfpUrl ? await this.client.utils.getBuffer(pfpUrl) : this.client.assets.get('404');
            }
            else if (M.quoted) {
                if (!M.quoted.hasSupportedMediaMessage) {
                    let pfpUrl;
                    try {
                        pfpUrl = await this.client.profilePictureUrl(M.quoted.sender.jid, 'image');
                    }
                    catch (error) {
                        return void M.reply("Can't access to the quoted user's profile picture");
                    }
                    buffer = pfpUrl ? await this.client.utils.getBuffer(pfpUrl) : this.client.assets.get('404');
                }
                else
                    buffer = await M.downloadMediaMessage(M.quoted.message);
            }
            else {
                let pfpUrl;
                try {
                    pfpUrl = await this.client.profilePictureUrl(M.sender.jid, 'image');
                }
                catch (error) {
                    return void M.reply("Can't access to the your profile picture");
                }
                buffer = pfpUrl ? await this.client.utils.getBuffer(pfpUrl) : this.client.assets.get('404');
            }
            return void (await M.reply(await new canvas_chan_1.Simp(buffer).build(), 'image'));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('simp', {
        description: 'Makes a person simp',
        cooldown: 15,
        usage: 'simp [tag/quote user || quote/caption image]',
        category: 'fun',
        exp: 10
    })
], default_1);
exports.default = default_1;
