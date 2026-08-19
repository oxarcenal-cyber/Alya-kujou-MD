"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const config_1 = __importDefault(require("../../config"));
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
                    `📢 *How to use:* \`${prefix}gchatbot on/off\``);
            if (!(config_1.default.GROQ_API_KEY || config_1.default.OPENAI_API_KEY))
                return void M.reply(`❌ *Chatbot configure nahi hai!*\n\nBot owner se contact karo.\n\n` +
                    `📢 *How to use:* \`${prefix}gchatbot on/off\``);
            const data = await this.client.DB.getGroup(M.from);
            const current = data.groupChatbot;
            if (!context.trim()) {
                const status = current ? '🟢 *ON*' : '🔴 *OFF*';
                return void M.reply(`🤖 *GROUP CHATBOT*\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `📌 *Status:* ${status}\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}gchatbot on\` → Enable karo\n` +
                    `  \`${prefix}gchatbot off\` → Disable karo\n\n` +
                    `_Jab ON ho, \`${prefix}chat <message>\` se bot se baat karo_`);
            }
            const input = context.trim().toLowerCase();
            if (input !== 'on' && input !== 'off')
                return void M.reply(`❌ *on* ya *off* likho!\n\n` +
                    `📢 *How to use:*\n  \`${prefix}gchatbot on\`\n  \`${prefix}gchatbot off\``);
            const newValue = input === 'on';
            if (newValue === current)
                return void M.reply(`🟨 Group chatbot already *${input.toUpperCase()}* hai!`);
            await this.client.DB.updateGroup(M.from, 'groupChatbot', newValue);
            return void M.reply(newValue
                ? `🟢 *CHATBOT ON!* 🤖\n\n` +
                    `Ab is group mein \`${prefix}chat <message>\` se bot se baat kar sakte ho!\n\n` +
                    `📢 Band karne ke liye: \`${prefix}gchatbot off\``
                : `🔴 *CHATBOT OFF!*\n\n` +
                    `Is group mein chatbot disable ho gaya.\n\n` +
                    `📢 On karne ke liye: \`${prefix}gchatbot on\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('gchatbot', {
        description: 'Enable/disable chatbot for this group 🤖',
        category: 'moderation',
        usage: 'gchatbot on || gchatbot off || gchatbot',
        aliases: ['groupchatbot', 'gcb'],
        cooldown: 5,
        exp: 10
    })
], default_1);
exports.default = default_1;
