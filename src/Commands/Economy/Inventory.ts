import { BaseCommand, Command, Message } from '../../Structures'
import { getShopItem, SHOP_ITEMS } from '../../lib/ShopItems'

@Command('inventory', {
    description: 'View your owned items 📦',
    aliases: ['inv', 'items', 'bag'],
    usage: 'inventory',
    cooldown: 5,
    exp: 3,
    category: 'economy'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const userData = await this.client.DB.getUser(M.sender.jid)
        const inv: string[] = (userData as any).inventory || []

        if (inv.length === 0)
            return void M.reply(
                `📦 *YOUR INVENTORY*\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `😔 *Your inventory is empty!*\n\n` +
                `🛒 Visit the shop to buy items:\n` +
                `\`${prefix}shop\``
            )

        // Count each item
        const counts = new Map<string, number>()
        for (const key of inv) counts.set(key, (counts.get(key) || 0) + 1)

        let text = `📦 *YOUR INVENTORY*\n`
        text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`
        text += `💰 *Balance:* ${userData.wallet.toLocaleString()} Gold\n`
        text += `📦 *Items:* ${inv.length} total\n\n`

        for (const [key, count] of counts) {
            const item = getShopItem(key)
            if (!item) continue
            text += `${item.emoji} *${item.name}* ×${count}\n`
            text += `   _${item.desc}_\n`
            if (item.usable) text += `   🔧 Use: \`${prefix}use ${key}\`\n`
            text += `\n`
        }

        text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`
        text += `🛒 Buy more: \`${prefix}shop\``

        return void M.reply(text)
    }
}
