import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

const langMap: Record<string, string> = {
    en: 'English', hi: 'Hindi', ur: 'Urdu', es: 'Spanish',
    fr: 'French', de: 'German', ja: 'Japanese', ko: 'Korean',
    zh: 'Chinese', ar: 'Arabic', pt: 'Portuguese', ru: 'Russian',
    it: 'Italian', tr: 'Turkish', bn: 'Bengali', ta: 'Tamil',
    te: 'Telugu', mr: 'Marathi', gu: 'Gujarati', pa: 'Punjabi'
}

@Command('translate', {
    description: 'Translate text to any language 🌐',
    category: 'utils',
    usage: 'translate <lang_code> <text>',
    aliases: ['tr', 'trans'],
    cooldown: 5,
    exp: 15,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context, args }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        const prefix = this.client.config.prefix
        if (!context.trim() || args.length < 2)
            return void M.reply(t('translate_usage', lang, { p: prefix }))

        const targetLang = args[0].toLowerCase()
        const text = args.slice(1).join(' ')
        if (!text.trim())
            return void M.reply(t('translate_no_text', lang, { p: prefix }))

        try {
            const res = await this.client.utils.fetch<any[]>(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
            )
            // Response shape: [ [ ["translated","original",...], ... ], ... ]
            const translated = (res?.[0] as any[][])?.map((chunk) => chunk?.[0]).filter(Boolean).join('') || ''

            if (!translated)
                return void M.reply(t('translate_failed', lang, { p: prefix }))

            const langName = langMap[targetLang] || targetLang.toUpperCase()
            return void M.reply(
                `🌐 *TRANSLATION* 🌐\n` +
                `${'─'.repeat(25)}\n\n` +
                `📝 *Original:* ${text}\n\n` +
                `✅ *${langName}:* ${translated}\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}translate <lang> <text>\``
            )
        } catch {
            return void M.reply(t('translate_error', lang, { p: prefix }))
        }
    }
}
