"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const BadgeList_1 = require("../../lib/BadgeList");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            if (!M.mentioned.length)
                return void M.reply(`💍 *MARRY*\n` +
                    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                    `❌ Please tag someone to propose to!\n\n` +
                    `📖 *How to use:*\n` +
                    `\`${prefix}marry @username\`\n\n` +
                    `_Example: ${prefix}marry @john_`);
            const targetJid = M.mentioned[0];
            const botJid = this.client.correctJid(this.client.user?.id || '');
            if (this.client.correctJid(targetJid) === botJid)
                return void M.reply(`💔 Aww I'm flattered but I can't marry you~ I'm just a bot! 😅`);
            if (this.client.correctJid(targetJid) === M.sender.jid)
                return void M.reply(`😅 You can't marry yourself... try tagging someone else!`);
            const senderData = await this.client.DB.getUser(M.sender.jid);
            if (senderData.partner)
                return void M.reply(`💍 You're already married to @${senderData.partner.split('@')[0]}!\n` +
                    `Use \`${prefix}divorce\` first if you want to remarry.`, 'text', undefined, undefined, undefined, [senderData.partner]);
            const targetData = await this.client.DB.getUser(targetJid);
            if (targetData.partner)
                return void M.reply(`💔 @${targetJid.split('@')[0]} is already married to someone else!`, 'text', undefined, undefined, undefined, [targetJid]);
            // Set marriage
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { partner: targetJid } });
            await this.client.DB.user.updateOne({ jid: targetJid }, { $set: { partner: M.sender.jid } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            this.client.DB.cacheInvalidate(`user:${targetJid}`);
            // Award badges
            await (0, BadgeList_1.checkAndAwardBadges)(M.sender.jid, this.client.DB);
            await (0, BadgeList_1.checkAndAwardBadges)(targetJid, this.client.DB);
            return void M.reply(`💍 *CONGRATULATIONS!* 💍\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `💒 *@${M.sender.username}* and *@${targetJid.split('@')[0]}* are now *officially married!* 🥂\n\n` +
                `🌹 May your journey together be filled with happiness!\n` +
                `🎁 Both of you earned the *💍 Taken* badge!\n\n` +
                `_Use \`${prefix}spouse\` to view your partner's profile_`, 'text', undefined, undefined, undefined, [M.sender.jid, targetJid]);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('marry', {
        description: 'Propose to another user and get married 💍',
        aliases: ['propose'],
        usage: 'marry @user',
        cooldown: 10,
        exp: 20,
        category: 'general',
        dm: false
    })
], default_1);
exports.default = default_1;
