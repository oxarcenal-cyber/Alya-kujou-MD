"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pendingGives = void 0;
const Structures_1 = require("../../Structures");
exports.pendingGives = new Map();
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const botJid = this.client.correctJid(this.client.user?.id || '');
            // ── Resolve target users ──────────────────────────────────────────────────
            // rawUsers: raw JIDs for mentions[] — NEVER transform these for mention sends
            // normUsers: correctJid for DB operations
            const rawUsers = [...M.mentioned];
            const normUsers = rawUsers.map(j => this.client.correctJid(j));
            if (M.quoted) {
                const qJid = this.client.correctJid(M.quoted.sender.jid);
                // Skip if the quoted message is from the bot itself (list-response quote)
                if (qJid !== botJid && !normUsers.includes(qJid)) {
                    rawUsers.push(M.quoted.sender.jid); // quoted.sender.jid is already phone-format
                    normUsers.push(qJid);
                }
            }
            // ─── CASE A: Amount given but NO user → check pending list-selection ──────
            // Triggered when user taps an amount from the list button (e.g. `!give 100`)
            if (normUsers.length === 0 && M.numbers.length >= 1) {
                const pending = exports.pendingGives.get(M.sender.jid);
                if (pending && Date.now() < pending.expiresAt) {
                    exports.pendingGives.delete(M.sender.jid);
                    const user = pending.recipientJid; // DB
                    const rawUser = pending.rawRecipientJid; // mentions
                    const amount = M.numbers[0];
                    if (amount <= 0)
                        return void M.reply(`*『 GIVE GOLD 』*\n\n` +
                            `❌ *Invalid Amount!*\n\n` +
                            `_Amount must be greater than 0_ 💀`);
                    const { wallet } = await this.client.DB.getUser(M.sender.jid);
                    if (wallet < amount)
                        return void M.reply(`*『 GIVE GOLD 』*\n\n` +
                            `❌ *Insufficient Balance!*\n` +
                            `💎 *Your Wallet:* ${wallet.toLocaleString()} Gold\n\n` +
                            `_You don't have enough gold for this transfer_ 💀`);
                    await this.client.DB.setCrystal(M.sender.jid, -amount);
                    await this.client.DB.setCrystal(user, amount);
                    const sNum = M.sender.jid.split('@')[0].split(':')[0];
                    const rNum = rawUser.split('@')[0].split(':')[0];
                    const now1 = new Date();
                    const date1 = now1.toLocaleString('en-GB', { day: '2-digit', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
                    return void M.reply(`*『 GOLD TRANSFER 』*\n\n` +
                        `🎁 *From:*\n• @${sNum}\n\n` +
                        `🎯 *To:*\n• @${rNum}\n\n` +
                        `💰 *Amount:* ${amount.toLocaleString()} Gold\n` +
                        `📅 *Date:* ${date1}\n\n` +
                        `_Gold has been transferred successfully_ ✨`, 'text', undefined, undefined, undefined, [M.sender.jid, rawUser]);
                }
                // Pending expired or never existed → fall through to error
            }
            // ─── No user at all → show usage ──────────────────────────────────────────
            if (!normUsers.length)
                return void M.reply(`*『 GIVE GOLD 』*\n\n` +
                    `❌ *No recipient found!*\n\n` +
                    `📌 *How to Use:*\n` +
                    `• \`${prefix}give @user 500\`  — direct amount\n` +
                    `• \`${prefix}give @user\`  — pick from menu\n` +
                    `• Reply to a message + \`${prefix}give\`\n\n` +
                    `_Tag or quote someone to transfer gold_ 💡`);
            const rawUser = rawUsers[0];
            const user = normUsers[0];
            if (user === this.client.correctJid(M.sender.jid))
                return void M.reply(`*『 GIVE GOLD 』*\n\n` +
                    `❌ *You cannot send gold to yourself!*\n\n` +
                    `_Tag another user to transfer gold_ 💡`);
            // ─── CASE B: User + Amount given → direct transfer ────────────────────────
            if (M.numbers.length >= 1) {
                const amount = M.numbers[0];
                if (amount <= 0)
                    return void M.reply(`*『 GIVE GOLD 』*\n\n` +
                        `❌ *Invalid Amount!*\n\n` +
                        `_Amount must be greater than 0_ 💀`);
                const { wallet } = await this.client.DB.getUser(M.sender.jid);
                if (wallet < amount)
                    return void M.reply(`*『 GIVE GOLD 』*\n\n` +
                        `❌ *Insufficient Balance!*\n` +
                        `💎 *Your Wallet:* ${wallet.toLocaleString()} Gold\n\n` +
                        `_You don't have enough gold for this transfer_ 💀`);
                await this.client.DB.setCrystal(M.sender.jid, -amount);
                await this.client.DB.setCrystal(user, amount);
                const now2 = new Date();
                const date2 = now2.toLocaleString('en-GB', { day: '2-digit', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
                const sNum = M.sender.jid.split('@')[0].split(':')[0];
                const rNum = rawUser.split('@')[0].split(':')[0];
                return void M.reply(`*『 GOLD TRANSFER 』*\n\n` +
                    `🎁 *From:*\n• @${sNum}\n\n` +
                    `🎯 *To:*\n• @${rNum}\n\n` +
                    `💰 *Amount:* ${amount.toLocaleString()} Gold\n` +
                    `📅 *Date:* ${date2}\n\n` +
                    `_Gold has been transferred successfully_ ✨`, 'text', undefined, undefined, undefined, [M.sender.jid, rawUser]);
            }
            // ─── CASE C: User given but NO amount → save pending + show list menu ─────
            exports.pendingGives.set(M.sender.jid, {
                recipientJid: user, // correctJid for DB
                rawRecipientJid: rawUser, // raw JID for mentions
                expiresAt: Date.now() + 2 * 60 * 1000 // 2 minutes TTL
            });
            const rNum = rawUser.split('@')[0].split(':')[0];
            return void await this.client.sendMessage(M.from, {
                text: `*『 GIVE GOLD 』*\n\n` +
                    `🎯 *Recipient:*\n• @${rNum}\n\n` +
                    `💳 *Select how much gold to send!*\n\n` +
                    `_Tap the menu below to choose an amount_ 👇`,
                footer: `⏳ Expires in 2 minutes`,
                mentions: [rawUser],
                buttons: [{
                        text: '『 💰 Select Amount 』',
                        sections: [{
                                title: '〔 GOLD GIFT — Choose Amount 〕',
                                rows: [
                                    { title: '💸 100 Gold', description: '🌱 Small Starter Gift', id: `${prefix}give 100` },
                                    { title: '✨ 500 Gold', description: '⚡ A Decent Offer', id: `${prefix}give 500` },
                                    { title: '🎁 1,000 Gold', description: '🌟 Nice & Generous Gift', id: `${prefix}give 1000` },
                                    { title: '🔥 5,000 Gold', description: '💎 Big Spender!', id: `${prefix}give 5000` },
                                    { title: '👑 10,000 Gold', description: '🏆 Ultimate Flex 🎉', id: `${prefix}give 10000` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('give', {
        category: 'economy',
        description: 'Give your gold to another user 💎',
        usage: 'give [@user / quote] [amount] — or use the menu!',
        exp: 25,
        cooldown: 35
    })
], command);
exports.default = command;
