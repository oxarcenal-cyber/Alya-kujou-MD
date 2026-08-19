import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { AnyMessageContent } from '@adiwajshing/baileys'

interface YTMp4Response {
    success: boolean
    result: {
        title: string
        thumbnail: string
        quality: string
        download_url: string
    }
}

@Command('ytmp4', {
    description: '🎬 Download video (MP4) from a YouTube link',
    aliases: ['ytvideo', 'ytv'],
    usage: 'ytmp4 [youtube_url]',
    cooldown: 30,
    exp: 20,
    category: 'media'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix

        const url = context?.trim() || M.urls.find(u => u.includes('youtube.com') || u.includes('youtu.be'))

        if (!url)
            return void M.reply(
                `🎬 *YOUTUBE MP4 DOWNLOADER*\n` +
                `━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `📖 *Usage:* \`${prefix}ytmp4 <youtube link>\`\n\n` +
                `📌 *Example:*\n` +
                `  \`${prefix}ytmp4 https://youtu.be/dQw4w9WgXcQ\`\n\n` +
                `💡 _Aliases: ${prefix}ytvideo, ${prefix}ytv_\n` +
                `━━━━━━━━━━━━━━━━━━━━━`
            )

        if (!url.includes('youtube.com') && !url.includes('youtu.be'))
            return void M.reply(
                `❌ *Invalid Link!*\n\nOnly YouTube links are supported.\n` +
                `💡 Audio only: \`${prefix}ytmp3 <link>\``
            )

        await M.react('⏳')

        const dlData = await this.client.utils.fetch<YTMp4Response>(
            `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`
        ).catch(() => null)

        if (!dlData?.success || !dlData.result?.download_url) {
            await M.react('❌')
            return void M.reply(`❌ *Download failed!*\n\n_Is the link correct? Try again after some time._`)
        }

        const { title, thumbnail, quality, download_url } = dlData.result

        const caption =
            `🎬 *${title}*\n` +
            `🎚️ ${quality?.toUpperCase() || 'MP4'}  •  📺 YouTube\n` +
            `🔱 _RedzeoX_`

        // Download thumbnail + video in parallel
        const [thumb, videoBuffer] = await Promise.all([
            this.client.utils.getBuffer(thumbnail).catch(() => null),
            this.client.utils.getBuffer(download_url).catch(() => null)
        ])

        // Thumbnail with URL button
        if (thumb) {
            await this.client.sendMessage(M.from, {
                image: thumb,
                caption,
                footer: '🎬 RedzeoX Video',
                buttons: [
                    { text: '▶️ Watch on YouTube', url }
                ]
            } as unknown as AnyMessageContent, { quoted: M.message })
        }

        if (!videoBuffer) {
            await M.react('❌')
            return void M.reply(`❌ *Video download failed!*\n\n🔗 ${url}`)
        }

        await M.react('✅')
        return void (await M.reply(videoBuffer, 'video', undefined, undefined, caption))
    }
}
