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
        this.execute = async ({ from, sender, message }) => {
            const { bank, tag } = await this.client.DB.getUser(sender.jid);
            const text = `🏦 *Celestic Bank* 🏦\n\n` +
                `🧧 *Name:* ${sender.username}\n` +
                `☘️ *ID Tag:* #${tag}\n` +
                `💎 *Gold:* ${bank}\n\n` +
                `_Use *${this.client.config.prefix}wallet* to check your wallet_\n` +
                `_Use *${this.client.config.prefix}daily* to claim your daily reward_`;
            return void (await this.client.sendMessage(from, { text }, {
                quoted: message
            }));
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('bank', {
        description: 'Check your bank balance',
        usage: 'bank',
        category: 'economy',
        exp: 10,
        cooldown: 200,
    })
], command);
exports.default = command;
