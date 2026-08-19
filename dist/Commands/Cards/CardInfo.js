"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const CardData_1 = require("../../lib/CardData");
const lib_1 = require("../../lib");
let CardInfoCommand = class CardInfoCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            if (!context.trim()) {
                return void await this.client.sendMessage(M.from, {
                    text: `*ℹ️ CARD INFO*\n\n` +
                        `*Usage:* \`${prefix}cardinfo <name>\`\n` +
                        `*Example:* \`${prefix}cardinfo Asuna Yuuki\`\n` +
                        `_Filter by tier: \`${prefix}cardinfo Asuna Yuuki-4\`_`,
                    footer: 'Tap Open Menu to browse cards.',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Quick Links',
                                    rows: [
                                        { title: '🛒 Card Shop', description: 'Buy card packs', id: `${prefix}cardshop` },
                                        { title: '📦 My Deck', description: 'View your deck', id: `${prefix}deck` },
                                        { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            const input = context.trim();
            const lastDash = input.lastIndexOf('-');
            let title = input;
            let tierFilter = '';
            if (lastDash > 0) {
                const possibleTier = input.substring(lastDash + 1);
                if (['1', '2', '3', '4', '5', '6', 'S'].includes(possibleTier)) {
                    title = input.substring(0, lastDash);
                    tierFilter = possibleTier;
                }
            }
            const titleLower = title.toLowerCase();
            let card = tierFilter
                ? CardData_1.ALL_CARDS.find(c => c.title.toLowerCase() === titleLower && c.tier === tierFilter)
                : CardData_1.ALL_CARDS.find(c => c.title.toLowerCase() === titleLower);
            if (!card)
                card = CardData_1.ALL_CARDS.find(c => c.title.toLowerCase().includes(titleLower));
            if (!card) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('card_not_found_input', lang, { input, p: prefix }),
                    footer: 'Try a different card name.',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🛒 Card Shop', id: `${prefix}cardshop` },
                        { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
                    ]
                }, { quoted: M.message });
            }
            const te = CardData_1.TIER_EMOJI[card.tier] ?? '🃏';
            const tn = CardData_1.TIER_NAME[card.tier] ?? card.tier;
            const caption = `${te} *${card.title}*\n` +
                `🏷️ Tier: ${card.tier} — ${tn}\n` +
                `🔗 Type: ${card.url.endsWith('.gif') ? 'Animated GIF ✨' : 'Image'}`;
            try {
                if (card.url.toLowerCase().endsWith('.gif')) {
                    const gifBuf = await this.client.utils.getBuffer(card.url);
                    const mp4Buf = await this.client.utils.gifToMp4(gifBuf);
                    return void await this.client.sendMessage(M.from, {
                        video: mp4Buf,
                        caption,
                        gifPlayback: true,
                        mimetype: 'video/mp4'
                    });
                }
                else {
                    const buffer = await this.client.utils.getBuffer(card.url);
                    return void await M.reply(buffer, 'image', undefined, undefined, caption);
                }
            }
            catch {
                return void await this.client.sendMessage(M.from, {
                    text: caption + `\n\n${(0, lib_1.t)('card_image_failed', lang)}\n🔗 ${card.url}`,
                    footer: 'Tap Open Menu to continue.',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🛒 Card Shop', id: `${prefix}cardshop` },
                        { text: '🃏 Card Game Hub', id: `${prefix}cardgame` }
                    ]
                }, { quoted: M.message });
            }
        };
    }
};
CardInfoCommand = __decorate([
    (0, Structures_1.Command)('cardinfo', {
        description: 'View image and info for any card',
        usage: 'cardinfo <card name>',
        category: 'cards',
        aliases: ['acard', 'aboutcard', 'cinfo'],
        cooldown: 5,
        dm: true,
        exp: 0
    })
], CardInfoCommand);
exports.default = CardInfoCommand;
