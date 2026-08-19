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
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const res = this.handler.quiz.quizResponse.get(M.from);
            if (!res)
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *Is group mein koi quiz nahi chal raha!*\n\n` +
                        `📢 *How to use:* \`${prefix}quiz\` → quiz shuru karo\n` +
                        `Phir: \`${prefix}answer <option number>\``,
                    footer: '🎀 RedzeoX Quiz',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎀 Start Quiz', id: `${prefix}quiz` }]
                }, { quoted: M.message });
            const arr = this.handler.quiz.failed.get(M.from);
            if (arr.includes(M.sender.jid))
                return void M.reply(`⏳ *Pehle se try kiya!*\n\n` +
                    `Thoda wait karo aur dobara try karo.\n` +
                    `📢 *How to use:* \`${prefix}answer <1/2/3/4>\``);
            if (!M.numbers.length)
                return void M.reply(`❌ Option number daalo!\n\n` +
                    `📢 *How to use:* \`${prefix}answer 2\``);
            const correctIndex = res.options.indexOf(res.answer) + 1;
            if (correctIndex !== M.numbers[0]) {
                arr.push(M.sender.jid);
                this.handler.quiz.failed.set(M.from, arr);
                return void M.reply(`❌ *Galat jawab!*\n\n` +
                    `Option *${M.numbers[0]}* sahi nahi hai. Dobara try karo!\n` +
                    `📢 *How to use:* \`${prefix}answer <1/2/3/4>\``);
            }
            // Clear quiz state BEFORE rewarding to prevent repeated-answer exploit
            this.handler.quiz.quizResponse.delete(M.from);
            this.handler.quiz.failed.delete(M.from);
            this.handler.quiz.creator.delete(M.from);
            const exp = Math.floor(Math.random() * 251);
            await this.client.DB.setExp(M.sender.jid, exp);
            return void await this.client.sendMessage(M.from, {
                text: `🎉 *SAHI JAWAB!*\n\n` +
                    `✅ Correct! Tumne *${exp} experience* kamaya!\n\n` +
                    `📢 Aur quiz: \`${prefix}quiz\``,
                footer: '🎀 RedzeoX Quiz',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎀 New Quiz', id: `${prefix}quiz` }]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('answer', {
        description: 'Answer the ongoing quiz question 🎯',
        aliases: ['ans'],
        usage: 'answer <option number>',
        exp: 10,
        cooldown: 5,
        category: 'games'
    })
], default_1);
exports.default = default_1;
