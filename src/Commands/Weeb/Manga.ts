import { Manga } from '@shineiichijo/marika'
import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

@Command('manga', {
    description: 'Searches a manga of the given query in MyAnimeList',
    category: 'weeb',
    exp: 10,
    usage: 'manga [query]',
    cooldown: 20
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        if (!context) return void M.reply(t('weeb_no_query', lang))
        const query = context.trim()
        await this.client.utils
            .withRetry(() => new Manga().searchManga(query))
            .then(async ({ data }) => {
                const result = data[0]
                if (!result) return void M.reply(t('weeb_manga_not_found', lang, { query }))
                let text = `🎀 *Title:* ${result.title}\n🎋 *Format:* ${
                    result.type
                }\n📈 *Status:* ${this.client.utils.capitalize(
                    result.status.toLowerCase().replace(/\_/g, ' ')
                )}\n🍥 *Total chapters:* ${result.chapters}\n🎈 *Total volumes:* ${
                    result.volumes
                }\n🧧 *Genres:* ${result.genres.map((genre) => genre.name).join(', ')}\n💫 *Published on:* ${
                    result.published.from
                }\n🎗 *Ended on:* ${result.published.to}\n🎐 *Popularity:* ${result.popularity}\n🎏 *Favorites:* ${
                    result.favorites
                }\n🏅 *Rank:* ${result.rank}\n\n`
                if (result.background !== null) text += `🎆 *Background:* ${result.background}\n\n`
                text += `❄ *Description:* ${result.synopsis}`
                const image = await this.client.utils.getBuffer(result.images.jpg.large_image_url)
                return void (await M.reply(image, 'image', undefined, undefined, text, undefined, {
                    title: result.title,
                    mediaType: 1,
                    thumbnail: image,
                    sourceUrl: result.url
                }))
            })
            .catch((error) => {
                console.error(`[Manga] Failed to fetch manga for "${query}":`, (error as Error)?.message)
                return void M.reply(t('weeb_manga_not_found', lang, { query }))
            })
    }
}
