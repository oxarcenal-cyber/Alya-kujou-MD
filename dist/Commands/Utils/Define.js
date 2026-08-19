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
        this.execute = async (M, { context }) => {
            const lang = await this.getLang(M);
            const prefix = this.client.config.prefix;
            if (!context.trim())
                return void M.reply((0, lib_1.t)('define_usage', lang, { p: prefix }));
            const word = context.trim().split(' ')[0];
            try {
                const data = await this.client.utils.fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
                if (!data || !Array.isArray(data) || !data.length)
                    return void M.reply((0, lib_1.t)('define_not_found', lang, { word, p: prefix }));
                const entry = data[0];
                const phonetic = entry.phonetics.find(p => p.text)?.text || '';
                let text = `📖 *${entry.word.toUpperCase()}* ${phonetic ? `_(${phonetic})_` : ''}\n` +
                    `${'─'.repeat(25)}\n\n`;
                for (const meaning of entry.meanings.slice(0, 3)) {
                    text += `🏷️ *${meaning.partOfSpeech}*\n`;
                    for (const def of meaning.definitions.slice(0, 2)) {
                        text += `  • ${def.definition}\n`;
                        if (def.example)
                            text += `    _"${def.example}"_\n`;
                    }
                    text += '\n';
                }
                text += `${'─'.repeat(25)}\n📢 *How to use:* \`${prefix}define <word>\``;
                return void M.reply(text);
            }
            catch {
                return void M.reply((0, lib_1.t)('define_error', lang, { word, p: prefix }));
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('define', {
        description: 'Get the dictionary definition of any English word 📖',
        category: 'utils',
        usage: 'define <word>',
        aliases: ['dict', 'meaning', 'definition'],
        cooldown: 5,
        exp: 15,
        dm: true
    })
], default_1);
exports.default = default_1;
