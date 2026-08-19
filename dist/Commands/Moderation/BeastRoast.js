"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
// Keep this command useful for testing without allowing repeated group spam.
const ROAST_COOLDOWN_MS = 5000;
const lastRoastByGroup = new Map();
let BeastRoastCommand = class BeastRoastCommand extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            if (!M.groupMetadata)
                return void M.reply('❌ BeastRoast sirf group mein use ho sakta hai!');
            const input = (context || '').trim().toLowerCase();
            if (!input || input === 'help') {
                return void M.reply(`🦁 *BeastRoast*\n\n` +
                    `• \`${prefix}beastroast @user\` — tagged member ko ek roast\n` +
                    `• Kisi member ka message quote karke \`${prefix}beastroast\` bhejo\n\n` +
                    `⚠️ Sirf group admin/mod trigger kar sakta hai.\n` +
                    `⏳ Har group mein 5-second cooldown active hai.`);
            }
            const isMod = this.client.config.mods.some((mod) => this.client.correctJid(mod) === this.client.correctJid(M.sender.jid));
            if (!M.sender.isAdmin && !isMod)
                return void M.reply('❌ Roast trigger sirf group admins aur mods kar sakte hain!');
            const rawSource = M.quoted && M.mentioned.length === 0
                ? M.quoted.sender.jid
                : M.mentioned[0] || '';
            const target = this.client.correctJid(rawSource);
            if (!target || target === M.sender.jid)
                return void M.reply(`❌ Kisi opted-in member ko tag ya quote karo!\n` +
                    `Example: \`${prefix}beastroast @user\``);
            const lastRoast = lastRoastByGroup.get(M.from) || 0;
            const remaining = ROAST_COOLDOWN_MS - (Date.now() - lastRoast);
            if (remaining > 0)
                return void M.reply(`⏳ BeastRoast cooldown active hai. ${Math.ceil(remaining / 1000)}s baad try karo.`);
            lastRoastByGroup.set(M.from, Date.now());
            const rawTarget = rawSource;
            const targetNumber = rawTarget.split('@')[0].split(':')[0];
            try {
                await this.client.sendPresenceUpdate('composing', M.from);
                const reply = await (0, lib_1.getBeastRoastReply)('the opted-in tagged target');
                await (0, lib_1.beastDelay)();
                await this.client.sendPresenceUpdate('paused', M.from);
                return void await this.client.sendMessage(M.from, {
                    text: `@${targetNumber} ${reply || 'Aaj BeastChat ka mood offline hai, baad mein roast hoga.'}`,
                    mentions: [rawTarget]
                });
            }
            catch (error) {
                lastRoastByGroup.delete(M.from);
                await this.client.sendPresenceUpdate('paused', M.from).catch(() => { });
                console.error('[BEASTROAST] reply error:', error);
                return void M.reply('❌ BeastRoast abhi available nahi hai, thodi der baad try karo.');
            }
        };
    }
};
BeastRoastCommand = __decorate([
    (0, Structures_1.Command)('beastroast', {
        description: 'Request one savage roast from BeastChat (admin/mod only)',
        category: 'moderation',
        usage: 'beastroast @user',
        aliases: ['roastbeast'],
        cooldown: 5,
        exp: 0
    })
], BeastRoastCommand);
exports.default = BeastRoastCommand;
