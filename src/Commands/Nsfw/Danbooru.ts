import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

interface DanbooruPost {
    id: number
    file_url?: string
    large_file_url?: string
    tag_string_general: string
    tag_string_character: string
    tag_string_copyright: string
    file_ext: string
    is_deleted: boolean
    is_banned: boolean
}

const PRESET_TAGS: Record<string, string> = {
    waifu:    'rating:e 1girl solo',
    yuri:     'rating:e yuri 2girls',
    milf:     'rating:e mature_female',
    ecchi:    'rating:q 1girl',
    hentai:   'rating:e 1boy 1girl hetero',
    trap:     'rating:e trap',
    neko:     'rating:e cat_ears 1girl',
    maid:     'rating:e maid 1girl',
    ahegao:   'rating:e ahegao',
    femdom:   'rating:e femdom',
}

@Command('danbooru', {
    description: 'Fetch a random explicit/NSFW image from Danbooru by tag or preset',
    usage: 'danbooru [tag/preset]',
    category: 'nsfw',
    aliases: ['booru'],
    exp: 25,
    cooldown: 8
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        const p = this.client.config.prefix
        const raw = context.trim().toLowerCase()

        if (!raw) {
            const presets = Object.keys(PRESET_TAGS).join(', ')
            return void M.reply(t('nsfw_danbooru_usage', lang, { p, presets }))
        }

        const tags = PRESET_TAGS[raw] ?? `rating:e ${raw}`

        await M.reply(t('nsfw_fetching', lang))

        const url = `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(tags)}&limit=100`
        const posts = await this.client.utils
            .fetch<DanbooruPost[]>(url)
            .catch(() => null)

        if (!posts || !Array.isArray(posts) || posts.length === 0)
            return void M.reply(t('nsfw_danbooru_no_result', lang, { query: raw }))

        const valid = posts.filter(
            (p) => !p.is_deleted && !p.is_banned && p.file_url && ['jpg', 'png', 'webp'].includes(p.file_ext)
        )
        if (valid.length === 0)
            return void M.reply(t('nsfw_danbooru_no_result', lang, { query: raw }))

        const post = valid[Math.floor(Math.random() * valid.length)]
        const imageUrl = post.large_file_url || post.file_url!

        const chars = post.tag_string_character
            ? post.tag_string_character.split(' ').slice(0, 3).map((s) => s.replace(/_/g, ' ')).join(', ')
            : '?'
        const copy = post.tag_string_copyright
            ? post.tag_string_copyright.split(' ')[0].replace(/_/g, ' ')
            : ''
        const caption = t('nsfw_danbooru_caption', lang, {
            chars,
            copy: copy || '?',
            id: String(post.id),
            p
        })

        return void (await this.client.sendMessage(M.from, {
            image: { url: imageUrl },
            caption
        }))
    }
}
