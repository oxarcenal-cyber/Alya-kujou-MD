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
                    `📢 *How to use:* \`${prefix}open\``);
            const { announce } = await this.client.groupMetadata(M.from);
            if (!announce)
                return void M.reply(`⚠️ *Group pehle se open hai!*\n\n` +
                    `📢 Close karne ke liye: \`${prefix}close\``);
            await this.client.groupSettingUpdate(M.from, 'not_announcement');
            return void M.reply(`🔓 *GROUP OPEN!*\n\n` +
                `Ab sab members message kar sakte hain.\n\n` +
                `📢 *How to use:* \`${prefix}open\`\n` +
                `_Band karne ke liye: \`${prefix}close\`_`);
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('open', {
        description: 'Open the group — everyone can send messages 🔓',
        adminRequired: true,
        category: 'moderation',
        usage: 'open',
        exp: 5,
        cooldown: 10
    })
], command);
exports.default = command;
