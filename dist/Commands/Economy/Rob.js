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
            if (M.from === this.client.config.casinoGroup)
                return void M.reply("❌ Is group mein rob nahi kar sakte!");
            const time = 900000;
            const { lastRob: cd } = await this.client.DB.getUser(M.sender.jid);
            if (time - (Date.now() - cd) > 0) {
                const left = Math.ceil((time - (Date.now() - cd)) / 60000);
                return void M.reply(`⏳ Rob cooldown chal raha hai!\n\n` +
                    `🕐 *${left} minute* baad try karo.\n\n` +
                    `📢 *How to use:* \`${prefix}rob @user\``);
            }
            // ── Resolve target — raw JID for mentions, correctJid for DB ──────────────
            const rawSource = M.quoted && M.mentioned.length === 0
                ? M.quoted.sender.jid // quoted.sender.jid is already phone-format
                : M.mentioned[0] || '';
            const target = this.client.correctJid(rawSource); // for DB
            const rawTarget = rawSource; // for mentions[] notification
            if (!target || target === M.sender.jid)
                return void M.reply(`❌ Kisi ko tag ya quote karo rob karne ke liye!\n\n` +
                    `📢 *How to use:* \`${prefix}rob @user\``);
            const { wallet } = await this.client.DB.getUser(M.sender.jid);
            const { wallet: Wallet } = await this.client.DB.getUser(target);
            if (Wallet < 250)
                return void M.reply(`❌ Us user ke wallet mein itne gold nahi hain rob karne ke liye!`);
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { lastRob: Date.now() } });
            const success = Math.random() < 0.1; // 10% chance
            let targetAmount = Math.min(Math.floor(Math.random() * (Wallet - 250) + 250), 10000);
            let userAmount = Math.min(Math.floor(Math.random() * (wallet - 250) + 250), 10000);
            // Use raw num for @mention text, raw JID for mentions array
            const senderNum = M.sender.jid.split('@')[0].split(':')[0];
            const targetNum = rawTarget.split('@')[0].split(':')[0];
            if (success) {
                await this.client.DB.setCrystal(M.sender.jid, targetAmount);
                await this.client.DB.setCrystal(target, -targetAmount);
                return void M.reply(`🦹 *ROB SUCCESSFUL!*\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `@${senderNum} ne @${targetNum} se *${targetAmount} Gold* chura liye!\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 *How to use:* \`${prefix}rob @user\``, 'text', undefined, undefined, undefined, [M.sender.jid, rawTarget]);
            }
            else {
                await this.client.DB.setCrystal(M.sender.jid, -userAmount);
                await this.client.DB.setCrystal(target, userAmount);
                return void M.reply(`🚔 *CAUGHT!*\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `@${senderNum} pakda gaya aur @${targetNum} ko *${userAmount} Gold* dena pada!\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 *How to use:* \`${prefix}rob @user\``, 'text', undefined, undefined, undefined, [M.sender.jid, rawTarget]);
            }
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('rob', {
        description: 'Try to rob gold from another user (risky!) 🦹',
        category: 'economy',
        usage: 'rob [@user / quote user]',
        exp: 10,
        cooldown: 900
    })
], command);
exports.default = command;
