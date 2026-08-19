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
            const prefix = this.client.config.prefix;
            const res = this.handler.quiz.quizResponse.get(M.from);
            if (!res)
                return void M.reply(`❌ *Koi quiz nahi chal raha is group mein!*\n\n` +
                    `📢 *How to use:* \`${prefix}quiz\` → quiz shuru karo\n` +
                    `_Sirf quiz creator forfeit kar sakta hai_`);
            const creator = this.handler.quiz.creator.get(M.from) || M.sender.jid;
            if (creator !== M.sender.jid)
                return void M.reply(`❌ *Sirf quiz shuru karne wala forfeit kar sakta hai!*\n\n` +
                    `📢 *How to use:* Pehle quiz shuru karo: \`${prefix}quiz\``);
            for (const key in this.handler.quiz) {
                this.handler.quiz[key].delete(M.from);
            }
            return void await this.client.sendMessage(M.from, {
                text: `🏳️ *QUIZ FORFEITED!*\n\n` +
                    `Quiz band kar di gayi.\n\n` +
                    `📢 Naya quiz: \`${prefix}quiz\``,
                footer: '🎀 RedzeoX Quiz',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎀 New Quiz', id: `${prefix}quiz` }]
            }, { quoted: M.message });
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('forfeit', {
        description: 'Forfeit the ongoing quiz in this group 🏳️',
        aliases: ['ff'],
        category: 'games',
        exp: 20,
        cooldown: 15,
        usage: 'forfeit'
    })
], command);
exports.default = command;
