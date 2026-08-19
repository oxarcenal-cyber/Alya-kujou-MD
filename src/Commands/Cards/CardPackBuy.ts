import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { normalize } from '../../lib/CardBattleState'

export interface PackDef {
    id: string; emoji: string; label: string; price: number
    cardCount: number; tiers: string[]; guaranteedMinTier: string; description: string
}

export const PACK_DEFS: Record<string, PackDef> = {
    basic:     { id: 'basic',     emoji: '📦', label: 'Basic Pack',     price: 500,   cardCount: 2, tiers: ['1','1','2','2','3'],     guaranteedMinTier: '1', description: '2 cards · Tier 1–3 · Great starter pack' },
    premium:   { id: 'premium',   emoji: '💠', label: 'Premium Pack',   price: 2000,  cardCount: 3, tiers: ['2','3','3','4','4','5'], guaranteedMinTier: '2', description: '3 cards · Tier 2–5 · Decent chance at Legendaries' },
    legendary: { id: 'legendary', emoji: '🔥', label: 'Legendary Pack', price: 8000,  cardCount: 3, tiers: ['4','5','5','6','6','S'], guaranteedMinTier: '4', description: '3 cards · Tier 4–S · High-tier guaranteed' },
    divine:    { id: 'divine',    emoji: '👑', label: 'Divine Pack',    price: 30000, cardCount: 3, tiers: ['5','6','6','S','S'],     guaranteedMinTier: '5', description: '3 cards · Tier 5–S · For serious collectors' }
}

@Command('cardpack', {
    description: 'Buy a card pack from the shop',
    usage: 'cardpack <basic|premium|legendary|divine>',
    category: 'cards',
    aliases: ['buypack', 'cpack'],
    cooldown: 5, exp: 10, dm: false
})
export default class CardPackBuyCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const packId = context.trim().toLowerCase()

        if (!packId || !(packId in PACK_DEFS)) {
            const rows = Object.values(PACK_DEFS).map(p => ({
                title: `${p.emoji} ${p.label} — ${p.price.toLocaleString()} gold`,
                description: p.description,
                id: `${prefix}cardpack ${p.id}`
            }))
            return void await this.client.sendMessage(M.from, {
                text: `📦 *CHOOSE A PACK*\n\nUse \`${prefix}cardpack <type>\` to buy.\nBrowse with prices: \`${prefix}cardshop\``,
                footer: 'Tap to select a pack.',
                title: '📦 Card Packs',
                buttons: [{ text: '📦 Pick a Pack', sections: [{ title: 'Available Packs', rows }] }]
            } as any, { quoted: M.message as any })
        }

        const def = PACK_DEFS[packId]
        const jid = normalize(M.sender.jid)
        const user = await this.client.DB.getUser(jid)
        const wallet: number = user.wallet ?? 0

        if (wallet < def.price) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `❌ *Not enough gold*\n\n` +
                    `${def.emoji} *${def.label}* costs *${def.price.toLocaleString()}* gold.\n` +
                    `Your wallet: *${wallet.toLocaleString()}* gold`,
                footer: 'Earn gold from battles, daily rewards, and missions.',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '💰 Daily Reward', id: `${prefix}daily` },
                    { text: '🎯 Missions',      id: `${prefix}cardmissions` }
                ]
            } as any, { quoted: M.message as any })
        }

        await this.client.DB.setCrystal(jid, -def.price)
        const packs: string[] = Array.isArray(user.cardPacks) ? [...user.cardPacks] : []
        packs.push(packId)
        await this.client.DB.updateUser(jid, 'cardPacks', 'set', packs as any)

        return void await this.client.sendMessage(M.from, {
            text:
                `${def.emoji} *${def.label.toUpperCase()} PURCHASED!*\n\n` +
                `Spent: *${def.price.toLocaleString()} gold*\n` +
                `Remaining gold: *${(wallet - def.price).toLocaleString()}*\n` +
                `📦 Unopened packs: *${packs.length}*`,
            footer: 'Open your pack now to get cards!',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '📦 Open Pack Now', id: `${prefix}cardopen` },
                { text: '🛒 Buy More',      id: `${prefix}cardshop` }
            ]
        } as any, { quoted: M.message as any })
    }
}
