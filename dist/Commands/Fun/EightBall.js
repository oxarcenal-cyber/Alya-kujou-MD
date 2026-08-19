"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const responses = [
    '✅ It is certain.',
    '✅ It is decidedly so.',
    '✅ Without a doubt.',
    '✅ Yes — definitely.',
    '✅ You may rely on it.',
    '✅ As I see it, yes.',
    '✅ Most likely.',
    '✅ Outlook good.',
    '✅ Yes.',
    '✅ Signs point to yes.',
    '🤷 Reply hazy, try again.',
    '🤷 Ask again later.',
    '🤷 Better not tell you now.',
    '🤷 Cannot predict now.',
    '🤷 Concentrate and ask again.',
    '❌ Do not count on it.',
    '❌ My reply is no.',
    '❌ My sources say no.',
    '❌ Outlook not so good.',
    '❌ Very doubtful.'
];
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            if (!context.trim())
                return void M.reply(`🎱 *MAGIC 8-BALL*\n\n` +
                    `Koi bhi yes/no sawaal pucho!\n\n` +
                    `📢 *How to use:* \`${prefix}8ball kya aaj meri luck achi hai?\``);
            const answer = responses[Math.floor(Math.random() * responses.length)];
            return void M.reply(`🎱 *MAGIC 8-BALL* 🎱\n` +
                `${'─'.repeat(25)}\n\n` +
                `❓ *Question:* ${context.trim()}\n\n` +
                `💰 *Answer:* ${answer}\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}8ball <sawaal>\``);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('8ball', {
        description: 'Ask the magic 8-ball any yes/no question 🎱',
        category: 'fun',
        usage: '8ball <your question>',
        aliases: ['eightball', 'magic8'],
        cooldown: 5,
        exp: 10,
        dm: true
    })
], default_1);
exports.default = default_1;
