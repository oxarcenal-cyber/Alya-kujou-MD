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
            try {
                const data = await this.client.utils.fetch('https://zenquotes.io/api/random');
                if (!data || !data.length)
                    return void M.reply(`❌ Quote nahi mila. Try again!`);
                const { q, a } = data[0];
                return void M.reply(`💬 *QUOTE OF THE MOMENT* 💬\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `_"${q}"_\n\n` +
                    `✍️ *— ${a}*\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 *How to use:* \`${prefix}quote\`\n` +
                    `_Aur try karo: \`${prefix}fact\` | \`${prefix}joke\`_`);
            }
            catch {
                return void M.reply('❌ Quote fetch nahi hua. Try again later!');
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('quote', {
        description: 'Sends a random motivational quote 💬',
        category: 'fun',
        usage: 'quote',
        aliases: ['motivation', 'qte'],
        cooldown: 5,
        exp: 10,
        dm: true
    })
], default_1);
exports.default = default_1;
