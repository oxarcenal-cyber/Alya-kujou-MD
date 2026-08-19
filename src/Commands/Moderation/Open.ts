import { BaseCommand, Command, Message } from '../../Structures'

@Command('open', {
    description: 'Open the group — everyone can send messages 🔓',
    adminRequired: true,
    category: 'moderation',
    usage: 'open',
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
                `📢 *How to use:* \`${prefix}open\``
            )

        const { announce } = await this.client.groupMetadata(M.from)
        if (!announce)
            return void M.reply(
                `⚠️ *Group pehle se open hai!*\n\n` +
                `📢 Close karne ke liye: \`${prefix}close\``
            )

        await this.client.groupSettingUpdate(M.from, 'not_announcement')
        return void M.reply(
            `🔓 *GROUP OPEN!*\n\n` +
            `Ab sab members message kar sakte hain.\n\n` +
            `📢 *How to use:* \`${prefix}open\`\n` +
            `_Band karne ke liye: \`${prefix}close\`_`
        )
    }
}
