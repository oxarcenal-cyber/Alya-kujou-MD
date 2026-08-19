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
            const url = context.trim().split(' ')[0];
            if (!url)
                return void M.reply(`🔗 *URL SHORTENER*\n` +
                    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                    `📖 *How to use:*\n` +
                    `\`${prefix}shorten <url>\`\n\n` +
                    `_Example: ${prefix}shorten https://www.google.com/very/long/url_`);
            if (!url.startsWith('http://') && !url.startsWith('https://'))
                return void M.reply(`❌ Please provide a valid URL starting with *http://* or *https://*`);
            try {
                await M.reply(`⏳ Shortening your URL...`);
                const encoded = encodeURIComponent(url);
                const apiUrl = `https://tinyurl.com/api-create.php?url=${encoded}`;
                // TinyURL returns plain text — use native fetch
                const rawRes = await fetch(apiUrl);
                const short = await rawRes.text();
                if (!short || !short.startsWith('https://tinyurl.com'))
                    throw new Error('Invalid response');
                return void M.reply(`🔗 *URL SHORTENED!*\n` +
                    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                    `📌 *Original:* ${url.length > 50 ? url.slice(0, 50) + '...' : url}\n\n` +
                    `✅ *Short URL:*\n${short}\n\n` +
                    `_Powered by TinyURL_`);
            }
            catch {
                return void M.reply(`❌ Failed to shorten URL. Please try again later.`);
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('shorten', {
        description: 'Shorten a long URL 🔗',
        aliases: ['short', 'tinyurl', 'shorturl'],
        usage: 'shorten <url>',
        cooldown: 5,
        exp: 5,
        category: 'utils',
        dm: true
    })
], default_1);
exports.default = default_1;
