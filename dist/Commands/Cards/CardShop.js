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
const CardPackBuy_1 = require("./CardPackBuy");
let CardShopCommand = class CardShopCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const user = await this.client.DB.getUser((0, CardBattleState_1.normalize)(M.sender.jid));
            const wallet = user.wallet ?? 0;
            const pending = Array.isArray(user.cardPacks) ? user.cardPacks : [];
            const rows = Object.values(CardPackBuy_1.PACK_DEFS).map(p => ({
                title: `${p.emoji} ${p.label} — ${p.price.toLocaleString()} gold`,
                description: p.description,
                id: `${prefix}cardpack ${p.id}`
            }));
            const lines = Object.values(CardPackBuy_1.PACK_DEFS).map(p => `${p.emoji} *${p.label}* — ${p.price.toLocaleString()} gold\n   ${p.description}`);
            return void await this.client.sendMessage(M.from, {
                text: `🛒 *CARD PACK SHOP*\n\n` +
                    lines.join('\n\n') +
                    `\n\n─────────────────\n` +
                    `💰 Your gold: *${wallet.toLocaleString()}*\n` +
                    `📦 Unopened packs: *${pending.length}*`,
                footer: 'Tap Open Shop to choose a pack.',
                title: '🛒 Card Pack Shop',
                buttons: [{
                        text: '🛒 Open Shop',
                        sections: [{
                                title: 'Available Packs',
                                rows
                            }]
                    }]
            }, { quoted: M.message });
        };
    }
};
CardShopCommand = __decorate([
    (0, Structures_1.Command)('cardshop', {
        description: 'Browse the card pack shop',
        usage: 'cardshop',
        category: 'cards',
        aliases: ['cshop', 'packshop'],
        cooldown: 5, exp: 5, dm: false
    })
], CardShopCommand);
exports.default = CardShopCommand;
