import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('badwords', {
    description: 'Toggle bad words filter on/off 🚫',
    aliases: ['bwfilter', 'wordfilter'],
    usage: 'badwords <on|off>',
    cooldown: 5,
    exp: 5,
    category: 'moderation',
    dm: false
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const arg = context.trim().toLowerCase()

        const groupData = await this.client.DB.getGroup(M.from)
        const current = (groupData as any).badWords as boolean
        const list: string[] = (groupData as any).badWordsList || []

        if (!arg)
            return void M.reply(
                `🚫 *BAD WORDS FILTER*\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n` +
                `📌 *Status:* ${current ? '🟢 ON' : '🔴 OFF'}\n` +
                `📋 *Words in list:* ${list.length}\n\n` +
                `📖 *Commands:*\n` +
                `\`${prefix}badwords on\` — Enable filter\n` +
                `\`${prefix}badwords off\` — Disable filter\n` +
                `\`${prefix}addbadword <word>\` — Add a word\n` +
                `\`${prefix}rmbadword <word>\` — Remove a word\n\n` +
                (list.length > 0 ? `🔒 *Filtered words:* ${list.map(w => `||\`${w}\`||`).join(' · ')}` : `_No words added yet_`)
            )

        if (!['on', 'off'].includes(arg))
            return void M.reply(`❌ Use *on* or *off*\n_Example: ${prefix}badwords on_`)

        const newState = arg === 'on'
        if (newState === current)
            return void M.reply(`⚠️ Bad words filter is already *${current ? 'ON' : 'OFF'}*!`)

        await this.client.DB.group.updateOne({ jid: M.from }, { $set: { badWords: newState } })
        this.client.DB.cacheInvalidate(`group:${M.from}`)

        return void M.reply(
            `🚫 *BAD WORDS FILTER ${newState ? 'ENABLED' : 'DISABLED'}*\n\n` +
            `📌 Status: ${newState ? '🟢 ON' : '🔴 OFF'}\n` +
            `${newState ? `⚠️ Messages containing filtered words will be *auto-deleted*.\n_Admins are exempt from the filter._` : `_Messages are no longer being filtered._`}`
        )
    }
}
