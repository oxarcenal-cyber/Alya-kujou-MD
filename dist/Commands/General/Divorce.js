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
            const partner = userData.partner;
            if (!partner)
                return void M.reply(`💔 You're not married to anyone right now!\nUse \`${this.client.config.prefix}marry @user\` to get married.`);
            const partnerName = `@${partner.split('@')[0]}`;
            // Clear both sides
            await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { partner: '' } });
            await this.client.DB.user.updateOne({ jid: partner }, { $set: { partner: '' } });
            this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
            this.client.DB.cacheInvalidate(`user:${partner}`);
            return void M.reply(`💔 *DIVORCE*\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `😢 *@${M.sender.username}* has divorced ${partnerName}.\n\n` +
                `_Sometimes things don't work out... you're single again._\n` +
                `💌 Use \`${this.client.config.prefix}marry @user\` to find love again!`, 'text', undefined, undefined, undefined, [M.sender.jid, partner]);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('divorce', {
        description: 'Break up your marriage 💔',
        aliases: ['breakup'],
        usage: 'divorce',
        cooldown: 30,
        exp: 5,
        category: 'general',
        dm: false
    })
], default_1);
exports.default = default_1;
