import { SlotMachine, SlotSymbol } from 'slot-machine'
import { BaseCommand, Command, Message } from '../../Structures'

// Shuffle symbols for animation frames
const SPIN_SYMBOLS = ['🎰', '💎', '💰', '⭐', '🍒', '🍋', '🍉', '🎯', '🃏', '💫', '🌟', '🔥']
const SPIN_BARS   = ['▰▰▰', '▱▱▱', '▰▱▰', '▱▰▱', '▰▰▱', '▱▱▰']

function randomSpin(): string {
    const r = () => SPIN_SYMBOLS[Math.floor(Math.random() * SPIN_SYMBOLS.length)]
    const bar = SPIN_BARS[Math.floor(Math.random() * SPIN_BARS.length)]
    return (
        `🎰 *SLOT MACHINE* 🎰\n` +
        `━━━━━━━━━━━━━━\n` +
        `┃  ${r()}  ${r()}  ${r()}  ┃\n` +
        `━━━━━━━━━━━━━━\n` +
        `    ${bar}\n\n` +
        `_🌀 Spinning..._`
    )
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

@Command('slot', {
    category: 'economy',
    description: 'Bet your gold in a slot machine 🎰',
    casino: true,
    usage: 'slot <amount>',
    cooldown: 0,
    exp: 10,
    aliases: ['bet']
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (M.numbers.length < 1)
            return void M.reply(`💬 Amount likho!\nExample: *slot 500*`)

        const amount = M.numbers[0]
        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        if (amount > wallet)
            return void M.reply(`❌ Wallet mein itna nahi hai!\n💎 *Wallet:* ${wallet}`)
        if (amount < 300)
            return void M.reply(`❌ Minimum bet *300 gold* hai`)
        if (amount > 10000)
            return void M.reply(`❌ Maximum bet *10,000 gold* hai`)

        // ── Calculate result pehle (fair play) ──────────────────────────
        const machine = new SlotMachine(3, this.symbols)
        const results  = machine.play()
        const points   = results.lines.reduce((t, l) => t + l.points, 0)
        const delta    = points <= 0 ? -amount : amount * points

        // ── Send first spinning frame ────────────────────────────────────
        const sent = await this.client.sendMessage(
            M.from,
            { text: randomSpin() },
            { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
        )
        if (!sent?.key) return

        // ── Shuffle for ~7 seconds (8 edits × ~875ms) ───────────────────
        const FRAMES = 8
        const INTERVAL = 875
        for (let i = 0; i < FRAMES; i++) {
            await sleep(INTERVAL)
            await this.client.sendMessage(M.from, {
                text: randomSpin(),
                edit: sent.key
            } as any)
        }

        // ── Final result edit ────────────────────────────────────────────
        await this.client.DB.setCrystal(M.sender.jid, delta)

        const won   = points > 0
        const emoji = won ? '🎉' : '💔'
        const visualRows = results.visualize().split('\n')

        let finalText =
            `🎰 *SLOT MACHINE* 🎰\n` +
            `━━━━━━━━━━━━━━\n`

        for (const row of visualRows) {
            if (row.trim()) finalText += `┃  ${row.trim()}  ┃\n`
        }

        finalText +=
            `━━━━━━━━━━━━━━\n\n` +
            (won
                ? `${emoji} *Jeet gaye! +${delta} gold!*\n🏆 Points: ${points}x`
                : `${emoji} *Haar gaye! -${amount} gold!*`) +
            `\n\n_💎 Balance check: *${this.client.config.prefix}wallet*_`

        await sleep(400)
        await this.client.sendMessage(M.from, {
            text: finalText,
            edit: sent.key
        } as any)

        // ── Send win/lose GIF after result ───────────────────────────────
        const LOSE_KEYS = ['lose-1','lose-2','lose-3','lose-4','lose-5','lose-6','lose-7','lose-8','lose-9','lose-10','lose-11','lose-12']
        const gifKey = won ? 'slot-win' : LOSE_KEYS[Math.floor(Math.random() * LOSE_KEYS.length)]
        const gifBuf = this.client.assets.get(gifKey) as Buffer | undefined
        if (gifBuf) {
            this.client.utils.gifToMp4(gifBuf).then(mp4 =>
                this.client.sendMessage(M.from, {
                    video: mp4,
                    gifPlayback: true,
                    mimetype: 'video/mp4',
                    caption: won
                        ? `🎉 *Jeet gaye! +${delta} gold!*`
                        : `💔 *Haar gaye! -${amount} gold!*`
                })
            ).catch(() => {})
        }
    }

    private symbols = [
        new SlotSymbol('1', { display: '🎰', points: 1, weight: 100 }),
        new SlotSymbol('b', { display: '💎', points: 5, weight: 20 }),
        new SlotSymbol('2', { display: '💰', points: 1, weight: 100 }),
        new SlotSymbol('c', { display: '⭐', points: 5, weight: 40 })
    ]
}
