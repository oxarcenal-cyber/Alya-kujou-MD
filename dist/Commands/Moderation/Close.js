"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let command = class command extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            if (!M.groupMetadata)
                return void M.reply('❌ Try Again!');
            const isAdmin = M.sender.isAdmin;
            const isMod = this.client.config.mods.includes(M.sender.jid);
            if (!isAdmin && !isMod)
                return void M.reply(`❌ *Sirf admins use kar sakte hain!*\n\n` +
                    `📢 *How to use:* \`${prefix}close\``);
            const { announce } = M.groupMetadata;
            if (announce)
                return void M.reply(`⚠️ *Group pehle se closed hai!*\n\n` +
                    `📢 Open karne ke liye: \`${prefix}open\``);
            await this.client.groupSettingUpdate(M.from, 'announcement');
            return void M.reply(`🔒 *GROUP CLOSED!*\n\n` +
                `Ab sirf admins message kar sakte hain.\n\n` +
                `📢 *How to use:* \`${prefix}close\`\n` +
                `_Open karne ke liye: \`${prefix}open\`_`);
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('close', {
        description: 'Close the group — only admins can send messages 🔒',
        adminRequired: true,
        category: 'moderation',
        usage: 'close',
        exp: 5,
        cooldown: 10
    })
], command);
exports.default = command;
