"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            if (M.numbers.length < 1)
                return void M.reply('💬 Specify the amount of gold to deposit\nExample: *deposit 500*');
            const { wallet } = await this.client.DB.getUser(M.sender.jid);
            if ((wallet - M.numbers[0]) < 0)
                return void M.reply(`❌ You don't have that much gold in your wallet!\n💎 *Wallet:* ${wallet}`);
            await this.client.DB.setCrystal(M.sender.jid, M.numbers[0], 'bank');
            await this.client.DB.setCrystal(M.sender.jid, -M.numbers[0]);
            const text = `🏦 *Deposit Successful!* 🏦\n\n` +
                `💎 *${M.numbers[0]} Gold* transferred to your bank\n\n` +
                `_Use *${this.client.config.prefix}bank* to check your bank balance_`;
            return void (await this.client.sendMessage(M.from, { text }, {
                quoted: M.message
            }));
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('deposit', {
        description: 'Deposit your gold to bank',
        usage: 'deposit <amount>',
        cooldown: 15,
        exp: 5,
        category: 'economy'
    })
], command);
exports.default = command;
