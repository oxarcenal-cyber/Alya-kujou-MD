import { Command, BaseCommand, Message } from '../../Structures'
import { warningSchema } from '../../Database/Models/Warning'

@Command('warnings', {
    description: 'Check warnings of a user in the group 📋',
    category: 'moderation',
    usage: 'warnings [@user / quote user]',
    aliases: ['warnlist', 'checkwarn'],
    cooldown: 5,
    exp: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        if (!M.groupMetadata) return void M.reply('❌ Ye command sirf groups mein use hoti hai!')

        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        const target = users.length ? users[0] : M.sender.jid

        const data = await warningSchema.findOne({ groupJid: M.from, userJid: target })
        if (!data || data.count === 0)
            return void M.reply(
                `✅ @${target.split('@')[0]} ke koi warnings nahi hain is group mein!\n\n` +
                `📢 *How to use:* \`${prefix}warnings @user\``,
                'text', undefined, undefined, undefined, [target]
            )

        const reasonsList = data.reasons.map((r, i) => `  ${i + 1}. ${r}`).join('\n')

        return void M.reply(
            `📋 *WARNINGS* 📋\n` +
            `${'─'.repeat(25)}\n\n` +
            `👤 *User:* @${target.split('@')[0]}\n` +
            `⚠️ *Total:* ${data.count}/3\n\n` +
            `📝 *Reasons:*\n${reasonsList}\n\n` +
            `${'─'.repeat(25)}\n` +
            `📢 *How to use:* \`${prefix}warnings @user\``,
            'text', undefined, undefined, undefined, [target]
        )
    }
}
