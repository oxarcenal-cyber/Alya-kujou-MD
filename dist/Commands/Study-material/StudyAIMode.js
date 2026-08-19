"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let StudyAIModeCommand = class StudyAIModeCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, _args) => {
            const p = this.client.config.prefix;
            if (!M.sender.isAdmin && !M.sender.isMod)
                return void M.reply(`❌ *Admin only!*\n\nOnly group admins can change Study AI mode.`);
            const groupData = await this.client.DB.getGroup(M.from).catch(() => null);
            if (!groupData)
                return void M.reply(`❌ Could not fetch group data.`);
            const currentOn = groupData.studyAi || false;
            const currentMode = groupData.studyAiMode || 'all';
            const statusText = !currentOn
                ? `🔴 *Currently:* OFF`
                : currentMode === 'mention'
                    ? `🟡 *Currently:* ON — Mention Only`
                    : `🟢 *Currently:* ON — All Messages`;
            const rows = [
                {
                    title: '🟢 Study AI — ON (All Messages)',
                    description: 'Roxy replies to EVERY group message automatically',
                    id: `studyai:all`
                },
                {
                    title: '📣 Study AI — ON (Mention Only)',
                    description: 'Roxy replies only when someone @mentions the bot',
                    id: `studyai:mention`
                },
                {
                    title: '🔴 Study AI — OFF',
                    description: 'Disable group Study AI completely',
                    id: `studyai:off`
                }
            ];
            return void await this.client.sendMessage(M.from, {
                text: `🤖 *STUDY AI MODE — Group Settings*\n` +
                    `${'━'.repeat(28)}\n\n` +
                    `${statusText}\n\n` +
                    `📢 *What is Study AI?*\n` +
                    `Roxy — your AI study assistant — can be enabled for this group so members can ask questions naturally, without any prefix!\n\n` +
                    `  🟢 *All Messages* — Roxy replies to every message\n` +
                    `  📣 *Mention Only* — Roxy replies when @mentioned\n` +
                    `  🔴 *OFF* — Disable Study AI\n\n` +
                    `${'━'.repeat(28)}\n` +
                    `👇 _Select a mode below_ *(Admin only)*`,
                footer: 'Group Study AI Settings',
                buttons: [{
                        text: '⚙️ Set Study AI Mode',
                        sections: [{ title: '🤖 Study AI Options', rows }]
                    }]
            }, { quoted: M.message });
        };
    }
};
StudyAIModeCommand = __decorate([
    (0, Structures_1.Command)('studyaimode', {
        description: 'Enable or disable group-wide Study AI (Roxy) mode 🤖',
        category: 'study',
        usage: 'studyaimode',
        aliases: ['groupai', 'saim', 'studyai'],
        cooldown: 5,
        exp: 0,
        dm: false
    })
], StudyAIModeCommand);
exports.default = StudyAIModeCommand;
