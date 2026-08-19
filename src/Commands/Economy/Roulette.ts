import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

// ─── Wheel Setup ─────────────────────────────────────────────────────────────

/** European roulette wheel order */
const WHEEL = [
    0, 32, 15, 19,  4, 21,  2, 25, 17, 34,
    6, 27, 13, 36, 11, 30,  8, 23, 10,  5,
   24, 16, 33,  1, 20, 14, 31,  9, 22, 18,
   29,  7, 28, 12, 35,  3, 26
]
const WHEEL_LEN = WHEEL.length

const RED_NUMS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36])

const numColor = (n: number): string =>
    n === 0 ? '🟢' : RED_NUMS.has(n) ? '🔴' : '⚫'

// ─── Frame Renderer ──────────────────────────────────────────────────────────

/**
 * Renders a roulette frame.
 * @param pos  - current ball index on WHEEL
 * @param bet  - bet label string
 * @param amt  - bet amount
 * @param phase - 'fast' | 'slow' | 'done'
 * @param result - filled only when phase === 'done'
 */
function frame(
    pos: number,
    bet: string,
    amt: number,
    phase: 'fast' | 'slow' | 'done',
    result?: { win: boolean; payout: number; num: number }
): string {
    // ── 7-number window, ball in center ────────────────────────────────────
    const HALF = 3
    let colorRow = ''
    let numRow   = ''

    for (let i = -HALF; i <= HALF; i++) {
        const idx = ((pos + i) % WHEEL_LEN + WHEEL_LEN) % WHEEL_LEN
        const n   = WHEEL[idx]
        const c   = numColor(n)
        const pad = n.toString().padStart(2, ' ')

        if (i === 0) {
            colorRow += `❱${c}❰`
            numRow   += `❱${pad}❰`
        } else {
            colorRow += ` ${c} `
            numRow   += ` ${pad} `
        }
    }

    const spinLine =
        phase === 'fast' ? '🌀 *Spinning fast...* ⚡' :
        phase === 'slow' ? '🐌 *Slowing down...* 💫' :
        ''

    let text =
        `🎡 ═══ *ROULETTE ROYALE* ═══ 🎡\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `${colorRow}\n` +
        `${numRow}\n` +
        `         ↑\n` +
        `        ⚪ Ball\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💰 Bet: *${amt.toLocaleString()} gold*\n` +
        `🎨 Guess: *${bet}*\n`

    if (spinLine) text += `\n${spinLine}`

    if (phase === 'done' && result) {
        const { win, payout, num } = result
        const col = numColor(num)
        text +=
            `\n\n🎯 *LANDED ON: ${col} ${num}*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            (win
                ? `🏆 *YOU WIN! +${payout.toLocaleString()} gold!* 🎉`
                : `💔 *YOU LOSE! -${amt.toLocaleString()} gold!*`) +
            `\n_💎 Check balance: wallet_`
    }

    return text
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

/** Parse user's bet type and return a label + win checker */
function parseBet(input: string): {
    label: string
    check: (n: number) => boolean
    multiplier: number   // net win multiplier (winnings = bet * multiplier)
} | null {
    const s = input.toLowerCase().trim()
    if (s === 'red')   return { label: '🔴 Red',       check: n => n > 0 && RED_NUMS.has(n),   multiplier: 1 }
    if (s === 'black') return { label: '⚫ Black',      check: n => n > 0 && !RED_NUMS.has(n),  multiplier: 1 }
    if (s === 'green') return { label: '🟢 Green (0)',  check: n => n === 0,                     multiplier: 17 }
    if (s === 'odd')   return { label: '🔢 Odd',        check: n => n > 0 && n % 2 !== 0,       multiplier: 1 }
    if (s === 'even')  return { label: '🔢 Even',       check: n => n > 0 && n % 2 === 0,       multiplier: 1 }
    if (s === 'low')   return { label: '📉 Low (1-18)', check: n => n >= 1 && n <= 18,           multiplier: 1 }
    if (s === 'high')  return { label: '📈 High (19-36)',check: n => n >= 19 && n <= 36,         multiplier: 1 }

    const num = parseInt(s)
    if (!isNaN(num) && num >= 0 && num <= 36)
        return { label: `🎯 Number ${num}`, check: n => n === num, multiplier: 35 }

    return null
}

// ─── Command ─────────────────────────────────────────────────────────────────

@Command('roulette', {
    description: 'Spinning ball roulette game 🎡',
    category: 'economy',
    usage: 'roulette <amount> <red|black|odd|even|low|high|0-36>',
    aliases: ['rl', 'spin'],
    casino: true,
    cooldown: 0,
    exp: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { args }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix

        // ── Input validation ──────────────────────────────────────────────
        if (args.length < 2)
            return void M.reply(
                `🎡 *ROULETTE ROYALE*\n\n` +
                `📢 *Usage:* \`${prefix}roulette <amount> <bet>\`\n\n` +
                `🎨 *Bet Options:*\n` +
                `  🔴 \`red\`    — 2x payout\n` +
                `  ⚫ \`black\`  — 2x payout\n` +
                `  🟢 \`green\`  — 18x payout (sirf 0)\n` +
                `  🔢 \`odd\`    — 2x payout\n` +
                `  🔢 \`even\`   — 2x payout\n` +
                `  📉 \`low\`    — 2x payout (1–18)\n` +
                `  📈 \`high\`   — 2x payout (19–36)\n` +
                `  🎯 \`0–36\`  — 36x payout (exact number)\n\n` +
                `📢 *Example:* \`${prefix}roulette 1000 red\`\n` +
                `📢 *Example:* \`${prefix}roulette 500 7\``
            )

        const amount = parseInt(args[0])
        if (isNaN(amount) || amount <= 0)
            return void M.reply(`❌ Sahi amount likho!\n📢 Example: \`${prefix}roulette 500 red\``)

        const bet = parseBet(args[1])
        if (!bet)
            return void M.reply(
                `❌ Sahi bet type likho!\n` +
                `📢 Options: \`red\`, \`black\`, \`green\`, \`odd\`, \`even\`, \`low\`, \`high\`, ya \`0-36\``
            )

        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        if (amount > wallet)
            return void M.reply(`❌ Wallet mein itna nahi hai!\n💎 *Wallet:* ${wallet.toLocaleString()} gold`)
        if (amount < 100)
            return void M.reply(`❌ Minimum bet *100 gold* hai`)
        if (amount > 50000)
            return void M.reply(`❌ Maximum bet *50,000 gold* hai`)

        // ── Determine result (wheel physics pre-calculated) ───────────────
        const finalIdx = Math.floor(Math.random() * WHEEL_LEN)
        const finalNum = WHEEL[finalIdx]
        const win      = bet.check(finalNum)
        const payout   = win ? amount * bet.multiplier : 0

        // ── Animate: pick a random start far from final ───────────────────
        // ball travels ~2.5 full laps + approach
        const LAP       = WHEEL_LEN                        // 37 steps = 1 lap
        const totalStep = LAP * 2 + Math.floor(Math.random() * LAP) + finalIdx

        // steps array: fast phase (step 1), slow phase (step 0.5-0.1)
        const steps: Array<{ pos: number; delay: number; phase: 'fast'|'slow'|'done' }> = []

        // Fast phase — every 2 wheel slots, 120ms
        for (let s = 0; s < totalStep - 12; s += 2) {
            steps.push({ pos: s % WHEEL_LEN, delay: 120, phase: 'fast' })
        }
        // Slow phase — every 1 wheel slot, slowing down
        const slowDelays = [200, 280, 380, 480, 600, 750, 900, 1000, 1100, 1200, 1300]
        const slowStart  = totalStep - 12
        for (let i = 0; i < slowDelays.length; i++) {
            const pos = ((slowStart + i) % WHEEL_LEN + WHEEL_LEN) % WHEEL_LEN
            steps.push({ pos, delay: slowDelays[i], phase: 'slow' })
        }
        // Final landing
        steps.push({ pos: finalIdx, delay: 600, phase: 'done' })

        // ── Send initial message ──────────────────────────────────────────
        const initPos  = steps[0]?.pos ?? 0
        const sent = await this.client.sendMessage(
            M.from,
            { text: frame(initPos, bet.label, amount, 'fast') },
            { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
        )
        if (!sent?.key) return

        // ── Play animation ────────────────────────────────────────────────
        for (let i = 1; i < steps.length; i++) {
            const s = steps[i]
            await sleep(s.delay)

            const isDone   = s.phase === 'done'
            const frameText = isDone
                ? frame(s.pos, bet.label, amount, 'done', { win, payout, num: finalNum })
                : frame(s.pos, bet.label, amount, s.phase)

            await this.client.sendMessage(M.from, {
                text: frameText,
                edit: sent.key
            } as any)
        }

        // ── Save result to DB ─────────────────────────────────────────────
        const delta = win ? payout : -amount
        await this.client.DB.setCrystal(M.sender.jid, delta)

        // ── Send loss GIF if player lost ──────────────────────────────────
        if (!win) {
            const LOSE_KEYS = ['lose-1','lose-2','lose-3','lose-4','lose-5','lose-6','lose-7','lose-8','lose-9','lose-10','lose-11','lose-12']
            const loseKey = LOSE_KEYS[Math.floor(Math.random() * LOSE_KEYS.length)]
            const gifBuf = this.client.assets.get(loseKey) as Buffer | undefined
            if (gifBuf) this.client.utils.gifToMp4(gifBuf).then(mp4 => this.client.sendMessage(M.from, { video: mp4, gifPlayback: true, mimetype: 'video/mp4', caption: `💔 *Haar gaye! -${amount.toLocaleString()} gold!*` })).catch(() => {})
        }
    }
}
