"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const wa_sticker_formatter_1 = require("wa-sticker-formatter");
const Structures_1 = require("../../Structures");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args }) => {
            const directions = ['left', 'right'];
            if (M.numbers.length < 1 || args.length < 1)
                return void M.reply(`❌ Invalid usage!\nExample: *${this.client.config.prefix}gamble right 500*`);
            const amount = M.numbers[0];
            const { wallet } = await this.client.DB.getUser(M.sender.jid);
            if ((wallet - amount) < 300)
                return void M.reply(`❌ You need at least 300 gold in your wallet!\n💎 *Wallet:* ${wallet}`);
            if (amount > 10000)
                return void M.reply(`🟥 You can't gamble more than *10,000 gold* at once.`);
            const direction = args[1];
            if (!directions.includes(direction))
                return void M.reply(`❌ Choose *left* or *right*!\nExample: *${this.client.config.prefix}gamble right 500*`);
            const result = directions[Math.floor(Math.random() * directions.length)];
            const won = result === direction;
            await this.client.DB.setCrystal(M.sender.jid, won ? amount : -amount);
            const stickerAsset = this.client.assets.get(result);
            if (stickerAsset) {
                const sticker = await new wa_sticker_formatter_1.Sticker(stickerAsset, {
                    pack: 'CELSTIC',
                    author: `𝔻𝕜`,
                    quality: 90,
                    type: 'full'
                }).build();
                await M.reply(sticker, 'sticker');
            }
            const text = won
                ? `🎉 *You Won!* The ball went *${result}*!\n💎 *+${amount} Gold* added to your wallet`
                : `😂 *You Lost!* The ball went *${result}*!\n💎 *-${amount} Gold* deducted from your wallet`;
            return void (await this.client.sendMessage(M.from, { text }, {
                quoted: M.message
            }));
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('gamble', {
        description: 'Gamble your gold — pick left or right',
        usage: 'gamble <left|right> <amount>',
        category: 'economy',
        cooldown: 30,
        exp: 20,
        casino: true
    })
], command);
exports.default = command;
