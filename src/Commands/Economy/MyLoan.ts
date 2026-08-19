import { BaseCommand, Command, Message } from '../../Structures'

@Command('myloan', {
    category: 'economy',
    description: 'Check your active loan status and EMI schedule',
    usage: 'myloan',
    aliases: ['loanstatus', 'loaninfo'],
    exp: 5
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const user = await this.client.DB.getUser(M.sender.jid)
        const loan = user.loan

        if (!loan?.active) {
            return void M.reply(
                `📭 *No Active Loan*\n\n` +
                `You currently have no outstanding loan.\n\n` +
                `💡 Take a loan with \`${prefix}loan <amount>\`\n` +
                `📊 Range: 1,000 – 50,000 💰`
            )
        }

        const pad = (s: number): string => (s < 10 ? '0' : '') + s
        const formatCountdown = (ms: number): string => {
            if (ms <= 0) return '*DUE NOW ⚠️*'
            const totalSecs = Math.floor(ms / 1000)
            const h = Math.floor(totalSecs / 3600)
            const m = Math.floor((totalSecs % 3600) / 60)
            const s = totalSecs % 60
            return `*${pad(h)}h ${pad(m)}m ${pad(s)}s*`
        }

        const now = Date.now()
        const timeLeft = loan.nextEmiAt - now
        const nextEmiStr = timeLeft <= 0
            ? '⚠️ *OVERDUE — will deduct on next cron cycle*'
            : `in ${formatCountdown(timeLeft)}`

        const emisDone = loan.emisPaid
        const emisLeft = loan.totalEmis - emisDone
        const progressBar = '█'.repeat(emisDone) + '░'.repeat(emisLeft)
        const takenDate = new Date(loan.takenAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

        return void M.reply(
            `🏦 *YOUR LOAN STATUS*\n` +
            `${'═'.repeat(30)}\n\n` +
            `💸 *Original Loan:*  ${loan.principal.toLocaleString()} 💰\n` +
            `💰 *Total Repay:*   ${loan.totalRepay.toLocaleString()} 💰\n` +
            `🔴 *Remaining:*     ${loan.remaining.toLocaleString()} 💰\n` +
            `💎 *Per EMI:*       ${loan.emiAmount.toLocaleString()} 💰\n\n` +
            `${'─'.repeat(30)}\n` +
            `📊 *Progress:* [${progressBar}] ${emisDone}/${loan.totalEmis}\n\n` +
            `⏰ *Next EMI:* ${nextEmiStr}\n` +
            (loan.penaltyCount > 0
                ? `⚠️ *Penalties hit:* ${loan.penaltyCount}x (20% each time)\n`
                : '') +
            `\n📅 *Loan taken:* ${takenDate} IST\n\n` +
            `${'═'.repeat(30)}\n` +
            `💡 Use \`${prefix}loanpay <amount>\` to pay early & save on penalties`
        )
    }
}
