import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { parseCard, TIER_EMOJI } from '../../lib/CardData'
import { t } from '../../lib'

@Command('cards', {
    description: 'View all your cards (deck + collection)',
    usage: 'cards  /  cards --tier  /  cards --name',
    category: 'cards',
    aliases: ['mycards', 'allcards'],
    cooldown: 5,
    dm: false,
    exp: 0
})
export default class CardsCommand extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang   = await this.getLang(M)
        const user   = await this.client.DB.getUser(M.sender.jid)
        const deck: string[]           = (user as any).deck ?? []
        const cardCollection: string[] = (user as any).cardCollection ?? []
        const all = [...deck, ...cardCollection]

        if (all.length === 0) {
            return void await this.client.sendMessage(M.from, {
                text: t('card_no_cards_yet', lang, { p: prefix }),
                footer: 'Open the Card Game Hub to get started.',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Get Cards',
                        rows: [
                            { title: '🛒 Card Shop', description: 'Buy packs', id: `${prefix}cardshop` },
                            { title: '📦 Open Pack', description: 'Open your packs', id: `${prefix}cardopen` },
                            { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const flag = context.trim().toLowerCase()

        if (flag === '--tier') {
            const tiers: Record<string, string[]> = {}
            all.forEach(c => {
                const { title, tier } = parseCard(c)
                if (!tiers[tier]) tiers[tier] = []
                tiers[tier].push(title)
            })
            let tr = `*🃏 ${M.sender.username}'s Cards (Tier-wise)*\n\n`
            for (const tier of ['S', '6', '5', '4', '3', '2', '1']) {
                if (!tiers[tier]) continue
                const te = (TIER_EMOJI as any)[tier] ?? '🃏'
                tr += `*${te} Tier ${tier}:*\n`
                tiers[tier].forEach((name, i) => { tr += `  ${i + 1}. ${name}\n` })
                tr += '\n'
            }
            tr += `📦 *Deck:* ${deck.length}/12  |  🗃️ *Collection:* ${cardCollection.length}`

            return void await this.client.sendMessage(M.from, {
                text: tr,
                footer: 'Tap Open Menu for more options.',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Card Actions',
                        rows: [
                            { title: '📦 My Deck', description: 'View deck', id: `${prefix}deck` },
                            { title: '🗃️ Collection', description: 'View collection', id: `${prefix}coll` },
                            { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const list = flag === '--name' ? [...all].sort() : all

        let tr = `*🃏 ${M.sender.username}'s Cards*\n\n`
        list.forEach((c, i) => {
            const { title, tier } = parseCard(c)
            const src = deck.includes(c) ? '🗡️' : '🗃️'
            const te  = (TIER_EMOJI as any)[tier] ?? '🃏'
            tr += `*${i + 1}.* ${src} ${te} ${title} _(T${tier})_\n`
        })
        tr += `\n📦 *Deck:* ${deck.length}/12  |  🗃️ *Coll:* ${cardCollection.length}\n`
        tr += `_\`${prefix}cards --tier\`  |  \`${prefix}cards --name\`_`

        return void await this.client.sendMessage(M.from, {
            text: tr,
            footer: 'Tap Open Menu for card actions.',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Card Actions',
                    rows: [
                        { title: '📦 My Deck', description: 'View deck', id: `${prefix}deck` },
                        { title: '🗃️ Collection', description: 'View collection', id: `${prefix}coll` },
                        { title: '✨ Upgrade Card', description: 'Combine cards to upgrade', id: `${prefix}cardupgrade` },
                        { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
