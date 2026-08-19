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
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = require("mongoose");
const Structures_1 = require("../../Structures");
const CHECKS = [
    { name: 'MyAnimeList (anime/manga/character)', url: 'https://api.jikan.moe/v4/anime?q=one&limit=1' },
    { name: 'Nekos.best (waifu/kitsune)', url: 'https://nekos.best/api/v2/waifu' },
    { name: 'Nekos.life (neko)', url: 'https://nekos.life/api/v2/img/neko' },
    { name: 'GitHub API', url: 'https://api.github.com' },
    { name: 'Weather API', url: 'https://wttr.in/London?format=3' }
];
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            await M.reply('Checking service status, please wait...');
            const results = await Promise.all(CHECKS.map(async (check) => {
                const start = Date.now();
                try {
                    await axios_1.default.get(check.url, { timeout: 8000 });
                    return { ...check, ok: true, ms: Date.now() - start };
                }
                catch (err) {
                    const status = err?.response?.status;
                    return { ...check, ok: false, ms: Date.now() - start, status };
                }
            }));
            const db = mongoose_1.connection.readyState === 1;
            let text = `🩺 *${this.client.config.name.toUpperCase()} - SERVICE STATUS*\n\n`;
            text += `${db ? '🟢' : '🔴'} *Database:* ${db ? 'Connected' : 'Disconnected'}\n`;
            text += `🟢 *WhatsApp:* Connected\n\n`;
            text += `*External APIs:*\n`;
            for (const result of results) {
                const icon = result.ok ? '🟢' : '🔴';
                const detail = result.ok
                    ? `${result.ms}ms`
                    : `${'status' in result && result.status ? `HTTP ${result.status}` : 'unreachable'}`;
                text += `${icon} *${result.name}:* ${detail}\n`;
            }
            const downCount = results.filter((r) => !r.ok).length;
            text += `\n${downCount === 0 ? '✅ All systems operational' : `⚠️ ${downCount} service(s) degraded`}`;
            return void (await M.reply(text));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('status', {
        description: 'Checks bot uptime, database, and external API health',
        category: 'general',
        aliases: ['apistatus', 'health'],
        usage: 'status',
        cooldown: 15,
        exp: 5
    })
], default_1);
exports.default = default_1;
