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
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            if (!M.groupMetadata)
                return void M.reply('❌ Ye command sirf groups mein use hoti hai!');
            const isAdmin = M.sender.isAdmin;
            const isMod = this.client.config.mods.includes(M.sender.jid);
            if (!isAdmin && !isMod)
                return void M.reply(`❌ *Sirf admins use kar sakte hain!*\n\n` +
                    `📢 *How to use:* \`${prefix}tagall [message]\``);
            const participants = M.groupMetadata.participants || [];
            const jids = participants.map(p => p.id);
            const mentions = jids.map(jid => `@${jid.split('@')[0]}`).join(' ');
            const msg = context.trim() || '📢 *Attention Everyone!*';
            return void M.reply(`📢 *TAG ALL*\n` +
                `${'─'.repeat(25)}\n\n` +
                `${msg}\n\n` +
                `${mentions}\n\n` +
                `${'─'.repeat(25)}\n` +
                `👥 *Members tagged:* ${jids.length}\n` +
                `📢 *How to use:* \`${prefix}tagall [message]\``, 'text', undefined, undefined, undefined, jids);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('tagall', {
        description: 'Tag all members in the group 📢',
        category: 'moderation',
        usage: 'tagall [message]',
        aliases: ['everyone', 'all'],
        cooldown: 60,
        exp: 20,
        adminRequired: true
    })
], default_1);
exports.default = default_1;
