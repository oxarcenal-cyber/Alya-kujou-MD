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
                    `\`${prefix}rmbadword <word>\`\n\n` +
                    `_Example: ${prefix}rmbadword badword_`);
            const groupData = await this.client.DB.getGroup(M.from);
            const list = groupData.badWordsList || [];
            if (!list.includes(word))
                return void M.reply(`❌ *${word}* is not in the filter list!`);
            await this.client.DB.group.updateOne({ jid: M.from }, { $pull: { badWordsList: word } });
            this.client.DB.cacheInvalidate(`group:${M.from}`);
            return void M.reply(`✅ *Word removed from filter!*\n\n` +
                `🗑️ *Removed:* \`${word}\`\n` +
                `📋 *Remaining words:* ${list.length - 1}/50`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('rmbadword', {
        description: 'Remove a word from the bad words filter ✅',
        aliases: ['removeword', 'unbanword', 'delbadword'],
        usage: 'rmbadword <word>',
        cooldown: 5,
        exp: 5,
        category: 'moderation',
        dm: false
    })
], default_1);
exports.default = default_1;
