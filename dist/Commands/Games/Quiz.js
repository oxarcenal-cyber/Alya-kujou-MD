"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const anime_quiz_1 = require("anime-quiz");
const Structures_1 = require("../../Structures");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            if (this.handler.quiz.quizResponse.has(M.from))
                return void M.reply(`There's a quiz ongoing in this group. Use ${this.client.config.prefix}forfeit to forfeit the quiz.`);
            const quiz = new anime_quiz_1.Quiz().getRandom();
            this.handler.quiz.creator.set(M.from, M.sender.jid);
            this.handler.quiz.quizResponse.set(M.from, quiz);
            this.handler.quiz.failed.set(M.from, []);
            let text = '';
            text += `🎀 *Question: ${quiz.question}*\n\n`;
            for (let i = 0; i < quiz.options.length; i++)
                text += `*${i + 1}) ${quiz.options[i]}*\n`;
            text += `\n📒 *Note: You only have 60 seconds to answer.*`;
            const prefix = this.client.config.prefix;
            await this.client.sendMessage(M.from, {
                text,
                footer: '🎀 RedzeoX Quiz',
                buttons: [{
                        text: '📝 Choose Answer',
                        sections: [{
                                title: '🎯 Select your answer',
                                rows: quiz.options.map((opt, i) => ({
                                    title: `${i + 1}) ${opt}`,
                                    id: `${prefix}answer ${i + 1}`,
                                    description: `Option ${i + 1} choose karo`
                                }))
                            }]
                    }]
            }, { quoted: M.message });
            setTimeout(async () => {
                const res = this.handler.quiz.quizResponse.get(M.from);
                if (!res)
                    return void null;
                for (const key in this.handler.quiz)
                    this.handler.quiz[key].delete(M.from);
                return void await this.client.sendMessage(M.from, {
                    text: `🕕 Timed out! The correct answer was *${res.options.indexOf(res.answer) + 1}) ${res.answer}.*`,
                    footer: '🎀 RedzeoX Quiz',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎀 New Quiz', id: `${prefix}quiz` }]
                });
            }, 60 * 1000);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('quiz', {
        description: 'starts a quiz',
        exp: 10,
        cooldown: 60,
        category: 'games',
        usage: 'quiz'
    })
], default_1);
exports.default = default_1;
