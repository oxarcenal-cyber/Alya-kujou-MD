"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const SECTIONS = [
    {
        title: '💦 Sex Acts',
        cmds: ['blowjob', 'sucking', 'licking', 'fucking', 'anal', 'deepthroat', 'facefuck', 'titfuck', 'handjob', 'footjob', 'masturbate'],
    },
    {
        title: '🔥 Positions',
        cmds: ['doggy', 'missionary', 'cowgirl', 'reverse', 'pov', 'rough', 'bdsm'],
    },
    {
        title: '👙 Body Parts',
        cmds: ['pussy', 'ass', 'tits', 'boobs', 'nipple', 'bigass', 'bigtits', 'smalltits', 'shaved', 'hairy', 'pink', 'blackass', 'asslick', 'pussylick'],
    },
    {
        title: '🎭 Finish',
        cmds: ['cumshot', 'creampie', 'facial', 'squirting'],
    },
    {
        title: '👥 Group',
        cmds: ['threesome', 'lesbian', 'gay', 'trans', 'interracial', 'gangbang', 'orgy'],
    },
    {
        title: '💄 Types',
        cmds: ['solo', 'dildo', 'vibrator', 'amateur', 'pornstar', 'milf', 'teen', 'mature'],
    },
    {
        title: '🌍 Ethnicity',
        cmds: ['ebony', 'asian', 'latina', 'white', 'japanese', 'korean', 'indian', 'arab', 'european', 'russian'],
    },
    {
        title: '🏫 Role Play',
        cmds: ['step', 'mom', 'daughter', 'teacher', 'student', 'boss', 'secretary', 'nurse', 'doctor', 'police', 'prison'],
    },
    {
        title: '📍 Location',
        cmds: ['public', 'outdoor', 'beach', 'pool', 'shower', 'bedroom', 'kitchen', 'office', 'school', 'camping', 'gym', 'yoga', 'dance', 'strip'],
    },
    {
        title: '✨ Look',
        cmds: ['tattoo', 'piercing', 'glasses', 'redhead', 'blonde', 'brunette', 'black'],
    },
    {
        title: '💍 Special',
        cmds: ['romantic', 'wedding', 'honeymoon', 'vacation'],
    },
];
const TOTAL = SECTIONS.reduce((acc, s) => acc + s.cmds.length, 0);
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, {}) => {
            const p = this.client.config.prefix;
            const sectionsText = SECTIONS.map(({ title, cmds }) => {
                const cmdList = cmds.map(c => `  ▸ *${p}${c}*`).join('\n');
                return `*${title}*\n${cmdList}`;
            }).join('\n\n');
            const msg = `*『 NSFW SHORTS — Categories 』* 🔞\n` +
                `━━━━━━━━━━━━━━━━━━━\n\n` +
                `📊 *Total:* ${TOTAL} categories\n` +
                `🎬 *Usage:* \`${p}<category>\`\n\n` +
                `━━━━━━━━━━━━━━━━━━━\n\n` +
                sectionsText +
                `\n\n━━━━━━━━━━━━━━━━━━━\n` +
                `_Each command sends a random video. Use again for a new one!_ 🎲`;
            // ── Send banner GIF with text caption together ────────────────────────
            const bannerBuf = this.client.assets.get('nsfw-banner');
            if (bannerBuf) {
                return void await this.client.sendMessage(M.from, {
                    video: bannerBuf,
                    gifPlayback: true,
                    mimetype: 'video/mp4',
                    caption: msg
                }, { quoted: M.message });
            }
            return void M.reply(msg);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('nsfwlist', {
        description: 'Show all available NSFW video categories',
        usage: 'nsfwlist',
        category: 'nsfw',
        aliases: ['nsfwcategories', 'nsfwcmds'],
        exp: 5,
        cooldown: 10,
        dm: false
    })
], default_1);
exports.default = default_1;
