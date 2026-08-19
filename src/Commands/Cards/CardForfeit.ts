import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'
import { pending, sessions, activeUsers, normalize } from '../../lib/CardBattleState'

@Command('cardforfeit', {
    description: 'Forfeit or cancel the current card battle',
    usage: 'cardforfeit',
    category: 'cards',
    aliases: ['cforfeit', 'cardcancel'],
    cooldown: 0, exp: 0, dm: false
})
export default class CardForfeitCommand extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        if (M.chat !== 'group') return void M.reply(`❌ Card battles are only in groups.`)

        const self = normalize(M.sender.jid)
        const group = M.from

        const session = sessions.get(group)
        if (session && [session.challengerJid, session.challengedJid].includes(self)) {
            sessions.delete(group)
            activeUsers.delete(session.challengerJid)
            activeUsers.delete(session.challengedJid)
            if (session.stakeReserved && session.mode === 'gold') {
                await this.client.DB.setCrystal(session.challengerJid, session.amount)
                await this.client.DB.setCrystal(session.challengedJid, session.amount)
            }
            return void await this.client.sendMessage(M.from, {
                text: `🏳️ *${M.sender.username || 'Player'}* forfeited the battle.\n_Stakes refunded if any._`,
                footer: 'Start a new battle anytime.',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'What next?',
                        rows: [
                            { title: '📊 My Stats', description: 'Check wins, rating & streak', id: `${prefix}cardstats` },
                            { title: '📜 Battle History', description: 'Recent battle log', id: `${prefix}cardhistory` },
                            { title: '🃏 Card Game Hub', description: 'Back to main menu', id: `${prefix}cardgame` }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        const challenge = pending.get(group)
        if (challenge && challenge.challengerJid === self) {
            pending.delete(group)
            return void await this.client.sendMessage(M.from, {
                text: `🛑 Challenge cancelled.`,
                footer: 'You can start a new challenge anytime.',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'What next?',
                        rows: [
                            { title: '⚔️ New Battle', description: 'Challenge someone', id: `${prefix}cardbattle help` },
                            { title: '📦 My Deck', description: 'Manage your deck', id: `${prefix}deck` },
                            { title: '🃏 Card Game Hub', description: 'Back to main menu', id: `${prefix}cardgame` }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message as any })
        }

        return void await this.client.sendMessage(M.from, {
            text: `❌ No active battle or challenge found for you.`,
            footer: `Use ${prefix}cardbattle @user to start one.`,
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Quick Links',
                    rows: [
                        { title: '⚔️ Battle Help', description: 'How to battle', id: `${prefix}cardbattle help` },
                        { title: '📦 My Deck', description: 'View your deck', id: `${prefix}deck` },
                        { title: '🃏 Card Game Hub', description: 'Main menu', id: `${prefix}cardgame` }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message as any })
    }
}
