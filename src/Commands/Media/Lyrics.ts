import { Lyrics, t } from '../../lib'
import { Message, Command, BaseCommand } from '../../Structures'
import { IArgs } from '../../Types'

@Command('lyrics', {
    description: 'Sends the lyrics of a given song',
    usage: 'lyrics [song]',
    cooldown: 10,
    exp: 20,
    category: 'media'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        if (!context) return void (await M.reply(t('media_lyrics_no_query', lang)))
        const term = context.trim()
        const lyrics = new Lyrics()
        const data = await lyrics.search(term)
        if (!data.length) return void (await M.reply(t('media_lyrics_not_found', lang, { term })))
        const buffer = await this.client.utils.getBuffer(data[0].image)
        let text = `🌿 *Title:* ${data[0].title} *(${data[0].fullTitle})*\n🍥 *Artist:* ${data[0].artist}`
        text += `\n\n${data[0].lyrics}`
        return void (await M.reply(buffer, 'image', undefined, undefined, text, undefined, {
            title: data[0].title,
            body: data[0].fullTitle,
            thumbnail: buffer,
            sourceUrl: data[0].url,
            mediaType: 1,
            mediaUrl: data[0].url
        }))
    }
}
