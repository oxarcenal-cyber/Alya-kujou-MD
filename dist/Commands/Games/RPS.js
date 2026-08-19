"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const choices = ['rock', 'paper', 'scissors'];
const emojis = {
    rock: '🪨 Rock',
    paper: '📄 Paper',
    scissors: '✂️ Scissors'
};
const beats = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
};
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const sendChoiceButtons = async (text) => {
                await this.client.sendMessage(M.from, {
                    text,
                    footer: '✂️ RedzeoX RPS',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '🪨 Rock', id: `${prefix}rps rock` },
                        { text: '📄 Paper', id: `${prefix}rps paper` },
                        { text: '✂️ Scissors', id: `${prefix}rps scissors` }
                    ]
                }, { quoted: M.message });
            };
            if (!context.trim())
                return void sendChoiceButtons(`✂️ *ROCK PAPER SCISSORS*\n\n` +
                    `Bot ke khilaf khelo! Apna choice choose karo 👇`);
            const player = context.trim().toLowerCase();
            if (!choices.includes(player))
                return void sendChoiceButtons(`❌ Invalid choice! Neeche se choose karo 👇`);
            const bot = choices[Math.floor(Math.random() * choices.length)];
            let result = '';
            if (player === bot)
                result = "🤝 *It's a Tie!*";
            else if (beats[player] === bot)
                result = '🎉 *You Win!* 🏆';
            else
                result = '😂 *Bot Wins!* Better luck next time!';
            return void sendChoiceButtons(`✂️ *ROCK PAPER SCISSORS* ✂️\n` +
                `${'─'.repeat(25)}\n\n` +
                `👤 *You:* ${emojis[player]}\n` +
                `🤖 *Bot:* ${emojis[bot]}\n\n` +
                `${result}\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *Play again — choose karo:*`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('rps', {
        description: 'Play Rock Paper Scissors against the bot ✂️',
        category: 'games',
        usage: 'rps <rock/paper/scissors>',
        aliases: ['rockpaperscissors'],
        cooldown: 5,
        exp: 15,
        dm: true
    })
], default_1);
exports.default = default_1;
