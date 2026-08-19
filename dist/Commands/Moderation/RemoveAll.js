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
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            if (!M.groupMetadata)
                return void M.reply('❌ Ye command sirf groups mein use hoti hai!');
            const isAdmin = M.sender.isAdmin;
            const isMod = this.client.config.mods.includes(M.sender.jid);
            if (!isAdmin && !isMod)
                return void M.reply(`❌ *Sirf admins use kar sakte hain!*\n\n` +
                    `📢 *How to use:* \`${prefix}removeall\` → preview\n` +
                    `✅ Confirm karne ke liye: \`${prefix}removeall confirm\``);
            const participants = M.groupMetadata.participants || [];
            const normalize = (jid) => this.client.correctJid(jid);
            const botJid = this.client.user?.id || '';
            const senderJid = M.sender.jid;
            const ownerJid = M.groupMetadata.owner || '';
            // Admins, group owner, bot, and the command sender are never candidates.
            // Checking both raw and normalized JIDs keeps this safe with WhatsApp LID IDs.
            const isProtected = (jid, isParticipantAdmin) => {
                if (isParticipantAdmin)
                    return true;
                const ids = [jid, normalize(jid)];
                return [ownerJid, botJid, senderJid].some((protectedJid) => protectedJid !== '' &&
                    (ids.includes(protectedJid) || ids.includes(normalize(protectedJid))));
            };
            const candidates = participants
                .filter((participant) => !isProtected(participant.id, participant.admin !== null && participant.admin !== undefined))
                .map((participant) => participant.id);
            if (!candidates.length)
                return void M.reply(`✅ *Group already clean hai!*\n\n` +
                    `Admins, owner aur bot ko remove nahi kiya jaata.`);
            const confirmed = context.trim().toLowerCase() === 'confirm';
            if (!confirmed)
                return void M.reply(`⚠️ *REMOVE ALL PREVIEW*\n${'─'.repeat(25)}\n\n` +
                    `👥 *Regular members:* ${candidates.length}\n` +
                    `🛡️ *Protected:* admins, group owner aur bot\n\n` +
                    `⚠️ Ye ${candidates.length} members ko group se remove karega.\n` +
                    `Agar pakka ho to likho: \`${prefix}removeall confirm\``);
            let removed = 0;
            let failed = 0;
            // Keep requests sequential so WhatsApp does not rate-limit a large group cleanup.
            for (const jid of candidates) {
                try {
                    await this.client.groupParticipantsUpdate(M.from, [jid], 'remove');
                    removed++;
                }
                catch {
                    failed++;
                }
            }
            return void M.reply(`🚫 *REMOVE ALL RESULTS* 🚫\n${'─'.repeat(25)}\n\n` +
                `✅ Removed: *${removed}*\n` +
                `❌ Failed: *${failed}*\n` +
                `🛡️ Protected members ko skip kiya gaya.`);
        };
    }
};
command = __decorate([
    (0, Structures_1.Command)('removeall', {
        description: 'Remove all regular members from the group (with confirmation) 🚫',
        category: 'moderation',
        usage: 'removeall [confirm]',
        aliases: ['kickall', 'clearall'],
        cooldown: 60,
        exp: 20,
        adminRequired: true
    })
], command);
exports.default = command;
