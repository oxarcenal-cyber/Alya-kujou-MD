import { Sticker } from 'wa-sticker-formatter'
import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('gamble', {
    description: 'Gamble your gold — pick left or right',
    usage: 'gamble <left|right> <amount>',
    category: 'economy',
    cooldown: 30,
    exp: 20,
    casino: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { args }: IArgs): Promise<void> => {
        const directions = ['left', 'right'] as TGamblingDirections[]
        if (M.numbers.length < 1 || args.length < 1)
            return void M.reply(`❌ Invalid usage!\nExample: *${this.client.config.prefix}gamble right 500*`)
        const amount = M.numbers[0]
        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        if ((wallet - amount) < 300) return void M.reply(`❌ You need at least 300 gold in your wallet!\n💎 *Wallet:* ${wallet}`)
        if (amount > 10000) return void M.reply(`🟥 You can't gamble more than *10,000 gold* at once.`)
        const direction = args[1] as TGamblingDirections
        if (!directions.includes(direction)) return void M.reply(`❌ Choose *left* or *right*!\nExample: *${this.client.config.prefix}gamble right 500*`)
        const result = directions[Math.floor(Math.random() * directions.length)]
        const won = result === direction
        await this.client.DB.setCrystal(M.sender.jid, won ? amount : -amount)
        const stickerAsset = this.client.assets.get(result)
        if (stickerAsset) {
            const sticker = await new Sticker(stickerAsset, {
                pack: 'CELSTIC',
                author: `𝔻𝕜`,
                quality: 90,
                type: 'full'
            }).build()
            await M.reply(sticker, 'sticker')
        }
        const text = won
            ? `🎉 *You Won!* The ball went *${result}*!\n💎 *+${amount} Gold* added to your wallet`
            : `😂 *You Lost!* The ball went *${result}*!\n💎 *-${amount} Gold* deducted from your wallet`
        return void (await this.client.sendMessage(M.from, { text }, {
            quoted: M.message as import('@adiwajshing/baileys').WAMessage
        }))
    }
}

type TGamblingDirections = 'left' | 'right'
