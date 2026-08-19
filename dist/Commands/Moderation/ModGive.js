"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const pendingModGives = new Map();
let ModGiveCommand = class ModGiveCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args }) => {
            if (!M.sender.isMod)
                return void M.reply('❌ This command is for bot mods only!');
            const prefix = this.client.config.prefix;
            const botJid = this.client.correctJid(this.client.user?.id || '');
            // ── Resolve target user ──────────────────────────────────────────────────
            // rawUsers: raw JIDs for mentions[] — NEVER transform for mention sends
            // normUsers: correctJid for DB operations
            const rawUsers = [...M.mentioned];
            const normUsers = rawUsers.map(j => this.client.correctJid(j));
            if (M.quoted) {
                const qJid = this.client.correctJid(M.quoted.sender.jid);
                // Skip if quoted message is from the bot itself (list-response quote)
                if (qJid !== botJid && !normUsers.includes(qJid)) {
                    rawUsers.push(M.quoted.sender.jid);
                    normUsers.push(qJid);
                }
            }
            // ─── CASE A: No user but amount given → check pending list-selection ──────
            // Triggered when mod taps an amount from the list button (e.g. `!modgive 50000`)
            if (normUsers.length === 0) {
                const pending = pendingModGives.get(M.sender.jid);
                if (pending && Date.now() < pending.expiresAt) {
                    const cleanTokens = args.filter((a) => !a.startsWith('@') && !/^\d{10,15}$/.test(a) && a.trim() !== '');
                    const parseAmount = () => {
                        for (const tok of cleanTokens) {
                            if (/^-?\d+$/.test(tok)) {
                                const n = parseInt(tok, 10);
                                if (!isNaN(n))
                                    return n;
                            }
                        }
                        return M.numbers.find((n) => Math.abs(n) < 1000000000);
                    };
                    const amount = parseAmount();
                    if (amount !== undefined && amount !== 0) {
                        pendingModGives.delete(M.sender.jid);
                        const targetJid = pending.targetJid;
                        const rawTargetJid = pending.rawTargetJid;
                        const field = pending.field;
                        const targetNum = rawTargetJid.split('@')[0].split(':')[0];
                        const before = await this.client.DB.getUser(targetJid);
                        const oldBal = field === 'bank' ? before.bank : before.wallet;
                        await this.client.DB.setCrystal(targetJid, amount, field);
                        const updated = await this.client.DB.getUser(targetJid);
                        const newBal = field === 'bank' ? updated.bank : updated.wallet;
                        const emoji = amount > 0 ? '➕' : '➖';
                        const action = amount > 0 ? 'ADDED' : 'DEDUCTED';
                        return void M.reply(`${emoji} *GOLD ${action}!*\n` +
                            `${'─'.repeat(26)}\n\n` +
                            `👤 *User:*     @${targetNum}\n` +
                            `📍 *Field:*    ${field === 'bank' ? '🏦 Bank' : '💳 Wallet'}\n` +
                            `💸 *Amount:*   ${amount > 0 ? '+' : ''}${amount.toLocaleString()} 💰\n` +
                            `📊 *Before:*   ${oldBal.toLocaleString()} 💰\n` +
                            `💰 *After:*    ${newBal.toLocaleString()} 💰`, 'text', undefined, undefined, undefined, [rawTargetJid]);
                    }
                }
                // No pending state or no amount found
            }
            // ── No user mentioned at all → show usage ────────────────────────────────
            if (!normUsers.length)
                return void M.reply(`❓ *Kise gold dena hai?*\n\n` +
                    `💡 *Best:* Target ke message ko *Reply* karo\n` +
                    `💡 *Ya:*  WhatsApp @mention select karo\n\n` +
                    `📢 *Examples:*\n` +
                    `• Reply + \`${prefix}modgive 50000\`\n` +
                    `• \`${prefix}modgive @user 50000\`\n` +
                    `• \`${prefix}modgive @user 50000 bank\`\n` +
                    `• \`${prefix}modgive @user set 99999\`\n` +
                    `• \`${prefix}modgive @user reset\``);
            const rawTargetJid = rawUsers[0];
            const targetJid = normUsers[0];
            const targetNum = rawTargetJid.split('@')[0].split(':')[0];
            // ── Parse tokens (keywords + amounts) ───────────────────────────────────
            const cleanTokens = args.filter((a) => !a.startsWith('@') && !/^\d{10,15}$/.test(a) && a.trim() !== '');
            const hasReset = cleanTokens.some((t) => t.toLowerCase() === 'reset');
            const hasSet = cleanTokens.some((t) => t.toLowerCase() === 'set');
            const hasBank = cleanTokens.some((t) => t.toLowerCase() === 'bank');
            const field = hasBank ? 'bank' : 'wallet';
            const parseAmount = () => {
                for (const tok of cleanTokens) {
                    if (/^-?\d+$/.test(tok)) {
                        const n = parseInt(tok, 10);
                        if (!isNaN(n))
                            return n;
                    }
                }
                return M.numbers.find((n) => Math.abs(n) < 1000000000);
            };
            // ── RESET ───────────────────────────────────────────────────────────────
            if (hasReset) {
                await this.client.DB.getUser(targetJid);
                await this.client.DB.user.updateOne({ jid: targetJid }, { $set: { wallet: 0, bank: 0 } });
                this.client.DB.cacheInvalidate(`user:${targetJid}`);
                return void M.reply(`🗑️ *BALANCE RESET*\n` +
                    `${'─'.repeat(26)}\n\n` +
                    `👤 *User:* @${targetNum}\n` +
                    `💳 Wallet → *0 💰*\n` +
                    `🏦 Bank   → *0 💰*`, 'text', undefined, undefined, undefined, [rawTargetJid]);
            }
            // ── SET exact value ──────────────────────────────────────────────────────
            if (hasSet) {
                const setAmount = parseAmount();
                if (setAmount === undefined || isNaN(setAmount))
                    return void M.reply(`❌ *Amount likho!*\n\n` +
                        `📢 Usage: \`${prefix}modgive @user set <amount> [bank]\``);
                await this.client.DB.getUser(targetJid);
                await this.client.DB.user.updateOne({ jid: targetJid }, { $set: { [field]: setAmount } });
                this.client.DB.cacheInvalidate(`user:${targetJid}`);
                return void M.reply(`✏️ *BALANCE SET*\n` +
                    `${'─'.repeat(26)}\n\n` +
                    `👤 *User:*     @${targetNum}\n` +
                    `📍 *Field:*    ${hasBank ? '🏦 Bank' : '💳 Wallet'}\n` +
                    `💰 *New Val:*  ${setAmount.toLocaleString()} 💰`, 'text', undefined, undefined, undefined, [rawTargetJid]);
            }
            // ── ADD / DEDUCT — direct amount given ──────────────────────────────────
            const amount = parseAmount();
            if (amount !== undefined && amount !== 0) {
                const before = await this.client.DB.getUser(targetJid);
                const oldBal = hasBank ? before.bank : before.wallet;
                await this.client.DB.setCrystal(targetJid, amount, field);
                const updated = await this.client.DB.getUser(targetJid);
                const newBal = hasBank ? updated.bank : updated.wallet;
                const emoji = amount > 0 ? '➕' : '➖';
                const action = amount > 0 ? 'ADDED' : 'DEDUCTED';
                return void M.reply(`${emoji} *GOLD ${action}!*\n` +
                    `${'─'.repeat(26)}\n\n` +
                    `👤 *User:*     @${targetNum}\n` +
                    `📍 *Field:*    ${hasBank ? '🏦 Bank' : '💳 Wallet'}\n` +
                    `💸 *Amount:*   ${amount > 0 ? '+' : ''}${amount.toLocaleString()} 💰\n` +
                    `📊 *Before:*   ${oldBal.toLocaleString()} 💰\n` +
                    `💰 *After:*    ${newBal.toLocaleString()} 💰`, 'text', undefined, undefined, undefined, [rawTargetJid]);
            }
            // ── CASE B: User given but NO amount → show list button menu ─────────────
            pendingModGives.set(M.sender.jid, {
                targetJid, // correctJid for DB
                rawTargetJid, // raw JID for mentions
                field,
                expiresAt: Date.now() + 3 * 60 * 1000 // 3 minutes TTL
            });
            const fieldLabel = field === 'bank' ? '🏦 Bank' : '💳 Wallet';
            return void await this.client.sendMessage(M.from, {
                text: `🛡️ *MODGIVE — Amount Choose Karo* 🛡️\n` +
                    `${'─'.repeat(30)}\n\n` +
                    `👤 *Target:* @${targetNum}\n` +
                    `📍 *Field:*  ${fieldLabel}\n\n` +
                    `👇 Neeche button tap karo aur amount select karo!`,
                footer: `⏳ 3 min mein expire hoga`,
                mentions: [rawTargetJid],
                buttons: [{
                        text: '💰 Amount Choose Karo',
                        sections: [{
                                title: `💰 ${fieldLabel} mein kitna add karna hai?`,
                                rows: [
                                    { title: '💰 1,000 Gold', description: 'Small boost', id: `${prefix}modgive 1000` },
                                    { title: '💰 10,000 Gold', description: 'Medium boost', id: `${prefix}modgive 10000` },
                                    { title: '💰 50,000 Gold', description: 'Large boost', id: `${prefix}modgive 50000` },
                                    { title: '💰 1,00,000 Gold', description: 'Huge boost', id: `${prefix}modgive 100000` },
                                    { title: '💰 5,00,000 Gold', description: 'Max boost! 🚀', id: `${prefix}modgive 500000` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
ModGiveCommand = __decorate([
    (0, Structures_1.Command)('modgive', {
        description: '[MOD ONLY] Give / set / reset gold for any user',
        usage: 'modgive @user <amount> [bank] | modgive @user set <amount> [bank] | modgive @user reset',
        category: 'moderation',
        aliases: ['givecash', 'addbal', 'modbal'],
        cooldown: 3,
        exp: 0,
        dm: true
    })
], ModGiveCommand);
exports.default = ModGiveCommand;
