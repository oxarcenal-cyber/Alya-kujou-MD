import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('tagall', {
    description: 'Tag all members in the group 📢',
    category: 'moderation',
    usage: 'tagall [message]',
    aliases: ['everyone', 'all'],
    cooldown: 60,
    exp: 20,
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
                `📢 *How to use:* \`${prefix}tagall [message]\``
            )

        const participants = M.groupMetadata.participants || []
        const jids = participants.map(p => p.id)
        const mentions = jids.map(jid => `@${jid.split('@')[0]}`).join(' ')
        const msg = context.trim() || '📢 *Attention Everyone!*'

        return void M.reply(
            `📢 *TAG ALL*\n` +
            `${'─'.repeat(25)}\n\n` +
            `${msg}\n\n` +
            `${mentions}\n\n` +
            `${'─'.repeat(25)}\n` +
            `👥 *Members tagged:* ${jids.length}\n` +
            `📢 *How to use:* \`${prefix}tagall [message]\``,
            'text', undefined, undefined, undefined, jids
        )
    }
}
