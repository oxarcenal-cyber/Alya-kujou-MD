"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
const compliments = [
    'You have a great sense of humor! 😄',
    'You always know how to make people smile 😊',
    "You're genuinely one of the kindest people around!",
    'Your positivity is absolutely contagious!',
    'You make people around you feel special.',
    'You are more amazing than you realize.',
    'Your energy lights up any room (or group chat)! ✨',
    "You're creative in ways that genuinely inspire others.",
    'I really admire your dedication and passion.',
    'You handle tough situations with so much grace.',
    "You're smarter than you give yourself credit for.",
    'The world is genuinely a better place with you in it.',
    'Your sense of style is on another level!',
    'You always go above and beyond — people notice.',
    'You have a magical ability to make things better.',
    'Your thoughtfulness means more than you know.',
    "You're a total rockstar in disguise! 🎸",
    'People are lucky to have you around.',
    'You have a heart of gold. Truly. 💛',
    "You're like sunshine on a rainy day ☀️"
];
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const lang = await this.getLang(M);
            const users = M.mentioned;
            if (M.quoted && !users.includes(M.quoted.sender.jid))
                users.push(M.quoted.sender.jid);
            const target = users.length ? users[0] : M.sender.jid;
            const compliment = compliments[Math.floor(Math.random() * compliments.length)];
            return void M.reply(`💖 *COMPLIMENT* 💖\n` +
                `${'─'.repeat(25)}\n\n` +
                `@${target.split('@')[0]} — ${compliment}\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}compliment @user\`\n` +
                (0, lib_1.t)('fun_compliment_footer', lang, { prefix }), 'text', undefined, undefined, undefined, [target]);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('compliment', {
        description: 'Give a sweet compliment to someone 💖',
        category: 'fun',
        usage: 'compliment [@user / quote user]',
        aliases: ['comp', 'praise'],
        cooldown: 10,
        exp: 15
    })
], default_1);
exports.default = default_1;
