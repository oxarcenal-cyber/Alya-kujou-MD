import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('addbadword', {
    description: 'Add a word to the bad words filter 🚫',
    aliases: ['addword', 'banword'],
    usage: 'addbadword <word>',
    cooldown: 5,
    exp: 5,
    category: 'moderation',
    dm: false
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const word = context.trim().toLowerCase().split(' ')[0]

        if (!word)
            return void M.reply(
                `📖 *How to use:*\n` +
                `\`${prefix}addbadword <word>\`\n\n` +
                `_Example: ${prefix}addbadword badword_`
            )

        if (word.length < 2)
            return void M.reply(`❌ Word must be at least 2 characters!`)

        const groupData = await this.client.DB.getGroup(M.from)
        const list: string[] = (groupData as any).badWordsList || []

        if (list.includes(word))
            return void M.reply(`⚠️ *${word}* is already in the filter list!`)

        if (list.length >= 50)
            return void M.reply(`❌ Maximum 50 words allowed in the filter list!`)

        await this.client.DB.group.updateOne({ jid: M.from }, { $push: { badWordsList: word } })
        this.client.DB.cacheInvalidate(`group:${M.from}`)

        return void M.reply(
            `✅ *Word added to filter!*\n\n` +
            `🚫 *Word:* \`${word}\`\n` +
            `📋 *Total words:* ${list.length + 1}/50\n\n` +
            `_Enable filter with \`${prefix}badwords on\`_`
        )
    }
}
