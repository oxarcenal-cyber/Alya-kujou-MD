"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const Warning_1 = require("../../Database/Models/Warning");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            if (!M.groupMetadata)
                return void M.reply('❌ Ye command sirf groups mein use hoti hai!');
            const isAdmin = M.sender.isAdmin;
            const isMod = this.client.config.mods.includes(M.sender.jid);
            if (!isAdmin && !isMod)
                return void M.reply(`❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* \`${prefix}clearwarn @user\``);
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            if (!users.length)
                return void M.reply(`❌ Kisi ko tag ya quote karo!\n\n📢 *How to use:* \`${prefix}clearwarn @user\``);
            const target = users[0];
            await Warning_1.warningSchema.deleteOne({ groupJid: M.from, userJid: target });
            return void M.reply(`✅ *WARNINGS CLEARED* ✅\n` +
                `${'─'.repeat(25)}\n\n` +
                `👤 *User:* @${target.split('@')[0]}\n` +
                `🧹 *Saari warnings hata di gayi!*\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}clearwarn @user\``, 'text', undefined, undefined, undefined, [target]);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('clearwarn', {
        description: 'Clear all warnings of a user ✅',
        category: 'moderation',
        usage: 'clearwarn [@user / quote user]',
        aliases: ['resetwarn', 'cwarn'],
        cooldown: 5,
        exp: 10,
        adminRequired: true
    })
], default_1);
exports.default = default_1;
