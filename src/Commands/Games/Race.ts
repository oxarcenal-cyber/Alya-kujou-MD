import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Racer {
    jid: string
    name: string
    pos: number
    emoji: string
    finished: boolean
}

interface RaceSession {
    hostJid: string
    bet: number
    players: Racer[]
    expiresAt: number
    started: boolean
}

// ─── State ────────────────────────────────────────────────────────────────────

const races = new Map<string, RaceSession>()
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const TRACK_LEN = 14
const RACER_EMOJIS = ['🏎️', '🚗', '🚕', '🏍️', '🛻', '🚙']

// ─── Render ───────────────────────────────────────────────────────────────────

function renderTrack(players: Racer[], round: number, finished = false): string {
    let text =
        `🏁 ═══ *GROUP RACE* ═══ 🏁\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `${finished ? '🏆 *RACE OVER!*' : `⚡ Round ${round}`}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

    for (const p of players) {
        const pos = Math.min(p.pos, TRACK_LEN)
        const track = '░'.repeat(pos) + p.emoji + '░'.repeat(Math.max(0, TRACK_LEN - pos)) + '🏁'
        const tag = p.finished ? ' ✅' : ''
        text += `*${p.name}*${tag}\n\`${track}\`\n\n`
    }
    return text.trimEnd()
}

// ─── Command ─────────────────────────────────────────────────────────────────

@Command('race', {
    description: 'Group race game — sab bet karo aur race karo! 🏎️',
    category: 'games',
    usage: 'race create <amount> | race join | race start | race cancel',
    aliases: ['gr', 'grouprace'],
    cooldown: 0,
    exp: 20
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const input  = context.trim().toLowerCase()
        const group  = M.from
        const fromJid = this.client.correctJid(M.sender.jid)

        if (M.chat !== 'group')
            return void M.reply('❌ Race sirf group mein hoti hai!')

        // ── Help ──────────────────────────────────────────────────────────
        if (!input)
            return void await this.client.sendMessage(M.from, {
                text:
                    `🏎️ *GROUP RACE*\n\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}race create <amount>\` → Race create karo (bet set karo)\n` +
                    `  \`${prefix}race join\` → Race mein shamil hao\n` +
                    `  \`${prefix}race start\` → Race shuru karo (min 2 players)\n` +
                    `  \`${prefix}race cancel\` → Race cancel karo\n\n` +
                    `⏰ Join window: *60 seconds*\n` +
                    `👥 Max players: *6*\n` +
                    `💰 Min bet: *100 gold*\n` +
                    `🏆 Winner gets: *sab ka gold!*`,
                footer: '🏎️ RedzeoX Race',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Race Actions',
                        rows: [
                            { title: '✅ Join Race',    description: 'Join the ongoing race',        id: `${prefix}race join`   },
                            { title: '🏁 Start Race',  description: 'Start race (host/admin only)', id: `${prefix}race start`  },
                            { title: '🛑 Cancel Race', description: 'Cancel the race (host only)',  id: `${prefix}race cancel` },
                        ]
                    }]
                }]
            } as any, { quoted: M.message })

        // ── Create ────────────────────────────────────────────────────────
        if (input.startsWith('create')) {
            if (races.has(group))
                return void M.reply(`❌ Pehle se ek race chal rahi hai!\n📢 Join karo: \`${prefix}race join\``)

            const parts  = context.trim().split(/\s+/)
            const amount = parseInt(parts[1])
            if (!amount || amount < 100)
                return void M.reply(`❌ Bet amount batao! Minimum *100 gold*\n📢 Example: \`${prefix}race create 500\``)
            if (amount > 10_000)
                return void M.reply(`❌ Maximum bet *10,000 gold* hai`)

            const { wallet } = await this.client.DB.getUser(fromJid)
            if (wallet < amount)
                return void M.reply(`❌ Wallet mein sirf *${wallet.toLocaleString()} gold* hai!`)

            const hostName = M.sender.username || 'Racer'
            races.set(group, {
                hostJid: fromJid,
                bet: amount,
                players: [{ jid: fromJid, name: hostName, pos: 0, emoji: RACER_EMOJIS[0], finished: false }],
                expiresAt: Date.now() + 60_000,
                started: false
            })

            setTimeout(() => {
                const r = races.get(group)
                if (r && !r.started) {
                    races.delete(group)
                }
            }, 60_000)

            return void await this.client.sendMessage(
                M.from,
                {
                    text:
                        `🏎️ *RACE CREATED!* 🏁\n\n` +
                        `🏠 Host: *${hostName}*\n` +
                        `💰 Bet: *${amount.toLocaleString()} gold* each\n\n` +
                        `⏰ 60s baad auto-cancel`,
                    footer: '🏎️ RedzeoX Race',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '✅ Join Race',  id: `${prefix}race join` },
                        { text: '🏁 Start Race', id: `${prefix}race start` }
                    ]
                } as any,
                { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
            )
        }

        // ── Join ──────────────────────────────────────────────────────────
        if (input === 'join') {
            const race = races.get(group)
            if (!race)
                return void M.reply(`❌ Koi race nahi hai!\n📢 Banao: \`${prefix}race create <amount>\``)
            if (race.started)
                return void M.reply('❌ Race already shuru ho gayi!')
            if (Date.now() > race.expiresAt) {
                races.delete(group)
                return void M.reply('⏰ Race expire ho gayi! Nayi race banao.')
            }
            if (race.players.find(p => p.jid === fromJid))
                return void M.reply('❌ Tum pehle se join kar chuke ho!')
            if (race.players.length >= 6)
                return void M.reply('❌ Max 6 players allowed! Race start karo.')

            const { wallet } = await this.client.DB.getUser(fromJid)
            if (wallet < race.bet)
                return void M.reply(`❌ Tumhare paas *${race.bet.toLocaleString()} gold* nahi hai!`)

            const emoji = RACER_EMOJIS[race.players.length % RACER_EMOJIS.length]
            race.players.push({ jid: fromJid, name: M.sender.username || 'Racer', pos: 0, emoji, finished: false })

            return void M.reply(
                `✅ *${M.sender.username || 'Racer'}* joined! ${emoji}\n\n` +
                `👥 Players (${race.players.length}/6):\n` +
                race.players.map(p => `  ${p.emoji} ${p.name}`).join('\n') +
                `\n\n💰 Total pot: *${(race.bet * race.players.length).toLocaleString()} gold*\n` +
                `📢 Start: \`${prefix}race start\``
            )
        }

        // ── Cancel ────────────────────────────────────────────────────────
        if (input === 'cancel') {
            const race = races.get(group)
            if (!race) return void M.reply('❌ Koi race nahi hai!')
            if (race.hostJid !== fromJid && !M.sender.isAdmin)
                return void M.reply('❌ Sirf host ya admin race cancel kar sakta hai!')
            races.delete(group)
            return void M.reply('🛑 Race cancel ho gayi!')
        }

        // ── Start ─────────────────────────────────────────────────────────
        if (input === 'start') {
            const race = races.get(group)
            if (!race)
                return void M.reply(`❌ Koi race nahi hai!\n📢 Banao: \`${prefix}race create <amount>\``)
            if (race.started)
                return void M.reply('❌ Race already shuru ho gayi!')
            if (race.hostJid !== fromJid && !M.sender.isAdmin)
                return void M.reply('❌ Sirf host ya admin race start kar sakta hai!')
            if (race.players.length < 2)
                return void M.reply(`❌ Kam se kam *2 players* chahiye!\n📢 Join karo: \`${prefix}race join\``)

            race.started = true

            // Deduct bets
            for (const p of race.players) {
                await this.client.DB.setCrystal(p.jid, -race.bet)
            }

            await M.reply(
                `🏎️ *RACE SHURU HO RAHI HAI!*\n\n` +
                race.players.map(p => `${p.emoji} *${p.name}*`).join('\n') +
                `\n\n💰 Prize Pool: *${(race.bet * race.players.length).toLocaleString()} gold*\n\n` +
                `_3... 2... 1... GO! 🏁_`
            )

            await sleep(2000)

            const sent = await this.client.sendMessage(
                M.from,
                { text: renderTrack(race.players, 1) },
                { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
            )
            if (!sent?.key) { races.delete(group); return }

            const edit = (text: string) =>
                this.client.sendMessage(M.from, { text, edit: sent.key } as any)

            let round = 1
            const finishOrder: Racer[] = []

            while (finishOrder.length < race.players.length) {
                await sleep(1100)
                for (const p of race.players) {
                    if (p.finished) continue
                    p.pos += Math.floor(Math.random() * 3) + 1
                    if (p.pos >= TRACK_LEN && !p.finished) {
                        p.finished = true
                        p.pos = TRACK_LEN
                        finishOrder.push(p)
                    }
                }
                round++
                await edit(renderTrack(race.players, round))
            }

            const winner = finishOrder[0]
            const prize  = race.bet * race.players.length
            await this.client.DB.setCrystal(winner.jid, prize)
            await sleep(800)

            const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣']
            await edit(
                `🏁 ═══ *RACE OVER!* ═══ 🏁\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                finishOrder.map((p, i) => `${medals[i]} *${p.name}*`).join('\n') +
                `\n\n🏆 *${winner.name} WINS!*\n` +
                `💰 *+${prize.toLocaleString()} gold* 🎉`
            )

            races.delete(group)
            return
        }

        return void M.reply(`❓ Sahi command batao!\n📢 Help: \`${prefix}race\``)
    }
}
