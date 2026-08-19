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
        this.execute = async (M, _args) => {
            try {
                const stats = await this.client.DB.getBotStats();
                const totalUsers = stats.totalUsers;
                const maleCount = stats.maleCount;
                const femaleCount = stats.femaleCount;
                const unsetCount = stats.unsetCount;
                const totalFeedback = stats.totalFeedback;
                const pendingFeedback = stats.pendingFeedback;
                const topCmds = stats.topCommands;
                const topCmdsText = topCmds.length > 0
                    ? topCmds.slice(0, 10).map((x, i) => `  ${i + 1}. \`${this.client.config.prefix}${x.cmd}\` — *${x.count.toLocaleString()}* uses`).join('\n')
                    : '  _No data yet_';
                const maleBar = totalUsers > 0 ? Math.round((maleCount / totalUsers) * 10) : 0;
                const femaleBar = totalUsers > 0 ? Math.round((femaleCount / totalUsers) * 10) : 0;
                await M.reply(`╔══════════════════════════════╗\n` +
                    `║      📊 *BOT ANALYTICS*      ║\n` +
                    `╚══════════════════════════════╝\n\n` +
                    `👥 *USERS*\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `📌 Total Users:     *${totalUsers.toLocaleString()}*\n` +
                    `👨 Male:            *${maleCount}* ${'█'.repeat(maleBar)}${'░'.repeat(10 - maleBar)}\n` +
                    `👩 Female:          *${femaleCount}* ${'█'.repeat(femaleBar)}${'░'.repeat(10 - femaleBar)}\n` +
                    `❓ Gender Not Set:  *${unsetCount}*\n\n` +
                    `⚡ *TOP 10 COMMANDS*\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `${topCmdsText}\n\n` +
                    `📝 *FEEDBACK / UPDATE LIST*\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `📬 Total Submitted:  *${totalFeedback}*\n` +
                    `⏳ Pending Review:   *${pendingFeedback}*\n\n` +
                    `💡 _Use \`${this.client.config.prefix}updatelist\` to manage feedback_\n` +
                    `🔱 _Powered by RedzeoX_`);
            }
            catch (err) {
                await M.reply(`❌ Error fetching stats: ${err.message}`);
            }
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('botstats', {
        description: 'View complete bot analytics — total users, top commands, feedback stats',
        aliases: ['bstats', 'analytics'],
        cooldown: 10,
        exp: 0,
        usage: 'botstats',
        category: 'dev',
        dm: true
    })
], default_1);
exports.default = default_1;
