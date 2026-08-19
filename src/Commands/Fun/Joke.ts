import { Command, BaseCommand, Message } from '../../Structures'

@Command('joke', {
    description: 'Sends a random funny joke 😂',
    category: 'fun',
    usage: 'joke',
    aliases: ['lol'],
    cooldown: 5,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        try {
            const data = await this.client.utils.fetch<any>(
                'https://v2.jokeapi.dev/joke/Any?safe-mode&blacklistFlags=racist,sexist,explicit'
            )
            if (!data) return void M.reply(`❌ Joke nahi mila. Try again!`)
            const jokeText = data.type === 'single' ? data.joke : `${data.setup}\n\n_${data.delivery}_`
            return void M.reply(
                `😂 *RANDOM JOKE* 😂\n` +
                `${'─'.repeat(25)}\n\n` +
                `${jokeText}\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}joke\`\n` +
                `_Aur try karo: \`${prefix}meme\` | \`${prefix}fact\` | \`${prefix}roast @user\`_`
            )
        } catch {
            return void M.reply('❌ Joke fetch nahi hua. Try again later!')
        }
    }
}
