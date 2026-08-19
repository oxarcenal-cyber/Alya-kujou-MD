import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

// ─── State ────────────────────────────────────────────────────────────────────

interface RRSession {
    hostJid: string
    bet: number
    players: { jid: string; name: string; alive: boolean }[]
    cylinder: number[]   // 0 = empty, 1 = bullet
    chamber: number
    started: boolean
    turnIdx: number
    expiresAt: number
}

const rrGames = new Map<string, RRSession>()
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

function buildCylinder(chamber: number, total = 6): string {
    return Array.from({ length: total }, (_, i) => i === chamber ? '🔴' : '⚫').join('')
}

// ─── Command ─────────────────────────────────────────────────────────────────

@Command('russianroulette', {
    description: 'Group elimination game — ek bullet, 6 chambers 🔫',
    category: 'games',
    usage: 'rr create <amount> | rr join | rr start | rr shoot | rr cancel',
    aliases: ['rr', 'rroulette'],
    cooldown: 0,
    exp: 25
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix  = this.client.config.prefix
        const input   = context.trim().toLowerCase()
        const group   = M.from
        const fromJid = this.client.correctJid(M.sender.jid)

        if (M.chat !== 'group')
            return void M.reply('❌ Russian Roulette sirf group mein hota hai!')

        // ── Help ──────────────────────────────────────────────────────────
        if (!input)
            return void M.reply(
                `🔫 *RUSSIAN ROULETTE*\n\n` +
                `📢 *How to use:*\n` +
                `  \`${prefix}rr create <amount>\` → Game create karo\n` +
                `  \`${prefix}rr join\` → Game mein shamil ho\n` +
                `  \`${prefix}rr start\` → Game shuru karo (min 2)\n` +
                `  \`${prefix}rr shoot\` → Apni baari pe trigger dabaao\n` +
                `  \`${prefix}rr cancel\` → Cancel karo\n\n` +
                `⚡ *Rules:*\n` +
                `  🔫 6 chambers — 1 mein bullet\n` +
                `  👥 Baari baari trigger dabate hain\n` +
                `  💥 Bullet laga = eliminated!\n` +
                `  🏆 Last alive = sab ka gold!`
            )

        // ── Create ────────────────────────────────────────────────────────
        if (input.startsWith('create')) {
            if (rrGames.has(group))
                return void M.reply(`❌ Pehle se game chal rahi hai!\n📢 Join karo: \`${prefix}rr join\``)

            const parts  = context.trim().split(/\s+/)
            const amount = parseInt(parts[1])
            if (!amount || amount < 100)
                return void M.reply(`❌ Bet amount batao! Min *100 gold*\n📢 Example: \`${prefix}rr create 500\``)
            if (amount > 10_000)
                return void M.reply(`❌ Max bet *10,000 gold*`)

            const { wallet } = await this.client.DB.getUser(fromJid)
            if (wallet < amount) return void M.reply(`❌ Wallet mein sirf *${wallet.toLocaleString()} gold* hai!`)

            // 6-chamber cylinder with 1 bullet at random position
            const cylinder = Array(6).fill(0)
            cylinder[Math.floor(Math.random() * 6)] = 1

            rrGames.set(group, {
                hostJid: fromJid,
                bet: amount,
                players: [{ jid: fromJid, name: M.sender.username || 'Player', alive: true }],
                cylinder,
                chamber: 0,
                started: false,
                turnIdx: 0,
                expiresAt: Date.now() + 60_000
            })

            setTimeout(() => {
                const g = rrGames.get(group)
                if (g && !g.started) rrGames.delete(group)
            }, 60_000)

            return void await this.client.sendMessage(
                M.from,
                {
                    text:
                        `🔫 *RUSSIAN ROULETTE CREATED!*\n\n` +
                        `💀 Host: *${M.sender.username || 'Player'}*\n` +
                        `💰 Bet: *${amount.toLocaleString()} gold* each\n\n` +
                        `⏰ 60s baad expire`,
                    footer: '🔫 RedzeoX Russian Roulette',
                    buttonsFormat: 'buttons',
                    buttons: [
                        { text: '✅ Join Game',   id: `${prefix}rr join` },
                        { text: '🔫 Start Game',  id: `${prefix}rr start` }
                    ]
                } as any,
                { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
            )
        }

        // ── Join ──────────────────────────────────────────────────────────
        if (input === 'join') {
            const g = rrGames.get(group)
            if (!g) return void M.reply(`❌ Koi game nahi!\n📢 Banao: \`${prefix}rr create <amount>\``)
            if (g.started) return void M.reply('❌ Game already shuru ho gayi!')
            if (g.players.length >= 6) return void M.reply('❌ Max 6 players!')
            if (g.players.find(p => p.jid === fromJid)) return void M.reply('❌ Pehle se join ho!')

            const { wallet } = await this.client.DB.getUser(fromJid)
            if (wallet < g.bet) return void M.reply(`❌ Tumhare paas *${g.bet.toLocaleString()} gold* nahi!`)

            g.players.push({ jid: fromJid, name: M.sender.username || 'Player', alive: true })
            return void M.reply(
                `✅ *${M.sender.username || 'Player'}* joined!\n\n` +
                `👥 Players (${g.players.length}/6):\n` +
                g.players.map(p => `  💀 ${p.name}`).join('\n') +
                `\n\n💰 Pot: *${(g.bet * g.players.length).toLocaleString()} gold*\n` +
                `📢 Start: \`${prefix}rr start\``
            )
        }

        // ── Cancel ────────────────────────────────────────────────────────
        if (input === 'cancel') {
            const g = rrGames.get(group)
            if (!g) return void M.reply('❌ Koi game nahi!')
            if (g.hostJid !== fromJid && !M.sender.isAdmin) return void M.reply('❌ Sirf host ya admin cancel kar sakta hai!')
            rrGames.delete(group)
            return void M.reply('🛑 Russian Roulette cancel!')
        }

        // ── Start ─────────────────────────────────────────────────────────
        if (input === 'start') {
            const g = rrGames.get(group)
            if (!g) return void M.reply(`❌ Koi game nahi!\n📢 Banao: \`${prefix}rr create <amount>\``)
            if (g.started) return void M.reply('❌ Game already shuru ho gayi!')
            if (g.hostJid !== fromJid && !M.sender.isAdmin) return void M.reply('❌ Sirf host ya admin start kar sakta hai!')
            if (g.players.length < 2) return void M.reply(`❌ Min *2 players* chahiye!\n📢 Join: \`${prefix}rr join\``)

            g.started = true
            for (const p of g.players) await this.client.DB.setCrystal(p.jid, -g.bet)

            // Shuffle player order
            for (let i = g.players.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [g.players[i], g.players[j]] = [g.players[j], g.players[i]]
            }

            const currentPlayer = g.players[g.turnIdx]
            return void await this.client.sendMessage(
                M.from,
                {
                    text:
                        `🔫 *RUSSIAN ROULETTE SHURU!*\n\n` +
                        `👥 Players:\n` +
                        g.players.map(p => `  💀 ${p.name}`).join('\n') +
                        `\n\n💰 Pot: *${(g.bet * g.players.length).toLocaleString()} gold*\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `🔫 *${currentPlayer.name}* ki baari hai!`,
                    footer: '🔫 RedzeoX Russian Roulette',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🔫 Pull Trigger', id: `${prefix}rr shoot` }]
                } as any,
                { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
            )
        }

        // ── Shoot ─────────────────────────────────────────────────────────
        if (input === 'shoot') {
            const g = rrGames.get(group)
            if (!g || !g.started) return void M.reply(`❌ Koi active game nahi!\n📢 Banao: \`${prefix}rr create <amount>\``)

            const currentPlayer = g.players.find(p => p.alive && g.players.filter(x => x.alive).indexOf(p) === g.turnIdx % g.players.filter(x => x.alive).length)
            if (!currentPlayer) return void M.reply('❌ Game error! Try again.')
            if (this.client.correctJid(fromJid) !== currentPlayer.jid)
                return void M.reply(`❌ Abhi *${currentPlayer.name}* ki baari hai!\n📢 Unhe shoot karne do.`)

            const bullet = g.cylinder[g.chamber]
            const chamberNum = g.chamber
            g.chamber++

            const sent = await this.client.sendMessage(
                M.from,
                { text: `🔫 *${currentPlayer.name}* ne trigger dabaya...\n\n${buildCylinder(chamberNum)}\n\n_Click!_` },
                { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
            )
            if (!sent?.key) return

            const edit = (text: string) => this.client.sendMessage(M.from, { text, edit: sent.key } as any)

            await sleep(1000)
            await edit(`🔫 *${currentPlayer.name}* ne trigger dabaya...\n\n${buildCylinder(chamberNum)}\n\n_Cylinder spin ho raha hai..._ 🌀`)
            await sleep(1200)

            const alivePlayers = g.players.filter(p => p.alive)

            if (bullet === 1) {
                // Eliminated!
                currentPlayer.alive = false
                await edit(
                    `🔫 *${currentPlayer.name}* ne trigger dabaya...\n\n${buildCylinder(chamberNum)} 💥\n\n` +
                    `*BANG!!!* 💥\n` +
                    `💀 *${currentPlayer.name} ELIMINATED!*`
                )

                // ── Send loss GIF ─────────────────────────────────────────
                const LOSE_KEYS = ['lose-1','lose-2','lose-3','lose-4','lose-5','lose-6','lose-7','lose-8','lose-9','lose-10','lose-11','lose-12']
                const loseGifBuf = this.client.assets.get(LOSE_KEYS[Math.floor(Math.random() * LOSE_KEYS.length)]) as Buffer | undefined
                if (loseGifBuf) this.client.utils.gifToMp4(loseGifBuf).then(mp4 => this.client.sendMessage(M.from, { video: mp4, gifPlayback: true, mimetype: 'video/mp4', caption: `💀 *${currentPlayer.name} ELIMINATED!*` })).catch(() => {})

                const stillAlive = g.players.filter(p => p.alive)

                if (stillAlive.length === 1) {
                    const winner = stillAlive[0]
                    const prize = g.bet * g.players.length
                    await this.client.DB.setCrystal(winner.jid, prize)
                    rrGames.delete(group)
                    await sleep(1000)
                    return void await this.client.sendMessage(M.from, {
                        text:
                            `🏆 *GAME OVER!*\n\n` +
                            `🥇 *${winner.name} WINS!*\n` +
                            `💰 *+${prize.toLocaleString()} gold* 🎉\n\n` +
                            `☠️ Eliminated:\n` +
                            g.players.filter(p => !p.alive).map(p => `  💀 ${p.name}`).join('\n'),
                        footer: '🔫 RedzeoX Russian Roulette',
                        buttonsFormat: 'buttons',
                        buttons: [{ text: '🔫 New Game', id: `${prefix}rr create 500` }]
                    } as any, { quoted: M.message as import('@adiwajshing/baileys').WAMessage })
                }

                // Next alive player
                g.turnIdx = 0
                const nextAlive = g.players.find(p => p.alive)!
                return void await this.client.sendMessage(
                    M.from,
                    {
                        text:
                            `💀 *${currentPlayer.name}* eliminated!\n\n` +
                            `👥 Still alive: ${stillAlive.map(p => p.name).join(', ')}\n\n` +
                            `🔫 *${nextAlive.name}* ki baari!`,
                        footer: '🔫 RedzeoX Russian Roulette',
                        buttonsFormat: 'buttons',
                        buttons: [{ text: '🔫 Pull Trigger', id: `${prefix}rr shoot` }]
                    } as any,
                    { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
                )
            } else {
                // Safe!
                await edit(
                    `🔫 *${currentPlayer.name}* ne trigger dabaya...\n\n${buildCylinder(chamberNum)}\n\n` +
                    `*Click!* 😅\n` +
                    `✅ *${currentPlayer.name} SAFE!* Phir se click!`
                )

                // Next player
                const aliveNow = g.players.filter(p => p.alive)
                const currIdx  = aliveNow.indexOf(currentPlayer)
                const nextPlayer = aliveNow[(currIdx + 1) % aliveNow.length]
                g.turnIdx++

                await sleep(800)
                return void await this.client.sendMessage(M.from, {
                    text:
                        `😅 *${currentPlayer.name}* bach gaya!\n\n` +
                        `🔫 Ab *${nextPlayer.name}* ki baari!`,
                    footer: '🔫 RedzeoX Russian Roulette',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🔫 Pull Trigger', id: `${prefix}rr shoot` }]
                } as any, { quoted: M.message as import('@adiwajshing/baileys').WAMessage })
            }
        }

        return void M.reply(`❓ Sahi command batao!\n📢 Help: \`${prefix}rr\``)
    }
}
