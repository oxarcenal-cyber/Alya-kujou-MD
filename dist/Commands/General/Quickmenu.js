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
            const body = `╭━━━✦ *QUICK MENU* ✦━━━╮\n` +
                `┃\n` +
                `┃  Hey *${M.sender.username}* 👋\n` +
                `┃  Bot ke kaam ke buttons\n` +
                `┃  neeche diye gaye hain!\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━━━╯`;
            await this.client.sendMessage(M.from, {
                text: body,
                footer: '⚡ RedzeoX Bot',
                title: '🎛️ Bot Quick Menu',
                buttons: [
                    {
                        text: '📋 Help',
                        id: `${prefix}help`
                    },
                    {
                        text: '📊 My Profile',
                        id: `${prefix}profile`
                    },
                    {
                        text: '🏓 Ping',
                        id: `${prefix}ping`
                    },
                    {
                        text: '🌐 Support Group',
                        url: 'https://chat.whatsapp.com/DrY5MBaiDRS9BAcpCpJQCv'
                    },
                    {
                        text: '📌 Copy Prefix',
                        copy: prefix
                    }
                ]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('quickmenu', {
        description: 'Shows a quick interactive menu with buttons',
        usage: 'quickmenu',
        category: 'general',
        aliases: ['qmenu', 'qm'],
        cooldown: 5,
        exp: 10,
        dm: true
    })
], default_1);
exports.default = default_1;
