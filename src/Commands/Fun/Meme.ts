import { Command, BaseCommand, Message } from '../../Structures'

@Command('meme', {
    description: 'Sends a random meme from Reddit 😂',
    category: 'fun',
    usage: 'meme',
    aliases: ['randommeme'],
    cooldown: 8,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        try {
            const data = await this.client.utils.fetch<{
                url: string
                title: string
                author: string
                subreddit: string
                ups: number
                nsfw: boolean
            }>('https://meme-api.com/gimme')
            if (!data || !data.url) return void M.reply(`❌ Meme nahi mila. Try again!`)
            if (data.nsfw) return void M.reply('❌ NSFW meme mila, skip! Try again.')
            const buffer = await this.client.utils.getBuffer(data.url)
            return void M.reply(
                buffer,
                'image',
                undefined,
                undefined,
                `😂 *${data.title}*\n👤 by u/${data.author} | r/${data.subreddit} | 👍 ${data.ups}\n\n📢 *How to use:* \`${prefix}meme\``
            )
        } catch {
            return void M.reply('❌ Meme fetch nahi hua. Try again later!')
        }
    }
}
