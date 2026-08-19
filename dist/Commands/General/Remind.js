"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
const reminders = [];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
function parseTime(str) {
    const match = str.match(/^(\d+)(s|m|h|d)$/);
    if (!match)
        return null;
    const val = parseInt(match[1]);
    const unit = match[2];
    if (unit === 's')
        return val * 1000;
    if (unit === 'm')
        return val * 60 * 1000;
    if (unit === 'h')
        return val * 3600 * 1000;
    if (unit === 'd')
        return val * 86400 * 1000;
    return null;
}
function formatMs(ms) {
    const s = Math.floor(ms / 1000);
    if (s < 60)
        return `${s} second${s !== 1 ? 's' : ''}`;
    if (s < 3600) {
        const m = Math.floor(s / 60);
        const r = s % 60;
        return r > 0 ? `${m}m ${r}s` : `${m} minute${m !== 1 ? 's' : ''}`;
    }
    const h = Math.floor(s / 3600);
    const rm = Math.floor((s % 3600) / 60);
    return rm > 0 ? `${h}h ${rm}m` : `${h} hour${h !== 1 ? 's' : ''}`;
}
// ─── Command ─────────────────────────────────────────────────────────────────
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const input = context.trim();
            const fromJid = this.client.correctJid(M.sender.jid);
            const lang = await this.getLang(M);
            // ── Help ──────────────────────────────────────────────────────────
            if (!input)
                return void M.reply((0, lib_1.t)('remind_help', lang, { prefix }));
            // ── List ──────────────────────────────────────────────────────────
            if (input.toLowerCase() === 'list') {
                const mine = reminders.filter(r => r.jid === fromJid);
                if (mine.length === 0)
                    return void M.reply((0, lib_1.t)('remind_none', lang, { prefix }));
                const now = Date.now();
                const header = (0, lib_1.t)('remind_list_header', lang, { count: String(mine.length) });
                const items = mine.map((r, i) => {
                    const left = Math.max(0, r.fireAt - now);
                    return (0, lib_1.t)('remind_list_item', lang, { idx: String(i + 1), text: r.text, time: formatMs(left) });
                }).join('\n\n');
                return void M.reply(`${header}\n\n${items}`);
            }
            // ── Clear ─────────────────────────────────────────────────────────
            if (input.toLowerCase() === 'clear') {
                const before = reminders.length;
                const toRemove = reminders.filter(r => r.jid === fromJid);
                for (const r of toRemove) {
                    const idx = reminders.indexOf(r);
                    if (idx > -1)
                        reminders.splice(idx, 1);
                }
                const removed = before - reminders.length;
                return void M.reply(removed > 0
                    ? (0, lib_1.t)('remind_cleared', lang, { count: String(removed), s: removed !== 1 ? 's' : '' })
                    : (0, lib_1.t)('remind_none_clear', lang));
            }
            // ── Set new reminder ──────────────────────────────────────────────
            const parts = input.split(/\s+/);
            const timeStr = parts[0].toLowerCase();
            const message = parts.slice(1).join(' ');
            const timeMs = parseTime(timeStr);
            if (!timeMs)
                return void M.reply((0, lib_1.t)('remind_bad_time', lang, { prefix }));
            if (!message)
                return void M.reply((0, lib_1.t)('remind_no_msg', lang, { prefix }));
            if (timeMs < 5000)
                return void M.reply((0, lib_1.t)('remind_min_time', lang));
            if (timeMs > 7 * 24 * 3600 * 1000)
                return void M.reply((0, lib_1.t)('remind_max_time', lang));
            const myReminders = reminders.filter(r => r.jid === fromJid);
            if (myReminders.length >= 5)
                return void M.reply((0, lib_1.t)('remind_limit', lang, { prefix }));
            const reminder = {
                jid: fromJid,
                name: M.sender.username || 'User',
                text: message,
                group: M.from,
                setAt: Date.now(),
                fireAt: Date.now() + timeMs
            };
            reminders.push(reminder);
            await M.reply((0, lib_1.t)('remind_set', lang, { message, time: formatMs(timeMs) }));
            // Fire reminder
            await sleep(timeMs);
            const idx = reminders.indexOf(reminder);
            if (idx > -1)
                reminders.splice(idx, 1);
            await this.client.sendMessage(reminder.group, {
                text: (0, lib_1.t)('remind_fire', lang, {
                    user: fromJid.split('@')[0],
                    message,
                    time: formatMs(timeMs)
                }),
                mentions: [fromJid]
            });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('remind', {
        description: 'Apne liye reminder set karo ⏰',
        category: 'general',
        usage: 'remind <time> <message> | remind list | remind clear',
        aliases: ['reminder', 'remindme'],
        cooldown: 5,
        exp: 5,
        dm: true
    })
], default_1);
exports.default = default_1;
