import { BaseCommand, Command, Message } from '../../Structures'
import { normalize } from '../../lib/CardBattleState'
import { PACK_DEFS } from './CardPackBuy'

@Command('cardshop', {
    description: 'Browse the card pack shop',
    usage: 'cardshop',
    category: 'cards',
    aliases: ['cshop', 'packshop'],
    cooldown: 5, exp: 5, dm: false
})
export default class CardShopCommand extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const user = await this.client.DB.getUser(normalize(M.sender.jid))
        const wallet: number = user.wallet ?? 0
        const pending: string[] = Array.isArray(user.cardPacks) ? user.cardPacks : []

        const rows = Object.values(PACK_DEFS).map(p => ({
            title: `${p.emoji} ${p.label} — ${p.price.toLocaleString()} gold`,
            description: p.description,
            id: `${prefix}cardpack ${p.id}`
        }))

        const lines = Object.values(PACK_DEFS).map(p =>
            `${p.emoji} *${p.label}* — ${p.price.toLocaleString()} gold\n   ${p.description}`
        )

        return void await this.client.sendMessage(M.from, {
            text:
                `🛒 *CARD PACK SHOP*\n\n` +
                lines.join('\n\n') +
                `\n\n─────────────────\n` +
                `💰 Your gold: *${wallet.toLocaleString()}*\n` +
                `📦 Unopened packs: *${pending.length}*`,
            footer: 'Tap Open Shop to choose a pack.',
            title: '🛒 Card Pack Shop',
            buttons: [{
                text: '🛒 Open Shop',
                sections: [{
                    title: 'Available Packs',
                    rows
                }]
            }]
        } as any, { quoted: M.message as any })
    }
}
