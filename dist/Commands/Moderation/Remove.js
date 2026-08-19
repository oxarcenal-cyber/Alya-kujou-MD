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
            const prefix = this.client.config.prefix;
            if (!M.groupMetadata)
                return void M.reply('❌ Try Again!');
            const isAdmin = M.sender.isAdmin;
            const isMod = this.client.config.mods.includes(M.sender.jid);
            if (!isAdmin && !isMod)
                return void M.reply(`❌ *Sirf admins use kar sakte hain!*\n\n` +
                    `📢 *How to use:* \`${prefix}remove @user\``);
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            if (!users.length)
                return void M.reply(`❌ Kisi ko tag ya quote karo!\n\n` +
                    `📢 *How to use:* \`${prefix}remove @user\``);
            const mentioned = users;
            let text = `🚫 *REMOVE RESULTS* 🚫\n${'─'.repeat(20)}\n`;
            for (const user of users) {
                if (user === M.groupMetadata.owner) {
                    text += `\n⚠️ Skipped @${user.split('@')[0]} — group owner hai`;
                    continue;
                }
                try {
                    await this.client.groupParticipantsUpdate(M.from, [user], 'remove');
                    text += `\n✅ Removed @${user.split('@')[0]}`;
                }
                catch {
                    text += `\n❌ @${user.split('@')[0]} remove nahi hua`;
                }
            }
            text += `\n\n📢 *How to use:* \`${prefix}remove @user\``;
            return void M.reply(text, 'text', undefined, undefined, undefined, mentioned);
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('remove', {
        description: 'Remove a user from the group 🚫',
        category: 'moderation',
        usage: 'remove [@user / quote user]',
        cooldown: 10,
        exp: 10,
        adminRequired: true
    })
], command);
exports.default = command;
