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
            if (M.chat !== 'group')
                return void M.reply('❌ Ye command sirf groups mein use hoti hai!');
            const isAdmin = M.sender.isAdmin;
            const isMod = this.client.config.mods.includes(M.sender.jid);
            if (!isAdmin && !isMod)
                return void M.reply(`❌ *Sirf admins use kar sakte hain!*`);
            const data = await this.client.DB.getGroup(M.from);
            const current = data.newsEnabled ?? false;
            const input = context.trim().toLowerCase();
            // ── Status ──────────────────────────────────────────────────────────────
            if (!input || input === 'status') {
                return void M.reply(`📰 *NEWS FEED*\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `📌 *Status:* ${current ? '🟢 *ON*' : '🔴 *OFF*'}\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `📢 *What you'll get:*\n` +
                    `  🎌 Anime news — every 30 minutes\n` +
                    `  📖 Manga news — every 30 minutes\n` +
                    `  📰 World news digest — daily at 7 AM\n` +
                    `  🚨 Breaking alerts — instantly when they drop\n\n` +
                    `📢 *Commands:*\n` +
                    `  \`${prefix}news on\` → Subscribe\n` +
                    `  \`${prefix}news off\` → Unsubscribe`);
            }
            if (input !== 'on' && input !== 'off')
                return void M.reply(`❌ Use *on*, *off*, or *status*!\n\nExample: \`${prefix}news on\``);
            const newVal = input === 'on';
            if (newVal === current)
                return void M.reply(`🟨 News feed is already *${input.toUpperCase()}* in this group!`);
            await this.client.DB.updateGroup(M.from, 'newsEnabled', newVal);
            if (newVal) {
                return void M.reply(`🟢 *NEWS FEED ON!* 📰\n\n` +
                    `This group will now receive:\n\n` +
                    `  🎌 *Anime news* — every 30 minutes\n` +
                    `  📖 *Manga news* — every 30 minutes\n` +
                    `  📰 *World news digest* — daily at 7 AM\n` +
                    `  🚨 *Breaking alerts* — as they happen\n\n` +
                    `_To disable: \`${prefix}news off\`_`);
            }
            else {
                return void M.reply(`🔴 *NEWS FEED OFF!*\n\n` +
                    `This group will no longer receive news updates.\n\n` +
                    `_To re-enable: \`${prefix}news on\`_`);
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('news', {
        description: 'Subscribe/unsubscribe group to anime & world news updates 📰',
        category: 'moderation',
        usage: 'news on | news off | news status',
        aliases: ['newsfeed', 'nws'],
        cooldown: 5,
        exp: 10,
        adminRequired: true
    })
], default_1);
exports.default = default_1;
