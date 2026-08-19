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
let CardsCommand = class CardsCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const user = await this.client.DB.getUser(M.sender.jid);
            const deck = user.deck ?? [];
            const cardCollection = user.cardCollection ?? [];
            const all = [...deck, ...cardCollection];
            if (all.length === 0) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('card_no_cards_yet', lang, { p: prefix }),
                    footer: 'Open the Card Game Hub to get started.',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Get Cards',
                                    rows: [
                                        { title: '🛒 Card Shop', description: 'Buy packs', id: `${prefix}cardshop` },
                                        { title: '📦 Open Pack', description: 'Open your packs', id: `${prefix}cardopen` },
                                        { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            const flag = context.trim().toLowerCase();
            if (flag === '--tier') {
                const tiers = {};
                all.forEach(c => {
                    const { title, tier } = (0, CardData_1.parseCard)(c);
                    if (!tiers[tier])
                        tiers[tier] = [];
                    tiers[tier].push(title);
                });
                let tr = `*🃏 ${M.sender.username}'s Cards (Tier-wise)*\n\n`;
                for (const tier of ['S', '6', '5', '4', '3', '2', '1']) {
                    if (!tiers[tier])
                        continue;
                    const te = CardData_1.TIER_EMOJI[tier] ?? '🃏';
                    tr += `*${te} Tier ${tier}:*\n`;
                    tiers[tier].forEach((name, i) => { tr += `  ${i + 1}. ${name}\n`; });
                    tr += '\n';
                }
                tr += `📦 *Deck:* ${deck.length}/12  |  🗃️ *Collection:* ${cardCollection.length}`;
                return void await this.client.sendMessage(M.from, {
                    text: tr,
                    footer: 'Tap Open Menu for more options.',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: 'Card Actions',
                                    rows: [
                                        { title: '📦 My Deck', description: 'View deck', id: `${prefix}deck` },
                                        { title: '🗃️ Collection', description: 'View collection', id: `${prefix}coll` },
                                        { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            const list = flag === '--name' ? [...all].sort() : all;
            let tr = `*🃏 ${M.sender.username}'s Cards*\n\n`;
            list.forEach((c, i) => {
                const { title, tier } = (0, CardData_1.parseCard)(c);
                const src = deck.includes(c) ? '🗡️' : '🗃️';
                const te = CardData_1.TIER_EMOJI[tier] ?? '🃏';
                tr += `*${i + 1}.* ${src} ${te} ${title} _(T${tier})_\n`;
            });
            tr += `\n📦 *Deck:* ${deck.length}/12  |  🗃️ *Coll:* ${cardCollection.length}\n`;
            tr += `_\`${prefix}cards --tier\`  |  \`${prefix}cards --name\`_`;
            return void await this.client.sendMessage(M.from, {
                text: tr,
                footer: 'Tap Open Menu for card actions.',
                buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                                title: 'Card Actions',
                                rows: [
                                    { title: '📦 My Deck', description: 'View deck', id: `${prefix}deck` },
                                    { title: '🗃️ Collection', description: 'View collection', id: `${prefix}coll` },
                                    { title: '✨ Upgrade Card', description: 'Combine cards to upgrade', id: `${prefix}cardupgrade` },
                                    { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                                ]
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
CardsCommand = __decorate([
    (0, Structures_1.Command)('cards', {
        description: 'View all your cards (deck + collection)',
        usage: 'cards  /  cards --tier  /  cards --name',
        category: 'cards',
        aliases: ['mycards', 'allcards'],
        cooldown: 5,
        dm: false,
        exp: 0
    })
], CardsCommand);
exports.default = CardsCommand;
