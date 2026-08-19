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
let BuyCardCommand = class BuyCardCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const shopId = parseInt(context.trim());
            if (isNaN(shopId)) {
                return void await this.client.sendMessage(M.from, {
                    text: `*🛒 BUY CARD*\n\n` +
                        `*Usage:* \`${prefix}buycard <shop ID>\`\n` +
                        `*Example:* \`${prefix}buycard 45231\`\n\n` +
                        `_Get the Shop ID from the sale listing_`,
                    footer: 'Shop ID is shown in the salecard message.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
                }, { quoted: M.message });
            }
            const sale = CardData_1.cardSales.get(M.from);
            if (!sale) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('sale_none', lang),
                    footer: 'No active sale in this group.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
                }, { quoted: M.message });
            }
            if (sale.shopId !== shopId)
                return void M.reply((0, lib_1.t)('card_wrong_shop_id', lang));
            if (this.client.correctJid(sale.seller) === this.client.correctJid(M.sender.jid))
                return void M.reply((0, lib_1.t)('sale_own', lang));
            const buyer = await this.client.DB.getUser(M.sender.jid);
            if (buyer.wallet < sale.price) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('sale_no_gold', lang, {
                        price: sale.price.toLocaleString(),
                        wallet: buyer.wallet.toLocaleString()
                    }),
                    footer: 'Not enough gold.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎯 Daily Missions', id: `${prefix}cardmissions` }]
                }, { quoted: M.message });
            }
            const sellerUser = await this.client.DB.getUser(sale.seller);
            const sellerDeck = sellerUser.deck ?? [];
            if (sale.cardIdx >= sellerDeck.length) {
                CardData_1.cardSales.delete(M.from);
                return void M.reply((0, lib_1.t)('sale_stale', lang));
            }
            const cardStr = sellerDeck[sale.cardIdx];
            await this.client.DB.setCrystal(M.sender.jid, -sale.price);
            await this.client.DB.setCrystal(sale.seller, sale.price);
            sellerDeck.splice(sale.cardIdx, 1);
            await this.client.DB.updateUser(sale.seller, 'deck', 'set', sellerDeck);
            const buyerDeck = buyer.deck ?? [];
            const buyerColl = buyer.cardCollection ?? [];
            let storedIn = 'deck';
            if (buyerDeck.length < 12) {
                buyerDeck.push(cardStr);
                await this.client.DB.updateUser(M.sender.jid, 'deck', 'set', buyerDeck);
            }
            else {
                buyerColl.push(cardStr);
                await this.client.DB.updateUser(M.sender.jid, 'cardCollection', 'set', buyerColl);
                storedIn = 'collection';
            }
            CardData_1.cardSales.delete(M.from);
            const sellerName = this.client.contact.getContact(sale.seller).username;
            return void await this.client.sendMessage(M.from, {
                text: (0, lib_1.t)('sale_success', lang, {
                    title: sale.cardTitle,
                    tier: sale.cardTier,
                    paid: sale.price.toLocaleString(),
                    seller: sellerName,
                    stored: storedIn
                }),
                footer: 'Card added to your ' + storedIn + '.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '📦 View My Deck', id: `${prefix}deck` }]
            }, { quoted: M.message });
        };
    }
};
BuyCardCommand = __decorate([
    (0, Structures_1.Command)('buycard', {
        description: 'Buy a card listed for sale',
        usage: 'buycard <shopID>',
        category: 'cards',
        aliases: ['buycrd'],
        cooldown: 5,
        dm: false,
        exp: 0
    })
], BuyCardCommand);
exports.default = BuyCardCommand;
