import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('shorten', {
    description: 'Shorten a long URL 🔗',
    aliases: ['short', 'tinyurl', 'shorturl'],
    usage: 'shorten <url>',
    cooldown: 5,
    exp: 5,
    category: 'utils',
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const url = context.trim().split(' ')[0]

        if (!url)
            return void M.reply(
                `🔗 *URL SHORTENER*\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `📖 *How to use:*\n` +
                `\`${prefix}shorten <url>\`\n\n` +
                `_Example: ${prefix}shorten https://www.google.com/very/long/url_`
            )

        if (!url.startsWith('http://') && !url.startsWith('https://'))
            return void M.reply(`❌ Please provide a valid URL starting with *http://* or *https://*`)

        try {
            await M.reply(`⏳ Shortening your URL...`)
            const encoded = encodeURIComponent(url)
            const apiUrl  = `https://tinyurl.com/api-create.php?url=${encoded}`

            // TinyURL returns plain text — use native fetch
            const rawRes = await fetch(apiUrl)
            const short  = await rawRes.text()

            if (!short || !short.startsWith('https://tinyurl.com'))
                throw new Error('Invalid response')

            return void M.reply(
                `🔗 *URL SHORTENED!*\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `📌 *Original:* ${url.length > 50 ? url.slice(0, 50) + '...' : url}\n\n` +
                `✅ *Short URL:*\n${short}\n\n` +
                `_Powered by TinyURL_`
            )
        } catch {
            return void M.reply(`❌ Failed to shorten URL. Please try again later.`)
        }
    }
}
