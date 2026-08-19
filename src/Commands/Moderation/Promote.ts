import { BaseCommand, Command, Message } from '../../Structures'
import { Message as MessageClass } from '../../Structures/Message'

@Command('promote', {
    description: 'Promote a member to admin 📈',
    category: 'moderation',
    usage: 'promote [@user / quote user]',
    exp: 10,
    cooldown: 10,
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
                `📢 *How to use:* \`${prefix}promote @user\``
            )

        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        if (!users.length)
            return void M.reply(
                `❌ Kisi ko tag ya quote karo!\n\n` +
                `📢 *How to use:* \`${prefix}promote @user\``
            )

        const mentioned = users
        let text = `📈 *PROMOTE RESULTS* 📈\n${'─'.repeat(20)}\n`

        let anyChanged = false
        for (const user of users) {
            if (M.groupMetadata.admins?.includes(user)) {
                text += `\n⚠️ Skipped @${user.split('@')[0]} — pehle se admin hai`
                continue
            }
            try {
                await this.client.groupParticipantsUpdate(M.from, [user], 'promote')
                text += `\n✅ Promoted @${user.split('@')[0]} to admin`
                anyChanged = true
            } catch {
                text += `\n❌ @${user.split('@')[0]} promote nahi hua`
            }
        }
        // Clear cached admin list so the newly promoted user is recognised immediately
        if (anyChanged) MessageClass.clearGroupMetaCache(M.from)

        text += `\n\n📢 *How to use:* \`${prefix}promote @user\``
        return void M.reply(text, 'text', undefined, undefined, undefined, mentioned)
    }
}
