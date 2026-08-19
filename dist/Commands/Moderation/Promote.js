"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const Message_1 = require("../../Structures/Message");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            if (!M.groupMetadata)
                return void M.reply('❌ Try Again!');
            const isAdmin = M.sender.isAdmin;
            const isMod = this.client.config.mods.includes(M.sender.jid);
            if (!isAdmin && !isMod)
                return void M.reply(`❌ *Sirf admins use kar sakte hain!*\n\n` +
                    `📢 *How to use:* \`${prefix}promote @user\``);
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            if (!users.length)
                return void M.reply(`❌ Kisi ko tag ya quote karo!\n\n` +
                    `📢 *How to use:* \`${prefix}promote @user\``);
            const mentioned = users;
            let text = `📈 *PROMOTE RESULTS* 📈\n${'─'.repeat(20)}\n`;
            let anyChanged = false;
            for (const user of users) {
                if (M.groupMetadata.admins?.includes(user)) {
                    text += `\n⚠️ Skipped @${user.split('@')[0]} — pehle se admin hai`;
                    continue;
                }
                try {
                    await this.client.groupParticipantsUpdate(M.from, [user], 'promote');
                    text += `\n✅ Promoted @${user.split('@')[0]} to admin`;
                    anyChanged = true;
                }
                catch {
                    text += `\n❌ @${user.split('@')[0]} promote nahi hua`;
                }
            }
            // Clear cached admin list so the newly promoted user is recognised immediately
            if (anyChanged)
                Message_1.Message.clearGroupMetaCache(M.from);
            text += `\n\n📢 *How to use:* \`${prefix}promote @user\``;
            return void M.reply(text, 'text', undefined, undefined, undefined, mentioned);
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('promote', {
        description: 'Promote a member to admin 📈',
        category: 'moderation',
        usage: 'promote [@user / quote user]',
        exp: 10,
        cooldown: 10,
        adminRequired: true
    })
], command);
exports.default = command;
