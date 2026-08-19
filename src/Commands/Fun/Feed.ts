import { BaseCommand, Command, Message } from '../../Structures'

const ANIMALS: Record<string, string> = {
    cat: '🐱', dog: '🐶', fox: '🦊', rabbit: '🐰', dragon: '🐲'
}

@Command('feed', {
    description: 'Feed your virtual pet 🍖',
    aliases: ['feedpet'],
    usage: 'feed',
    cooldown: 3600,
    exp: 5,
    category: 'fun'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const userData = await this.client.DB.getUser(M.sender.jid)
        const pet = (userData as any).pet

        if (!pet?.active)
            return void M.reply(
                `🐾 You don't have a pet!\n` +
                `Use \`${prefix}adopt <name> <type>\` to get one.`
            )

        const hoursSinceFed = (Date.now() - pet.lastFed) / 3_600_000
        if (hoursSinceFed < 1)
            return void M.reply(
                `🍖 *${pet.name}* is not hungry yet!\n\n` +
                `⏳ Can feed again in *${Math.ceil(60 - hoursSinceFed * 60)} min*`
            )

        const currentHunger = Math.max(0, pet.hunger - Math.floor(hoursSinceFed * 5))
        const newHunger = Math.min(100, currentHunger + 30)
        const gainedExp = Math.floor(Math.random() * 10) + 5
        const newExp = (pet.exp || 0) + gainedExp
        const newLevel = Math.floor(newExp / 100) + 1

        await this.client.DB.user.updateOne({ jid: M.sender.jid }, {
            $set: {
                'pet.hunger': newHunger,
                'pet.lastFed': Date.now(),
                'pet.exp': newExp,
                'pet.level': newLevel
            }
        })
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        const emoji = ANIMALS[pet.animal] || '🐾'
        const leveled = newLevel > pet.level

        return void M.reply(
            `🍖 *FED ${pet.name.toUpperCase()}!* ${emoji}\n` +
            `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
            `😋 *${pet.name}* munched happily!\n\n` +
            `❤️ *Hunger:* ${currentHunger}% → ${newHunger}% ✅\n` +
            `✨ *+${gainedExp} EXP gained!*\n` +
            (leveled ? `🎉 *${pet.name} leveled up to Level ${newLevel}!* 🎊\n\n` : `\n`) +
            `⏰ _Next feeding available in 1 hour_`
        )
    }
}
