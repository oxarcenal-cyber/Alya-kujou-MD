"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../../Structures");
// ─── Category Map: command → xbooru search tag ────────────────────────────────
const CATEGORIES = {
    pussy: 'pussy',
    ass: 'ass',
    licking: 'licking',
    blowjob: 'blowjob',
    sucking: 'sucking',
    fucking: 'sex',
    anal: 'anal',
    doggy: 'doggystyle',
    missionary: 'missionary',
    cowgirl: 'cowgirl',
    reverse: 'reverse_cowgirl',
    tits: 'big_breasts',
    boobs: 'breasts',
    nipple: 'nipples',
    creampie: 'creampie',
    cumshot: 'cum',
    facial: 'facial',
    handjob: 'handjob',
    footjob: 'footjob',
    threesome: 'threesome',
    lesbian: 'lesbian',
    gay: 'gay',
    trans: 'transgender',
    solo: 'solo',
    masturbate: 'masturbation',
    dildo: 'dildo',
    vibrator: 'vibrator',
    bdsm: 'bdsm',
    rough: 'rough_sex',
    romantic: 'romantic',
    amateur: 'amateur',
    milf: 'milf',
    teen: 'teen',
    mature: 'mature',
    ebony: 'dark_skin',
    asian: 'asian',
    latina: 'latina',
    white: 'caucasian',
    interracial: 'interracial',
    gangbang: 'gangbang',
    orgy: 'orgy',
    squirting: 'squirting',
    deepthroat: 'deepthroat',
    facefuck: 'facefuck',
    titfuck: 'paizuri',
    pov: 'pov',
    public: 'public_sex',
    outdoor: 'outdoor',
    beach: 'beach',
    pool: 'pool',
    shower: 'shower',
    bedroom: 'bedroom',
    kitchen: 'kitchen',
    office: 'office',
    school: 'school',
    step: 'step_siblings',
    mom: 'mother',
    daughter: 'daughter',
    teacher: 'teacher',
    student: 'student',
    boss: 'boss',
    secretary: 'secretary',
    nurse: 'nurse',
    doctor: 'doctor',
    police: 'police',
    prison: 'prison',
    wedding: 'wedding',
    honeymoon: 'honeymoon',
    vacation: 'vacation',
    camping: 'camping',
    gym: 'gym',
    yoga: 'yoga',
    dance: 'dancing',
    strip: 'striptease',
    pornstar: 'pornstar',
    japanese: 'japanese',
    korean: 'korean',
    indian: 'indian',
    arab: 'arab',
    european: 'european',
    russian: 'russian',
    bigass: 'large_ass',
    bigtits: 'huge_breasts',
    smalltits: 'small_breasts',
    shaved: 'shaved_pussy',
    hairy: 'hairy',
    tattoo: 'tattoo',
    piercing: 'piercing',
    glasses: 'glasses',
    redhead: 'redhead',
    blonde: 'blonde',
    brunette: 'brunette',
    black: 'black',
    pink: 'pink_pussy',
    blackass: 'black_ass',
    asslick: 'ass_lick',
    pussylick: 'pussy_lick',
};
let default_1 = class extends Structures_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.execute = async (M) => {
            const prefix = this.client.config.prefix;
            const usedCmd = M.content.trim().split(' ')[0].toLowerCase().slice(prefix.length);
            const tag = CATEGORIES[usedCmd];
            if (!tag) {
                return void M.reply(`*『 NSFW SHORTS 』*\n\n` +
                    `❌ *Unknown category!*\n\n` +
                    `📌 Use \`${prefix}nsfwlist\` to see all available categories.\n\n` +
                    `_Example: \`${prefix}blowjob\` · \`${prefix}anal\` · \`${prefix}milf\`_ 🔞`);
            }
            await M.react('⏳');
            // ── Randomise page so results are never the same ──────────────────────
            const pid = Math.floor(Math.random() * 15);
            const url = `https://xbooru.com/index.php?page=dapi&s=post&q=index&json=1` +
                `&tags=${encodeURIComponent(tag)}+video&limit=20&pid=${pid}`;
            const posts = await this.client.utils
                .fetch(url)
                .catch(() => null);
            // Filter for actual video (mp4) URLs
            const videos = (posts ?? []).filter(p => p?.file_url?.includes('mp4.xbooru.com'));
            // If random page yielded nothing, try page 0 as fallback
            let videoUrl;
            if (videos.length > 0) {
                videoUrl = videos[Math.floor(Math.random() * videos.length)].file_url;
            }
            else if (pid > 0) {
                const fallback = await this.client.utils
                    .fetch(`https://xbooru.com/index.php?page=dapi&s=post&q=index&json=1` +
                    `&tags=${encodeURIComponent(tag)}+video&limit=20&pid=0`)
                    .catch(() => null);
                const fallbackVids = (fallback ?? []).filter(p => p?.file_url?.includes('mp4.xbooru.com'));
                if (fallbackVids.length > 0)
                    videoUrl = fallbackVids[Math.floor(Math.random() * fallbackVids.length)].file_url;
            }
            if (!videoUrl) {
                await M.react('❌');
                return void M.reply(`*『 NSFW SHORTS 』*\n\n` +
                    `❌ *No video found!*\n` +
                    `📂 *Category:* ${tag}\n\n` +
                    `_Try again or use a different category_ 🔄`);
            }
            await M.react('🔞');
            return void await this.client.sendMessage(M.from, {
                video: { url: videoUrl },
                caption: `*『 NSFW SHORTS 』*\n\n` +
                    `📂 *Category:* ${tag}\n\n` +
                    `_Use \`${prefix}${usedCmd}\` again for another_ 🔞`,
                gifPlayback: false,
                mimetype: 'video/mp4'
            }, { quoted: M.message });
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('pussy', {
        description: 'Send a random NSFW video by category 🔞',
        usage: 'pussy | ass | blowjob | anal | ... (see -nsfwlist)',
        category: 'nsfw',
        aliases: Object.keys(CATEGORIES).filter(k => k !== 'pussy'),
        exp: 10,
        cooldown: 8,
        dm: false
    })
], default_1);
exports.default = default_1;
