"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const CardBattleState_1 = require("../../lib/CardBattleState");
const CardData_1 = require("../../lib/CardData");
const CardPackBuy_1 = require("./CardPackBuy");
const TIER_ORDER = ['1', '2', '3', '4', '5', '6', 'S'];
function pickCardForTier(tier) {
    const pool = CardData_1.ALL_CARDS.filter(c => c.tier === tier);
    const src = pool.length > 0 ? pool : CardData_1.ALL_CARDS;
    const card = src[Math.floor(Math.random() * src.length)];
    return (0, CardData_1.formatCard)(card.title, card.tier);
}
function openPack(def) {
    const cards = Array.from({ length: def.cardCount }, () => pickCardForTier(def.tiers[Math.floor(Math.random() * def.tiers.length)]));
    const minIdx = TIER_ORDER.indexOf(def.guaranteedMinTier);
    if (!cards.some(c => TIER_ORDER.indexOf((0, CardData_1.parseCard)(c).tier) >= minIdx))
        cards[0] = pickCardForTier(def.guaranteedMinTier);
    return cards;
}
let CardOpenCommand = class CardOpenCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const jid = (0, CardBattleState_1.normalize)(M.sender.jid);
            const user = await this.client.DB.getUser(jid);
            const packs = Array.isArray(user.cardPacks) ? [...user.cardPacks] : [];
            if (!packs.length) {
                return void await this.client.sendMessage(M.from, {
                    text: `📦 *No Unopened Packs*\n\nYou don't have any packs to open.\nBuy one from the shop!`,
                    footer: 'Packs contain 2–3 cards each.',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🛒 Browse Shop', id: `${prefix}cardshop` },
                        { text: '💰 Check Wallet', id: `${prefix}wallet` }
                    ]
                }, { quoted: M.message });
            }
            const packId = packs.shift();
            const def = CardPackBuy_1.PACK_DEFS[packId] ?? CardPackBuy_1.PACK_DEFS.basic;
            const newCards = openPack(def);
            await this.client.DB.updateUser(jid, 'cardPacks', 'set', packs);
            const deck = Array.isArray(user.deck) ? [...user.deck] : [];
            const coll = Array.isArray(user.cardCollection) ? [...user.cardCollection] : [];
            let deckAdded = 0, collAdded = 0;
            for (const card of newCards) {
                if (deck.length < 12) {
                    deck.push(card);
                    deckAdded++;
                }
                else {
                    coll.push(card);
                    collAdded++;
                }
            }
            await this.client.DB.updateUser(jid, 'deck', 'set', deck);
            await this.client.DB.updateUser(jid, 'cardCollection', 'set', coll);
            const lines = newCards.map(c => {
                const { title, tier } = (0, CardData_1.parseCard)(c);
                return `${CardData_1.TIER_EMOJI[tier] ?? '🃏'} *${title}* — ${CardData_1.TIER_NAME[tier] ?? tier} (T${tier})`;
            });
            const destNote = deckAdded > 0
                ? `📦 ${deckAdded} card(s) → deck${collAdded > 0 ? ` · ${collAdded} → collection` : ''}`
                : `🗃️ ${collAdded} card(s) → collection`;
            const moreNote = packs.length > 0
                ? `📦 ${packs.length} pack(s) still unopened.`
                : `📦 No more packs. Buy more from the shop.`;
            return void await this.client.sendMessage(M.from, {
                text: `${def.emoji} *${def.label.toUpperCase()} OPENED!*\n\n` +
                    `You received:\n${lines.join('\n')}\n\n` +
                    `${destNote}\n${moreNote}`,
                footer: 'View your cards below.',
                buttonsFormat: 'buttons',
                buttons: packs.length > 0
                    ? [
                        { text: '📦 Open Next Pack', id: `${prefix}cardopen` },
                        { text: '🃏 View Deck', id: `${prefix}deck` }
                    ]
                    : [
                        { text: '🃏 View Deck', id: `${prefix}deck` },
                        { text: '🛒 Buy More', id: `${prefix}cardshop` }
                    ]
            }, { quoted: M.message });
        };
    }
};
CardOpenCommand = __decorate([
    (0, Structures_1.Command)('cardopen', {
        description: 'Open your next card pack and receive the cards',
        usage: 'cardopen',
        category: 'cards',
        aliases: ['openpack', 'copen'],
        cooldown: 3, exp: 15, dm: false
    })
], CardOpenCommand);
exports.default = CardOpenCommand;
