import { BaseCommand, Command, Message } from '../../Structures'

@Command('bank', {
    description: 'Check your bank balance',
    usage: 'bank',
    category: 'economy',
    exp: 10,
    cooldown: 200,
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, message }: Message): Promise<void> => {
        const { bank, tag } = await this.client.DB.getUser(sender.jid)
        const text =
            `🏦 *Celestic Bank* 🏦\n\n` +
            `🧧 *Name:* ${sender.username}\n` +
            `☘️ *ID Tag:* #${tag}\n` +
            `💎 *Gold:* ${bank}\n\n` +
            `_Use *${this.client.config.prefix}wallet* to check your wallet_\n` +
            `_Use *${this.client.config.prefix}daily* to claim your daily reward_`
        return void (await this.client.sendMessage(from, { text }, {
            quoted: message as import('@adiwajshing/baileys').WAMessage
        }))
    }
}
