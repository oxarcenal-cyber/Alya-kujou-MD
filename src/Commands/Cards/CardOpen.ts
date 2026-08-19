import { BaseCommand, Command, Message } from '../../Structures'
import { normalize } from '../../lib/CardBattleState'
import { parseCard, TIER_EMOJI, TIER_NAME, ALL_CARDS, formatCard } from '../../lib/CardData'
import { PACK_DEFS } from './CardPackBuy'

const TIER_ORDER = ['1','2','3','4','5','6','S']

function pickCardForTier(tier: string): string {
    const pool = ALL_CARDS.filter(c => c.tier === tier)
    const src = pool.length > 0 ? pool : ALL_CARDS
    const card = src[Math.floor(Math.random() * src.length)]
    return formatCard(card.title, card.tier)
}

function openPack(def: { tiers: string[]; cardCount: number; guaranteedMinTier: string }): string[] {
    const cards = Array.from({ length: def.cardCount }, () =>
        pickCardForTier(def.tiers[Math.floor(Math.random() * def.tiers.length)])
    )
    const minIdx = TIER_ORDER.indexOf(def.guaranteedMinTier)
    if (!cards.some(c => TIER_ORDER.indexOf(parseCard(c).tier) >= minIdx))
        cards[0] = pickCardForTier(def.guaranteedMinTier)
    return cards
}

@Command('cardopen', {
    description: 'Open your next card pack and receive the cards',
    usage: 'cardopen',
    category: 'cards',
    aliases: ['openpack', 'copen'],
    cooldown: 3, exp: 15, dm: false
})
export default class CardOpenCommand extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const jid = normalize(M.sender.jid)
        const user = await this.client.DB.getUser(jid)
        const packs: string[] = Array.isArray(user.cardPacks) ? [...user.cardPacks] : []

        if (!packs.length) {
            return void await this.client.sendMessage(M.from, {
                text: `📦 *No Unopened Packs*\n\nYou don't have any packs to open.\nBuy one from the shop!`,
                footer: 'Packs contain 2–3 cards each.',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🛒 Browse Shop',    id: `${prefix}cardshop` },
                    { text: '💰 Check Wallet',   id: `${prefix}wallet` }
                ]
            } as any, { quoted: M.message as any })
        }

        const packId = packs.shift()!
        const def = PACK_DEFS[packId] ?? PACK_DEFS.basic
        const newCards = openPack(def)

        await this.client.DB.updateUser(jid, 'cardPacks', 'set', packs as any)

        const deck: string[] = Array.isArray(user.deck) ? [...user.deck] : []
        const coll: string[] = Array.isArray(user.cardCollection) ? [...user.cardCollection] : []
        let deckAdded = 0, collAdded = 0
        for (const card of newCards) {
            if (deck.length < 12) { deck.push(card); deckAdded++ }
            else                   { coll.push(card); collAdded++ }
        }
        await this.client.DB.updateUser(jid, 'deck', 'set', deck as any)
        await this.client.DB.updateUser(jid, 'cardCollection', 'set', coll as any)

        const lines = newCards.map(c => {
            const { title, tier } = parseCard(c)
            return `${(TIER_EMOJI as any)[tier] ?? '🃏'} *${title}* — ${(TIER_NAME as any)[tier] ?? tier} (T${tier})`
        })

        const destNote = deckAdded > 0
            ? `📦 ${deckAdded} card(s) → deck${collAdded > 0 ? ` · ${collAdded} → collection` : ''}`
            : `🗃️ ${collAdded} card(s) → collection`

        const moreNote = packs.length > 0
            ? `📦 ${packs.length} pack(s) still unopened.`
            : `📦 No more packs. Buy more from the shop.`

        return void await this.client.sendMessage(M.from, {
            text:
                `${def.emoji} *${def.label.toUpperCase()} OPENED!*\n\n` +
                `You received:\n${lines.join('\n')}\n\n` +
                `${destNote}\n${moreNote}`,
            footer: 'View your cards below.',
            buttonsFormat: 'buttons',
            buttons: packs.length > 0
                ? [
                    { text: '📦 Open Next Pack', id: `${prefix}cardopen` },
                    { text: '🃏 View Deck',       id: `${prefix}deck` }
                  ]
                : [
                    { text: '🃏 View Deck',    id: `${prefix}deck` },
                    { text: '🛒 Buy More',     id: `${prefix}cardshop` }
                  ]
        } as any, { quoted: M.message as any })
    }
}
