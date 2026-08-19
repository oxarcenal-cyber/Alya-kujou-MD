"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const prettier_1 = require("prettier");
const Structures_1 = require("../../Structures");
const supportedLang = ['json', 'ts', 'js', 'css', 'md', 'yaml', 'html'];
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { flags, context }) => {
            flags.forEach((flag) => (context = context.replace(flag, '')));
            if (!context && (!M.quoted || M.quoted.content === ''))
                return void M.reply(`Provide or quote a message containing the code that you want to run prettier along with the language and options. Example: *${this.client.config.prefix}prettier --lang=ts --no-semi --single-quote *[quotes a message containing the code]**`);
            const langFlag = flags.filter((flag) => flag.startsWith('--lang=') || flag.startsWith('--language='))[0];
            let lang = 'js';
            if (langFlag)
                lang = langFlag.split('=')[1];
            const parser = this.getParserFromLanguage(lang);
            try {
                const formattedCode = (0, prettier_1.format)(context || M.quoted?.content, {
                    parser,
                    semi: parser !== 'babel' && parser !== 'babel-ts',
                    singleQuote: parser !== 'babel' && parser !== 'babel-ts'
                });
                return void (await M.reply(`\`\`\`${formattedCode}\`\`\``));
            }
            catch (error) {
                await M.reply(`${error.message}`);
                return void (await M.reply(`If the code's not wrong, try changing the languages to: \`\`\`${supportedLang.join(', ')}\`\`\``));
            }
        };
        this.getParserFromLanguage = (lang) => {
            let parser;
            switch (lang.toLowerCase().trim()) {
                default:
                case 'js':
                case 'javascript':
                    parser = 'babel';
                    break;
                case 'css':
                    parser = 'css';
                    break;
                case 'html':
                    parser = 'html';
                    break;
                case 'json':
                    parser = 'json';
                    break;
                case 'ts':
                case 'typescript':
                    parser = 'babel-ts';
                    break;
                case 'md':
                case 'markdown':
                    parser = 'markdown';
                    break;
                case 'yaml':
                    parser = 'markdown';
                    break;
            }
            return parser;
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('prettier', {
        description: 'Runs prettier of the given code',
        category: 'utils',
        exp: 50,
        cooldown: 15,
        usage: `prettier --lang[${supportedLang.join(', ')}] [provide/quote the message containing the code]`,
        aliases: ['format']
    })
], default_1);
exports.default = default_1;
