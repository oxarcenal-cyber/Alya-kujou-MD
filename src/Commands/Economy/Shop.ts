import { BaseCommand, Command, Message } from '../../Structures'
import { SHOP_ITEMS } from '../../lib/ShopItems'

@Command('shop', {
    description: 'Browse the item shop 🛒',
    aliases: ['store', 'market'],
    usage: 'shop',
    cooldown: 5,
    exp: 3,
    category: 'economy'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const userData = await this.client.DB.getUser(M.sender.jid)

        let text = `🛒 *ITEM SHOP*\n`
        text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`
        text += `💰 *Your Balance:* ${userData.wallet.toLocaleString()} Gold\n\n`

        for (let i = 0; i < SHOP_ITEMS.length; i++) {
            const item = SHOP_ITEMS[i]
            const owned = ((userData as any).inventory || []).filter((k: string) => k === item.key).length
            text += `${item.emoji} *${item.name}*\n`
            text += `   📄 ${item.desc}\n`
            text += `   💲 *Price:* ${item.price.toLocaleString()} Gold\n`
            text += `   🔑 Key: \`${item.key}\``
            if (owned > 0) text += `  ✅ _(owned: ${owned})_`
            text += `\n\n`
        }

        text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`
        text += `📖 *How to buy:*\n`
        text += `\`${prefix}buy <item_key>\`\n\n`
        text += `📦 *View your items:*\n`
        text += `\`${prefix}inventory\``

        return void M.reply(text)
    }
}
