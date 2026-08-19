import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

interface DictEntry {
    word: string
    phonetics: { text?: string }[]
    meanings: {
        partOfSpeech: string
        definitions: { definition: string; example?: string }[]
    }[]
}

@Command('define', {
    description: 'Get the dictionary definition of any English word 📖',
    category: 'utils',
    usage: 'define <word>',
    aliases: ['dict', 'meaning', 'definition'],
    cooldown: 5,
    exp: 15,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        const prefix = this.client.config.prefix
        if (!context.trim())
            return void M.reply(t('define_usage', lang, { p: prefix }))

        const word = context.trim().split(' ')[0]
        try {
            const data = await this.client.utils.fetch<DictEntry[]>(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
            )
            if (!data || !Array.isArray(data) || !data.length)
                return void M.reply(t('define_not_found', lang, { word, p: prefix }))

            const entry = data[0]
            const phonetic = entry.phonetics.find(p => p.text)?.text || ''
            let text =
                `📖 *${entry.word.toUpperCase()}* ${phonetic ? `_(${phonetic})_` : ''}\n` +
                `${'─'.repeat(25)}\n\n`

            for (const meaning of entry.meanings.slice(0, 3)) {
                text += `🏷️ *${meaning.partOfSpeech}*\n`
                for (const def of meaning.definitions.slice(0, 2)) {
                    text += `  • ${def.definition}\n`
                    if (def.example) text += `    _"${def.example}"_\n`
                }
                text += '\n'
            }

            text += `${'─'.repeat(25)}\n📢 *How to use:* \`${prefix}define <word>\``
            return void M.reply(text)
        } catch {
            return void M.reply(t('define_error', lang, { word, p: prefix }))
        }
    }
}
