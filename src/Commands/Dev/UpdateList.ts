import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('updatelist', {
    description: 'View and manage user feedback & feature requests (mods only)',
    aliases: ['feedbacklist', 'requests', 'bugs'],
    cooldown: 5,
    exp: 0,
    usage: 'updatelist [pending|done|rejected|all] [page]  OR  updatelist resolve <id> [note]  OR  updatelist reject <id> [reason]',
    category: 'dev',
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, args: IArgs): Promise<void> => {
        const parts = args.context.trim().split(' ')
        const sub   = parts[0]?.toLowerCase() || 'pending'

        // ─── resolve / reject ────────────────────────────────────────────────
        if (sub === 'resolve' || sub === 'reject') {
            const id   = parts[1]
            const note = parts.slice(2).join(' ').trim()
            if (!id)
                return void await M.reply(
                    `❌ Please provide an ID!\n\n*Usage:*\n\`${this.client.config.prefix}updatelist resolve <id>\``
                )

            const newStatus = sub === 'resolve' ? 'done' : 'rejected'
            const updated   = await this.client.DB.updateFeedbackStatus(id, newStatus as any, note)
            if (!updated)
                return void await M.reply(`❌ ID \`${id}\` not found or already closed.`)

            const emoji = newStatus === 'done' ? '✅' : '❌'
            return void await M.reply(
                `${emoji} *Feedback ${newStatus.toUpperCase()}!*\n\n` +
                `🆔 ID: \`${id}\`\n` +
                (note ? `📝 Note: _"${note}"_\n` : '') +
                `\n_Status updated successfully!_`
            )
        }

        // ─── list view ───────────────────────────────────────────────────────
        const filterMap: Record<string, string | null> = {
            pending: 'pending', done: 'done', rejected: 'rejected', all: null
        }
        const validFilters = ['pending', 'done', 'rejected', 'all']
        const filter  = validFilters.includes(sub) ? filterMap[sub] : 'pending'
        const pageArg = parseInt(parts[validFilters.includes(sub) ? 1 : 0] || '1') || 1
        const PAGE_SIZE = 5

        const items = await this.client.DB.getFeedbackList(filter as any, pageArg, PAGE_SIZE)
        const total = await this.client.DB.getFeedbackCount(filter as any)
        const pages = Math.ceil(total / PAGE_SIZE) || 1

        if (items.length === 0) {
            return void await M.reply(
                `📭 *No ${sub === 'all' ? '' : sub + ' '}feedback found!*\n\n` +
                `_Items will appear here once users submit them._\n\n` +
                `📊 *Filters:* pending | done | rejected | all`
            )
        }

        const typeEmoji: Record<string, string> = {
            suggestion: '💡', bugreport: '🐛', request: '📬', other: '📄'
        }
        const statusEmoji: Record<string, string> = {
            pending: '⏳', reviewing: '🔍', done: '✅', rejected: '❌'
        }

        let text  = `📋 *UPDATE LIST — ${sub.toUpperCase()}* (Page ${pageArg}/${pages})\n`
        text     += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

        for (const item of items) {
            const i       = item as any
            const date    = new Date(i.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' })
            const preview = i.message.length > 60 ? i.message.slice(0, 60) + '...' : i.message
            text += `${typeEmoji[i.type] ?? '📄'} *[${i._id.toString().slice(-6).toUpperCase()}]* ${statusEmoji[i.status] ?? '⏳'}\n`
            text += `👤 ${i.senderName}  •  📅 ${date}\n`
            text += `_"${preview}"_\n`
            if (i.note) text += `📝 Note: ${i.note}\n`
            text += '\n'
        }

        text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
        text += `📊 Total: *${total}* | Page ${pageArg}/${pages}\n\n`
        text += `💡 *Commands:*\n`
        text += `  • \`${this.client.config.prefix}updatelist pending 2\` — next page\n`
        text += `  • \`${this.client.config.prefix}updatelist resolve <id> <note>\`\n`
        text += `  • \`${this.client.config.prefix}updatelist reject <id> <reason>\`\n`
        text += `  • \`${this.client.config.prefix}updatelist all\` — show everything`

        await M.reply(text)
    }
}
