import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { normalize, getStats } from '../../lib/CardBattleState'

function rankTier(r: number): string {
    const t = [
        { l: '🥉 Bronze', m: 0 }, { l: '🥈 Silver', m: 1100 }, { l: '🥇 Gold', m: 1300 },
        { l: '💎 Platinum', m: 1500 }, { l: '💠 Diamond', m: 1700 }, { l: '👑 Champion', m: 2000 }
    ]
    let out = t[0].l; for (const x of t) { if (r >= x.m) out = x.l }; return out
}

@Command('cardstats', {
    description: 'View your card battle stats',
    usage: 'cardstats [@user]',
    category: 'cards',
    aliases: ['cbstats'],
    cooldown: 5, exp: 5, dm: false
})
export default class CardStatsCommand extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const targetJid = M.mentioned.length > 0 ? normalize(M.mentioned[0]) : normalize(M.sender.jid)
        const user = await this.client.DB.getUser(targetJid)
        const stats = getStats(user)
        const name = this.client.contact.getContact(targetJid).username || user.username?.name || targetJid.split('@')[0]
        const wr = stats.wins + stats.losses > 0 ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100) : 0

        return void await this.client.sendMessage(M.from, {
            text:
                `📊 *CARD STATS* — ${name}\n\n` +
                `Wins: *${stats.wins}* · Losses: *${stats.losses}* · Win Rate: *${wr}%*\n` +
                `Rating: *${stats.rating}* (${rankTier(stats.rating)})\n` +
                `Streak: *${stats.streak}*\n\n` +
                `Cards Won: *${stats.cardsWon}* · Cards Lost: *${stats.cardsLost}*\n` +
                `Protected: *${stats.protectedCards.length}/3*`,
            footer: 'Tap Open Menu for more options.',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Quick Links',
                    rows: [
                        { title: '📜 Battle History', description: 'Recent battle log', id: `${prefix}cardhistory` },
                        { title: '🏆 Leaderboard', description: 'Top players', id: `${prefix}cardlb` },
                        { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
