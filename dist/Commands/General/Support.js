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
            let url;
            let text = '*🖤Celestic Botz. Inc🖤*\n\n🏮 celestic Casino group  = https://chat.whatsapp.com/DrY5MBaiDRS9BAcpCpJQCv\n\n🖤 Reroru Support = https://chat.whatsapp.com/De72uE77HXj411DRSVBBmM!';
            const { supportGroups } = this.client.config;
            for (let i = 0; i < supportGroups.length; i++) {
                const { subject } = await this.client.groupMetadata(supportGroups[i]);
                const code = await this.client.groupInviteCode(supportGroups[i]);
                text += `*#${i + 1}*\n*${subject}:* *https://chat.whatsapp.com/DrY5MBaiDRS9BAcpCpJQCv*\n`;
                if (!url)
                    url = `https://chat.whatsapp.com/${code}`;
            }
            await this.client.sendMessage(M.sender.jid, {
                text
            });
            return void M.reply('🎈Sent the support group links in your DM.');
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('support', {
        description: 'the bot sends the support links to your pm.',
        category: 'general',
        usage: 'support',
        cooldown: 15,
        exp: 10,
        dm: true
    })
], command);
exports.default = command;
