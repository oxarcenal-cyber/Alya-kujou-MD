import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('setrules', {
    description: 'Set group rules — admin only 📝',
    category: 'moderation',
    usage: 'setrules <rules text>',
    aliases: ['srules', 'addrules'],
    cooldown: 10,
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
                `❌ *Sirf admins rules set kar sakte hain!*\n\n` +
                `📢 *How to use:* \`${prefix}setrules <rules>\``
            )

        if (!context.trim())
            return void M.reply(
                `📝 *SET GROUP RULES*\n\n` +
                `Group ke rules set karo!\n\n` +
                `📢 *How to use:*\n` +
                `\`${prefix}setrules\n1. Spam mat karo\n2. Sab ka respect karo\n3. No NSFW\n4. Links allowed nahi\`\n\n` +
                `_Rules dekhne ke liye: \`${prefix}rules\`_`
            )

        await this.client.DB.group.findOneAndUpdate(
            { jid: M.from },
            { $set: { rules: context.trim() } },
            { upsert: true }
        )

        return void M.reply(
            `✅ *RULES SET!* ✅\n` +
            `${'─'.repeat(25)}\n\n` +
            `📜 *Rules:*\n${context.trim()}\n\n` +
            `${'─'.repeat(25)}\n` +
            `📢 Rules dekhne ke liye: \`${prefix}rules\``
        )
    }
}
