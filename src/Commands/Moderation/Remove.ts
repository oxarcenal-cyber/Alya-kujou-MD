import { BaseCommand, Command, Message } from '../../Structures'

@Command('remove', {
    description: 'Remove a user from the group 🚫',
    category: 'moderation',
    usage: 'remove [@user / quote user]',
    cooldown: 10,
    exp: 10,
    adminRequired: true
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
                `📢 *How to use:* \`${prefix}remove @user\``
            )

        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        if (!users.length)
            return void M.reply(
                `❌ Kisi ko tag ya quote karo!\n\n` +
                `📢 *How to use:* \`${prefix}remove @user\``
            )

        const mentioned = users
        let text = `🚫 *REMOVE RESULTS* 🚫\n${'─'.repeat(20)}\n`

        for (const user of users) {
            if (user === M.groupMetadata.owner) {
                text += `\n⚠️ Skipped @${user.split('@')[0]} — group owner hai`
                continue
            }
            try {
                await this.client.groupParticipantsUpdate(M.from, [user], 'remove')
                text += `\n✅ Removed @${user.split('@')[0]}`
            } catch {
                text += `\n❌ @${user.split('@')[0]} remove nahi hua`
            }
        }

        text += `\n\n📢 *How to use:* \`${prefix}remove @user\``
        return void M.reply(text, 'text', undefined, undefined, undefined, mentioned)
    }
}
