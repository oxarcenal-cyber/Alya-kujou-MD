"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const BadgeList_1 = require("../../lib/BadgeList");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const input = context.trim();
            if (!input)
                return void M.reply(`🎂 *SET BIRTHDAY*\n` +
                    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                    `📖 *How to use:*\n` +
                    `\`${prefix}setbirthday DD/MM\`\n\n` +
                    `_Example: ${prefix}setbirthday 25/12 (December 25)_`);
            const parts = input.split('/');
            if (parts.length !== 2)
                return void M.reply(`❌ Invalid format! Use *DD/MM*\n_Example: ${prefix}setbirthday 15/08_`);
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            if (isNaN(day) || isNaN(month) || day < 1 || day > 31 || month < 1 || month > 12)
                return void M.reply(`❌ Invalid date! Day: 1-31, Month: 1-12`);
            const ddmm = day * 100 + month; // e.g. 1508 = Aug 15
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { birthday: ddmm } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            await (0, BadgeList_1.checkAndAwardBadges)(M.sender.jid, this.client.DB);
            const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return void M.reply(`🎂 *BIRTHDAY SET!*\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `📅 *${M.sender.username}'s birthday:* ${day} ${MONTHS[month - 1]}\n\n` +
                `🎁 You'll receive *+2000 Gold* on your birthday!\n` +
                `🏅 *Birthday Star* badge earned!\n\n` +
                `_Use \`${prefix}birthdays\` to see upcoming birthdays in this group_`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('setbirthday', {
        description: 'Set your birthday to receive wishes 🎂',
        aliases: ['setbday', 'mybirthday'],
        usage: 'setbirthday DD/MM',
        cooldown: 10,
        exp: 10,
        category: 'general'
    })
], default_1);
exports.default = default_1;
