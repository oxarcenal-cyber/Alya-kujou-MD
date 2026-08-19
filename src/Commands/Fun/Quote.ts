import { Command, BaseCommand, Message } from '../../Structures'

@Command('quote', {
    description: 'Sends a random motivational quote 💬',
    category: 'fun',
    usage: 'quote',
    aliases: ['motivation', 'qte'],
    cooldown: 5,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        try {
            const data = await this.client.utils.fetch<[{ q: string; a: string }]>(
                'https://zenquotes.io/api/random'
            )
            if (!data || !data.length) return void M.reply(`❌ Quote nahi mila. Try again!`)
            const { q, a } = data[0]
            return void M.reply(
                `💬 *QUOTE OF THE MOMENT* 💬\n` +
                `${'─'.repeat(25)}\n\n` +
                `_"${q}"_\n\n` +
                `✍️ *— ${a}*\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}quote\`\n` +
                `_Aur try karo: \`${prefix}fact\` | \`${prefix}joke\`_`
            )
        } catch {
            return void M.reply('❌ Quote fetch nahi hua. Try again later!')
        }
    }
}
