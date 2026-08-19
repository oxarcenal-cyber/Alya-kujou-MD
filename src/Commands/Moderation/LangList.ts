import { Command, BaseCommand, Message } from '../../Structures'
import { t, langName } from '../../lib'

@Command('langlist', {
    description: 'Preview how bot messages look in English and Hindi side-by-side',
    category: 'moderation',
    usage: 'langlist',
    aliases: ['langpreview', 'langshow'],
    exp: 5,
    cooldown: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const lang = await this.getLang(M)
        const p = this.client.config.prefix
        const current = langName(lang)

        const SAMPLES: Array<{ key: string; label: string }> = [
            { key: 'cooldown',              label: '⏳ Cooldown' },
            { key: 'banned',                label: '🚫 Banned' },
            { key: 'group_only',            label: '👥 Group only' },
            { key: 'admin_only',            label: '⚔️ Admin only' },
            { key: 'nsfw_only',             label: '🔞 NSFW only' },
            { key: 'weeb_no_query',         label: '🔍 No query (weeb)' },
            { key: 'weeb_fetch_error',      label: '❌ Fetch error' },
            { key: 'media_lyrics_no_query', label: '🎵 No song name' },
            { key: 'media_yts_no_query',    label: '📺 No YT query' },
            { key: 'chara_nothing_to_claim',label: '🎭 Nothing to claim' },
            { key: 'chara_no_gallery',      label: '📭 Empty gallery' },
            { key: 'nsfw_loli_caption',     label: '🔞 Loli reply' },
        ]

        const vars = { time: '5', p, prefix: p, cmd: 'example' }

        let text = t('langlist_header', lang, { current })

        text += t('langlist_section_en', lang) + '\n'
        for (const { key, label } of SAMPLES) {
            const en = t(key, 'en', vars)
            text += `\n*${label}*\n${en}\n`
        }

        text += '\n' + t('langlist_section_hi', lang) + '\n'
        for (const { key, label } of SAMPLES) {
            const hi = t(key, 'hi', vars)
            text += `\n*${label}*\n${hi}\n`
        }

        text += t('langlist_footer', lang, { p })
        return void M.reply(text)
    }
}
