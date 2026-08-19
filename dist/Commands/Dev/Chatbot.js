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
            if (!context) {
                const p = this.client.config.prefix;
                const text = `🤖 *Chatbot Feature*\n\n` +
                    `Enable/Disable chatbot in bot's personal DM.\n\n` +
                    `📌 *Commands:*\n` +
                    `  ▸ \`${p}chatbot enable\`  — Turn ON\n` +
                    `  ▸ \`${p}chatbot disable\` — Turn OFF`;
                return void M.reply(text);
            }
            const key = context.toLowerCase().trim();
            const action = key === 'enable' ? true : false;
            await this.client.DB.updateFeature('chatbot', action);
            return void M.reply(`${action === true ? '🟩' : '🟥'} ${action === true ? 'Enabled' : 'Disabled'}`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('chatbot', {
        description: 'enable/disable private message chat bot feature.',
        category: 'dev',
        usage: 'chatbot enable/disable',
        exp: 20,
        cooldown: 5
    })
], default_1);
exports.default = default_1;
