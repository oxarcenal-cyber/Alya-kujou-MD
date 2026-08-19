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
        this.execute = async (M, { args }) => {
            const user = await this.client.DB.getUser(M.sender.jid);
            const current = user.gender;
            const prefix = this.client.config.prefix;
            // ── Direct text arg: -gender male / -gender female ──────────────────
            const input = args[0]?.toLowerCase();
            if (input === 'male' || input === 'female') {
                const emoji = input === 'male' ? '👨' : '👩';
                const label = input === 'male' ? 'Male' : 'Female';
                await this.client.DB.setGender(M.sender.jid, input);
                this.client.DB.cacheInvalidate(`user:${M.sender.jid}`);
                return void (await this.client.sendMessage(M.from, {
                    text: `✦ ───────────── ✦\n` +
                        `  ${emoji} *Gender Updated!* ${emoji}\n` +
                        `✦ ───────────── ✦\n\n` +
                        `Hey *${M.sender.username}*,\n` +
                        `your gender has been set to *${label}* ✅\n\n` +
                        `✦ ───────────── ✦`,
                    footer: '⚡ RedzeoX'
                }, { quoted: M.message }));
            }
            // ── Wrong arg given ──────────────────────────────────────────────────
            if (input && input !== 'male' && input !== 'female') {
                return void (await this.client.sendMessage(M.from, {
                    text: `❌ *Invalid option!*\n\n` +
                        `Usage:\n` +
                        `• \`${prefix}gender male\`\n` +
                        `• \`${prefix}gender female\`\n` +
                        `• \`${prefix}gender\` _(shows menu)_`,
                    footer: '⚡ RedzeoX'
                }, { quoted: M.message }));
            }
            // ── No arg: show button menu ─────────────────────────────────────────
            const currentLabel = current === 'male' ? '👨 Boy' : current === 'female' ? '👩 Girl' : '❓ Not set';
            await this.client.sendMessage(M.from, {
                text: `✦ ───────────── ✦\n` +
                    `    🌸 *WELCOME SETUP* 🌸\n` +
                    `✦ ───────────── ✦\n\n` +
                    `Hey *${M.sender.username}*!\n\n` +
                    `Before you begin your journey,\n` +
                    `tell me — who are you? ✨\n\n` +
                    (current ? `Current: *${currentLabel}*\n\n` : '') +
                    `💡 _Tip: You can also type_\n` +
                    `• \`${prefix}gender male\`\n` +
                    `• \`${prefix}gender female\`\n\n` +
                    `✦ ───────────── ✦`,
                footer: '⚡ RedzeoX',
                buttons: [
                    {
                        text: '🚻 Select Gender',
                        sections: [
                            {
                                title: '👤 Choose Your Gender',
                                rows: [
                                    { title: '🤵 Male', id: 'gender:male', description: 'Set your gender to Male' },
                                    { title: '👰 Female', id: 'gender:female', description: 'Set your gender to Female' }
                                ]
                            }
                        ]
                    }
                ]
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('gender', {
        description: 'Set or change your gender preference',
        aliases: ['setgender', 'mygender'],
        cooldown: 5,
        exp: 5,
        usage: 'gender [male/female]',
        category: 'general',
        dm: true
    })
], default_1);
exports.default = default_1;
