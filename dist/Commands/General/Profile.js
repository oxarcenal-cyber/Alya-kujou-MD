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
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            while (users.length < 1)
                users.push(M.sender.jid);
            const user = users[0];
            const username = user === M.sender.jid ? M.sender.username : (this.client.contact.getContact(user)?.username ?? user.split('@')[0]);
            let pfpUrl;
            try {
                pfpUrl = await this.client.profilePictureUrl(user, 'image');
            }
            catch {
                pfpUrl = undefined;
            }
            const pfp = pfpUrl ? await this.client.utils.getBuffer(pfpUrl) : this.client.assets.get('404');
            let bio;
            try {
                const statusResult = await this.client.fetchStatus(user);
                bio = statusResult?.[0]?.['status'] || '';
            }
            catch (error) {
                bio = '';
            }
            const { banned, experience, level, tag } = await this.client.DB.getUser(user);
            const admin = this.client.utils.capitalize(`${M.groupMetadata?.admins?.includes(user) || false}`);
            const { rank } = (0, lib_1.getStats)(level);
            return void M.reply(pfp, 'image', undefined, undefined, `🏮 *Username:* ${username}#${tag}\n\n🎫 *Bio:* ${bio}\n\n🌟 *Experience:* ${experience}\n\n🥇 *Rank:* ${rank}\n\n🍀 *Level:* ${level}\n\n👑 *Admin:* ${admin}\n\n🟥 *Banned:* ${this.client.utils.capitalize(`${banned || false}`)}`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('profile', {
        description: "Displays user's profile",
        category: 'general',
        aliases: ['p'],
        cooldown: 15,
        exp: 30,
        usage: 'profile [tag/quote users]'
    })
], default_1);
exports.default = default_1;
