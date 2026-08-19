import { BaseCommand, Command, Message } from '../../Structures'

const ANIMALS: Record<string, string> = {
    cat: '🐱', dog: '🐶', fox: '🦊', rabbit: '🐰', dragon: '🐲'
}

const bar = (val: number): string => {
    const filled = Math.round(val / 10)
    return '█'.repeat(filled) + '░'.repeat(10 - filled) + ` ${val}%`
}

const getMood = (hunger: number, happiness: number): string => {
    const avg = (hunger + happiness) / 2
    if (avg >= 80) return '😊 Happy!'
    if (avg >= 50) return '😐 Okay~'
    if (avg >= 30) return '😔 Sad...'
    return '😢 Suffering!'
}

@Command('pet', {
    description: 'Check your virtual pet status 🐾',
    aliases: ['mypet', 'petstat', 'petstatus'],
    usage: 'pet',
    cooldown: 5,
    exp: 3,
    category: 'fun'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const userData = await this.client.DB.getUser(M.sender.jid)
        const pet = (userData as any).pet

        if (!pet?.active)
            return void M.reply(
                `🐾 You don't have a pet yet!\n\n` +
                `📖 *How to adopt:*\n` +
                `\`${prefix}adopt <name> <cat|dog|fox|rabbit|dragon>\`\n\n` +
                `_Example: ${prefix}adopt Luna cat_`
            )

        // Decay hunger/happiness over time (5 points per hour)
        const hoursSinceFed    = (Date.now() - pet.lastFed)    / 3_600_000
        const hoursSincePlayed = (Date.now() - pet.lastPlayed) / 3_600_000
        const hunger    = Math.max(0, pet.hunger    - Math.floor(hoursSinceFed * 5))
        const happiness = Math.max(0, pet.happiness - Math.floor(hoursSincePlayed * 4))

        const emoji = ANIMALS[pet.animal] || '🐾'
        const mood  = getMood(hunger, happiness)

        return void M.reply(
            `${emoji} *${pet.name.toUpperCase()}*\n` +
            `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
            `🐾 *Type:* ${pet.animal} ${emoji}\n` +
            `⭐ *Level:* ${pet.level} (${pet.exp} XP)\n` +
            `💭 *Mood:* ${mood}\n\n` +
            `🍖 *Hunger:*     ${bar(hunger)}\n` +
            `😊 *Happiness:* ${bar(happiness)}\n\n` +
            `⏰ *Last fed:* ${hoursSinceFed < 1 ? 'Just now' : `${Math.floor(hoursSinceFed)}h ago`}\n` +
            `🎮 *Last played:* ${hoursSincePlayed < 1 ? 'Just now' : `${Math.floor(hoursSincePlayed)}h ago`}\n\n` +
            `📖 *Commands:*\n` +
            `\`${prefix}feed\` · \`${prefix}petplay\``
        )
    }
}
