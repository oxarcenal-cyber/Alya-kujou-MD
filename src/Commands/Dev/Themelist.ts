import { BaseCommand, Command, Message } from '../../Structures'
import { getPersonaName } from '../../lib'
import type { TPersona } from '../../lib'

const THEMES: { key: TPersona; emoji: string; anime: string; trait: string; vibe: string }[] = [
    {
        key: 'rias',
        emoji: '♟️',
        anime: 'High School DxD',
        trait: 'Confident · Royal · Commanding',
        vibe: 'The Devil Princess who leads with elegance and authority'
    },
    {
        key: 'alya',
        emoji: '🌸',
        anime: 'Alya Sometimes Hides Her Feelings in Russian',
        trait: 'Cool · Tsundere · Bilingual',
        vibe: 'Occasionally slips into Russian when flustered — watch out!'
    },
    {
        key: 'akino',
        emoji: '🌺',
        anime: 'High School DxD',
        trait: 'Gentle · Warm · Caring',
        vibe: 'Soft-spoken and kind, she makes everyone feel at home'
    },
    {
        key: 'hinata',
        emoji: '💜',
        anime: 'Naruto / Boruto',
        trait: 'Shy · Determined · Humble',
        vibe: 'Quiet on the outside, but with a heart full of courage'
    },
    {
        key: 'zerotwo',
        emoji: '🌹',
        anime: 'Darling in the FranXX',
        trait: 'Wild · Playful · Unpredictable',
        vibe: 'Calls you "darling" — expect chaos and fun at every turn'
    },
    {
        key: 'miku',
        emoji: '🎤',
        anime: 'Vocaloid',
        trait: 'Cheerful · Musical · Energetic',
        vibe: 'Always upbeat, always singing — the crowd favorite!'
    }
]

@Command('themelist', {
    description: 'View all available bot character themes',
    aliases: ['themes', 'personas', 'personalist'],
    usage: 'themelist',
    cooldown: 5,
    exp: 3,
    category: 'dev'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const current = this.client.config.persona as TPersona
        const prefix = this.client.config.prefix

        let text = `📋 *THEME DIRECTORY*\n`
        text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`
        text += `_All available bot personalities_\n\n`

        for (let i = 0; i < THEMES.length; i++) {
            const t = THEMES[i]
            const isActive = t.key === current
            const num = `0${i + 1}`

            text += `${num}. ${t.emoji} *${getPersonaName(t.key)}*`
            text += isActive ? `  ✅ _Active_\n` : `\n`
            text += `     📺 *Anime:* ${t.anime}\n`
            text += `     ✨ *Traits:* ${t.trait}\n`
            text += `     💬 ${t.vibe}\n`
            text += `     🔑 *Key:* \`${t.key}\`\n`

            if (i < THEMES.length - 1) text += `\n`
        }

        text += `\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`
        text += `🎭 *Currently Active:* ${getPersonaName(current)}\n\n`
        text += `🔄 *How to switch:*\n`
        text += `\`${prefix}settheme <key>\`\n`
        text += `_e.g. ${prefix}settheme miku_`

        return void M.reply(text)
    }
}
