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
                const data = await this.client.utils.fetch('https://v2.jokeapi.dev/joke/Any?safe-mode&blacklistFlags=racist,sexist,explicit');
                if (!data)
                    return void M.reply(`❌ Joke nahi mila. Try again!`);
                const jokeText = data.type === 'single' ? data.joke : `${data.setup}\n\n_${data.delivery}_`;
                return void M.reply(`😂 *RANDOM JOKE* 😂\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `${jokeText}\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `📢 *How to use:* \`${prefix}joke\`\n` +
                    `_Aur try karo: \`${prefix}meme\` | \`${prefix}fact\` | \`${prefix}roast @user\`_`);
            }
            catch {
                return void M.reply('❌ Joke fetch nahi hua. Try again later!');
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('joke', {
        description: 'Sends a random funny joke 😂',
        category: 'fun',
        usage: 'joke',
        aliases: ['lol'],
        cooldown: 5,
        exp: 10,
        dm: true
    })
], default_1);
exports.default = default_1;
