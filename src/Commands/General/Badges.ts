import { BaseCommand, Command, Message } from '../../Structures'
import { BADGE_LIST, getBadge } from '../../lib/BadgeList'

@Command('badges', {
    description: 'View your earned achievement badges 🏅',
    aliases: ['achievements', 'medal'],
    usage: 'badges',
    cooldown: 5,
    exp: 3,
    category: 'general'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix

        // Check if viewing another user
        const targetJid = M.mentioned.length ? M.mentioned[0] : M.sender.jid
        const isSelf = targetJid === M.sender.jid
        const userData = await this.client.DB.getUser(targetJid)
        const earned: string[] = userData.badges || []

        const displayName = isSelf
            ? M.sender.username
            : `@${targetJid.split('@')[0]}`

        let text = `🏅 *${isSelf ? 'YOUR' : displayName.toUpperCase() + "'S"} BADGES*\n`
        text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n`

        if (earned.length === 0) {
            text += `😔 *No badges earned yet!*\n\n`
            text += `_Start completing milestones to earn badges:_\n\n`
        } else {
            text += `✨ *Earned ${earned.length}/${BADGE_LIST.length} badges:*\n\n`
            for (const key of earned) {
                const badge = getBadge(key)
                if (badge) text += `${badge.emoji} *${badge.name}* — ${badge.desc}\n`
            }
            text += `\n`
        }

        text += `📋 *ALL AVAILABLE BADGES:*\n`
        text += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`
        for (const badge of BADGE_LIST) {
            const isEarned = earned.includes(badge.key)
            text += `${isEarned ? badge.emoji : '🔒'} ${isEarned ? `*${badge.name}*` : badge.name} — _${badge.desc}_\n`
        }

        text += `\n📖 *How to earn:*\n`
        text += `_Complete milestones like daily claims, leveling up,\ngetting married, adopting pets, shopping, and more!_`

        return void M.reply(text)
    }
}
