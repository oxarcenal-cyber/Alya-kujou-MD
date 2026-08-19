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
            const lang = await this.getLang(M);
            const prefix = this.client.config.prefix;
            // No args → usage + style list
            if (!args.length || !context.trim()) {
                const list = lib_1.FONT_LIST.map((f, i) => `  ${String(i + 1).padStart(2, ' ')}. ${f.emoji} *${f.label}* — \`${f.key}\``).join('\n');
                return void M.reply(`✍️ *FONT CONVERTER*\n` +
                    `${'─'.repeat(28)}\n\n` +
                    `📋 *Available Styles:*\n${list}\n\n` +
                    `${'─'.repeat(28)}\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}font bold Hello World\`\n` +
                    `  \`${prefix}font cursive Rias Gremory\`\n` +
                    `  \`${prefix}font all Hello\` → preview in all styles\n` +
                    `  \`${prefix}font list\` → show this list again`);
            }
            const subCmd = args[0].toLowerCase();
            // -font list
            if (subCmd === 'list') {
                const list = lib_1.FONT_LIST.map((f, i) => `  ${String(i + 1).padStart(2, ' ')}. ${f.emoji} *${f.label}*\n      Preview: ${f.preview}`).join('\n\n');
                return void M.reply(`✍️ *FONT STYLES LIST*\n` +
                    `${'─'.repeat(28)}\n\n` +
                    `${list}\n\n` +
                    `${'─'.repeat(28)}\n` +
                    `📢 Use: \`${prefix}font <style> <text>\``);
            }
            // -font all <text>
            if (subCmd === 'all') {
                const text = args.slice(1).join(' ').trim();
                if (!text)
                    return void M.reply((0, lib_1.t)('font_all_no_text', lang, { p: prefix }));
                const preview = (0, lib_1.previewAllFonts)(text);
                return void M.reply(`✍️ *ALL FONT STYLES*\n` +
                    `${'─'.repeat(28)}\n` +
                    `📝 Original: *${text}*\n` +
                    `${'─'.repeat(28)}\n\n` +
                    `${preview}\n\n` +
                    `${'─'.repeat(28)}\n` +
                    (0, lib_1.t)('font_all_footer', lang, { p: prefix, text }));
            }
            // -font <style> <text>
            const style = subCmd;
            const text = args.slice(1).join(' ').trim();
            // Number se bhi style select kare
            const byNumber = /^\d+$/.test(style);
            const fontEntry = byNumber
                ? lib_1.FONT_LIST[parseInt(style) - 1]
                : lib_1.FONT_LIST.find((f) => f.key === style || f.label.toLowerCase() === style);
            if (!fontEntry)
                return void M.reply((0, lib_1.t)('font_style_invalid', lang, { style, p: prefix }));
            if (!text)
                return void M.reply((0, lib_1.t)('font_style_no_text', lang, { p: prefix, key: fontEntry.key }));
            const result = (0, lib_1.convertFont)(text, fontEntry.key);
            return void M.reply(`✍️ *${fontEntry.emoji} ${fontEntry.label} Font*\n` +
                `${'─'.repeat(28)}\n\n` +
                `📝 *Original:* ${text}\n` +
                `✨ *Converted:*\n${result}\n\n` +
                `${'─'.repeat(28)}\n` +
                (0, lib_1.t)('font_style_footer', lang, { p: prefix }));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('font', {
        description: 'Convert text into fancy Unicode font styles ✍️',
        category: 'utils',
        usage: 'font <style> <text> | font list | font all <text>',
        aliases: ['fonts', 'fancy', 'style'],
        exp: 5,
        cooldown: 3,
        dm: true
    })
], default_1);
exports.default = default_1;
