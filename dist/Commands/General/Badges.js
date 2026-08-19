"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const BadgeList_1 = require("../../lib/BadgeList");
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            // Check if viewing another user
            const targetJid = M.mentioned.length ? M.mentioned[0] : M.sender.jid;
            const isSelf = targetJid === M.sender.jid;
            const userData = await this.client.DB.getUser(targetJid);
            const earned = userData.badges || [];
            const displayName = isSelf
                ? M.sender.username
                : `@${targetJid.split('@')[0]}`;
            let text = `🏅 *${isSelf ? 'YOUR' : displayName.toUpperCase() + "'S"} BADGES*\n`;
            text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n`;
            if (earned.length === 0) {
                text += `😔 *No badges earned yet!*\n\n`;
                text += `_Start completing milestones to earn badges:_\n\n`;
            }
            else {
                text += `✨ *Earned ${earned.length}/${BadgeList_1.BADGE_LIST.length} badges:*\n\n`;
                for (const key of earned) {
                    const badge = (0, BadgeList_1.getBadge)(key);
                    if (badge)
                        text += `${badge.emoji} *${badge.name}* — ${badge.desc}\n`;
                }
                text += `\n`;
            }
            text += `📋 *ALL AVAILABLE BADGES:*\n`;
            text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
            for (const badge of BadgeList_1.BADGE_LIST) {
                const isEarned = earned.includes(badge.key);
                text += `${isEarned ? badge.emoji : '🔒'} ${isEarned ? `*${badge.name}*` : badge.name} — _${badge.desc}_\n`;
            }
            text += `\n📖 *How to earn:*\n`;
            text += `_Complete milestones like daily claims, leveling up,\ngetting married, adopting pets, shopping, and more!_`;
            return void M.reply(text);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('badges', {
        description: 'View your earned achievement badges 🏅',
        aliases: ['achievements', 'medal'],
        usage: 'badges',
        cooldown: 5,
        exp: 3,
        category: 'general'
    })
], default_1);
exports.default = default_1;
