import { BaseCommand, Command, Message } from '../../Structures'

@Command('deposit', {
    description: 'Deposit your gold to bank',
    usage: 'deposit <amount>',
    cooldown: 15,
    exp: 5,
    category: 'economy'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (M.numbers.length < 1) return void M.reply('💬 Specify the amount of gold to deposit\nExample: *deposit 500*')
        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        if ((wallet - M.numbers[0]) < 0) return void M.reply(`❌ You don't have that much gold in your wallet!\n💎 *Wallet:* ${wallet}`)
        await this.client.DB.setCrystal(M.sender.jid, M.numbers[0], 'bank')
        await this.client.DB.setCrystal(M.sender.jid, -M.numbers[0])
        const text =
            `🏦 *Deposit Successful!* 🏦\n\n` +
            `💎 *${M.numbers[0]} Gold* transferred to your bank\n\n` +
            `_Use *${this.client.config.prefix}bank* to check your bank balance_`
        return void (await this.client.sendMessage(M.from, { text }, {
            quoted: M.message as import('@adiwajshing/baileys').WAMessage
        }))
    }
}
