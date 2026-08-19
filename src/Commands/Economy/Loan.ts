import { BaseCommand, Command, Message } from '../../Structures'

const MIN_LOAN = 1000
const MAX_LOAN = 50000
const INTEREST_RATE = 0.1   // 10%
const TOTAL_EMIS = 5
const EMI_HOURS = 5

@Command('loan', {
    category: 'economy',
    description: 'Take a loan from the bot and repay in 5 EMIs every 5 hours',
    usage: 'loan <amount>',
    aliases: ['borrow'],
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix

        // --- Show loan info if no amount given ---
        if (M.numbers.length < 1) {
            return void M.reply(
                `🏦 *LOAN SYSTEM*\n` +
                `${'─'.repeat(30)}\n\n` +
                `💡 *How it works:*\n` +
                `• Take a loan and gold land in your wallet instantly\n` +
                `• *10% interest* added on top\n` +
                `• Repaid in *5 EMIs*, auto-deducted every *${EMI_HOURS} hours*\n` +
                `• Bank is drained first, then wallet\n` +
                `• Miss an EMI? *20% penalty* added on remaining amount\n\n` +
                `💰 *Loan Limits:*\n` +
                `• Minimum: *${MIN_LOAN.toLocaleString()} 💰*\n` +
                `• Maximum: *${MAX_LOAN.toLocaleString()} 💰*\n\n` +
                `📋 *Commands:*\n` +
                `• \`${prefix}loan <amount>\` — take a loan\n` +
                `• \`${prefix}myloan\` — check your loan status\n` +
                `• \`${prefix}loanpay <amount>\` — pay early\n\n` +
                `${'─'.repeat(30)}\n` +
                `📢 *Usage:* \`${prefix}loan 5000\``
            )
        }

        const amount = Math.floor(M.numbers[0])

        if (amount < MIN_LOAN)
            return void M.reply(
                `❌ *Minimum loan amount is ${MIN_LOAN.toLocaleString()} 💰*\n\n` +
                `📢 *Usage:* \`${prefix}loan <amount>\``
            )

        if (amount > MAX_LOAN)
            return void M.reply(
                `❌ *Maximum loan amount is ${MAX_LOAN.toLocaleString()} 💰*\n\n` +
                `📢 *Usage:* \`${prefix}loan <amount>\``
            )

        const user = await this.client.DB.getUser(M.sender.jid)

        if (user.loan?.active)
            return void M.reply(
                `❌ *You already have an active loan!*\n\n` +
                `💡 Use \`${prefix}myloan\` to see details\n` +
                `💡 Use \`${prefix}loanpay <amount>\` to pay it off first`
            )

        const totalRepay = Math.ceil(amount * (1 + INTEREST_RATE))
        const emiAmount = Math.ceil(totalRepay / TOTAL_EMIS)
        const nextEmiAt = Date.now() + EMI_HOURS * 60 * 60 * 1000

        await this.client.DB.takeLoan(M.sender.jid, amount, totalRepay, emiAmount, nextEmiAt)

        const nextEmiTime = new Date(nextEmiAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

        return void M.reply(
            `✅ *LOAN APPROVED!* 🏦\n` +
            `${'═'.repeat(30)}\n\n` +
            `💸 *Loan Amount:*   ${amount.toLocaleString()} 💰\n` +
            `📈 *Interest (10%):* ${(totalRepay - amount).toLocaleString()} 💰\n` +
            `💰 *Total Repay:*   ${totalRepay.toLocaleString()} 💰\n\n` +
            `${'─'.repeat(30)}\n` +
            `📅 *EMI Plan:*\n` +
            `• *5 EMIs* of *${emiAmount.toLocaleString()} 💰* each\n` +
            `• Deducted every *${EMI_HOURS} hours* (bank first, then wallet)\n` +
            `• ⚠️ Miss an EMI → *+20% penalty* on remaining\n\n` +
            `⏰ *First EMI at:* ${nextEmiTime} IST\n\n` +
            `${'═'.repeat(30)}\n` +
            `💎 *${amount.toLocaleString()} gold added to your wallet!*\n` +
            `_Use \`${this.client.config.prefix}myloan\` to track your loan_`
        )
    }
}
