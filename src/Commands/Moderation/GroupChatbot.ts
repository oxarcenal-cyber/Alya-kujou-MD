import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import botConfig from '../../config'

@Command('gchatbot', {
    description: 'Enable/disable chatbot for this group 🤖',
    category: 'moderation',
    usage: 'gchatbot on || gchatbot off || gchatbot',
    aliases: ['groupchatbot', 'gcb'],
    cooldown: 5,
    exp: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        if (!M.groupMetadata) return void M.reply('❌ Ye command sirf groups mein use hoti hai!')

        const isMod = this.client.config.mods.includes(M.sender.jid)
        if (!M.sender.isAdmin && !isMod)
            return void M.reply(
                `❌ *Sirf admins use kar sakte hain!*\n\n` +
                `📢 *How to use:* \`${prefix}gchatbot on/off\``
            )

        if (!((botConfig as any).GROQ_API_KEY || botConfig.OPENAI_API_KEY))
            return void M.reply(
                `❌ *Chatbot configure nahi hai!*\n\nBot owner se contact karo.\n\n` +
                `📢 *How to use:* \`${prefix}gchatbot on/off\``
            )

        const data = await this.client.DB.getGroup(M.from)
        const current = (data as any).groupChatbot as boolean

        if (!context.trim()) {
            const status = current ? '🟢 *ON*' : '🔴 *OFF*'
            return void M.reply(
                `🤖 *GROUP CHATBOT*\n` +
                `${'─'.repeat(25)}\n\n` +
                `📌 *Status:* ${status}\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:*\n` +
                `  \`${prefix}gchatbot on\` → Enable karo\n` +
                `  \`${prefix}gchatbot off\` → Disable karo\n\n` +
                `_Jab ON ho, \`${prefix}chat <message>\` se bot se baat karo_`
            )
        }

        const input = context.trim().toLowerCase()
        if (input !== 'on' && input !== 'off')
            return void M.reply(
                `❌ *on* ya *off* likho!\n\n` +
                `📢 *How to use:*\n  \`${prefix}gchatbot on\`\n  \`${prefix}gchatbot off\``
            )

        const newValue = input === 'on'
        if (newValue === current)
            return void M.reply(`🟨 Group chatbot already *${input.toUpperCase()}* hai!`)

        await this.client.DB.updateGroup(M.from, 'groupChatbot' as any, newValue)

        return void M.reply(
            newValue
                ? `🟢 *CHATBOT ON!* 🤖\n\n` +
                  `Ab is group mein \`${prefix}chat <message>\` se bot se baat kar sakte ho!\n\n` +
                  `📢 Band karne ke liye: \`${prefix}gchatbot off\``
                : `🔴 *CHATBOT OFF!*\n\n` +
                  `Is group mein chatbot disable ho gaya.\n\n` +
                  `📢 On karne ke liye: \`${prefix}gchatbot on\``
        )
    }
}
