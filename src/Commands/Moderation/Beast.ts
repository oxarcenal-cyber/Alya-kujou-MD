import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('beast', {
    description: 'Enable/disable Beast chatbot for this group 🦁',
    category: 'moderation',
    usage: 'beast | beast on | beast off',
    aliases: ['beastmode', 'bm'],
    cooldown: 5,
    exp: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix

        if (!M.groupMetadata)
            return void M.reply('❌ This command can only be used in groups!')

        const isMod = this.client.config.mods.includes(M.sender.jid)
        if (!M.sender.isAdmin && !isMod)
            return void M.reply(
                `❌ *Only admins can use this command!*\n\n` +
                `📢 *Usage:* \`${prefix}beast\``
            )

        const input = context.trim().toLowerCase()

        // ── No argument → show list button menu ────────────────────────────
        if (!input) {
            const data  = await this.client.DB.getGroup(M.from)
            const isOn  = (data as any).beastChat as boolean
            const status = isOn ? '🟢 *ON*' : '🔴 *OFF*'

            return void await this.client.sendMessage(M.from, {
                text:
                    `🦁 *BEAST MODE*\n` +
                    `${'─'.repeat(25)}\n\n` +
                    `📌 *Status:* ${status}\n\n` +
                    `💬 When ON, mention the bot or reply to its message — it will respond like a savage!\n\n` +
                    `${'─'.repeat(25)}\n` +
                    `💡 Tap the button below to toggle:`,
                footer: '⚡ RedzeoX — Beast Mode',
                buttons: [
                    {
                        text: '🦁 Beast Settings',
                        sections: [
                            {
                                title: '🦁 BEAST MODE',
                                rows: [
                                    {
                                        title: '✅ Beast ON',
                                        id: `${prefix}beast on`,
                                        description: 'Enable savage chatbot — responds on @mention / reply'
                                    },
                                    {
                                        title: '❌ Beast OFF',
                                        id: `${prefix}beast off`,
                                        description: 'Disable the beast chatbot for this group'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            } as any, { quoted: M.message })
        }

        // ── on / off ────────────────────────────────────────────────────────
        if (input !== 'on' && input !== 'off')
            return void M.reply(
                `❌ Use *on* or *off*!\n\n` +
                `📢 Example: \`${prefix}beast on\``
            )

        const newValue  = input === 'on'
        const data      = await this.client.DB.getGroup(M.from)
        const current   = (data as any).beastChat as boolean

        if (newValue === current)
            return void M.reply(`⚠️ Beast mode is already *${input.toUpperCase()}* in this group!`)

        await this.client.DB.updateGroup(M.from, 'beastChat' as any, newValue)

        return void M.reply(
            newValue
                ? `🦁 *BEAST MODE — ON!*\n\n` +
                  `Ab is group mein bot ko @mention karo ya uski message reply karo — full gaali-mode mein jawab milega! 😤\n\n` +
                  `📢 Band karne ke liye: \`${prefix}beast off\``
                : `🔴 *BEAST MODE — OFF!*\n\n` +
                  `Beast chatbot is group mein disable ho gaya.\n\n` +
                  `📢 On karne ke liye: \`${prefix}beast on\``
        )
    }
}
