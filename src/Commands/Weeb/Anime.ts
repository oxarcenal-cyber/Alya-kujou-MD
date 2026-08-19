import { Anime } from '@shineiichijo/marika'
import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

@Command('anime', {
    description: 'Searches an anime of the given query in MyAnimeList',
    aliases: ['ani'],
    category: 'weeb',
    usage: 'anime [query]',
    exp: 20,
    cooldown: 20
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        if (!context) return void M.reply(t('weeb_no_query', lang))
        const query = context.trim()
        await this.client.utils
            .withRetry(() => new Anime().searchAnime(query))
            .then(async ({ data }) => {
                const result = data[0]
                if (!result) return void M.reply(t('weeb_anime_not_found', lang, { query }))
                let text = `🎀 *Title:* ${result.title}\n🎋 *Format:* ${
                    result.type
                }\n📈 *Status:* ${this.client.utils.capitalize(
                    result.status.toLowerCase().replace(/\_/g, ' ')
                )}\n🍥 *Total episodes:* ${result.episodes}\n🎈 *Duration:* ${
                    result.duration
                }\n🧧 *Genres:* ${result.genres
                    .map((genre) => genre.name)
                    .join(', ')}\n✨ *Based on:* ${this.client.utils.capitalize(
                    result.source.toLowerCase()
                )}\n📍 *Studios:* ${result.studios
                    .map((studio) => studio.name)
                    .join(', ')}\n🎴 *Producers:* ${result.producers
                    .map((producer) => producer.name)
                    .join(', ')}\n💫 *Premiered on:* ${result.aired.from}\n🎗 *Ended on:* ${
                    result.aired.to
                }\n🎐 *Popularity:* ${result.popularity}\n🎏 *Favorites:* ${result.favorites}\n🎇 *Rating:* ${
                    result.rating
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
                console.error(`[Anime] Failed to fetch anime for "${query}":`, (error as Error)?.message)
                return void M.reply(t('weeb_anime_not_found', lang, { query }))
            })
    }
}
