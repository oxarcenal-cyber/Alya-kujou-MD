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
            if (M.chat !== 'group' || !M.groupMetadata)
                return void M.reply(`❌ This command only works in groups!`);
            const isMod = this.client.config.mods.some((mod) => this.client.correctJid(mod) === this.client.correctJid(M.sender.jid));
            if (!M.sender.isAdmin && !isMod)
                return void M.reply(`❌ Only *group admins* can use this!\n\n` +
                    `📢 Use: \`${prefix}autocute on/off\``);
            const data = await this.client.DB.getGroup(M.from);
            const current = data.autoCute ?? false;
            const input = context.trim().toLowerCase();
            // ── No input → status ───────────────────────────────────────────────
            if (!input) {
                return void M.reply(`🐾 *AUTO CUTE STICKERS*\n` +
                    `${'─'.repeat(30)}\n\n` +
                    `📌 *Status:* ${current ? '🟢 ON' : '🔴 OFF'}\n` +
                    `🎲 *Trigger:* ~12% chance per message\n` +
                    `🖼️ *Style:* Mochi-cat anime stickers\n\n` +
                    `${'─'.repeat(30)}\n` +
                    `📢 *Commands:*\n` +
                    `  \`${prefix}autocute on\`  → Enable\n` +
                    `  \`${prefix}autocute off\` → Disable`);
            }
            if (input !== 'on' && input !== 'off')
                return void M.reply(`❌ Type \`on\` or \`off\`!\n\n` +
                    `📢 Example: \`${prefix}autocute on\``);
            const newValue = input === 'on';
            if (newValue === current)
                return void M.reply(`🟨 Auto Cute is already *${input.toUpperCase()}*!`);
            await this.client.DB.updateGroup(M.from, 'autoCute', newValue);
            return void M.reply(newValue
                ? `🐾 *AUTO CUTE ON!* 💗\n\n` +
                    `Cute mochi-cat stickers will randomly appear in this group~\n\n` +
                    `🎲 *Chance:* ~12% per message\n` +
                    `📢 Off karne ke liye: \`${prefix}autocute off\``
                : `😿 *AUTO CUTE OFF!*\n\n` +
                    `No more random stickers in this group.\n\n` +
                    `📢 On karne ke liye: \`${prefix}autocute on\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('autocute', {
        description: 'Randomly send cute mochi-cat stickers in the group — toggle on/off',
        aliases: ['mochi', 'cutesticker', 'cs'],
        usage: 'autocute on | autocute off | autocute',
        cooldown: 5,
        exp: 10,
        category: 'moderation'
    })
], default_1);
exports.default = default_1;
