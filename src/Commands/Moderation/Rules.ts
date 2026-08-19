import { Command, BaseCommand, Message } from '../../Structures'

@Command('rules', {
    description: 'Show the group rules 📜',
    category: 'moderation',
    usage: 'rules',
    aliases: ['rule', 'grouprules'],
    cooldown: 10,
    exp: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        if (!M.groupMetadata) return void M.reply('❌ Ye command sirf groups mein use hoti hai!')

        const data = await this.client.DB.getGroup(M.from)
        const rules = (data as any).rules as string | undefined

        if (!rules || !rules.trim())
            return void M.reply(
                `📜 *GROUP RULES*\n` +
                `${'─'.repeat(25)}\n\n` +
                `⚠️ Abhi tak koi rules set nahi hain!\n\n` +
                `${'─'.repeat(25)}\n` +
                `📢 Rules set karne ke liye (admin only):\n` +
                `  \`${prefix}setrules <rules likho>\``
            )

        return void M.reply(
            `📜 *GROUP RULES* 📜\n` +
            `${'─'.repeat(25)}\n\n` +
            `${rules}\n\n` +
            `${'─'.repeat(25)}\n` +
            `📢 *How to use:* \`${prefix}rules\`\n` +
            `_Rules update karne ke liye (admin): \`${prefix}setrules <text>\`_`
        )
    }
}
