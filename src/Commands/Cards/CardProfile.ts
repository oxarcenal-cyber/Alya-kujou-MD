import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { normalize, getStats } from '../../lib/CardBattleState'

function rankTier(rating: number): string {
    const t = [
        { l: '🥉 Bronze', m: 0 }, { l: '🥈 Silver', m: 1100 }, { l: '🥇 Gold', m: 1300 },
        { l: '💎 Platinum', m: 1500 }, { l: '💠 Diamond', m: 1700 }, { l: '👑 Champion', m: 2000 }
    ]
    let out = t[0].l
    for (const x of t) { if (rating >= x.m) out = x.l }
    return out
}

@Command('cardprofile', {
    description: 'View your full card battle profile',
    usage: 'cardprofile [@user]',
    category: 'cards',
    aliases: ['cbprofile', 'mycard'],
    cooldown: 5, exp: 5, dm: false
})
export default class CardProfileCommand extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const targetJid = M.mentioned.length > 0 ? normalize(M.mentioned[0]) : normalize(M.sender.jid)
        const user = await this.client.DB.getUser(targetJid)
        const stats = getStats(user)
        const name = this.client.contact.getContact(targetJid).username || user.username?.name || targetJid.split('@')[0]
        const winRate = stats.wins + stats.losses > 0 ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100) : 0

        return void await this.client.sendMessage(M.from, {
            text:
                `🃏 *CARD PROFILE* — ${name}\n\n` +
                `🏅 Rank: ${rankTier(stats.rating)}\n` +
                `⭐ Rating: *${stats.rating}* · 🔥 Streak: ${stats.streak}\n\n` +
                `✅ Wins: *${stats.wins}*  ❌ Losses: *${stats.losses}*  📊 Win Rate: ${winRate}%\n\n` +
                `🃏 Cards Won: ${stats.cardsWon}  💀 Cards Lost: ${stats.cardsLost}\n` +
                `🛡️ Protected: ${stats.protectedCards.length}/3\n\n` +
                `📦 Deck: ${(user.deck??[]).length} cards  🗃️ Collection: ${(user.cardCollection??[]).length} cards`,
            footer: 'Tap Open Menu for more options.',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Quick Actions',
                    rows: [
                        { title: '📦 My Deck', description: 'View active deck cards', id: `${prefix}deck` },
                        { title: '🗃️ Collection', description: 'Browse collection', id: `${prefix}coll` },
                        { title: '📊 Battle Stats', description: 'Detailed stats', id: `${prefix}cardstats` },
                        { title: '📜 Battle History', description: 'Recent battles', id: `${prefix}cardhistory` },
                        { title: '🏆 Leaderboard', description: 'Top players', id: `${prefix}cardlb` }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
