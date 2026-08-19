import { Message, BaseCommand, Command } from '../../Structures'
import { IArgs } from '../../Types'

@Command('welcome', {
    description: 'Enable or disable welcome/farewell messages for this group',
    usage: 'welcome on || welcome off || welcome',
    cooldown: 5,
    category: 'moderation',
    exp: 20,
    aliases: ['wlcm']
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix

        const data = await this.client.DB.getGroup(M.from)
        const current = data.welcome

        if (!context) {
            const status = current ? '🟢 *ON*' : '🔴 *OFF*'
            return void M.reply(
                `┌───□ *WELCOME FEATURE* □\n` +
                `├◇ 📌 *Status:* ${status}\n` +
                `├◇ 👥 *Group:* ${M.from}\n` +
                `└${'─'.repeat(18)}□\n\n` +
                `💡 *Usage:*\n` +
                `  \`${prefix}welcome on\` → Enable\n` +
                `  \`${prefix}welcome off\` → Disable\n\n` +
                `📝 _Jab koi join ya leave karega toh bot message bhejega_`
            )
        }

        const input = context.trim().toLowerCase()

        if (input !== 'on' && input !== 'off') {
            return void M.reply(
                `❌ Invalid option!\n\n` +
                `Use:\n` +
                `  \`${prefix}welcome on\` → Enable\n` +
                `  \`${prefix}welcome off\` → Disable`
            )
        }

        const newValue = input === 'on'

        if (newValue === current) {
            return void M.reply(
                `🟨 Welcome feature is already *${input.toUpperCase()}* in this group!`
            )
        }

        await this.client.DB.updateGroup(M.from, 'welcome', newValue)

        return void M.reply(
            newValue
                ? `🟢 *Welcome feature ON!*\n\n` +
                  `Ab jab koi group join karega → Welcome message aayega 🎉\n` +
                  `Jab koi leave karega → Farewell message aayega 👋\n\n` +
                  `_Disable karne ke liye:_ \`${prefix}welcome off\``
                : `🔴 *Welcome feature OFF!*\n\n` +
                  `Ab join/leave par koi message nahi aayega.\n\n` +
                  `_Enable karne ke liye:_ \`${prefix}welcome on\``
        )
    }
}
