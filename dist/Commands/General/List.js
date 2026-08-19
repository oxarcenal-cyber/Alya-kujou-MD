"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const categoryIcons = {
    general: '🌐',
    games: '🎮',
    economy: '💰',
    fun: '🎭',
    moderation: '🛡️',
    media: '🎵',
    utils: '🔧',
    weeb: '🌸',
    pokemon: '⚡',
    cards: '🃏',
    nsfw: '🔞'
};
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, _args) => {
            const prefix = this.client.config.prefix;
            // Hide nsfw if off in group
            let showNsfw = false;
            if (M.chat === 'group') {
                const groupData = await this.client.DB.getGroup(M.from).catch(() => null);
                showNsfw = groupData?.nsfw ?? false;
            }
            const rows = Object.entries(categoryIcons)
                .filter(([cat]) => cat !== 'nsfw' || showNsfw)
                .map(([cat, icon]) => ({
                title: `${icon} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`,
                id: `menu:${cat}`,
                description: `Tap to view ${cat} commands`
            }));
            const visibleCats = Object.entries(categoryIcons)
                .filter(([cat]) => cat !== 'nsfw' || showNsfw);
            // Short display names for categories
            const shortName = {
                general: 'Gen',
                games: 'Games',
                economy: 'Eco',
                fun: 'Fun',
                moderation: 'Mod',
                media: 'Media',
                utils: 'Utils',
                weeb: 'Weeb',
                pokemon: 'Pokémon',
                cards: 'Cards',
                nsfw: 'NSFW'
            };
            // Build category lines — 3 per row
            const catChunks = [];
            for (let i = 0; i < visibleCats.length; i += 3) {
                catChunks.push(visibleCats.slice(i, i + 3)
                    .map(([cat, icon]) => `${icon} ${shortName[cat] ?? cat}`)
                    .join(' · '));
            }
            await this.client.sendMessage(M.from, {
                text: `📚 *Commands Menu*\n\n` +
                    `🌐 *Browse all bot commands by*\n` +
                    `💡 Use \`${prefix}help <cmd>\` for details\n` +
                    `🔐 Admin only - On/Off 🎲\n\n` +
                    `🗂️ *Categories:*\n` +
                    catChunks.join('\n') + `\n\n` +
                    `_Tap the menu below to browse_ 👇`,
                footer: '📚 RedzeoX Commands',
                buttons: [
                    {
                        text: '📋 Browse Categories',
                        sections: [{ title: '📂 Select a Category', rows }]
                    }
                ]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('list', {
        description: 'Browse all bot commands by category 📚',
        aliases: ['listmenu', 'cmds'],
        cooldown: 5,
        exp: 5,
        usage: 'list',
        category: 'general',
        dm: true
    })
], default_1);
exports.default = default_1;
