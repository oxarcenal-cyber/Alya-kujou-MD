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
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            const word = context.trim().toLowerCase().split(' ')[0];
            if (!word)
                return void M.reply(`📖 *How to use:*\n` +
                    `\`${prefix}addbadword <word>\`\n\n` +
                    `_Example: ${prefix}addbadword badword_`);
            if (word.length < 2)
                return void M.reply(`❌ Word must be at least 2 characters!`);
            const groupData = await this.client.DB.getGroup(M.from);
            const list = groupData.badWordsList || [];
            if (list.includes(word))
                return void M.reply(`⚠️ *${word}* is already in the filter list!`);
            if (list.length >= 50)
                return void M.reply(`❌ Maximum 50 words allowed in the filter list!`);
            await this.client.DB.group.updateOne({ jid: M.from }, { $push: { badWordsList: word } });
            this.client.DB.cacheInvalidate(`group:${M.from}`);
            return void M.reply(`✅ *Word added to filter!*\n\n` +
                `🚫 *Word:* \`${word}\`\n` +
                `📋 *Total words:* ${list.length + 1}/50\n\n` +
                `_Enable filter with \`${prefix}badwords on\`_`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('addbadword', {
        description: 'Add a word to the bad words filter 🚫',
        aliases: ['addword', 'banword'],
        usage: 'addbadword <word>',
        cooldown: 5,
        exp: 5,
        category: 'moderation',
        dm: false
    })
], default_1);
exports.default = default_1;
