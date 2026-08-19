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
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args, context }) => {
            const prefix = this.client.config.prefix;
            if (M.chat !== 'group' || !M.groupMetadata)
                return void M.reply('❌ Ye command sirf group mein use karo!');
            const isMod = this.client.config.mods.some((mod) => this.client.correctJid(mod) === this.client.correctJid(M.sender.jid));
            if (!M.sender.isAdmin && !isMod)
                return void M.reply(`❌ Sirf *group admins* use kar sakte hain!\n\n` +
                    `📢 Use: \`${prefix}autoreact on/off\``);
            const data = await this.client.DB.getGroup(M.from);
            const currentOn = data.autoReact ?? false;
            const currentMode = data.autoReactMode ?? 'all';
            const input = context.trim().toLowerCase();
            // ─── No input → status show ───────────────────────────────────────
            if (!input) {
                const status = currentOn ? '🟢 *ON*' : '🔴 *OFF*';
                const modeLabel = currentMode === 'regular' ? '😄 Regular only' :
                    currentMode === 'anime' ? '🌸 Anime only' :
                        '🎭 All (Regular + Anime)';
                return void M.reply(`🎭 *AUTO REACT*\n` +
                    `${'─'.repeat(28)}\n\n` +
                    `📌 *Status:* ${status}\n` +
                    `🎨 *Mode:* ${modeLabel}\n\n` +
                    `📊 *Emoji Count:*\n` +
                    `  😄 Regular: ${lib_1.REACT_EMOJI_COUNTS.regular}\n` +
                    `  🌸 Anime: ${lib_1.REACT_EMOJI_COUNTS.anime}\n` +
                    `  🎭 Total: ${lib_1.REACT_EMOJI_COUNTS.total}\n\n` +
                    `${'─'.repeat(28)}\n` +
                    `📢 *Commands:*\n` +
                    `  \`${prefix}autoreact on\` → Enable\n` +
                    `  \`${prefix}autoreact off\` → Disable\n` +
                    `  \`${prefix}autoreact mode all\` → Sabhi emojis\n` +
                    `  \`${prefix}autoreact mode regular\` → Sirf regular\n` +
                    `  \`${prefix}autoreact mode anime\` → Sirf anime style`);
            }
            // ─── Mode change ──────────────────────────────────────────────────
            if (args[0]?.toLowerCase() === 'mode') {
                const newMode = args[1]?.toLowerCase();
                if (!newMode || !['all', 'regular', 'anime'].includes(newMode))
                    return void M.reply(`❌ Valid modes: \`all\`, \`regular\`, \`anime\`\n\n` +
                        `📢 Example: \`${prefix}autoreact mode anime\``);
                await this.client.DB.updateGroup(M.from, 'autoReactMode', newMode);
                const modeLabel = newMode === 'regular' ? '😄 Regular emojis only' :
                    newMode === 'anime' ? '🌸 Anime style only' :
                        '🎭 All emojis (Regular + Anime)';
                return void M.reply(`✅ *Auto React mode changed!*\n\n` +
                    `🎨 *New Mode:* ${modeLabel}\n\n` +
                    `_Ab is mode ke emojis randomly react karenge._`);
            }
            // ─── ON / OFF ─────────────────────────────────────────────────────
            if (input !== 'on' && input !== 'off')
                return void M.reply(`❌ \`on\` ya \`off\` likho!\n\n` +
                    `📢 Use: \`${prefix}autoreact on\` ya \`${prefix}autoreact off\``);
            const newValue = input === 'on';
            if (newValue === currentOn)
                return void M.reply(`🟨 Auto React already *${input.toUpperCase()}* hai!`);
            await this.client.DB.updateGroup(M.from, 'autoReact', newValue);
            return void M.reply(newValue
                ? `🟢 *AUTO REACT ON!* 🎭\n\n` +
                    `Ab is group ke har message par random emoji react karega!\n\n` +
                    `🎨 *Current Mode:* ${currentMode === 'anime' ? '🌸 Anime' : currentMode === 'regular' ? '😄 Regular' : '🎭 All'}\n` +
                    `📊 *Total Emojis:* ${lib_1.REACT_EMOJI_COUNTS.total}\n\n` +
                    `📢 Mode change karne ke liye: \`${prefix}autoreact mode anime\`\n` +
                    `📢 Band karne ke liye: \`${prefix}autoreact off\``
                : `🔴 *AUTO REACT OFF!*\n\n` +
                    `Is group mein auto reaction disable ho gaya.\n\n` +
                    `📢 On karne ke liye: \`${prefix}autoreact on\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('autoreact', {
        description: 'Har message par random emoji reaction auto-lagao 🎭',
        category: 'moderation',
        usage: 'autoreact on | autoreact off | autoreact mode <all/regular/anime>',
        aliases: ['areact', 'ar'],
        exp: 10,
        cooldown: 5
    })
], default_1);
exports.default = default_1;
