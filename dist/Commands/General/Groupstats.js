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
            if (M.chat !== 'group')
                return void M.reply(`📊 This command only works in groups!`);
            const groupData = await this.client.DB.getGroup(M.from);
            const meta = M.groupMetadata;
            const totalMsgs = groupData.totalMessages || 0;
            const memberStats = groupData.memberMsgCount || [];
            const sorted = [...memberStats].sort((a, b) => b.count - a.count).slice(0, 10);
            const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
            let text = `📊 *GROUP ANALYTICS*\n`;
            text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
            text += `👥 *Group:* ${meta?.subject || 'Unknown'}\n`;
            text += `👤 *Members:* ${meta?.participants.length || 0}\n`;
            text += `💬 *Total Messages:* ${totalMsgs.toLocaleString()}\n\n`;
            if (sorted.length === 0) {
                text += `😔 _No message data collected yet._\n`;
                text += `_Stats start recording from now!_\n`;
            }
            else {
                text += `🏆 *TOP MEMBERS*\n`;
                text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
                const mentions = [];
                for (let i = 0; i < sorted.length; i++) {
                    const { jid, count } = sorted[i];
                    const percent = totalMsgs > 0 ? ((count / totalMsgs) * 100).toFixed(1) : '0.0';
                    text += `${MEDALS[i]} @${jid.split('@')[0]} — *${count.toLocaleString()}* msgs (${percent}%)\n`;
                    mentions.push(jid);
                }
                text += `\n`;
                return void M.reply(text, 'text', undefined, undefined, undefined, mentions);
            }
            return void M.reply(text);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('groupstats', {
        description: 'View group message analytics 📊',
        aliases: ['gstats', 'groupanalytics', 'topmembers'],
        usage: 'groupstats',
        cooldown: 10,
        exp: 5,
        category: 'general',
        dm: false
    })
], default_1);
exports.default = default_1;
