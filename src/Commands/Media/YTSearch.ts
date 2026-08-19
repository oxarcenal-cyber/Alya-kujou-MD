import { Message, Command, BaseCommand } from '../../Structures'
import { IArgs, YT_Search } from '../../Types'
import { t } from '../../lib'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('yts', {
    description: 'Searches the video of the given query in YouTube',
    category: 'media',
    cooldown: 10,
    exp: 10,
    usage: 'yts [query]',
    aliases: ['ytsearch']
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        if (!context) return void M.reply(t('media_yts_no_query', lang))

        const query = context.trim()
        await M.react('🔍')

        const videos = await this.client.utils
            .fetch<YT_Search[]>(`https://weeb-api.vercel.app/ytsearch?query=${query}`)
            .catch(() => null)

        if (!videos || !videos.length) {
            await M.react('❌')
            return void M.reply(t('media_yts_not_found', lang, { query }))
        }

        const top = videos[0]
        const thumb = await this.client.utils.getBuffer(top.thumbnail).catch(() => null)

        // Short text — top 5 results only
        const length = Math.min(videos.length, 5)
        let text = `🔍 *YouTube Search Results*\n━━━━━━━━━━━━━━━━━━━━━\n\n`
        for (let i = 0; i < length; i++) {
            text +=
                `*${i + 1}.* ${videos[i].title}\n` +
                `   📺 ${videos[i].author.name}  •  ⏱️ ${videos[i].seconds}s\n` +
                `   🔗 ${videos[i].url}\n\n`
        }
        text += `🔱 _Powered by RedzeoX_`

        await M.react('✅')
        return void await this.client.sendMessage(M.from, {
            text,
            footer: '🔍 RedzeoX Search',
            buttons: [
                { text: '▶️ Watch Top Result', url: top.url }
            ]
        } as unknown as AnyMessageContent, { quoted: M.message })
    }
}
