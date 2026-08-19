import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('botstats', {
    description: 'View complete bot analytics — total users, top commands, feedback stats',
    aliases: ['bstats', 'analytics'],
    cooldown: 10,
    exp: 0,
    usage: 'botstats',
    category: 'dev',
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, _args: IArgs): Promise<void> => {
        try {
            const stats = await this.client.DB.getBotStats()

            const totalUsers      = stats.totalUsers
            const maleCount       = stats.maleCount
            const femaleCount     = stats.femaleCount
            const unsetCount      = stats.unsetCount
            const totalFeedback   = stats.totalFeedback
            const pendingFeedback = stats.pendingFeedback
            const topCmds         = stats.topCommands

            const topCmdsText = topCmds.length > 0
                ? topCmds.slice(0, 10).map((x: { cmd: string; count: number }, i: number) =>
                    `  ${i + 1}. \`${this.client.config.prefix}${x.cmd}\` — *${x.count.toLocaleString()}* uses`
                  ).join('\n')
                : '  _No data yet_'

            const maleBar   = totalUsers > 0 ? Math.round((maleCount / totalUsers) * 10)   : 0
            const femaleBar = totalUsers > 0 ? Math.round((femaleCount / totalUsers) * 10) : 0

            await M.reply(
                `╔══════════════════════════════╗\n` +
                `║      📊 *BOT ANALYTICS*      ║\n` +
                `╚══════════════════════════════╝\n\n` +

                `👥 *USERS*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `📌 Total Users:     *${totalUsers.toLocaleString()}*\n` +
                `👨 Male:            *${maleCount}* ${'█'.repeat(maleBar)}${'░'.repeat(10 - maleBar)}\n` +
                `👩 Female:          *${femaleCount}* ${'█'.repeat(femaleBar)}${'░'.repeat(10 - femaleBar)}\n` +
                `❓ Gender Not Set:  *${unsetCount}*\n\n` +

                `⚡ *TOP 10 COMMANDS*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `${topCmdsText}\n\n` +

                `📝 *FEEDBACK / UPDATE LIST*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `📬 Total Submitted:  *${totalFeedback}*\n` +
                `⏳ Pending Review:   *${pendingFeedback}*\n\n` +

                `💡 _Use \`${this.client.config.prefix}updatelist\` to manage feedback_\n` +
                `🔱 _Powered by RedzeoX_`
            )
        } catch (err) {
            await M.reply(`❌ Error fetching stats: ${(err as Error).message}`)
        }
    }
}
