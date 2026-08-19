import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('spawnctl', {
    description: 'Pause or resume Pokemon and Card spawning globally',
    usage: 'spawnctl <pokemon/cards/all> <on/off>',
    category: 'dev',
    cooldown: 5,
    exp: 0,
    aliases: ['spawncontrol']
})
export default class extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const parts = context?.trim().toLowerCase().split(/\s+/)
        const target = parts?.[0]
        const action = parts?.[1]

        const targets = ['pokemon', 'cards', 'all']
        const actions = ['on', 'off']

        if (!target || !targets.includes(target) || !action || !actions.includes(action))
            return void M.reply(
                `📖 *Spawn Control*\n\n` +
                    `*${this.client.config.prefix}spawnctl pokemon off* — Stop Pokémon spawning in all groups\n` +
                    `*${this.client.config.prefix}spawnctl cards off* — Stop Card spawning in all groups\n` +
                    `*${this.client.config.prefix}spawnctl all off* — Stop both\n\n` +
                    `*${this.client.config.prefix}spawnctl pokemon on* — Resume Pokémon spawning\n` +
                    `*${this.client.config.prefix}spawnctl cards on* — Resume Card spawning\n` +
                    `*${this.client.config.prefix}spawnctl all on* — Resume both\n\n` +
                    `⚠️ This is temporary — restarting the bot resets everything to ON.`
            )

        const pause = action === 'off'

        if (target === 'pokemon' || target === 'all') this.handler.wildPaused = pause
        if (target === 'cards' || target === 'all') this.handler.cardsPaused = pause

        const status = pause ? '🔴 *PAUSED*' : '🟢 *RESUMED*'
        const lines: string[] = []

        if (target === 'pokemon' || target === 'all')
            lines.push(`🐾 Pokémon spawning → ${status}`)
        if (target === 'cards' || target === 'all')
            lines.push(`🃏 Card spawning → ${status}`)

        return void M.reply(`⚙️ *Spawn Control Updated*\n\n${lines.join('\n')}`)
    }
}
