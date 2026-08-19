import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

// ─── State ────────────────────────────────────────────────────────────────────

interface Reminder {
    jid: string
    name: string
    text: string
    group: string
    setAt: number
    fireAt: number
}

const reminders: Reminder[] = []
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

function parseTime(str: string): number | null {
    const match = str.match(/^(\d+)(s|m|h|d)$/)
    if (!match) return null
    const val  = parseInt(match[1])
    const unit = match[2]
    if (unit === 's') return val * 1000
    if (unit === 'm') return val * 60 * 1000
    if (unit === 'h') return val * 3600 * 1000
    if (unit === 'd') return val * 86400 * 1000
    return null
}

function formatMs(ms: number): string {
    const s = Math.floor(ms / 1000)
    if (s < 60)   return `${s} second${s !== 1 ? 's' : ''}`
    if (s < 3600) {
        const m = Math.floor(s / 60)
        const r = s % 60
        return r > 0 ? `${m}m ${r}s` : `${m} minute${m !== 1 ? 's' : ''}`
    }
    const h = Math.floor(s / 3600)
    const rm = Math.floor((s % 3600) / 60)
    return rm > 0 ? `${h}h ${rm}m` : `${h} hour${h !== 1 ? 's' : ''}`
}

// ─── Command ─────────────────────────────────────────────────────────────────

@Command('remind', {
    description: 'Apne liye reminder set karo ⏰',
    category: 'general',
    usage: 'remind <time> <message> | remind list | remind clear',
    aliases: ['reminder', 'remindme'],
    cooldown: 5,
    exp: 5,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix  = this.client.config.prefix
        const input   = context.trim()
        const fromJid = this.client.correctJid(M.sender.jid)
        const lang    = await this.getLang(M)

        // ── Help ──────────────────────────────────────────────────────────
        if (!input)
            return void M.reply(t('remind_help', lang, { prefix }))

        // ── List ──────────────────────────────────────────────────────────
        if (input.toLowerCase() === 'list') {
            const mine = reminders.filter(r => r.jid === fromJid)
            if (mine.length === 0)
                return void M.reply(t('remind_none', lang, { prefix }))

            const now = Date.now()
            const header = t('remind_list_header', lang, { count: String(mine.length) })
            const items = mine.map((r, i) => {
                const left = Math.max(0, r.fireAt - now)
                return t('remind_list_item', lang, { idx: String(i + 1), text: r.text, time: formatMs(left) })
            }).join('\n\n')
            return void M.reply(`${header}\n\n${items}`)
        }

        // ── Clear ─────────────────────────────────────────────────────────
        if (input.toLowerCase() === 'clear') {
            const before = reminders.length
            const toRemove = reminders.filter(r => r.jid === fromJid)
            for (const r of toRemove) {
                const idx = reminders.indexOf(r)
                if (idx > -1) reminders.splice(idx, 1)
            }
            const removed = before - reminders.length
            return void M.reply(
                removed > 0
                    ? t('remind_cleared', lang, { count: String(removed), s: removed !== 1 ? 's' : '' })
                    : t('remind_none_clear', lang)
            )
        }

        // ── Set new reminder ──────────────────────────────────────────────
        const parts   = input.split(/\s+/)
        const timeStr = parts[0].toLowerCase()
        const message = parts.slice(1).join(' ')

        const timeMs = parseTime(timeStr)
        if (!timeMs)
            return void M.reply(t('remind_bad_time', lang, { prefix }))
        if (!message)
            return void M.reply(t('remind_no_msg', lang, { prefix }))
        if (timeMs < 5_000)
            return void M.reply(t('remind_min_time', lang))
        if (timeMs > 7 * 24 * 3600 * 1000)
            return void M.reply(t('remind_max_time', lang))

        const myReminders = reminders.filter(r => r.jid === fromJid)
        if (myReminders.length >= 5)
            return void M.reply(t('remind_limit', lang, { prefix }))

        const reminder: Reminder = {
            jid: fromJid,
            name: M.sender.username || 'User',
            text: message,
            group: M.from,
            setAt: Date.now(),
            fireAt: Date.now() + timeMs
        }
        reminders.push(reminder)

        await M.reply(t('remind_set', lang, { message, time: formatMs(timeMs) }))

        // Fire reminder
        await sleep(timeMs)

        const idx = reminders.indexOf(reminder)
        if (idx > -1) reminders.splice(idx, 1)

        await this.client.sendMessage(reminder.group, {
            text: t('remind_fire', lang, {
                user: fromJid.split('@')[0],
                message,
                time: formatMs(timeMs)
            }),
            mentions: [fromJid]
        })
    }
}
