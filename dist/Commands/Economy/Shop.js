"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const ShopItems_1 = require("../../lib/ShopItems");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const userData = await this.client.DB.getUser(M.sender.jid);
            let text = `🛒 *ITEM SHOP*\n`;
            text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
            text += `💰 *Your Balance:* ${userData.wallet.toLocaleString()} Gold\n\n`;
            for (let i = 0; i < ShopItems_1.SHOP_ITEMS.length; i++) {
                const item = ShopItems_1.SHOP_ITEMS[i];
                const owned = (userData.inventory || []).filter((k) => k === item.key).length;
                text += `${item.emoji} *${item.name}*\n`;
                text += `   📄 ${item.desc}\n`;
                text += `   💲 *Price:* ${item.price.toLocaleString()} Gold\n`;
                text += `   🔑 Key: \`${item.key}\``;
                if (owned > 0)
                    text += `  ✅ _(owned: ${owned})_`;
                text += `\n\n`;
            }
            text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
            text += `📖 *How to buy:*\n`;
            text += `\`${prefix}buy <item_key>\`\n\n`;
            text += `📦 *View your items:*\n`;
            text += `\`${prefix}inventory\``;
            return void M.reply(text);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('shop', {
        description: 'Browse the item shop 🛒',
        aliases: ['store', 'market'],
        usage: 'shop',
        cooldown: 5,
        exp: 3,
        category: 'economy'
    })
], default_1);
exports.default = default_1;
