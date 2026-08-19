import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { AnyMessageContent } from '@adiwajshing/baileys'

const categoryIcons: Record<string, string> = {
    general:    '🌐',
    games:      '🎮',
    economy:    '💰',
    fun:        '🎭',
    moderation: '🛡️',
    media:      '🎵',
    utils:      '🔧',
    weeb:       '🌸',
    pokemon:    '⚡',
    cards:      '🃏',
    nsfw:       '🔞'
}

@Command('list', {
    description: 'Browse all bot commands by category 📚',
    aliases: ['listmenu', 'cmds'],
    cooldown: 5,
    exp: 5,
    usage: 'list',
    category: 'general',
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, _args: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix

        // Hide nsfw if off in group
        let showNsfw = false
        if (M.chat === 'group') {
            const groupData = await this.client.DB.getGroup(M.from).catch(() => null)
            showNsfw = groupData?.nsfw ?? false
        }

        const rows = Object.entries(categoryIcons)
            .filter(([cat]) => cat !== 'nsfw' || showNsfw)
            .map(([cat, icon]) => ({
                title:       `${icon} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`,
                id:          `menu:${cat}`,
                description: `Tap to view ${cat} commands`
            }))

        const visibleCats = Object.entries(categoryIcons)
            .filter(([cat]) => cat !== 'nsfw' || showNsfw)

        // Short display names for categories
        const shortName: Record<string, string> = {
            general:    'Gen',
            games:      'Games',
            economy:    'Eco',
            fun:        'Fun',
            moderation: 'Mod',
            media:      'Media',
            utils:      'Utils',
            weeb:       'Weeb',
            pokemon:    'Pokémon',
            cards:      'Cards',
            nsfw:       'NSFW'
        }

        // Build category lines — 3 per row
        const catChunks: string[] = []
        for (let i = 0; i < visibleCats.length; i += 3) {
            catChunks.push(
                visibleCats.slice(i, i + 3)
                    .map(([cat, icon]) => `${icon} ${shortName[cat] ?? cat}`)
                    .join(' · ')
            )
        }

        await this.client.sendMessage(
            M.from,
            {
                text:
                    `📚 *Commands Menu*\n\n` +
                    `🌐 *Browse all bot commands by*\n` +
                    `💡 Use \`${prefix}help <cmd>\` for details\n` +
                    `🔐 Admin only - On/Off 🎲\n\n` +
                    `🗂️ *Categories:*\n` +
                    catChunks.join('\n') + `\n\n` +
                    `_Tap the menu below to browse_ 👇`,
                footer: '📚 RedzeoX Commands',
                buttons: [
                    {
                        text:     '📋 Browse Categories',
                        sections: [{ title: '📂 Select a Category', rows }]
                    }
                ]
            } as unknown as AnyMessageContent,
            { quoted: M.message }
        )
    }
}
