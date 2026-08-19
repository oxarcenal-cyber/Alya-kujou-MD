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
            const inv = userData.inventory || [];
            if (inv.length === 0)
                return void M.reply(`📦 *YOUR INVENTORY*\n` +
                    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                    `😔 *Your inventory is empty!*\n\n` +
                    `🛒 Visit the shop to buy items:\n` +
                    `\`${prefix}shop\``);
            // Count each item
            const counts = new Map();
            for (const key of inv)
                counts.set(key, (counts.get(key) || 0) + 1);
            let text = `📦 *YOUR INVENTORY*\n`;
            text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
            text += `💰 *Balance:* ${userData.wallet.toLocaleString()} Gold\n`;
            text += `📦 *Items:* ${inv.length} total\n\n`;
            for (const [key, count] of counts) {
                const item = (0, ShopItems_1.getShopItem)(key);
                if (!item)
                    continue;
                text += `${item.emoji} *${item.name}* ×${count}\n`;
                text += `   _${item.desc}_\n`;
                if (item.usable)
                    text += `   🔧 Use: \`${prefix}use ${key}\`\n`;
                text += `\n`;
            }
            text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
            text += `🛒 Buy more: \`${prefix}shop\``;
            return void M.reply(text);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('inventory', {
        description: 'View your owned items 📦',
        aliases: ['inv', 'items', 'bag'],
        usage: 'inventory',
        cooldown: 5,
        exp: 3,
        category: 'economy'
    })
], default_1);
exports.default = default_1;
