import { Command, BaseCommand, Message } from '../../Structures'
import { warningSchema } from '../../Database/Models/Warning'

@Command('clearwarn', {
    description: 'Clear all warnings of a user ✅',
    category: 'moderation',
    usage: 'clearwarn [@user / quote user]',
    aliases: ['resetwarn', 'cwarn'],
    cooldown: 5,
    exp: 10,
    adminRequired: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        if (!M.groupMetadata) return void M.reply('❌ Ye command sirf groups mein use hoti hai!')

        const isAdmin = M.sender.isAdmin
        const isMod = this.client.config.mods.includes(M.sender.jid)
        if (!isAdmin && !isMod)
            return void M.reply(
                `❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* \`${prefix}clearwarn @user\``
            )

        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        if (!users.length)
            return void M.reply(
                `❌ Kisi ko tag ya quote karo!\n\n📢 *How to use:* \`${prefix}clearwarn @user\``
            )

        const target = users[0]
        await warningSchema.deleteOne({ groupJid: M.from, userJid: target })

        return void M.reply(
            `✅ *WARNINGS CLEARED* ✅\n` +
            `${'─'.repeat(25)}\n\n` +
            `👤 *User:* @${target.split('@')[0]}\n` +
            `🧹 *Saari warnings hata di gayi!*\n\n` +
            `${'─'.repeat(25)}\n` +
            `📢 *How to use:* \`${prefix}clearwarn @user\``,
            'text', undefined, undefined, undefined, [target]
        )
    }
}
