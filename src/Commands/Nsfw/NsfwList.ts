import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

const SECTIONS = [
    {
        title: '💦 Sex Acts',
        cmds:  ['blowjob', 'sucking', 'licking', 'fucking', 'anal', 'deepthroat', 'facefuck', 'titfuck', 'handjob', 'footjob', 'masturbate'],
    },
    {
        title: '🔥 Positions',
        cmds:  ['doggy', 'missionary', 'cowgirl', 'reverse', 'pov', 'rough', 'bdsm'],
    },
    {
        title: '👙 Body Parts',
        cmds:  ['pussy', 'ass', 'tits', 'boobs', 'nipple', 'bigass', 'bigtits', 'smalltits', 'shaved', 'hairy', 'pink', 'blackass', 'asslick', 'pussylick'],
    },
    {
        title: '🎭 Finish',
        cmds:  ['cumshot', 'creampie', 'facial', 'squirting'],
    },
    {
        title: '👥 Group',
        cmds:  ['threesome', 'lesbian', 'gay', 'trans', 'interracial', 'gangbang', 'orgy'],
    },
    {
        title: '💄 Types',
        cmds:  ['solo', 'dildo', 'vibrator', 'amateur', 'pornstar', 'milf', 'teen', 'mature'],
    },
    {
        title: '🌍 Ethnicity',
        cmds:  ['ebony', 'asian', 'latina', 'white', 'japanese', 'korean', 'indian', 'arab', 'european', 'russian'],
    },
    {
        title: '🏫 Role Play',
        cmds:  ['step', 'mom', 'daughter', 'teacher', 'student', 'boss', 'secretary', 'nurse', 'doctor', 'police', 'prison'],
    },
    {
        title: '📍 Location',
        cmds:  ['public', 'outdoor', 'beach', 'pool', 'shower', 'bedroom', 'kitchen', 'office', 'school', 'camping', 'gym', 'yoga', 'dance', 'strip'],
    },
    {
        title: '✨ Look',
        cmds:  ['tattoo', 'piercing', 'glasses', 'redhead', 'blonde', 'brunette', 'black'],
    },
    {
        title: '💍 Special',
        cmds:  ['romantic', 'wedding', 'honeymoon', 'vacation'],
    },
]

const TOTAL = SECTIONS.reduce((acc, s) => acc + s.cmds.length, 0)

@Command('nsfwlist', {
    description: 'Show all available NSFW video categories',
    usage: 'nsfwlist',
    category: 'nsfw',
    aliases: ['nsfwcategories', 'nsfwcmds'],
    exp: 5,
    cooldown: 10,
    dm: false
})
export default class extends BaseCommand {
    public override execute = async (M: Message, {}: IArgs): Promise<void> => {
        const p = this.client.config.prefix

        const sectionsText = SECTIONS.map(({ title, cmds }) => {
            const cmdList = cmds.map(c => `  ▸ *${p}${c}*`).join('\n')
            return `*${title}*\n${cmdList}`
        }).join('\n\n')

        const msg =
            `*『 NSFW SHORTS — Categories 』* 🔞\n` +
            `━━━━━━━━━━━━━━━━━━━\n\n` +
            `📊 *Total:* ${TOTAL} categories\n` +
            `🎬 *Usage:* \`${p}<category>\`\n\n` +
            `━━━━━━━━━━━━━━━━━━━\n\n` +
            sectionsText +
            `\n\n━━━━━━━━━━━━━━━━━━━\n` +
            `_Each command sends a random video. Use again for a new one!_ 🎲`

        // ── Send banner GIF with text caption together ────────────────────────
        const bannerBuf = this.client.assets.get('nsfw-banner') as Buffer | undefined
        if (bannerBuf) {
            return void await this.client.sendMessage(M.from, {
                video:       bannerBuf,
                gifPlayback: true,
                mimetype:    'video/mp4',
                caption:     msg
            } as any, { quoted: M.message as any })
        }

        return void M.reply(msg)
    }
}
