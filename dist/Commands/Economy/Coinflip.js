"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { args }) => {
            const choice = args[1]?.toLowerCase();
            const amount = M.numbers[0];
            const valid = ['heads', 'tails'];
            if (!choice || !valid.includes(choice) || !amount || amount < 50)
                return void M.reply(`🪙 *How to play Coinflip*\n\n` +
                    `Pick *heads* or *tails*, bet gold, flip the coin!\n\n` +
                    `*${this.client.config.prefix}coinflip heads 500* — bet 500 on heads\n` +
                    `*${this.client.config.prefix}coinflip tails 1000* — bet 1000 on tails\n\n` +
                    `✅ Win → 2x your bet\n` +
                    `❌ Lose → lose your bet\n\n` +
                    `_Min bet: 50 gold_`);
            if (amount > 15000)
                return void M.reply(`❌ Max bet is *15,000 gold* per flip.`);
            const { wallet } = await this.client.DB.getUser(M.sender.jid);
            if (wallet < amount)
                return void M.reply(`❌ Not enough gold!\n💎 *Wallet:* ${wallet}`);
            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            const won = result === choice;
            const gain = won ? amount : -amount;
            await this.client.DB.setCrystal(M.sender.jid, gain);
            const newWallet = wallet + gain;
            const emoji = result === 'heads' ? '🪙 Heads' : '🌑 Tails';
            return void M.reply(`🪙 *COIN FLIP*\n\n` +
                `The coin landed on *${emoji}*!\n` +
                `You picked *${choice}*\n\n` +
                `${won ? `🎉 *You Won! +${amount} gold*` : `😔 *You Lost! -${amount} gold*`}\n\n` +
                `💎 Wallet: ${newWallet} gold`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('coinflip', {
        description: 'Flip a coin — pick heads or tails and double your gold!',
        usage: 'coinflip <heads|tails> <amount>',
        category: 'economy',
        cooldown: 10,
        exp: 10,
        casino: true,
        aliases: ['cf', 'flip']
    })
], default_1);
exports.default = default_1;
