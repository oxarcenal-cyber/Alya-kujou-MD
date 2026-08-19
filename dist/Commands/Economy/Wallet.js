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
            const { wallet, tag } = await this.client.DB.getUser(sender.jid);
            const text = `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                `  🌸✿ᰰ  *${sender.username}*  ✿ᰰ🌸\n` +
                `      𐚁 👛 𝑾𝒂𝒍𝒍𝒆𝒕 𖥻 𐚁\n\n` +
                `  ‧₊˚ 🧧 𝑵𝒂𝒎𝒆  ·❀·  ${sender.username}\n` +
                `  ‧₊˚ ☘️ 𝑻𝒂𝒈   ·❀·  #${tag}\n` +
                `  ‧₊˚ 💎 𝑮𝒐𝒍𝒅  ·❀·  ${wallet.toLocaleString()}\n\n` +
                `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
                `  🍃 ⁺. !bank · !daily .⁺ 🍃\n\n` +
                `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑨𝒄𝒕𝒊𝒗𝒆 𖥻ִֶָ`;
            return void (await this.client.sendMessage(from, { text }, {
                quoted: message
            }));
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('wallet', {
        description: 'Check your wallet balance',
        usage: 'wallet',
        category: 'economy',
        exp: 10,
        cooldown: 10,
    })
], command);
exports.default = command;
