"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
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
                return void M.reply(`❌ *Sirf admins rules set kar sakte hain!*\n\n` +
                    `📢 *How to use:* \`${prefix}setrules <rules>\``);
            if (!context.trim())
                return void M.reply(`📝 *SET GROUP RULES*\n\n` +
                    `Group ke rules set karo!\n\n` +
                    `📢 *How to use:*\n` +
                    `\`${prefix}setrules\n1. Spam mat karo\n2. Sab ka respect karo\n3. No NSFW\n4. Links allowed nahi\`\n\n` +
                    `_Rules dekhne ke liye: \`${prefix}rules\`_`);
            await this.client.DB.group.findOneAndUpdate({ jid: M.from }, { $set: { rules: context.trim() } }, { upsert: true });
            return void M.reply(`✅ *RULES SET!* ✅\n` +
                `${'─'.repeat(25)}\n\n` +
                `📜 *Rules:*\n${context.trim()}\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 Rules dekhne ke liye: \`${prefix}rules\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('setrules', {
        description: 'Set group rules — admin only 📝',
        category: 'moderation',
        usage: 'setrules <rules text>',
        aliases: ['srules', 'addrules'],
        cooldown: 10,
        exp: 10,
        adminRequired: true
    })
], default_1);
exports.default = default_1;
