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
let CollectCommand = class CollectCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, _) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const card = this.handler.cardResponse.get(M.from);
            if (!card)
                return void M.reply((0, lib_1.t)('card_not_available', lang));
            const user = await this.client.DB.getUser(M.sender.jid);
            const wallet = user.wallet;
            if (wallet < card.price)
                return void M.reply((0, lib_1.t)('card_no_gold', lang, {
                    price: card.price.toLocaleString(),
                    wallet: wallet.toLocaleString()
                }));
            // Deduct gold
            await this.client.DB.setCrystal(M.sender.jid, -card.price);
            // Re-fetch user after gold deduction (cache was invalidated by setCrystal)
            const freshUser = await this.client.DB.getUser(M.sender.jid);
            const deck = freshUser.deck ?? [];
            const cardCollection = freshUser.cardCollection ?? [];
            let storedIn = 'deck';
            if (deck.length < 12) {
                deck.push(card.card);
                // Direct $set — same pattern as Pokemon commands (100% reliable)
                await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { deck } });
                this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            }
            else {
                cardCollection.push(card.card);
                await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { cardCollection } });
                this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
                storedIn = 'collection';
            }
            this.handler.cardResponse.delete(M.from);
            // ── Special spawn: immediately edit the spawn message ───────────────
            const spawnInfo = this.handler.specialSpawnInfo.get(M.from);
            if (spawnInfo && !spawnInfo.claimedBy) {
                const claimerName = M.sender.username || M.sender.jid.split('@')[0];
                spawnInfo.claimedBy = claimerName;
                // Cancel the 15-min expiry timer — card is already taken
                clearTimeout(spawnInfo.timer);
                this.handler.specialSpawnInfo.delete(M.from);
                // Build the updated caption
                const te2 = spawnInfo.isEvent ? '🎉' : '💎';
                const tierLbl = spawnInfo.isEvent ? 'EVENT — Limited Edition' : 'S — GOD TIER 💎';
                const editedCaption = `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                    `  🌸✿ᰰ  *${spawnInfo.title}*  ✿ᰰ🌸\n` +
                    `      𐚁 ✅ 𝑪𝒂𝒓𝒅 𝑪𝒐𝒍𝒍𝒆𝒄𝒕𝒆𝒅! ✅ 𐚁\n\n` +
                    `  ‧₊˚ ${te2} 𝑻𝒊𝒆𝒓   ·❀·  ${tierLbl}\n` +
                    `  ‧₊˚ 💰 𝑷𝒂𝒊𝒅   ·❀·  ${spawnInfo.price.toLocaleString()} gold\n` +
                    `  ‧₊˚ 👤 𝑩𝒚     ·❀·  @${M.sender.jid.split('@')[0]}\n` +
                    `  ‧₊˚ 🎖️  𝑺𝒑𝒂𝒘𝒏  ·❀·  ${spawnInfo.spawnedBy}\n\n` +
                    `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
                    `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑺𝒐𝒍𝒅 𖥻ִֶָ`;
                if (spawnInfo.msgKey) {
                    this.client.sendMessage(M.from, {
                        text: editedCaption,
                        mentions: [M.sender.jid],
                        edit: spawnInfo.msgKey
                    }).catch(() => { });
                }
            }
            const tierEmoji = {
                '1': '⚪', '2': '💧', '3': '🌿', '4': '⚡', '5': '🔥', '6': '🌊', 'S': '👑', 'EVENT': '🎉'
            };
            const te = tierEmoji[card.tier] ?? '🃏';
            return void await this.client.sendMessage(M.from, {
                text: (0, lib_1.t)('card_claimed', lang, {
                    te,
                    title: card.cardTitle,
                    tier: card.tier,
                    paid: card.price.toLocaleString(),
                    stored: storedIn,
                    p: prefix
                }),
                footer: '⚡ RedzeoX',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '📋 My Deck', id: `${prefix}deck` },
                    { text: '🃏 My Collection', id: `${prefix}collection` }
                ]
            }, { quoted: M.message });
        };
    }
};
CollectCommand = __decorate([
    (0, Structures_1.Command)('collect', {
        description: 'Claim a spawned card',
        usage: 'collect',
        category: 'cards',
        aliases: ['claimcard', 'getcardnow'], // 'claim' removed — conflicts with chara & pokemon claim
        cooldown: 5,
        dm: false,
        exp: 5
    })
], CollectCommand);
exports.default = CollectCommand;
