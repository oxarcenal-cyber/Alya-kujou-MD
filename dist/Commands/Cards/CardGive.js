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
let CardGiveCommand = class CardGiveCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            if (!M.mentioned || M.mentioned.length === 0) {
                return void await this.client.sendMessage(M.from, {
                    text: `*🃏 CARD GIVE*\n\n` +
                        `*Usage:* \`${prefix}cardgive <deck index> @user\`\n` +
                        `*Example:* \`${prefix}cardgive 3 @someone\`\n\n` +
                        `_Use \`${prefix}deck\` to find your card number_`,
                    footer: 'View your deck first.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                }, { quoted: M.message });
            }
            const idx = parseInt(context.trim().split(' ')[0]) - 1;
            if (isNaN(idx) || idx < 0) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('card_valid_card_idx', lang, { p: prefix }),
                    footer: 'View your deck to find the index.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                }, { quoted: M.message });
            }
            const recipient = this.client.correctJid(M.mentioned[0]);
            if (recipient === this.client.correctJid(M.sender.jid))
                return void M.reply((0, lib_1.t)('card_give_self', lang));
            const user = await this.client.DB.getUser(M.sender.jid);
            const deck = user.deck ?? [];
            if (deck.length === 0) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('card_empty_deck', lang),
                    footer: 'Buy packs to get cards.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🛒 Card Shop', id: `${prefix}cardshop` }]
                }, { quoted: M.message });
            }
            if (idx >= deck.length) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('card_invalid_idx', lang, { max: String(deck.length) }),
                    footer: 'Check your deck.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
                }, { quoted: M.message });
            }
            // Positions 9-11 (index 8-11) are protected
            if (idx >= 9)
                return void M.reply((0, lib_1.t)('card_give_protected', lang));
            const cardStr = deck[idx];
            const { title, tier } = (0, CardData_1.parseCard)(cardStr);
            const te = CardData_1.TIER_EMOJI[tier] ?? '🃏';
            // Remove from sender
            deck.splice(idx, 1);
            await this.client.DB.updateUser(M.sender.jid, 'deck', 'set', deck);
            // Add to recipient
            const recipientUser = await this.client.DB.getUser(recipient);
            const recipientDeck = recipientUser.deck ?? [];
            const recipientColl = recipientUser.cardCollection ?? [];
            let storedIn = 'deck';
            if (recipientDeck.length < 12) {
                recipientDeck.push(cardStr);
                await this.client.DB.updateUser(recipient, 'deck', 'set', recipientDeck);
            }
            else {
                recipientColl.push(cardStr);
                await this.client.DB.updateUser(recipient, 'cardCollection', 'set', recipientColl);
                storedIn = 'collection';
            }
            return void await this.client.sendMessage(M.from, {
                text: (0, lib_1.t)('card_give_success', lang, {
                    te,
                    title,
                    tier,
                    from: M.sender.username,
                    to: recipient.split('@')[0],
                    stored: storedIn
                }),
                footer: 'Tap Open Menu to manage your cards.',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '📦 My Deck', id: `${prefix}deck` },
                    { text: '🗃️ Collection', id: `${prefix}coll` }
                ]
            }, { quoted: M.message, ...[recipient] });
        };
    }
};
CardGiveCommand = __decorate([
    (0, Structures_1.Command)('cardgive', {
        description: 'Give one of your cards to someone',
        usage: 'cardgive <deck index> @user',
        category: 'cards',
        aliases: ['cgive', 'givecard'],
        cooldown: 10,
        dm: false,
        exp: 0
    })
], CardGiveCommand);
exports.default = CardGiveCommand;
