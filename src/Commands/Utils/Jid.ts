import { BaseCommand, Command, Message } from '../../Structures'

@Command('jid', {
    description: 'Shows the JID (ID) of the current group and your own JID',
    usage: 'jid',
    category: 'utils',
    cooldown: 5,
    exp: 0,
    aliases: ['getjid', 'id']
})
export default class extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const lines: string[] = []

        if (M.chat === 'group') {
            const meta = M.groupMetadata
            lines.push(`🏠 *Group:* ${meta?.subject ?? 'Unknown'}`)
            lines.push(`📋 *Group JID:*\n\`${M.from}\``)
            lines.push(``)
        }

        lines.push(`👤 *Your JID:*\n\`${M.sender.jid}\``)
        lines.push(``)
        lines.push(`💡 Use group JID with:\n*${this.client.config.prefix}groups wild off <jid>*\n*${this.client.config.prefix}groups chara off <jid>*`)

        return void M.reply(lines.join('\n'))
    }
}
