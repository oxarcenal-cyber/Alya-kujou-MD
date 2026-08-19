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
            const arg = context.trim().toLowerCase();
            const groupData = await this.client.DB.getGroup(M.from);
            const current = groupData.badWords;
            const list = groupData.badWordsList || [];
            if (!arg)
                return void M.reply(`🚫 *BAD WORDS FILTER*\n` +
                    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                    `📌 *Status:* ${current ? '🟢 ON' : '🔴 OFF'}\n` +
                    `📋 *Words in list:* ${list.length}\n\n` +
                    `📖 *Commands:*\n` +
                    `\`${prefix}badwords on\` — Enable filter\n` +
                    `\`${prefix}badwords off\` — Disable filter\n` +
                    `\`${prefix}addbadword <word>\` — Add a word\n` +
                    `\`${prefix}rmbadword <word>\` — Remove a word\n\n` +
                    (list.length > 0 ? `🔒 *Filtered words:* ${list.map(w => `||\`${w}\`||`).join(' · ')}` : `_No words added yet_`));
            if (!['on', 'off'].includes(arg))
                return void M.reply(`❌ Use *on* or *off*\n_Example: ${prefix}badwords on_`);
            const newState = arg === 'on';
            if (newState === current)
                return void M.reply(`⚠️ Bad words filter is already *${current ? 'ON' : 'OFF'}*!`);
            await this.client.DB.group.updateOne({ jid: M.from }, { $set: { badWords: newState } });
            this.client.DB.cacheInvalidate(`group:${M.from}`);
            return void M.reply(`🚫 *BAD WORDS FILTER ${newState ? 'ENABLED' : 'DISABLED'}*\n\n` +
                `📌 Status: ${newState ? '🟢 ON' : '🔴 OFF'}\n` +
                `${newState ? `⚠️ Messages containing filtered words will be *auto-deleted*.\n_Admins are exempt from the filter._` : `_Messages are no longer being filtered._`}`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('badwords', {
        description: 'Toggle bad words filter on/off 🚫',
        aliases: ['bwfilter', 'wordfilter'],
        usage: 'badwords <on|off>',
        cooldown: 5,
        exp: 5,
        category: 'moderation',
        dm: false
    })
], default_1);
exports.default = default_1;
