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
const langMap = {
    en: 'English', hi: 'Hindi', ur: 'Urdu', es: 'Spanish',
    fr: 'French', de: 'German', ja: 'Japanese', ko: 'Korean',
    zh: 'Chinese', ar: 'Arabic', pt: 'Portuguese', ru: 'Russian',
    it: 'Italian', tr: 'Turkish', bn: 'Bengali', ta: 'Tamil',
    te: 'Telugu', mr: 'Marathi', gu: 'Gujarati', pa: 'Punjabi'
};
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context, args }) => {
            const lang = await this.getLang(M);
            const prefix = this.client.config.prefix;
            if (!context.trim() || args.length < 2)
                return void M.reply((0, lib_1.t)('translate_usage', lang, { p: prefix }));
            const targetLang = args[0].toLowerCase();
            const text = args.slice(1).join(' ');
            if (!text.trim())
                return void M.reply((0, lib_1.t)('translate_no_text', lang, { p: prefix }));
            try {
                const res = await this.client.utils.fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
                // Response shape: [ [ ["translated","original",...], ... ], ... ]
                const translated = res?.[0]?.map((chunk) => chunk?.[0]).filter(Boolean).join('') || '';
                if (!translated)
                    return void M.reply((0, lib_1.t)('translate_failed', lang, { p: prefix }));
                const langName = langMap[targetLang] || targetLang.toUpperCase();
                return void M.reply(`🌐 *TRANSLATION* 🌐\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `📝 *Original:* ${text}\n\n` +
                    `✅ *${langName}:* ${translated}\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 *How to use:* \`${prefix}translate <lang> <text>\``);
            }
            catch {
                return void M.reply((0, lib_1.t)('translate_error', lang, { p: prefix }));
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('translate', {
        description: 'Translate text to any language 🌐',
        category: 'utils',
        usage: 'translate <lang_code> <text>',
        aliases: ['tr', 'trans'],
        cooldown: 5,
        exp: 15,
        dm: true
    })
], default_1);
exports.default = default_1;
