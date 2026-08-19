import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { IArgs } from '../../Types'
import { normalize, getStats } from '../../lib/CardBattleState'

@Command('cardlb', {
    description: 'View the card battle leaderboard',
    usage: 'cardlb [--group]',
    category: 'cards',
    aliases: ['cardleaderboard', 'cblb'],
    cooldown: 10, exp: 5, dm: false
})
export default class CardLbCommand extends BaseCommand {
    public override execute = async (M: Message, { flags }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const groupOnly = flags.includes('--group') || flags.includes('group')
        let users: any[]

        if (groupOnly && M.chat === 'group') {
            const meta = await this.client.groupMetadata(M.from).catch(() => null)
            const jids = (meta?.participants ?? []).map((p: any) => normalize(p.id))
            users = jids.length ? await this.client.DB.user.find({ jid: { $in: jids } }).sort({ 'cardBattle.rating': -1 }).limit(10).lean() : []
        } else {
            users = await this.client.DB.user.find({}).sort({ 'cardBattle.rating': -1 }).limit(10).lean()
        }

        if (!users.length) {
            return void await this.client.sendMessage(M.from, {
                text: `🏆 No ranked players yet.\n_Be the first to battle!_`,
                footer: 'Challenge someone to get ranked.',
                buttonsFormat: 'buttons',
                buttons: [{ text: '⚔️ Battle Help', id: `${prefix}cardbattle help` }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const lines = users.map((u: any, i: number) => {
            const stats = getStats(u)
            const name = u.username?.name || u.jid?.split('@')[0] || '?'
            const medal = i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : `${i+1}.`
            return `${medal} *${name}* — ${stats.rating} · ${stats.wins}W ${stats.losses}L`
        })

        return void await this.client.sendMessage(M.from, {
            text:
                `🏆 *CARD LEADERBOARD*${groupOnly ? ' (Group)' : ''}\n\n` +
                lines.join('\n'),
            footer: 'Tap Open Menu for more options.',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Quick Links',
                    rows: [
                        { title: '📊 My Stats', description: 'Your wins, rating & streak', id: `${prefix}cardstats` },
                        { title: '📜 Battle History', description: 'Your recent battles', id: `${prefix}cardhistory` },
                        { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
