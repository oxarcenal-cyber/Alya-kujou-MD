"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
let SmashBoomCommand = class SmashBoomCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            if (M.chat !== 'group')
                return void M.reply(`❌ SmashBoom sirf group mein use ho sakta hai!`);
            const isMod = this.client.config.mods.some((mod) => this.client.correctJid(mod) === this.client.correctJid(M.sender.jid));
            if (!M.sender.isAdmin && !isMod)
                return void M.reply(`❌ Ye command sirf admins aur mods ke liye hai!`);
            const input = (context || '').trim().toLowerCase();
            if (!input || input === 'status') {
                const data = await this.client.DB.getGroup(M.from);
                const on = data.smashboom === true;
                return void M.reply(`💘 *SmashBoom Status*\n\n` +
                    `• Status: ${on ? '🟢 ON' : '🔴 OFF'}\n` +
                    `• Interval: Every 1 second (test mode)\n` +
                    `• What it does: Tags a random group member with a flirty anime pickup line\n\n` +
                    `*Usage:*\n` +
                    `• \`${prefix}smashboom on\` — Enable\n` +
                    `• \`${prefix}smashboom off\` — Disable`);
            }
            if (input !== 'on' && input !== 'off')
                return void M.reply(`❌ *Invalid option!*\n\n` +
                    `*Usage:*\n` +
                    `• \`${prefix}smashboom on\` — Enable\n` +
                    `• \`${prefix}smashboom off\` — Disable\n` +
                    `• \`${prefix}smashboom status\` — Check status`);
            const enable = input === 'on';
            const data = await this.client.DB.getGroup(M.from);
            const current = data.smashboom === true;
            if (current === enable)
                return void M.reply(`💘 SmashBoom is already ${enable ? '🟢 ON' : '🔴 OFF'} in this group!`);
            await this.client.DB.updateGroup(M.from, 'smashboom', enable);
            // Update in-memory list in handler
            if (enable) {
                if (!this.handler.smashboom.includes(M.from))
                    this.handler.smashboom.push(M.from);
            }
            else {
                const idx = this.handler.smashboom.indexOf(M.from);
                if (idx !== -1)
                    this.handler.smashboom.splice(idx, 1);
            }
            return void M.reply(`💘 *SmashBoom ${enable ? 'Enabled!' : 'Disabled!'}*\n\n` +
                (enable
                    ? `✅ Test mode: bot will tag a random member every 1 second!\n` +
                        `💡 Use \`${prefix}smashboom off\` to stop it.`
                    : `🛑 SmashBoom has been turned off for this group.`));
        };
    }
};
SmashBoomCommand = __decorate([
    (0, Structures_1.Command)('smashboom', {
        description: 'Toggle SmashBoom — test mode sends a random flirt every 1 second',
        usage: 'smashboom on | smashboom off | smashboom status',
        category: 'moderation',
        aliases: ['sb', 'smash'],
        cooldown: 5,
        exp: 0
    })
], SmashBoomCommand);
exports.default = SmashBoomCommand;
