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
            const body = `╭━━━✦ *CTA BUTTON TEST* ✦━━━╮\n` +
                `┃\n` +
                `┃  *3 Types of Buttons:*\n` +
                `┃\n` +
                `┃  1️⃣  *Reply Button* — press karo\n` +
                `┃     toh command chalti hai\n` +
                `┃\n` +
                `┃  2️⃣  *URL Button* — press karo\n` +
                `┃     toh link khulta hai\n` +
                `┃\n` +
                `┃  3️⃣  *Copy Button* — press karo\n` +
                `┃     toh text copy hota hai\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━━━━━━━╯`;
            // Message 1: Reply button via buttonsFormat:'buttons' — tap sends buttonsResponseMessage.selectedButtonId = command
            await this.client.sendMessage(M.from, {
                text: body,
                footer: '⚡ RedzeoX — Rias Gremory',
                title: '🧪 Interactive Button Test',
                buttonsFormat: 'buttons',
                buttons: [
                    {
                        text: '🏓 Reply Button (Ping)',
                        id: `${prefix}ping`
                    }
                ]
            }, { quoted: M.message });
            // Message 2: URL + Copy via interactive/nativeFlow — client handles them directly (no bot response)
            await this.client.sendMessage(M.from, {
                text: '↑ *Button 1* above sends a command.\n↓ *Buttons 2 & 3* below are client-side:',
                footer: '⚡ RedzeoX — Rias Gremory',
                buttons: [
                    {
                        text: '🌐 URL Button (GitHub)',
                        url: 'https://github.com'
                    },
                    {
                        text: '📋 Copy Button (Prefix)',
                        copy: prefix
                    }
                ]
            });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('menutest', {
        description: 'Tests all types of interactive CTA buttons',
        usage: 'menutest',
        category: 'dev',
        aliases: ['btntest', 'ctaTest'],
        cooldown: 5,
        exp: 0,
        dm: true
    })
], default_1);
exports.default = default_1;
