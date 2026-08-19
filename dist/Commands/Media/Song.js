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
            if (!context)
                return void M.reply(`🎵 *SONG DOWNLOADER*\n` +
                    `━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `📖 *How to use:*\n` +
                    `  \`${prefix}song <song name>\`\n\n` +
                    `📌 *Examples:*\n` +
                    `  \`${prefix}song shape of you\`\n` +
                    `  \`${prefix}song tum hi ho\`\n` +
                    `  \`${prefix}song blinding lights weeknd\`\n\n` +
                    `💡 _Aliases: ${prefix}play, ${prefix}yt, ${prefix}music_\n` +
                    `━━━━━━━━━━━━━━━━━━━━━`);
            const query = context.trim();
            await M.react('⏳');
            // Search YouTube
            const searchData = await this.client.utils.fetch(`https://apis.davidcyriltech.my.id/youtube/search?query=${encodeURIComponent(query)}`).catch(() => null);
            if (!searchData?.status || !searchData.results?.length) {
                await M.react('❌');
                return void M.reply(`❌ *No results found for:* _"${query}"_\n\n💡 Try a different song name.`);
            }
            const top = searchData.results[0];
            // Fetch MP3 download URL only (skip video — much faster)
            const mp3Data = await this.client.utils.fetch(`https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(top.url)}`).catch(() => null);
            if (!mp3Data?.success || !mp3Data.result?.download_url) {
                await M.react('❌');
                return void M.reply(`❌ *Download failed!*\n\n_Try again after some time._`);
            }
            const { title, quality, download_url: audioUrl, thumbnail } = mp3Data.result;
            const caption = `🎵 *${title}*\n` +
                `⏱️ ${top.duration}  •  🎚️ ${quality?.toUpperCase() || 'MP3'}  •  👁️ ${Number(top.views).toLocaleString()}\n` +
                `🔱 _RedzeoX_`;
            // Download audio + thumbnail in parallel
            const [audioBuffer, thumb] = await Promise.all([
                this.client.utils.getBuffer(audioUrl).catch(() => null),
                this.client.utils.getBuffer(thumbnail).catch(() => null)
            ]);
            if (!audioBuffer) {
                await M.react('❌');
                return void M.reply(`❌ *Audio download failed!*\n\n🔗 ${audioUrl}`);
            }
            const opusBuffer = await this.client.utils.mp3ToOpus(audioBuffer).catch(() => null);
            if (!opusBuffer) {
                await M.react('❌');
                return void M.reply(`❌ *Audio convert failed!*\n\n🔗 ${audioUrl}`);
            }
            // Send thumbnail with caption + YouTube URL button, then audio
            if (thumb) {
                await this.client.sendMessage(M.from, {
                    image: thumb,
                    caption,
                    footer: '🎵 RedzeoX Music',
                    buttons: [
                        { text: '▶️ Watch on YouTube', url: top.url }
                    ]
                }, { quoted: M.message });
            }
            await M.react('✅');
            return void (await M.reply(opusBuffer, 'audio'));
        };
    }
};
default_1 = __decorate([
    (0, Structures_1.Command)('song', {
        description: '🎵 Search a song by name and get the audio',
        aliases: ['play', 'yt', 'music'],
        usage: 'song [song name]',
        cooldown: 30,
        exp: 20,
        category: 'media'
    })
], default_1);
exports.default = default_1;
