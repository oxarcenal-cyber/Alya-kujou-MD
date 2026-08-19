import { BaseCommand, Command, Message } from '../../Structures'

@Command('groupstats', {
    description: 'View group message analytics 📊',
    aliases: ['gstats', 'groupanalytics', 'topmembers'],
    usage: 'groupstats',
    cooldown: 10,
    exp: 5,
    category: 'general',
    dm: false
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        if (M.chat !== 'group')
            return void M.reply(`📊 This command only works in groups!`)

        const groupData = await this.client.DB.getGroup(M.from)
        const meta = M.groupMetadata

        const totalMsgs = (groupData as any).totalMessages || 0
        const memberStats: { jid: string; count: number }[] = (groupData as any).memberMsgCount || []

        const sorted = [...memberStats].sort((a, b) => b.count - a.count).slice(0, 10)

        const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

        let text = `📊 *GROUP ANALYTICS*\n`
        text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`
        text += `👥 *Group:* ${meta?.subject || 'Unknown'}\n`
        text += `👤 *Members:* ${meta?.participants.length || 0}\n`
        text += `💬 *Total Messages:* ${totalMsgs.toLocaleString()}\n\n`

        if (sorted.length === 0) {
            text += `😔 _No message data collected yet._\n`
            text += `_Stats start recording from now!_\n`
        } else {
            text += `🏆 *TOP MEMBERS*\n`
            text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`
            const mentions: string[] = []
            for (let i = 0; i < sorted.length; i++) {
                const { jid, count } = sorted[i]
                const percent = totalMsgs > 0 ? ((count / totalMsgs) * 100).toFixed(1) : '0.0'
                text += `${MEDALS[i]} @${jid.split('@')[0]} — *${count.toLocaleString()}* msgs (${percent}%)\n`
                mentions.push(jid)
            }
            text += `\n`
            return void M.reply(text, 'text', undefined, undefined, undefined, mentions)
        }

        return void M.reply(text)
    }
}
