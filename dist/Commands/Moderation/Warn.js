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
const MAX_WARNS = 3;
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            if (!M.groupMetadata)
                return void M.reply('❌ Ye command sirf groups mein use hoti hai!');
            const isAdmin = M.sender.isAdmin;
            const isMod = this.client.config.mods.includes(M.sender.jid);
            if (!isAdmin && !isMod)
                return void M.reply(`❌ *Sirf admins use kar sakte hain!*\n\n` +
                    `📢 *How to use:* \`${prefix}warn @user [reason]\``);
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            if (!users.length)
                return void M.reply(`❌ Kisi ko tag ya quote karo!\n\n` +
                    `📢 *How to use:* \`${prefix}warn @user spam kar raha tha\``);
            const target = users[0];
            if (target === M.sender.jid)
                return void M.reply('❌ Apne aap ko warn nahi kar sakte!');
            if (this.client.config.mods.includes(target))
                return void M.reply('❌ Mods ko warn nahi kar sakte!');
            if (M.groupMetadata.admins?.includes(target))
                return void M.reply('❌ Admins ko warn nahi kar sakte!');
            const reason = context.replace(/@\d+/g, '').trim() || 'No reason provided';
            const data = await Warning_1.warningSchema.findOneAndUpdate({ groupJid: M.from, userJid: target }, { $inc: { count: 1 }, $push: { reasons: reason } }, { upsert: true, new: true });
            const count = data?.count || 1;
            let actionText = '';
            if (count >= MAX_WARNS) {
                try {
                    await this.client.groupParticipantsUpdate(M.from, [target], 'remove');
                    await Warning_1.warningSchema.deleteOne({ groupJid: M.from, userJid: target });
                    actionText = `\n\n🚫 *${MAX_WARNS} warnings pe auto-remove kar diya!*`;
                }
                catch {
                    actionText = `\n\n⚠️ ${MAX_WARNS} warnings ho gayi! Bot admin hona chahiye auto-remove ke liye.`;
                }
            }
            return void M.reply(`⚠️ *WARNING* ⚠️\n` +
                `${'─'.repeat(25)}\n\n` +
                `👤 *User:* @${target.split('@')[0]}\n` +
                `⚠️ *Warnings:* ${count}/${MAX_WARNS}\n` +
                `📝 *Reason:* ${reason}\n` +
                `🛡️ *By:* @${M.sender.jid.split('@')[0]}` +
                actionText + `\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}warn @user [reason]\``, 'text', undefined, undefined, undefined, [target, M.sender.jid]);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('warn', {
        description: 'Warn a user in the group ⚠️ (3 warnings = auto-remove)',
        category: 'moderation',
        usage: 'warn [@user / quote user] [reason]',
        aliases: ['warning'],
        cooldown: 5,
        exp: 10,
        adminRequired: true
    })
], default_1);
exports.default = default_1;
