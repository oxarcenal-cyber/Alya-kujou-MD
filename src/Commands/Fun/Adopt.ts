import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { checkAndAwardBadges } from '../../lib/BadgeList'

const ANIMALS: Record<string, { emoji: string; sound: string }> = {
    cat:    { emoji: '🐱', sound: 'Meow~' },
    dog:    { emoji: '🐶', sound: 'Woof!' },
    fox:    { emoji: '🦊', sound: 'Yip!' },
    rabbit: { emoji: '🐰', sound: 'Squeak~' },
    dragon: { emoji: '🐲', sound: 'Roar!' },
}

@Command('adopt', {
    description: 'Adopt a virtual pet! 🐾',
    aliases: ['getpet'],
    usage: 'adopt <name> <cat|dog|fox|rabbit|dragon>',
    cooldown: 10,
    exp: 20,
    category: 'fun'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const args = context.trim().split(' ')

        if (args.length < 2)
            return void M.reply(
                `🐾 *ADOPT A PET*\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `📖 *How to use:*\n` +
                `\`${prefix}adopt <name> <type>\`\n\n` +
                `🐱 *Available types:*\n` +
                Object.entries(ANIMALS).map(([k, v]) => `${v.emoji} \`${k}\``).join(' · ') + '\n\n' +
                `_Example: ${prefix}adopt Mochi cat_`
            )

        const userData = await this.client.DB.getUser(M.sender.jid)
        if ((userData as any).pet?.active)
            return void M.reply(
                `🐾 You already have a pet named *${(userData as any).pet.name}*!\n` +
                `Use \`${prefix}pet\` to check on them.`
            )

        const petName = args[0]
        const animalKey = args[1].toLowerCase()

        if (!ANIMALS[animalKey])
            return void M.reply(
                `❌ Unknown pet type *${animalKey}*!\n\n` +
                `🐾 *Available:* ` + Object.entries(ANIMALS).map(([k, v]) => `${v.emoji} ${k}`).join(', ')
            )

        if (petName.length > 15)
            return void M.reply(`❌ Pet name is too long! Maximum 15 characters.`)

        await this.client.DB.user.updateOne({ jid: M.sender.jid }, {
            $set: {
                pet: {
                    active: true,
                    name: petName,
                    animal: animalKey,
                    hunger: 100,
                    happiness: 100,
                    level: 1,
                    exp: 0,
                    lastFed: Date.now(),
                    lastPlayed: Date.now()
                }
            }
        })
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        await checkAndAwardBadges(M.sender.jid, this.client.DB)

        const { emoji, sound } = ANIMALS[animalKey]
        return void M.reply(
            `${emoji} *NEW PET ADOPTED!* ${emoji}\n` +
            `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
            `🎉 Say hello to *${petName}* the ${animalKey}!\n` +
            `💬 *${petName}:* "${sound}"\n\n` +
            `❤️ *Hunger:* ██████████ 100%\n` +
            `😊 *Happiness:* ██████████ 100%\n` +
            `⭐ *Level:* 1\n\n` +
            `📖 *Pet Commands:*\n` +
            `\`${prefix}pet\` — View pet status\n` +
            `\`${prefix}feed\` — Feed your pet\n` +
            `\`${prefix}petplay\` — Play with your pet`
        )
    }
}
