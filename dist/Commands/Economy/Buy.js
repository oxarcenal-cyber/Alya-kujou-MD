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
const BadgeList_1 = require("../../lib/BadgeList");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const key = context.trim().toLowerCase().split(' ')[0];
            if (!key)
                return void M.reply(`🛒 *BUY*\n` +
                    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                    `📖 *How to use:*\n` +
                    `\`${prefix}buy <item_key>\`\n\n` +
                    `_Use \`${prefix}shop\` to see all items_`);
            const item = (0, ShopItems_1.getShopItem)(key);
            if (!item)
                return void M.reply(`❌ Item *${key}* not found in the shop!\n\n` +
                    `_Use \`${prefix}shop\` to see all available items_`);
            const userData = await this.client.DB.getUser(M.sender.jid);
            if (userData.wallet < item.price)
                return void M.reply(`💸 *Not enough gold!*\n\n` +
                    `💰 *You have:* ${userData.wallet.toLocaleString()} Gold\n` +
                    `💲 *Cost:* ${item.price.toLocaleString()} Gold\n` +
                    `📉 *Short by:* ${(item.price - userData.wallet).toLocaleString()} Gold\n\n` +
                    `_Use \`${prefix}daily\` to earn more gold!_`);
            // Handle instant-use items
            if (item.key === 'coin_bag') {
                await this.client.DB.setCrystal(M.sender.jid, -item.price, 'wallet');
                await this.client.DB.setCrystal(M.sender.jid, 500, 'wallet');
                await (0, BadgeList_1.checkAndAwardBadges)(M.sender.jid, this.client.DB);
                return void M.reply(`💰 *COIN BAG OPENED!*\n\n` +
                    `💸 *Paid:* ${item.price.toLocaleString()} Gold\n` +
                    `🎁 *Received:* +500 Gold bonus!\n\n` +
                    `_Net gain: ${500 - item.price > 0 ? '+' : ''}${500 - item.price} Gold_`);
            }
            if (item.key === 'xp_scroll') {
                await this.client.DB.setCrystal(M.sender.jid, -item.price, 'wallet');
                await this.client.DB.setExp(M.sender.jid, 200);
                await (0, BadgeList_1.checkAndAwardBadges)(M.sender.jid, this.client.DB);
                return void M.reply(`📜 *XP SCROLL USED!*\n\n` +
                    `💸 *Paid:* ${item.price.toLocaleString()} Gold\n` +
                    `✨ *Received:* +200 EXP!\n\n` +
                    `_Use \`${prefix}rank\` to check your level_`);
            }
            if (item.key === 'mystery_box') {
                const reward = 100 + Math.floor(Math.random() * 2901); // 100–3000
                await this.client.DB.setCrystal(M.sender.jid, -item.price, 'wallet');
                await this.client.DB.setCrystal(M.sender.jid, reward, 'wallet');
                await (0, BadgeList_1.checkAndAwardBadges)(M.sender.jid, this.client.DB);
                const profit = reward - item.price;
                return void M.reply(`🎁 *MYSTERY BOX OPENED!*\n\n` +
                    `💸 *Paid:* ${item.price.toLocaleString()} Gold\n` +
                    `✨ *Found inside:* ${reward.toLocaleString()} Gold!\n` +
                    `${profit >= 0 ? `🤑 *Profit: +${profit.toLocaleString()} Gold!* 🎉` : `😅 *Loss: ${profit.toLocaleString()} Gold*`}`);
            }
            // Add to inventory for non-instant items
            await this.client.DB.setCrystal(M.sender.jid, -item.price, 'wallet');
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $push: { inventory: item.key } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            await (0, BadgeList_1.checkAndAwardBadges)(M.sender.jid, this.client.DB);
            return void M.reply(`✅ *PURCHASE SUCCESSFUL!*\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `${item.emoji} *${item.name}* added to your inventory!\n\n` +
                `💸 *Paid:* ${item.price.toLocaleString()} Gold\n` +
                `💰 *Remaining:* ${(userData.wallet - item.price).toLocaleString()} Gold\n\n` +
                `_Use \`${prefix}inventory\` to view your items_`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('buy', {
        description: 'Buy an item from the shop 💳',
        aliases: ['purchase'],
        usage: 'buy <item_key>',
        cooldown: 5,
        exp: 5,
        category: 'economy'
    })
], default_1);
exports.default = default_1;
