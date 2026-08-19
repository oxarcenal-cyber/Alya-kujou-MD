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
                return void M.reply(`❌ *Sirf admins use kar sakte hain!*\n\n` +
                    `📢 *How to use:* \`${prefix}antilink on/off\``);
            const data = await this.client.DB.getGroup(M.from);
            const current = data.mods; // mods field = antilink in this bot
            if (!context.trim()) {
                const status = current ? '🟢 *ON*' : '🔴 *OFF*';
                return void M.reply(`🔗 *ANTILINK*\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `📌 *Status:* ${status}\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}antilink on\` → Enable karo\n` +
                    `  \`${prefix}antilink off\` → Disable karo\n\n` +
                    `_Jab ON ho, group invite links share karne par member auto-remove hoga.\n` +
                    `(Bot ko admin hona zaroori hai)_`);
            }
            const input = context.trim().toLowerCase();
            if (input !== 'on' && input !== 'off')
                return void M.reply(`❌ *on* ya *off* likho!\n\n📢 *How to use:*\n  \`${prefix}antilink on\`\n  \`${prefix}antilink off\``);
            const newValue = input === 'on';
            if (newValue === current)
                return void M.reply(`🟨 Antilink already *${input.toUpperCase()}* hai!`);
            await this.client.DB.updateGroup(M.from, 'mods', newValue);
            return void M.reply(newValue
                ? `🟢 *ANTILINK ON!*\n\n🔗 Ab group invite links share karna banned hai!\n⚠️ Bot ko admin banana zaroori hai.\n\n📢 Off karne ke liye: \`${prefix}antilink off\``
                : `🔴 *ANTILINK OFF!*\n\nLinks allow hain ab.\n\n📢 On karne ke liye: \`${prefix}antilink on\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('antilink', {
        description: 'Enable/disable anti-invite-link feature 🔗',
        category: 'moderation',
        usage: 'antilink on || antilink off || antilink',
        aliases: ['al'],
        cooldown: 5,
        exp: 15,
        adminRequired: true
    })
], default_1);
exports.default = default_1;
