import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

@Command('poll', {
    description: 'Create a native WhatsApp poll in the group',
    usage: 'poll "Question?" Option1 Option2 Option3 ...',
    cooldown: 10,
    exp: 10,
    category: 'general',
    aliases: ['vote']
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang = await this.getLang(M)

        if (!context) {
            return void M.reply(t('poll_help', lang, { prefix }))
        }

        const quoteMatch = context.match(/^[""](.+?)[""](.*)$/)
        let question: string
        let optionsPart: string

        if (quoteMatch) {
            question = quoteMatch[1].trim()
            optionsPart = quoteMatch[2].trim()
        } else {
            const parts = context.trim().split(/\s+/)
            question = parts[0]
            optionsPart = parts.slice(1).join(' ')
        }

        if (!question) {
            return void M.reply(t('poll_no_question', lang, { prefix }))
        }

        const options = optionsPart
            .split(/\s+/)
            .map((o) => o.trim())
            .filter((o) => o.length > 0)

        if (options.length < 2) {
            return void M.reply(t('poll_min_options', lang, { prefix }))
        }

        if (options.length > 12) {
            return void M.reply(t('poll_max_options', lang, { count: String(options.length) }))
        }

        try {
            await this.client.sendMessage(M.from, {
                poll: {
                    name: question,
                    values: options,
                    selectableCount: 1
                }
            })
        } catch (err) {
            return void M.reply(t('poll_error', lang))
        }
    }
}
