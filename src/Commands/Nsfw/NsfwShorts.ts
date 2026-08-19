import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

// ─── Category Map: command → xbooru search tag ────────────────────────────────
const CATEGORIES: Record<string, string> = {
    pussy:        'pussy',
    ass:          'ass',
    licking:      'licking',
    blowjob:      'blowjob',
    sucking:      'sucking',
    fucking:      'sex',
    anal:         'anal',
    doggy:        'doggystyle',
    missionary:   'missionary',
    cowgirl:      'cowgirl',
    reverse:      'reverse_cowgirl',
    tits:         'big_breasts',
    boobs:        'breasts',
    nipple:       'nipples',
    creampie:     'creampie',
    cumshot:      'cum',
    facial:       'facial',
    handjob:      'handjob',
    footjob:      'footjob',
    threesome:    'threesome',
    lesbian:      'lesbian',
    gay:          'gay',
    trans:        'transgender',
    solo:         'solo',
    masturbate:   'masturbation',
    dildo:        'dildo',
    vibrator:     'vibrator',
    bdsm:         'bdsm',
    rough:        'rough_sex',
    romantic:     'romantic',
    amateur:      'amateur',
    milf:         'milf',
    teen:         'teen',
    mature:       'mature',
    ebony:        'dark_skin',
    asian:        'asian',
    latina:       'latina',
    white:        'caucasian',
    interracial:  'interracial',
    gangbang:     'gangbang',
    orgy:         'orgy',
    squirting:    'squirting',
    deepthroat:   'deepthroat',
    facefuck:     'facefuck',
    titfuck:      'paizuri',
    pov:          'pov',
    public:       'public_sex',
    outdoor:      'outdoor',
    beach:        'beach',
    pool:         'pool',
    shower:       'shower',
    bedroom:      'bedroom',
    kitchen:      'kitchen',
    office:       'office',
    school:       'school',
    step:         'step_siblings',
    mom:          'mother',
    daughter:     'daughter',
    teacher:      'teacher',
    student:      'student',
    boss:         'boss',
    secretary:    'secretary',
    nurse:        'nurse',
    doctor:       'doctor',
    police:       'police',
    prison:       'prison',
    wedding:      'wedding',
    honeymoon:    'honeymoon',
    vacation:     'vacation',
    camping:      'camping',
    gym:          'gym',
    yoga:         'yoga',
    dance:        'dancing',
    strip:        'striptease',
    pornstar:     'pornstar',
    japanese:     'japanese',
    korean:       'korean',
    indian:       'indian',
    arab:         'arab',
    european:     'european',
    russian:      'russian',
    bigass:       'large_ass',
    bigtits:      'huge_breasts',
    smalltits:    'small_breasts',
    shaved:       'shaved_pussy',
    hairy:        'hairy',
    tattoo:       'tattoo',
    piercing:     'piercing',
    glasses:      'glasses',
    redhead:      'redhead',
    blonde:       'blonde',
    brunette:     'brunette',
    black:        'black',
    pink:         'pink_pussy',
    blackass:     'black_ass',
    asslick:      'ass_lick',
    pussylick:    'pussy_lick',
}

interface XbooruPost {
    file_url: string
    id:       number
}

@Command('pussy', {
    description: 'Send a random NSFW video by category 🔞',
    usage: 'pussy | ass | blowjob | anal | ... (see -nsfwlist)',
    category: 'nsfw',
    aliases: Object.keys(CATEGORIES).filter(k => k !== 'pussy'),
    exp: 10,
    cooldown: 8,
    dm: false
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix  = this.client.config.prefix
        const usedCmd = M.content.trim().split(' ')[0].toLowerCase().slice(prefix.length)
        const tag     = CATEGORIES[usedCmd]

        if (!tag) {
            return void M.reply(
                `*『 NSFW SHORTS 』*\n\n` +
                `❌ *Unknown category!*\n\n` +
                `📌 Use \`${prefix}nsfwlist\` to see all available categories.\n\n` +
                `_Example: \`${prefix}blowjob\` · \`${prefix}anal\` · \`${prefix}milf\`_ 🔞`
            )
        }

        await M.react('⏳')

        // ── Randomise page so results are never the same ──────────────────────
        const pid  = Math.floor(Math.random() * 15)
        const url  = `https://xbooru.com/index.php?page=dapi&s=post&q=index&json=1` +
                     `&tags=${encodeURIComponent(tag)}+video&limit=20&pid=${pid}`

        const posts = await this.client.utils
            .fetch<XbooruPost[]>(url)
            .catch(() => null)

        // Filter for actual video (mp4) URLs
        const videos = (posts ?? []).filter(p => p?.file_url?.includes('mp4.xbooru.com'))

        // If random page yielded nothing, try page 0 as fallback
        let videoUrl: string | undefined
        if (videos.length > 0) {
            videoUrl = videos[Math.floor(Math.random() * videos.length)].file_url
        } else if (pid > 0) {
            const fallback = await this.client.utils
                .fetch<XbooruPost[]>(
                    `https://xbooru.com/index.php?page=dapi&s=post&q=index&json=1` +
                    `&tags=${encodeURIComponent(tag)}+video&limit=20&pid=0`
                )
                .catch(() => null)
            const fallbackVids = (fallback ?? []).filter(p => p?.file_url?.includes('mp4.xbooru.com'))
            if (fallbackVids.length > 0)
                videoUrl = fallbackVids[Math.floor(Math.random() * fallbackVids.length)].file_url
        }

        if (!videoUrl) {
            await M.react('❌')
            return void M.reply(
                `*『 NSFW SHORTS 』*\n\n` +
                `❌ *No video found!*\n` +
                `📂 *Category:* ${tag}\n\n` +
                `_Try again or use a different category_ 🔄`
            )
        }

        await M.react('🔞')

        return void await this.client.sendMessage(
            M.from,
            {
                video:       { url: videoUrl },
                caption:
                    `*『 NSFW SHORTS 』*\n\n` +
                    `📂 *Category:* ${tag}\n\n` +
                    `_Use \`${prefix}${usedCmd}\` again for another_ 🔞`,
                gifPlayback: false,
                mimetype:    'video/mp4'
            } as any,
            { quoted: M.message as any }
        )
    }
}
