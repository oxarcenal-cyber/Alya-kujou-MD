import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

/**
 * Short, menu-first entry point for the complete card system.
 * Detailed battle interactions live in CardBattle.ts.
 */
@Command('cardgame', {
    description: 'Open the card game hub',
    usage: 'cardgame',
    category: 'cards',
    aliases: ['cardhub', 'cgame'],
    cooldown: 5,
    exp: 5,
    dm: false
})
export default class CardGameCommand extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const body =
            `🃏 *CARD GAME HUB*\n\n` +
            `Manage cards, battle players, and climb the leaderboard.\n` +
            `Tap *Open Menu* to continue.`

        await this.client.sendMessage(
            M.from,
            {
                text: body,
                footer: 'Shortcuts: deck · coll · cardbattle help',
                title: '🃏 Card Game',
                buttons: [
                    {
                        text: '📋 Open Menu',
                        sections: [
                            {
                                title: 'Cards',
                                rows: [
                                    { title: '📦 My Deck', description: 'View and choose deck cards', id: `${prefix}deck` },
                                    { title: '🗃️ Collection', description: 'View collected cards', id: `${prefix}coll` },
                                    { title: '🔍 Card Info', description: 'Search a card by name', id: `${prefix}cardinfo` }
                                ]
                            },
                            {
                                title: 'Battle',
                                rows: [
                                    { title: '⚔️ Battle Help', description: 'Rules and quick usage', id: `${prefix}cardbattle help` },
                                    { title: '📊 My Stats', description: 'Wins, rating, and history', id: `${prefix}cardbattle stats` },
                                    { title: '🏆 Leaderboard', description: 'Top card battlers', id: `${prefix}cardbattle leaderboard` }
                                ]
                            },
                            {
                                title: 'Progression',
                                rows: [
                                    { title: '📊 Card Stats', description: 'Wins, rating, streak', id: `${prefix}cardstats` },
                                    { title: '📜 Battle History', description: 'Recent battle log', id: `${prefix}cardhistory` },
                                    { title: '🎯 Daily Missions', description: 'Earn gold & XP daily', id: `${prefix}cardmissions` }
                                ]
                            },
                            {
                                title: 'Shop & Upgrades',
                                rows: [
                                    { title: '🛒 Card Shop', description: 'Browse and buy packs', id: `${prefix}cardshop` },
                                    { title: '📦 Open Pack', description: 'Open your card packs', id: `${prefix}cardopen` },
                                    { title: '✨ Upgrade Card', description: 'Combine 2 cards → next tier', id: `${prefix}cardupgrade` }
                                ]
                            },
                            {
                                title: 'Management',
                                rows: [
                                    { title: '🛡️ Protected Cards', description: 'Cards safe from battle rewards', id: `${prefix}cardprotected` },
                                    { title: '🃏 Card Profile', description: 'Full card battle profile', id: `${prefix}cardprofile` }
                                ]
                            }
                        ]
                    }
                ]
            } as unknown as AnyMessageContent,
            { quoted: M.message }
        )
    }
}
