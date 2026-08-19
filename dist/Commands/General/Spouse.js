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
            const userData = await this.client.DB.getUser(M.sender.jid);
            const partnerJid = userData.partner;
            if (!partnerJid)
                return void M.reply(`💔 *You are currently single!*\n\n` +
                    `💍 Use \`${this.client.config.prefix}marry @user\` to find your partner~ 🌹`);
            const partnerData = await this.client.DB.getUser(partnerJid);
            const partnerName = partnerData.username?.name || `@${partnerJid.split('@')[0]}`;
            return void M.reply(`💑 *YOUR PARTNER*\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `👤 *Name:* ${partnerName}\n` +
                `📱 *Number:* +${partnerJid.split('@')[0]}\n` +
                `⭐ *Level:* ${partnerData.level}\n` +
                `💰 *Wallet:* ${partnerData.wallet.toLocaleString()} Gold\n` +
                `🎖️ *Badges:* ${(partnerData.badges || []).length > 0 ? (partnerData.badges || []).join(' ') : '_None yet_'}\n\n` +
                `❤️ _You and @${partnerJid.split('@')[0]} are married!_\n` +
                `_Use \`${this.client.config.prefix}divorce\` to end the marriage_`, 'text', undefined, undefined, undefined, [partnerJid]);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('spouse', {
        description: 'View your current partner info 💑',
        aliases: ['partner', 'mywife', 'myhusband'],
        usage: 'spouse',
        cooldown: 5,
        exp: 3,
        category: 'general'
    })
], default_1);
exports.default = default_1;
