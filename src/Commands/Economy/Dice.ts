import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('dice', {
    description: 'Roll a dice and bet gold — roll 4, 5 or 6 to win!',
    usage: 'dice <amount>',
    category: 'economy',
    cooldown: 15,
    exp: 10,
    casino: true
})
export default class extends BaseCommand {
    override execute = async (M: Message, { args }: IArgs): Promise<void> => {
        const amount = M.numbers[0]

        if (!amount || amount < 50)
            return void M.reply(
                `🎲 *How to play Dice*\n\n` +
                    `Roll a dice (1–6). Land on *4, 5 or 6* and you double your bet!\n\n` +
                    `*${this.client.config.prefix}dice <amount>* — min bet: 50 gold\n\n` +
                    `📊 *Payouts:*\n` +
                    `　🎲 1 – 3 → ❌ Lose your bet\n` +
                    `　🎲 4 – 5 → ✅ 2x your bet\n` +
                    `　🎲 6 → 🎉 3x your bet (jackpot!)`
            )

        if (amount > 20000) return void M.reply(`❌ Max bet is *20,000 gold* per roll.`)

        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        if (wallet < amount) return void M.reply(`❌ Not enough gold!\n💎 *Wallet:* ${wallet}`)

        const roll = Math.floor(Math.random() * 6) + 1
        const dice = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

        let gain = 0
        let resultLine = ''
        if (roll >= 6) {
            gain = amount * 2
            resultLine = `🎉 *JACKPOT! 3x!* You won *+${gain} gold*!`
        } else if (roll >= 4) {
            gain = amount
            resultLine = `✅ *You won!* 2x — *+${gain} gold*!`
        } else {
            gain = -amount
            resultLine = `❌ *You lost!* *-${amount} gold*`
        }

        await this.client.DB.setCrystal(M.sender.jid, gain)
        const newWallet = wallet + gain

        return void M.reply(
            `🎲 *DICE ROLL*\n\n` +
                `${dice[roll]} You rolled a *${roll}*!\n\n` +
                `${resultLine}\n\n` +
                `💎 Wallet: ${newWallet} gold`
        )
    }
}
