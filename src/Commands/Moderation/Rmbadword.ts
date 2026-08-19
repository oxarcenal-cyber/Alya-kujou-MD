import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('rmbadword', {
    description: 'Remove a word from the bad words filter ✅',
    aliases: ['removeword', 'unbanword', 'delbadword'],
    usage: 'rmbadword <word>',
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
                `\`${prefix}rmbadword <word>\`\n\n` +
                `_Example: ${prefix}rmbadword badword_`
            )

        const groupData = await this.client.DB.getGroup(M.from)
        const list: string[] = (groupData as any).badWordsList || []

        if (!list.includes(word))
            return void M.reply(`❌ *${word}* is not in the filter list!`)

        await this.client.DB.group.updateOne({ jid: M.from }, { $pull: { badWordsList: word } })
        this.client.DB.cacheInvalidate(`group:${M.from}`)

        return void M.reply(
            `✅ *Word removed from filter!*\n\n` +
            `🗑️ *Removed:* \`${word}\`\n` +
            `📋 *Remaining words:* ${list.length - 1}/50`
        )
    }
}
