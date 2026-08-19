import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

// ─── State ────────────────────────────────────────────────────────────────────

interface GiveawaySession {
    hostJid: string
    hostName: string
    prize: number
    participants: { jid: string; name: string }[]
    endsAt: number
    group: string
    msgKey: any
}

const activeGiveaways = new Map<string, GiveawaySession>()
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

function parseTime(str: string): number | null {
    const match = str.match(/^(\d+)(s|m|h)$/)
    if (!match) return null
    const val  = parseInt(match[1])
    const unit = match[2]
    if (unit === 's') return val * 1000
    if (unit === 'm') return val * 60 * 1000
    if (unit === 'h') return val * 3600 * 1000
    return null
}

function formatMs(ms: number): string {
    const s = Math.floor(ms / 1000)
    if (s < 60)  return `${s}s`
    if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
}

function buildGiveawayFrame(session: GiveawaySession, timeLeftMs: number): string {
    const timeStr = formatMs(Math.max(0, timeLeftMs))
    return (
        `🎟️ ═══ *GIVEAWAY!* ═══ 🎟️\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `💰 *Prize:* ${session.prize.toLocaleString()} gold\n` +
        `👑 *Host:* ${session.hostName}\n` +
        `⏰ *Time Left:* ${timeStr}\n` +
        `👥 *Entries:* ${session.participants.length}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📢 Join: \`!giveaway join\`\n` +
        `_Good luck everyone!_ 🍀`
    )
}

// ─── Command ─────────────────────────────────────────────────────────────────

@Command('giveaway', {
    description: 'Gold giveaway create karo! 🎟️',
    category: 'economy',
    usage: 'giveaway create <amount> <time> | giveaway join | giveaway end | giveaway cancel',
    aliases: ['ga', 'gw'],
    cooldown: 0,
    exp: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix  = this.client.config.prefix
        const input   = context.trim().toLowerCase()
        const group   = M.from
        const fromJid = this.client.correctJid(M.sender.jid)

        if (M.chat !== 'group')
            return void M.reply('❌ Giveaway sirf group mein hoti hai!')

        // ── Help ──────────────────────────────────────────────────────────
        if (!input)
            return void M.reply(
                `🎟️ *GIVEAWAY SYSTEM*\n\n` +
                `📢 *How to use:*\n` +
                `  \`${prefix}ga create <amount> <time>\` → Giveaway banao\n` +
                `  \`${prefix}ga join\` → Giveaway mein shamil ho\n` +
                `  \`${prefix}ga end\` → Abhi winner choose karo\n` +
                `  \`${prefix}ga cancel\` → Giveaway cancel karo\n\n` +
                `⏰ *Time formats:* \`30s\`, \`5m\`, \`1h\`\n` +
                `💰 *Min prize:* 100 gold\n\n` +
                `📢 *Example:*\n` +
                `  \`${prefix}ga create 5000 5m\` → 5000 gold, 5 minute giveaway`
            )

        // ── Join ──────────────────────────────────────────────────────────
        if (input === 'join') {
            const session = activeGiveaways.get(group)
            if (!session) return void M.reply(`❌ Koi active giveaway nahi!\n📢 Create: \`${prefix}ga create <amount> <time>\``)
            if (session.participants.find(p => p.jid === fromJid))
                return void M.reply('❌ Tum pehle se joined ho! 🍀')

            session.participants.push({ jid: fromJid, name: M.sender.username || 'User' })
            return void M.reply(
                `✅ *${M.sender.username || 'User'}* giveaway mein join hua! 🎟️\n\n` +
                `💰 Prize: *${session.prize.toLocaleString()} gold*\n` +
                `👥 Total entries: *${session.participants.length}*\n\n` +
                `_Good luck! 🍀_`
            )
        }

        // ── Cancel ────────────────────────────────────────────────────────
        if (input === 'cancel') {
            const session = activeGiveaways.get(group)
            if (!session) return void M.reply('❌ Koi active giveaway nahi!')
            if (session.hostJid !== fromJid && !M.sender.isAdmin)
                return void M.reply('❌ Sirf host ya admin cancel kar sakta hai!')
            activeGiveaways.delete(group)
            return void M.reply('🛑 Giveaway cancel!')
        }

        // ── End early ─────────────────────────────────────────────────────
        if (input === 'end') {
            const session = activeGiveaways.get(group)
            if (!session) return void M.reply('❌ Koi active giveaway nahi!')
            if (session.hostJid !== fromJid && !M.sender.isAdmin)
                return void M.reply('❌ Sirf host ya admin end kar sakta hai!')
            activeGiveaways.delete(group)
            return void this.pickWinner(M, session)
        }

        // ── Create ────────────────────────────────────────────────────────
        if (input.startsWith('create')) {
            if (activeGiveaways.has(group))
                return void M.reply(`❌ Pehle se ek giveaway active hai!\n📢 Cancel: \`${prefix}ga cancel\``)

            const parts  = context.trim().split(/\s+/)
            const amount = parseInt(parts[1])
            const timeMs = parts[2] ? parseTime(parts[2]) : null

            if (!amount || amount < 100)
                return void M.reply(`❌ Prize amount batao! Min *100 gold*\n📢 Example: \`${prefix}ga create 5000 5m\``)
            if (amount > 1_000_000)
                return void M.reply(`❌ Max prize *1,000,000 gold*`)
            if (!timeMs)
                return void M.reply(`❌ Sahi time format batao!\n📢 Examples: \`30s\`, \`5m\`, \`1h\``)
            if (timeMs < 10_000)
                return void M.reply(`❌ Minimum time *10 seconds*`)
            if (timeMs > 24 * 3600 * 1000)
                return void M.reply(`❌ Maximum time *24 hours*`)

            const { wallet } = await this.client.DB.getUser(fromJid)
            if (wallet < amount)
                return void M.reply(`❌ Wallet mein sirf *${wallet.toLocaleString()} gold* hai!`)

            // Deduct prize from host
            await this.client.DB.setCrystal(fromJid, -amount)

            const session: GiveawaySession = {
                hostJid: fromJid,
                hostName: M.sender.username || 'Host',
                prize: amount,
                participants: [],
                endsAt: Date.now() + timeMs,
                group,
                msgKey: null
            }
            activeGiveaways.set(group, session)

            const sent = await this.client.sendMessage(
                M.from,
                { text: buildGiveawayFrame(session, timeMs) },
                { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
            )
            session.msgKey = sent?.key

            // Live countdown update every 15s
            const updateInterval = setInterval(async () => {
                const s = activeGiveaways.get(group)
                if (!s || !s.msgKey) { clearInterval(updateInterval); return }
                const left = s.endsAt - Date.now()
                if (left <= 0) { clearInterval(updateInterval); return }
                await this.client.sendMessage(group, { text: buildGiveawayFrame(s, left), edit: s.msgKey } as any)
            }, 15_000)

            // Auto-end when time expires
            setTimeout(async () => {
                clearInterval(updateInterval)
                const s = activeGiveaways.get(group)
                if (!s) return
                activeGiveaways.delete(group)
                await this.pickWinner(M, s)
            }, timeMs)

            return
        }

        return void M.reply(`❓ Sahi command batao!\n📢 Help: \`${prefix}ga\``)
    }

    private pickWinner = async (M: Message, session: GiveawaySession): Promise<void> => {
        if (session.participants.length === 0) {
            return void M.reply(
                `🎟️ *GIVEAWAY ENDED*\n\n` +
                `😢 Koi join hi nahi kiya!\n` +
                `💰 *${session.prize.toLocaleString()} gold* wapas host ko.`
            )
        }

        // Animate winner selection
        const sent = await this.client.sendMessage(
            M.from,
            { text: `🎰 *Winner choose ho raha hai...*\n\n${session.participants.map(p => p.name).join(', ')}\n\n_Spinning..._` },
            { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
        )

        await sleep(1500)

        const winner = session.participants[Math.floor(Math.random() * session.participants.length)]
        await this.client.DB.setCrystal(winner.jid, session.prize)

        if (sent?.key) {
            await this.client.sendMessage(M.from, {
                text:
                    `🎟️ ═══ *GIVEAWAY OVER!* ═══ 🎟️\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `🏆 *WINNER:*\n` +
                    `👑 *${winner.name}*\n\n` +
                    `💰 *+${session.prize.toLocaleString()} gold* 🎉\n\n` +
                    `👥 Total entries: ${session.participants.length}\n\n` +
                    `_Congratulations!_ 🎊`,
                edit: sent.key
            } as any)
        }

        await this.client.sendMessage(M.from, {
            text: `🎊 Congratulations @${winner.jid.split('@')[0]}! Tumne *${session.prize.toLocaleString()} gold* jeete!`,
            mentions: [winner.jid]
        })
    }
}
