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
let CancelSaleCommand = class CancelSaleCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, _) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const sale = CardData_1.cardSales.get(M.from);
            if (!sale) {
                return void await this.client.sendMessage(M.from, {
                    text: (0, lib_1.t)('sale_none', lang),
                    footer: 'No active sale in this group.',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
                }, { quoted: M.message });
            }
            if (this.client.correctJid(sale.seller) !== this.client.correctJid(M.sender.jid)) {
                const isMod = this.client.config.mods.some(m => this.client.correctJid(m) === this.client.correctJid(M.sender.jid));
                if (!M.sender.isAdmin && !isMod)
                    return void M.reply((0, lib_1.t)('sale_cancel_denied', lang));
            }
            CardData_1.cardSales.delete(M.from);
            return void await this.client.sendMessage(M.from, {
                text: (0, lib_1.t)('sale_cancelled', lang, {
                    title: sale.cardTitle,
                    tier: sale.cardTier
                }),
                footer: 'Card is back in your deck.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🃏 Card Game Hub', id: `${prefix}cardgame` }]
            }, { quoted: M.message });
        };
    }
};
CancelSaleCommand = __decorate([
    (0, Structures_1.Command)('cancelsale', {
        description: 'Cancel your active card sale',
        usage: 'cancelsale',
        category: 'cards',
        aliases: ['csale', 'cancelsell'],
        cooldown: 5,
        dm: false,
        exp: 0
    })
], CancelSaleCommand);
exports.default = CancelSaleCommand;
