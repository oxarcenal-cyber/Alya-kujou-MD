import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { warningSchema } from '../../Database/Models/Warning'

const MAX_WARNS = 3

@Command('warn', {
    description: 'Warn a user in the group ⚠️ (3 warnings = auto-remove)',
    category: 'moderation',
    usage: 'warn [@user / quote user] [reason]',
    aliases: ['warning'],
    cooldown: 5,
    exp: 10,
    adminRequired: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        if (!M.groupMetadata) return void M.reply('❌ Ye command sirf groups mein use hoti hai!')

        const isAdmin = M.sender.isAdmin
        const isMod = this.client.config.mods.includes(M.sender.jid)
        if (!isAdmin && !isMod)
            return void M.reply(
                `❌ *Sirf admins use kar sakte hain!*\n\n` +
                `📢 *How to use:* \`${prefix}warn @user [reason]\``
            )

        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        if (!users.length)
            return void M.reply(
                `❌ Kisi ko tag ya quote karo!\n\n` +
                `📢 *How to use:* \`${prefix}warn @user spam kar raha tha\``
            )

        const target = users[0]
        if (target === M.sender.jid) return void M.reply('❌ Apne aap ko warn nahi kar sakte!')
        if (this.client.config.mods.includes(target)) return void M.reply('❌ Mods ko warn nahi kar sakte!')
        if (M.groupMetadata.admins?.includes(target)) return void M.reply('❌ Admins ko warn nahi kar sakte!')

        const reason = context.replace(/@\d+/g, '').trim() || 'No reason provided'

        const data = await warningSchema.findOneAndUpdate(
            { groupJid: M.from, userJid: target },
            { $inc: { count: 1 }, $push: { reasons: reason } },
            { upsert: true, new: true }
        )

        const count = data?.count || 1
        let actionText = ''

        if (count >= MAX_WARNS) {
            try {
                await this.client.groupParticipantsUpdate(M.from, [target], 'remove')
                await warningSchema.deleteOne({ groupJid: M.from, userJid: target })
                actionText = `\n\n🚫 *${MAX_WARNS} warnings pe auto-remove kar diya!*`
            } catch {
                actionText = `\n\n⚠️ ${MAX_WARNS} warnings ho gayi! Bot admin hona chahiye auto-remove ke liye.`
            }
        }

        return void M.reply(
            `⚠️ *WARNING* ⚠️\n` +
            `${'─'.repeat(25)}\n\n` +
            `👤 *User:* @${target.split('@')[0]}\n` +
            `⚠️ *Warnings:* ${count}/${MAX_WARNS}\n` +
            `📝 *Reason:* ${reason}\n` +
            `🛡️ *By:* @${M.sender.jid.split('@')[0]}` +
            actionText + `\n\n` +
            `${'─'.repeat(25)}\n` +
            `📢 *How to use:* \`${prefix}warn @user [reason]\``,
            'text', undefined, undefined, undefined, [target, M.sender.jid]
        )
    }
}
