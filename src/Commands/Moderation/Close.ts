import { BaseCommand, Command, Message } from '../../Structures'

@Command('close', {
    description: 'Close the group — only admins can send messages 🔒',
    adminRequired: true,
    category: 'moderation',
    usage: 'close',
    exp: 5,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        if (!M.groupMetadata) return void M.reply('❌ Try Again!')

        const isAdmin = M.sender.isAdmin
        const isMod = this.client.config.mods.includes(M.sender.jid)
        if (!isAdmin && !isMod)
            return void M.reply(
                `❌ *Sirf admins use kar sakte hain!*\n\n` +
                `📢 *How to use:* \`${prefix}close\``
            )

        const { announce } = M.groupMetadata
        if (announce)
            return void M.reply(
                `⚠️ *Group pehle se closed hai!*\n\n` +
                `📢 Open karne ke liye: \`${prefix}open\``
            )

        await this.client.groupSettingUpdate(M.from, 'announcement')
        return void M.reply(
            `🔒 *GROUP CLOSED!*\n\n` +
            `Ab sirf admins message kar sakte hain.\n\n` +
            `📢 *How to use:* \`${prefix}close\`\n` +
            `_Open karne ke liye: \`${prefix}open\`_`
        )
    }
}
