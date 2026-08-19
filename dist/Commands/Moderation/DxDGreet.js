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
            const isMod = this.client.config.mods.includes(M.sender.jid);
            if (!M.sender.isAdmin && !isMod)
                return void M.reply(`❌ *Sirf admins use kar sakte hain!*\n\n` +
                    `📢 *How to use:* \`${prefix}dxdgreet on/off\``);
            const data = await this.client.DB.getGroup(M.from);
            const current = data.dxdGreetings;
            if (!context.trim()) {
                const status = current ? '🟢 *ON*' : '🔴 *OFF*';
                return void M.reply(`🌙 *DxD AUTO GREETINGS*\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `📌 *Status:* ${status}\n\n` +
                    `⏰ *Kab bhejta hai:*\n` +
                    `  ☀️ Good Morning → ~7:00 AM\n` +
                    `  🌤️ Good Afternoon → ~1:00 PM\n` +
                    `  🌇 Good Evening → ~6:00 PM\n` +
                    `  🌙 Good Night → ~10:00 PM\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}dxdgreet on\` → Enable karo\n` +
                    `  \`${prefix}dxdgreet off\` → Disable karo\n\n` +
                    `_Jab ON ho, bot khud High School DxD character dialogue ke saath greeting bhejta hai — koi command ki zaroorat nahi._`);
            }
            const input = context.trim().toLowerCase();
            if (input !== 'on' && input !== 'off')
                return void M.reply(`❌ *on* ya *off* likho!\n\n` +
                    `📢 *How to use:*\n  \`${prefix}dxdgreet on\`\n  \`${prefix}dxdgreet off\``);
            const newValue = input === 'on';
            if (newValue === current)
                return void M.reply(`🟨 DxD Greetings already *${input.toUpperCase()}* hai!`);
            await this.client.DB.updateGroup(M.from, 'dxdGreetings', newValue);
            return void M.reply(newValue
                ? `🟢 *DxD GREETINGS ON!* 🌙\n\n` +
                    `Ab bot khud-ba-khud roz good morning/afternoon/evening/night greetings bhejega — DxD character dialogues ke saath!\n\n` +
                    `📢 Band karne ke liye: \`${prefix}dxdgreet off\``
                : `🔴 *DxD GREETINGS OFF!*\n\n` +
                    `Auto greetings band ho gaye is group mein.\n\n` +
                    `📢 On karne ke liye: \`${prefix}dxdgreet on\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('dxdgreet', {
        description: 'Enable/disable High School DxD auto good morning/afternoon/evening/night greetings 🌙',
        category: 'moderation',
        usage: 'dxdgreet on || dxdgreet off || dxdgreet',
        aliases: ['dxdgreetings', 'autogreet'],
        cooldown: 5,
        exp: 10
    })
], default_1);
exports.default = default_1;
