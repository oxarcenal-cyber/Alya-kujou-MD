"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Card Upgrade System.
 * Combine two cards of the same character and tier to create an upgraded card.
 * cardupgrade <slot1> <slot2>  — combine two deck/collection cards
 */
const Structures_1 = require("../../Structures");
const CardData_1 = require("../../lib/CardData");
const CardBattleState_1 = require("../../lib/CardBattleState");
const TIER_ORDER = ['1', '2', '3', '4', '5', '6', 'S'];
const MAX_UPGRADE_TIER = 'S';
function nextTier(tier) {
    const idx = TIER_ORDER.indexOf(tier);
    if (idx < 0 || idx >= TIER_ORDER.length - 1)
        return null;
    return TIER_ORDER[idx + 1];
}
function allCards(user) {
    return [
        ...(Array.isArray(user.deck) ? user.deck : []),
        ...(Array.isArray(user.cardCollection) ? user.cardCollection : [])
    ];
}
function cardLine(cardStr, slot) {
    const { title, tier } = (0, CardData_1.parseCard)(cardStr);
    const emoji = CardData_1.TIER_EMOJI[tier] ?? '🃏';
    const name = CardData_1.TIER_NAME[tier] ?? tier;
    return `${slot}. ${emoji} *${title}* — ${name} (T${tier})`;
}
let CardUpgradeCommand = class CardUpgradeCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            // ── Show guide if no args ──────────────────────────────────────────────
            if (!context.trim()) {
                return void await this.client.sendMessage(M.from, {
                    text: this.guide(prefix),
                    footer: 'Tap Open Menu to view your cards.',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'View Cards',
                                    rows: [
                                        { title: '📦 My Deck', description: 'See deck slots for upgrade', id: `${prefix}deck` },
                                        { title: '🗃️ Collection', description: 'See collection cards', id: `${prefix}coll` },
                                        { title: '🃏 All Cards (with slots)', description: 'Full card list with numbers', id: `${prefix}cards` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            const parts = context.trim().split(/\s+/);
            const idx1 = parseInt(parts[0]) - 1;
            const idx2 = parseInt(parts[1]) - 1;
            if (isNaN(idx1) || isNaN(idx2))
                return void await this.client.sendMessage(M.from, {
                    text: `❌ Invalid slots.\n_Usage: \`${prefix}cardupgrade 3 7\`_`,
                    footer: 'Use cards command to see slot numbers.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🃏 View All Cards', id: `${prefix}cards` }]
                }, { quoted: M.message });
            if (idx1 === idx2)
                return void M.reply(`❌ Choose two *different* card slots.`);
            const jid = (0, CardBattleState_1.normalize)(M.sender.jid);
            const user = await this.client.DB.getUser(jid);
            const cards = allCards(user);
            if (idx1 < 0 || idx1 >= cards.length || idx2 < 0 || idx2 >= cards.length)
                return void await this.client.sendMessage(M.from, {
                    text: `❌ Slot out of range. You have *${cards.length}* cards total.`,
                    footer: 'Use cards to see all slots.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🃏 View All Cards', id: `${prefix}cards` }]
                }, { quoted: M.message });
            const card1 = cards[idx1];
            const card2 = cards[idx2];
            const p1 = (0, CardData_1.parseCard)(card1);
            const p2 = (0, CardData_1.parseCard)(card2);
            if (p1.title !== p2.title)
                return void M.reply(`❌ Both cards must be the *same character*.\n\n` +
                    `${cardLine(card1, idx1 + 1)}\n` +
                    `${cardLine(card2, idx2 + 1)}\n\n` +
                    `_Upgrade needs two matching cards._`);
            if (p1.tier !== p2.tier)
                return void M.reply(`❌ Both cards must be the *same tier*.\n\n` +
                    `${cardLine(card1, idx1 + 1)}\n` +
                    `${cardLine(card2, idx2 + 1)}\n\n` +
                    `_Same character AND same tier required._`);
            const newTier = nextTier(p1.tier);
            if (!newTier)
                return void M.reply(`✨ *${p1.title}* is already at max tier (${CardData_1.TIER_EMOJI[p1.tier] ?? ''} T${p1.tier}).\n` +
                    `No further upgrade possible.`);
            const upgradedCard = (0, CardData_1.formatCard)(p1.title, newTier);
            const tierEmoji = CardData_1.TIER_EMOJI;
            const tierName = CardData_1.TIER_NAME;
            const deck = Array.isArray(user.deck) ? [...user.deck] : [];
            const coll = Array.isArray(user.cardCollection) ? [...user.cardCollection] : [];
            let removedCount = 0;
            for (const source of [card1, card2]) {
                const di = deck.indexOf(source);
                if (di >= 0) {
                    deck.splice(di, 1);
                    removedCount++;
                    continue;
                }
                const ci = coll.indexOf(source);
                if (ci >= 0) {
                    coll.splice(ci, 1);
                    removedCount++;
                }
            }
            if (removedCount < 2)
                return void M.reply(`❌ Could not find both cards. Please try again.`);
            let destination;
            if (deck.length < 12) {
                deck.push(upgradedCard);
                destination = 'deck';
            }
            else {
                coll.push(upgradedCard);
                destination = 'collection';
            }
            await this.client.DB.updateUser(jid, 'deck', 'set', deck);
            await this.client.DB.updateUser(jid, 'cardCollection', 'set', coll);
            return void await this.client.sendMessage(M.from, {
                text: `✨ *CARD UPGRADED!*\n\n` +
                    `${tierEmoji[p1.tier] ?? '🃏'} ${p1.title} (T${p1.tier}) × 2\n` +
                    `         ⬇️\n` +
                    `${tierEmoji[newTier] ?? '🃏'} *${p1.title}* — *${tierName[newTier] ?? newTier}* (T${newTier})\n\n` +
                    `Added to your *${destination}*.`,
                footer: 'Tap Open Menu to view your updated cards.',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'View Cards',
                                rows: [
                                    { title: '📦 My Deck', description: 'View active deck', id: `${prefix}deck` },
                                    { title: '🗃️ Collection', description: 'View collection', id: `${prefix}coll` },
                                    { title: '✨ Upgrade More', description: 'Combine more cards', id: `${prefix}cardupgrade` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
    guide(prefix) {
        const tiers = TIER_ORDER.map(t => `  T${t} → T${nextTier(t) ?? '(MAX)'} · ${CardData_1.TIER_EMOJI[t] ?? '🃏'} ${CardData_1.TIER_NAME[t]}`).join('\n');
        return (`✨ *CARD UPGRADE GUIDE*\n\n` +
            `Combine 2 cards of the *same character & tier* to upgrade.\n\n` +
            `*Usage:* \`${prefix}cardupgrade <slot1> <slot2>\`\n` +
            `*Example:* \`${prefix}cardupgrade 3 7\`\n\n` +
            `*Upgrade path:*\n${tiers}`);
    }
};
CardUpgradeCommand = __decorate([
    (0, Structures_1.Command)('cardupgrade', {
        description: 'Combine two identical cards to upgrade to the next tier',
        usage: 'cardupgrade <slot1> <slot2>',
        category: 'cards',
        aliases: ['cupgrade', 'cardmerge'],
        cooldown: 5, exp: 20, dm: false
    })
], CardUpgradeCommand);
exports.default = CardUpgradeCommand;
