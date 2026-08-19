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
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            const target = users.length ? users[0] : M.sender.jid;
            const data = await Warning_1.warningSchema.findOne({ groupJid: M.from, userJid: target });
            if (!data || data.count === 0)
                return void M.reply(`✅ @${target.split('@')[0]} ke koi warnings nahi hain is group mein!\n\n` +
                    `📢 *How to use:* \`${prefix}warnings @user\``, 'text', undefined, undefined, undefined, [target]);
            const reasonsList = data.reasons.map((r, i) => `  ${i + 1}. ${r}`).join('\n');
            return void M.reply(`📋 *WARNINGS* 📋\n` +
                `${'─'.repeat(25)}\n\n` +
                `👤 *User:* @${target.split('@')[0]}\n` +
                `⚠️ *Total:* ${data.count}/3\n\n` +
                `📝 *Reasons:*\n${reasonsList}\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}warnings @user\``, 'text', undefined, undefined, undefined, [target]);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('warnings', {
        description: 'Check warnings of a user in the group 📋',
        category: 'moderation',
        usage: 'warnings [@user / quote user]',
        aliases: ['warnlist', 'checkwarn'],
        cooldown: 5,
        exp: 10
    })
], default_1);
exports.default = default_1;
