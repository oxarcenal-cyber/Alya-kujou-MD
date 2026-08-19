import { BaseCommand, Command, Message } from '../../Structures'

@Command('withdraw', {
    description: 'Withdraw gold from your bank to wallet',
    usage: 'withdraw <amount>',
    cooldown: 15,
    exp: 5,
    category: 'economy'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (M.numbers.length < 1) return void M.reply('💬 Specify the amount to withdraw\nExample: *withdraw 500*')
        const { bank } = await this.client.DB.getUser(M.sender.jid)
        if ((bank - M.numbers[0]) < 0) return void M.reply(`❌ You don't have that much gold in your bank!\n💎 *Bank:* ${bank}`)
        await this.client.DB.setCrystal(M.sender.jid, -M.numbers[0], 'bank')
        await this.client.DB.setCrystal(M.sender.jid, M.numbers[0])
        const text =
            `✅ *Withdrawal Successful!* ✅\n\n` +
            `💎 *${M.numbers[0]} Gold* moved to your wallet\n\n` +
            `_Use *${this.client.config.prefix}wallet* to check your wallet balance_`
        return void (await this.client.sendMessage(M.from, { text }, {
            quoted: M.message as import('@adiwajshing/baileys').WAMessage
        }))
    }
}
