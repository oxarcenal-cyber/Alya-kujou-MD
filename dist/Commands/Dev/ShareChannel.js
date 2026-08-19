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
            const channelLink = this.client.config.channelLink;
            const supportLink = this.client.config.supportLink;
            const botName = this.client.config.name;
            if (!channelLink)
                return void M.reply('❌ Channel link config mein set nahi hai!\n`CHANNEL_LINK` fill karo `src/config.ts` mein.');
            // ── Message ──────────────────────────────────────────────────────────
            const text = `╔══════════════════════╗\n` +
                `║   📢 *${botName}*   ║\n` +
                `║   *Official Channel*   ║\n` +
                `╚══════════════════════╝\n\n` +
                `Hamare *WhatsApp Channel* se judo aur pao:\n\n` +
                `  🎌 Latest anime & manga news\n` +
                `  🤖 Bot updates & new features\n` +
                `  🎁 Giveaways & special events\n` +
                `  🚨 Breaking alerts — sabse pehle!\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `📲 *Channel Link:*\n` +
                `${channelLink}\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━` +
                (supportLink ? `\n\n👥 *Support Group:*\n${supportLink}` : '') +
                `\n\n_Follow karo aur updates miss mat karo!_ 🌟`;
            const sendAll = context.trim().toLowerCase() === 'all';
            if (sendAll) {
                await M.reply('📡 Sabhi groups mein bhej raha hoon... please wait!');
                const groupKeys = await this.client.groupFetchAllParticipating();
                const jids = Object.keys(groupKeys);
                let sent = 0;
                for (const jid of jids) {
                    try {
                        await this.client.sendMessage(jid, { text });
                        sent++;
                        await new Promise(r => setTimeout(r, 800));
                    }
                    catch { /* skip failed */ }
                }
                return void M.reply(`✅ *Done!* ${sent}/${jids.length} groups mein channel link bheja!`);
            }
            return void await this.client.sendMessage(M.from, { text });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('sharechannel', {
        description: 'Share bot WhatsApp channel link 📢',
        aliases: ['channel', 'chanlink'],
        usage: 'sharechannel | sharechannel all',
        cooldown: 10,
        exp: 0,
        category: 'dev',
        dm: true
    })
], default_1);
exports.default = default_1;
