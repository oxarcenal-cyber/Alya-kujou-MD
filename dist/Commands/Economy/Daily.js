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
            const pad = (s) => (s < 10 ? '0' : '') + s;
            const formatTime = (seconds) => {
                const hours = Math.floor(seconds / (60 * 60));
                const minutes = Math.floor((seconds % (60 * 60)) / 60);
                const secs = Math.floor(seconds % 60);
                return `*${pad(hours)} hour(s), ${pad(minutes)} minute(s), ${pad(secs)} second(s)*`;
            };
            const time = 86400000;
            const { lastDaily: cd } = await this.client.DB.getUser(M.sender.jid);
            if (time - (Date.now() - cd) > 0) {
                const timeLeft = formatTime((time - (Date.now() - cd)) / 1000);
                return void M.reply(`⏳ You have already claimed your daily 💰 recently.\nClaim again in ${timeLeft}`);
            }
            await this.client.DB.setCrystal(M.sender.jid, 1000);
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { lastDaily: Date.now() } });
            const text = `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                `  🌸✿ᰰ  *Daily Reward!*  ✿ᰰ🌸\n` +
                `      𐚁 🎁 𝑫𝒂𝒊𝒍𝒚 𝑪𝒍𝒂𝒊𝒎𝒆𝒅! 𐚁\n\n` +
                `  ‧₊˚ 💎 𝑮𝒐𝒍𝒅  ·❀·  +1,000\n` +
                `  ‧₊˚ 📅 𝑵𝒆𝒙𝒕  ·❀·  24 hrs\n\n` +
                `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
                `  🍃 ⁺. !wallet · !bank .⁺ 🍃\n\n` +
                `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑪𝒍𝒂𝒊𝒎𝒆𝒅 𖥻ִֶָ`;
            return void (await this.client.sendMessage(M.from, { text }, {
                quoted: M.message
            }));
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('daily', {
        category: 'economy',
        description: 'Claim your daily gold reward',
        usage: 'daily',
        exp: 10
    })
], command);
exports.default = command;
