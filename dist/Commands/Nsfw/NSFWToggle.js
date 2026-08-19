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
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const lang = await this.getLang(M);
            const p = this.client.config.prefix;
            const arg = context.trim().toLowerCase();
            // ── No argument → show interactive menu ───────────────────────────────
            if (!arg || arg === 'help' || arg === 'status') {
                const { nsfw } = await this.client.DB.getGroup(M.from);
                const caption = (0, lib_1.t)('nsfw_guide', lang, { p, status: nsfw ? '✅ ON' : '📴 OFF' });
                const bannerBuf = this.client.assets.get('nsfw-banner');
                if (bannerBuf) {
                    // Send banner GIF + caption + buttons all in one message
                    return void await this.client.sendMessage(M.from, {
                        video: bannerBuf,
                        gifPlayback: true,
                        mimetype: 'video/mp4',
                        caption,
                        footer: '🔞 RedzeoX NSFW',
                        buttons: [{
                                text: '📋 Open Menu',
                                sections: [{
                                        title: '🔞 NSFW Controls',
                                        rows: [
                                            {
                                                title: '✅ NSFW ON',
                                                description: '🔓 Group mein NSFW content enable karo',
                                                id: `${p}nsfw on`
                                            },
                                            {
                                                title: '📴 NSFW OFF',
                                                description: '🔒 Group mein NSFW content disable karo',
                                                id: `${p}nsfw off`
                                            }
                                        ]
                                    }]
                            }]
                    }, { quoted: M.message });
                }
                return void await this.client.sendMessage(M.from, {
                    text: caption,
                    footer: '🔞 RedzeoX NSFW',
                    buttons: [{
                            text: '📋 Open Menu',
                            sections: [{
                                    title: '🔞 NSFW Controls',
                                    rows: [
                                        {
                                            title: '✅ NSFW ON',
                                            description: '🔓 Group mein NSFW content enable karo',
                                            id: `${p}nsfw on`
                                        },
                                        {
                                            title: '📴 NSFW OFF',
                                            description: '🔒 Group mein NSFW content disable karo',
                                            id: `${p}nsfw off`
                                        }
                                    ]
                                }]
                        }]
                }, { quoted: M.message });
            }
            if (arg !== 'on' && arg !== 'off') {
                return void M.reply((0, lib_1.t)('nsfw_toggle_usage', lang, { p }));
            }
            const senderJid = this.client.correctJid(M.sender.jid);
            // isAdmin from simplify() + direct groupMetadata fallback (LID format safety)
            const adminJids = (M.groupMetadata?.admins || []).map((j) => this.client.correctJid(j));
            const isGroupAdmin = M.sender.isAdmin || adminJids.includes(senderJid);
            const isMod = this.client.config.mods.some((mod) => this.client.correctJid(mod) === senderJid);
            if (!isGroupAdmin && !isMod)
                return void M.reply((0, lib_1.t)('admin_only', lang));
            const enable = arg === 'on';
            const data = await this.client.DB.getGroup(M.from);
            if ((enable && data.nsfw) || (!enable && !data.nsfw))
                return void M.reply((0, lib_1.t)('nsfw_already', lang, { status: enable ? '✅ ON' : '📴 OFF' }));
            await this.client.DB.updateGroup(M.from, 'nsfw', enable);
            return void M.reply((0, lib_1.t)('nsfw_toggled', lang, { status: enable ? '✅ ON' : '📴 OFF' }));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('nsfw', {
        description: 'Enable or disable NSFW in a group / Show NSFW guide',
        usage: 'nsfw [on | off]',
        category: 'general',
        aliases: ['nsfwtoggle'],
        exp: 5,
        dm: false,
        cooldown: 3
    })
], default_1);
exports.default = default_1;
