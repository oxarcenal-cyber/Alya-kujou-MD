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
const PAGE_SIZE = 8; // cards per page shown as images
let MyCollectionCommand = class MyCollectionCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const user = await this.client.DB.getUser(M.sender.jid);
            const coll = user.cardCollection ?? [];
            if (coll.length === 0)
                return void M.reply((0, lib_1.t)('card_empty_coll_hint', lang, { p: prefix }));
            const ctx = context.trim();
            // ── Specific card image: coll <num> ────────────────────────────────
            const cardIdx = parseInt(ctx);
            if (!isNaN(cardIdx) && cardIdx >= 1 && cardIdx <= coll.length) {
                const { title, tier } = (0, CardData_1.parseCard)(coll[cardIdx - 1]);
                const cardData = (0, CardData_1.findCard)(title, tier);
                if (!cardData)
                    return void M.reply((0, lib_1.t)('card_not_found_msg', lang));
                const te = CardData_1.TIER_EMOJI[tier] ?? '🃏';
                const tn = CardData_1.TIER_NAME[tier] ?? tier;
                const caption = `${te} *${title}*\n` +
                    `🏷️ *Tier:* ${tier} — ${tn}\n` +
                    `📍 *Collection position:* #${cardIdx}\n` +
                    `🗃️ *Total collection:* ${coll.length}`;
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
                    return void M.reply(caption + `\n\n${(0, lib_1.t)('card_image_failed', lang)}`);
                }
            }
            // ── Paginated menu view: coll  or  coll p<N> ───────────────────────
            const totalPages = Math.ceil(coll.length / PAGE_SIZE);
            let page = 1;
            const pageMatch = ctx.match(/^p(\d+)$/i);
            if (pageMatch)
                page = Math.max(1, Math.min(parseInt(pageMatch[1]), totalPages));
            const start = (page - 1) * PAGE_SIZE;
            const end = Math.min(start + PAGE_SIZE, coll.length);
            // Build list rows for current page cards
            const rows = coll.slice(start, end).map((c, idx) => {
                const { title, tier } = (0, CardData_1.parseCard)(c);
                const te = CardData_1.TIER_EMOJI[tier] ?? '🃏';
                const tn = CardData_1.TIER_NAME[tier] ?? tier;
                const globalIdx = start + idx + 1;
                return {
                    title: `${te} ${title}`,
                    description: `Tier ${tier} — ${tn} • #${globalIdx}`,
                    id: `${prefix}coll ${globalIdx}`
                };
            });
            // Add next page navigation row if more pages exist
            const sections = [
                { title: `🗃️ Page ${page}/${totalPages}`, rows }
            ];
            if (page < totalPages) {
                sections.push({
                    title: '📄 Navigation',
                    rows: [{
                            title: `➡️ Next Page (${page + 1}/${totalPages})`,
                            description: `Cards ${start + PAGE_SIZE + 1}–${Math.min(start + PAGE_SIZE * 2, coll.length)}`,
                            id: `${prefix}coll p${page + 1}`
                        }]
                });
            }
            if (page > 1) {
                const navSection = sections.find(s => s.title === '📄 Navigation');
                const prevRow = {
                    title: `⬅️ Prev Page (${page - 1}/${totalPages})`,
                    description: `Cards ${(page - 2) * PAGE_SIZE + 1}–${(page - 1) * PAGE_SIZE}`,
                    id: `${prefix}coll p${page - 1}`
                };
                if (navSection)
                    navSection.rows.unshift(prevRow);
                else
                    sections.push({ title: '📄 Navigation', rows: [prevRow] });
            }
            await this.client.sendMessage(M.from, {
                text: `🗃️ *${M.sender.username}'s Collection* (${coll.length} cards)\n📄 Page ${page}/${totalPages}\n\n💡 Tap a card to view it`,
                footer: '⚡ RedzeoX',
                title: '🗃️ My Collection',
                buttons: [
                    {
                        text: '📋 Open Collection',
                        sections
                    }
                ]
            }, { quoted: M.message });
        };
    }
};
MyCollectionCommand = __decorate([
    (0, Structures_1.Command)('collection', {
        description: 'View your card collection with images/GIFs',
        usage: 'coll  /  coll <index>  /  coll p2',
        category: 'cards',
        aliases: ['coll', 'mycoll'],
        cooldown: 5,
        dm: false,
        exp: 0
    })
], MyCollectionCommand);
exports.default = MyCollectionCommand;
