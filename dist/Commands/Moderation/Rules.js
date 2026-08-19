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
            if (!M.groupMetadata)
                return void M.reply('❌ Ye command sirf groups mein use hoti hai!');
            const data = await this.client.DB.getGroup(M.from);
            const rules = data.rules;
            if (!rules || !rules.trim())
                return void M.reply(`📜 *GROUP RULES*\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `⚠️ Abhi tak koi rules set nahi hain!\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 Rules set karne ke liye (admin only):\n` +
                    `  \`${prefix}setrules <rules likho>\``);
            return void M.reply(`📜 *GROUP RULES* 📜\n` +
                `${'─'.repeat(25)}\n\n` +
                `${rules}\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}rules\`\n` +
                `_Rules update karne ke liye (admin): \`${prefix}setrules <text>\`_`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('rules', {
        description: 'Show the group rules 📜',
        category: 'moderation',
        usage: 'rules',
        aliases: ['rule', 'grouprules'],
        cooldown: 10,
        exp: 5
    })
], default_1);
exports.default = default_1;
