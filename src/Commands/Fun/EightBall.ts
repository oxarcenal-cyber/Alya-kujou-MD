import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

const responses = [
    '✅ It is certain.',
    '✅ It is decidedly so.',
    '✅ Without a doubt.',
    '✅ Yes — definitely.',
    '✅ You may rely on it.',
    '✅ As I see it, yes.',
    '✅ Most likely.',
    '✅ Outlook good.',
    '✅ Yes.',
    '✅ Signs point to yes.',
    '🤷 Reply hazy, try again.',
    '🤷 Ask again later.',
    '🤷 Better not tell you now.',
    '🤷 Cannot predict now.',
    '🤷 Concentrate and ask again.',
    '❌ Do not count on it.',
    '❌ My reply is no.',
    '❌ My sources say no.',
    '❌ Outlook not so good.',
    '❌ Very doubtful.'
]

@Command('8ball', {
    description: 'Ask the magic 8-ball any yes/no question 🎱',
    category: 'fun',
    usage: '8ball <your question>',
    aliases: ['eightball', 'magic8'],
    cooldown: 5,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        if (!context.trim())
            return void M.reply(
                `🎱 *MAGIC 8-BALL*\n\n` +
                `Koi bhi yes/no sawaal pucho!\n\n` +
                `📢 *How to use:* \`${prefix}8ball kya aaj meri luck achi hai?\``
            )
        const answer = responses[Math.floor(Math.random() * responses.length)]
        return void M.reply(
            `🎱 *MAGIC 8-BALL* 🎱\n` +
            `${'─'.repeat(25)}\n\n` +
            `❓ *Question:* ${context.trim()}\n\n` +
            `💰 *Answer:* ${answer}\n\n` +
            `${'─'.repeat(25)}\n` +
            `📢 *How to use:* \`${prefix}8ball <sawaal>\``
        )
    }
}
