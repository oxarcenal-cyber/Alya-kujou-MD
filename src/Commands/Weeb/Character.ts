import { Character } from '@shineiichijo/marika'
import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

@Command('character', {
    description: 'Searches a character of the given query in MyAnimeList',
    usage: 'character [query]',
    category: 'weeb',
    aliases: ['chara'],
    exp: 20,
    cooldown: 15
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        if (!context) return void M.reply(t('weeb_no_query', lang))
        const query = context.trim()
        await this.client.utils
            .withRetry(() => new Character().searchCharacter(query))
            .then(async ({ data }) => {
                const chara = data[0]
                if (!chara) return void M.reply(t('weeb_character_not_found', lang, { query }))
                let source = ''
                await this.client.utils
                    .withRetry(() => new Character().getCharacterAnime(chara.mal_id))
                    .then((res) => (source = res.data[0].anime.title))
                    .catch(async () => {
                        await this.client.utils
                            .withRetry(() => new Character().getCharacterManga(chara.mal_id.toString()))
                            .then((res) => (source = res.data[0].manga.title))
                            .catch(() => (source = ''))
                    })
                let text = `💙 *Name:* ${chara.name}\n💚 *Nicknames:* ${chara.nicknames.join(
                    ', '
                )}\n💛 *Source:* ${source}`
                if (chara.about !== null) text += `\n\n❤ *Description:* ${chara.about}`
                const image = await this.client.utils.getBuffer(chara.images.jpg.image_url)
                return void (await M.reply(image, 'image', undefined, undefined, text, undefined, {
                    title: chara.name,
                    mediaType: 1,
                    thumbnail: image,
                    sourceUrl: chara.url
                }))
            })
            .catch((error) => {
                console.error(`[Character] Failed to fetch character for "${query}":`, (error as Error)?.message)
                return void M.reply(t('weeb_character_not_found', lang, { query }))
            })
    }
}
