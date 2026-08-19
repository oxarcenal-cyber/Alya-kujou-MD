"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
const lib_1 = require("../../lib");
const os_1 = __importDefault(require("os"));
const PERSONA_ASSET = {
    rias: { name: 'rias-help', type: 'image' },
    alya: { name: 'alya-help', type: 'video', gif: true },
    akino: { name: 'akino-help', type: 'image' },
    hinata: { name: 'hinata-help', type: 'image' },
    zerotwo: { name: 'zerotwo-help', type: 'image' },
    miku: { name: 'miku-help', type: 'image' },
};
const categoryIcons = {
    general: '🌐',
    games: '🎮',
    economy: '💰',
    fun: '🎭',
    moderation: '🛡️',
    media: '🎵',
    utils: '🔧',
    weeb: '🌸',
    pokemon: '⚡',
    chara: '🎴',
    characters: '🎴',
    study: '📚',
    nsfw: '🔞',
    dev: '⚙️'
};
const formatUptime = (ms) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
};
const formatRam = () => {
    const used = process.memoryUsage().rss / 1024 / 1024 / 1024;
    const total = os_1.default.totalmem() / 1024 / 1024 / 1024;
    return `${used.toFixed(2)} / ${total.toFixed(2)} GB`;
};
const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' });
};
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M, { context }) => {
            const prefix = this.client.config.prefix;
            if (!context) {
                let commands = Array.from(this.handler.commands, ([, data]) => data)
                    .filter((cmd) => cmd.config.category !== 'dev');
                const { nsfw } = M.chat === 'group'
                    ? await this.client.DB.getGroup(M.from)
                    : { nsfw: false };
                if (!nsfw)
                    commands = commands.filter((cmd) => cmd.config.category !== 'nsfw');
                const introVideo = (0, lib_1.getRandomIntroVideo)();
                const pa = PERSONA_ASSET[this.client.config.persona] ?? PERSONA_ASSET['rias'];
                const buffer = (introVideo?.buffer ?? this.client.assets.get(pa.name) ?? this.client.assets.get('chisato'));
                const introBuf = introVideo?.buffer ?? null;
                const categoryMap = new Map();
                for (const cmd of commands) {
                    const cat = cmd.config.category;
                    if (!categoryMap.has(cat))
                        categoryMap.set(cat, []);
                    categoryMap.get(cat).push(cmd.name);
                }
                const uptime = formatUptime(Date.now() - this.client.startTime);
                const ram = formatRam();
                const time = getTime();
                const username = M.sender.jid.split('@')[0];
                const modsCount = this.client.config.mods.length;
                let text = `───  ×-♡ *${this.client.config.name}* ♡🤍❤️\n`;
                text += `| 🌸 *RUN*    : ${uptime}\n`;
                text += `| ⚙️ *MODE*   : PUBLIC ❤️\n`;
                text += `| 👁️ *PREFIX* : ${prefix}\n`;
                text += `| 🖥️ *RAM*    : ${ram}\n`;
                text += `| 🕐 *TIME*   : ${time}\n`;
                text += `| 😊 *USER*   : @${username}\n`;
                text += `| 🛡️ *OWNER*  : RedzeoX\n`;
                text += `| 👑 *MODS*   : ${modsCount} M\n`;
                text += `\n♡ •────── *${(0, lib_1.getPersonaName)(this.client.config.persona)}* 🔱 ──────• ♡\n\n`;
                for (const [cat, cmds] of categoryMap) {
                    const label = cat.toUpperCase();
                    text += `┌───□ *${label}* □\n`;
                    if (cat === 'nsfw') {
                        // Don't show individual NSFW command names — show a safe reference instead
                        const nsfwMeta = cmds.filter(c => ['nhentai', 'danbooru', 'lewd', 'loli', 'nsfwlist', 'nsfwtoggle', 'nsfwon', 'nsfwoff'].includes(c));
                        for (const cmd of nsfwMeta) {
                            text += `├◇ ${cmd}\n`;
                        }
                        text += `├◇ 🔞 Use \`${prefix}nsfwlist\` for all categories\n`;
                    }
                    else {
                        for (const cmd of cmds) {
                            text += `├◇ ${cmd}\n`;
                        }
                    }
                    text += `└${'─'.repeat(18)}□\n\n`;
                }
                text += `💡 *${prefix}help <command>* for details\n`;
                text += `🔱 _Powered by RedzeoX_`;
                const mediaType = introBuf ? 'video' : pa.type;
                const mediaGif = introBuf ? true : pa.gif;
                return void await this.client.sendMessage(M.from, {
                    [mediaType]: buffer,
                    gifPlayback: mediaGif,
                    caption: text,
                    mentions: [M.sender.jid],
                    footer: '⚡ RedzeoX',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: 'Surprise 🫢', id: `${prefix}surprise` }]
                }, { quoted: M.message });
            }
            const cmd = context.trim().toLowerCase();
            const command = this.handler.commands.get(cmd) || this.handler.aliases.get(cmd);
            if (!command) {
                return void M.reply(`❌ *Command not found*\n\n` +
                    `No command named *"${context.trim()}"* exists.\n` +
                    `Use *${prefix}help* to see all commands.`);
            }
            const lang = await this.getLang(M);
            const description = (0, lib_1.tOrDefault)(`cmd_${command.name}_desc`, lang, command.config.description);
            const usageText = (0, lib_1.tOrDefault)(`cmd_${command.name}_usage`, lang, command.config.usage);
            const icon = categoryIcons[command.config.category] ?? '📌';
            const aliases = command.config.aliases?.length
                ? command.config.aliases.map((a) => `\`${a}\``).join('  ')
                : '_none_';
            const usages = usageText
                .split('||')
                .map((u) => `  \`${prefix}${u.trim()}\``)
                .join('\n');
            return void M.reply(`*『 ${icon} ${this.client.utils.capitalize(command.name)} 』*\n` +
                `*━━━━━━━━━━━━━━━━━━━━━*\n\n` +
                `📖 *Description*\n${description}\n\n` +
                `*⟦ 🗂️ ᴅᴇᴛᴀɪʟꜱ ⟧*\n` +
                `❱ 🏷️ *Category:* ${this.client.utils.capitalize(command.config.category)}\n` +
                `❱ 🔀 *Aliases:* ${aliases}\n` +
                `❱ ⏱️ *Cooldown:* ${command.config.cooldown ?? 3}s\n\n` +
                `*⟦ 💻 ᴜꜱᴀɢᴇ ⟧*\n` +
                `${usages}\n\n` +
                `*━━━━━━━━━━━━━━━━━━━━━*\n` +
                `🔱 _Powered by RedzeoX_`);
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('help', {
        description: "Displays the bot's usable commands",
        aliases: ['h', 'menu'],
        cooldown: 10,
        exp: 20,
        usage: 'help || help <command_name>',
        category: 'general',
        dm: true
    })
], default_1);
exports.default = default_1;
