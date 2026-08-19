"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const POWER_REACTIONS = [
    { min: 0, max: 999, emoji: '😴', label: 'It\'s barely registering...' },
    { min: 1000, max: 4999, emoji: '😐', label: 'A mere human...' },
    { min: 5000, max: 9999, emoji: '😤', label: 'Some potential here.' },
    { min: 10000, max: 29999, emoji: '💪', label: 'Not bad! Has some power.' },
    { min: 30000, max: 59999, emoji: '😮', label: 'Impressive power level!' },
    { min: 60000, max: 89999, emoji: '😨', label: 'This power... it\'s enormous!' },
    { min: 90000, max: 99999, emoji: '😱', label: 'INCREDIBLE! OVER 9000... x10!' },
    { min: 100000, max: 499999, emoji: '🔥', label: 'IT\'S OVER 100,000!!!' },
    { min: 500000, max: 999999, emoji: '💥', label: 'THE SCOUTER IS BROKEN!!!' },
    { min: 1000000, max: Infinity, emoji: '👑', label: 'THIS POWER IS IMMEASURABLE!!!' },
];
function getReaction(level) {
    return POWER_REACTIONS.find(r => level >= r.min && level <= r.max) ?? POWER_REACTIONS[0];
}
function buildMeter(current, max) {
    const len = 12;
    const filled = Math.min(len, Math.round((current / max) * len));
    return '█'.repeat(filled) + '░'.repeat(len - filled);
}
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, _args) => {
            const targetJid = M.mentioned[0]
                ? this.client.correctJid(M.mentioned[0])
                : this.client.correctJid(M.sender.jid);
            const targetName = M.mentioned[0]
                ? (this.client.contact.getContact(targetJid).username || 'Warrior')
                : (M.sender.username || 'You');
            // Seeded random per user per day
            const seed = (targetJid.charCodeAt(0) * 31 + new Date().getDate() * 137 + new Date().getMonth() * 29) % 10000;
            const finalLevel = Math.floor((seed * 9973 + 7777) % 1000000) + 100;
            const maxLevel = Math.max(finalLevel, 1000000);
            const reaction = getReaction(finalLevel);
            // Initial scouter frame
            const sent = await this.client.sendMessage(M.from, {
                text: `🥽 ═══ *SCOUTER ACTIVATED* ═══ 🥽\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `👤 Target: *${targetName}*\n\n` +
                    `📊 Power Level: *???*\n` +
                    `\`${buildMeter(0, maxLevel)}\`\n\n` +
                    `🔍 _Scanning..._`
            }, { quoted: M.message });
            if (!sent?.key)
                return;
            const edit = (text) => this.client.sendMessage(M.from, { text, edit: sent.key });
            // Animate meter rising
            const steps = 10;
            for (let i = 1; i <= steps; i++) {
                await sleep(350);
                const cur = Math.floor((finalLevel / steps) * i);
                const display = cur.toLocaleString();
                const warning = i >= 8 ? '\n⚠️ *POWER LEVEL CRITICAL!*' : '';
                await edit(`🥽 ═══ *SCOUTER ACTIVATED* ═══ 🥽\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `👤 Target: *${targetName}*\n\n` +
                    `📊 Power Level: *${display}*\n` +
                    `\`${buildMeter(cur, maxLevel)}\`${warning}\n\n` +
                    `🔍 _Analyzing..._`);
            }
            await sleep(700);
            // Final reveal
            await edit(`🥽 ═══ *SCOUTER RESULT* ═══ 🥽\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `👤 *${targetName}*\n\n` +
                `📊 *Power Level:*\n` +
                `\`${buildMeter(finalLevel, maxLevel)}\`\n` +
                `⚡ *${finalLevel.toLocaleString()}*\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `${reaction.emoji} *${reaction.label}*`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('powerlevel', {
        description: 'Dragon Ball style power level check! 🌡️',
        category: 'fun',
        usage: 'powerlevel | powerlevel @user',
        aliases: ['pl', 'powercheck', 'scouter'],
        cooldown: 10,
        exp: 10,
        dm: true
    })
], default_1);
exports.default = default_1;
