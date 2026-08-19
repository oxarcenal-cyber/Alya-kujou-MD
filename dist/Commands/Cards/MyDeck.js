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
let MyDeckCommand = class MyDeckCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const user = await this.client.DB.getUser(M.sender.jid);
            const deck = user.deck ?? [];
            if (deck.length === 0)
                return void M.reply((0, lib_1.t)('card_empty_deck_hint', lang, { p: prefix }));
            const ctx = context.trim();
            const idx = parseInt(ctx);
            // ── Specific card view ──────────────────────────────────────────────
            if (!isNaN(idx) && idx >= 1 && idx <= deck.length) {
                const { title, tier } = (0, CardData_1.parseCard)(deck[idx - 1]);
                const cardData = (0, CardData_1.findCard)(title, tier);
                if (!cardData)
                    return void M.reply((0, lib_1.t)('card_not_found_msg', lang));
                const te = CardData_1.TIER_EMOJI[tier] ?? '🃏';
                const tn = CardData_1.TIER_NAME[tier] ?? tier;
                const caption = `${te} *${title}*\n` +
                    `🏷️ *Tier:* ${tier} — ${tn}\n` +
                    `📍 *Deck position:* #${idx}\n` +
                    `📦 *Total deck:* ${deck.length}/12`;
                try {
                    const gif = (0, CardData_1.isGif)(cardData.url);
                    if (gif) {
                        const gifBuf = await this.client.utils.getBuffer(cardData.url);
                        const mp4Buf = await this.client.utils.gifToMp4(gifBuf);
                        return void await this.client.sendMessage(M.from, {
                            video: mp4Buf, caption, gifPlayback: true, mimetype: 'video/mp4'
                        });
                    }
                    else {
                        const buffer = await this.client.utils.getBufferCapped(cardData.url, 5 * 1024 * 1024);
                        if (buffer)
                            return void await M.reply(buffer, 'image', undefined, undefined, caption);
                        return void M.reply(caption + `\n\n⚠️ _Image unavailable_\n🔗 ${cardData.url}`);
                    }
                }
                catch {
                    return void M.reply(caption + `\n\n${(0, lib_1.t)('card_image_failed', lang)}\n🔗 ${cardData.url}`);
                }
            }
            // ── Full deck — Open Menu list button ──────────────────────────────
            const rows = deck.map((c, i) => {
                const { title, tier } = (0, CardData_1.parseCard)(c);
                const te = CardData_1.TIER_EMOJI[tier] ?? '🃏';
                const tn = CardData_1.TIER_NAME[tier] ?? tier;
                return {
                    title: `${te} ${title}`,
                    description: `Tier ${tier} — ${tn} • Slot #${i + 1}`,
                    id: `${prefix}deck ${i + 1}`
                };
            });
            await this.client.sendMessage(M.from, {
                text: `📦 *${M.sender.username}'s Deck* (${deck.length}/12)\n\n💡 Tap a card below to view it`,
                footer: '⚡ RedzeoX',
                title: '🃏 My Deck',
                buttons: [
                    {
                        text: '📋 Open Deck',
                        sections: [{ title: '🃏 Your Cards', rows }]
                    }
                ]
            }, { quoted: M.message });
        };
    }
};
MyDeckCommand = __decorate([
    (0, Structures_1.Command)('deck', {
        description: 'View your deck — all cards shown as images/GIFs',
        usage: 'deck  /  deck <index>',
        category: 'cards',
        aliases: ['mydeck', 'viewdeck'],
        cooldown: 5,
        dm: false,
        exp: 0
    })
], MyDeckCommand);
exports.default = MyDeckCommand;
