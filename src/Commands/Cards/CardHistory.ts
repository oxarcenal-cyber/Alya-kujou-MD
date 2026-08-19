import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { normalize, getStats, modeLabel, BattleMode } from '../../lib/CardBattleState'

function timeAgo(ts: number): string {
    const s = Math.floor((Date.now() - ts) / 1000)
    if (s < 60) return `${s}s ago`
    if (s < 3600) return `${Math.floor(s/60)}m ago`
    if (s < 86400) return `${Math.floor(s/3600)}h ago`
    return `${Math.floor(s/86400)}d ago`
}

@Command('cardhistory', {
    description: 'View your recent card battle history',
    usage: 'cardhistory',
    category: 'cards',
    aliases: ['cbhistory', 'battlelog'],
    cooldown: 5, exp: 5, dm: false
})
export default class CardHistoryCommand extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const user = await this.client.DB.getUser(normalize(M.sender.jid))
        const history = getStats(user).history

        if (!history.length) {
            return void await this.client.sendMessage(M.from, {
                text: `📜 No battles yet!\n_Start one: \`${prefix}cardbattle @user\`_`,
                footer: 'Challenge someone to get started.',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '⚔️ Battle Help', id: `${prefix}cardbattle help` }
                ]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const lines = history.slice(0, 8).map((x, i) => {
            const icon = x.result === 'win' ? '✅' : '❌'
            const reward = x.reward ? `  · 🎁 ${x.reward.split('-')[0]}` : ''
            return `${i+1}. ${icon} vs *${x.opponent}* · ${modeLabel(x.mode as BattleMode)} · ${timeAgo(x.date)}${reward}`
        })

        return void await this.client.sendMessage(M.from, {
            text: `📜 *BATTLE HISTORY*\n\n${lines.join('\n')}`,
            footer: 'Tap Open Menu for more options.',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Quick Links',
                    rows: [
                        { title: '📊 Full Stats', description: 'Wins, rating & streak', id: `${prefix}cardstats` },
                        { title: '🏆 Leaderboard', description: 'Top players', id: `${prefix}cardlb` },
                        { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
