import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

// ─── State ────────────────────────────────────────────────────────────────────

interface BombGame {
    safeWire: string
    wires: string[]
    playerJid: string
}

const bombGames = new Map<string, BombGame>()
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const WIRE_COLORS = ['🔴 Red', '🔵 Blue', '🟢 Green', '🟡 Yellow', '⚪ White']
const WIRE_KEYS   = ['red', 'blue', 'green', 'yellow', 'white']

function buildBombFrame(timeLeft: number, wires: string[], cut?: string): string {
    const bar = timeLeft > 0
        ? '█'.repeat(timeLeft) + '░'.repeat(10 - timeLeft)
        : '░'.repeat(10)

    const wireList = wires.map((w, i) =>
        `  ${cut && WIRE_KEYS[i] === cut ? '✂️' : '🔌'} ${w}`
    ).join('\n')

    return (
        `💣 ═══ *BOMB DEFUSE* ═══ 💣\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `⏱️ Timer: \`${bar}\` ${timeLeft}s\n\n` +
        `🔌 *Wires:*\n${wireList}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📢 \`!bomb cut <color>\` → Wire kato!`
    )
}

// ─── Command ─────────────────────────────────────────────────────────────────

@Command('bomb', {
    description: 'Sahi wire kato aur bomb defuse karo! 💣',
    category: 'games',
    usage: 'bomb → bomb shuru karo | bomb cut <red/blue/green/yellow/white> → wire kato',
    aliases: ['bombdefuse', 'defuse'],
    cooldown: 5,
    exp: 30,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix  = this.client.config.prefix
        const input   = context.trim().toLowerCase()
        const key     = `${M.from}_${M.sender.jid}`
        const game    = bombGames.get(key)

        // ── Help ──────────────────────────────────────────────────────────
        if (!input && !game)
            return void await this.client.sendMessage(M.from, {
                text:
                    `💣 *BOMB DEFUSE*\n\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}bomb\` → Bomb shuru karo\n` +
                    `  \`${prefix}bomb cut red\` → Red wire kato\n` +
                    `  \`${prefix}bomb cut blue\` → Blue wire kato\n` +
                    `  \`${prefix}bomb cut green\` → Green wire kato\n` +
                    `  \`${prefix}bomb cut yellow\` → Yellow wire kato\n` +
                    `  \`${prefix}bomb cut white\` → White wire kato\n\n` +
                    `⚡ *Rules:*\n` +
                    `  💡 5 wires hain — sirf 1 safe hai\n` +
                    `  ⏱️ 30 seconds countdown\n` +
                    `  ✂️ Sahi wire = defused! 🎉\n` +
                    `  💥 Galat wire = BOOM! 💀`,
                footer: '💣 RedzeoX Bomb Defuse',
                buttonsFormat: 'buttons',
                buttons: [{ text: '💣 Start Bomb', id: `${prefix}bomb` }]
            } as any, { quoted: M.message })

        // ── Cut wire ─────────────────────────────────────────────────────
        if (input.startsWith('cut')) {
            if (!game) return void M.reply(`❌ Koi bomb nahi! Pehle shuru karo: \`${prefix}bomb\``)

            const colorInput = input.replace('cut', '').trim()
            const idx = WIRE_KEYS.findIndex(k => colorInput.startsWith(k))
            if (idx === -1)
                return void M.reply(
                    `❌ Sahi wire color batao!\n` +
                    `📢 Options: \`red\`, \`blue\`, \`green\`, \`yellow\`, \`white\``
                )

            const chosenKey = WIRE_KEYS[idx]
            bombGames.delete(key)

            if (chosenKey === game.safeWire) {
                return void await this.client.sendMessage(M.from, {
                    text:
                        `✂️ ═══ *${WIRE_COLORS[WIRE_KEYS.indexOf(chosenKey)]} Wire Kata!* ═══\n\n` +
                        `💣...\n💣..\n💣.\n\n` +
                        `✅ *BOMB DEFUSED!* 🎉\n\n` +
                        `🦸 Tu ek hero hai bhai! Safe wire mila!`,
                    footer: '💣 RedzeoX Bomb Defuse',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '💣 Play Again', id: `${prefix}bomb` }]
                } as any, { quoted: M.message })
            } else {
                return void await this.client.sendMessage(M.from, {
                    text:
                        `✂️ *${WIRE_COLORS[idx]} Wire Kata!*\n\n` +
                        `💣 BEEP...\n` +
                        `💣 BEEP BEEP...\n` +
                        `💥 *BOOM!!!*\n\n` +
                        `💀 *TERA KAAM TAMAM!*\n\n` +
                        `_Safe wire tha: ${WIRE_COLORS[WIRE_KEYS.indexOf(game.safeWire)]}_`,
                    footer: '💣 RedzeoX Bomb Defuse',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '💣 Try Again', id: `${prefix}bomb` }]
                } as any, { quoted: M.message })
            }
        }

        // ── Already in game ───────────────────────────────────────────────
        if (game)
            return void M.reply(
                `❌ Bomb pehle se active hai!\n` +
                `📢 Wire kato: \`${prefix}bomb cut <color>\``
            )

        // ── Start new bomb ────────────────────────────────────────────────
        const safeIdx  = Math.floor(Math.random() * WIRE_COLORS.length)
        const safeWire = WIRE_KEYS[safeIdx]
        const wires    = [...WIRE_COLORS]

        bombGames.set(key, { safeWire, wires, playerJid: M.sender.jid })

        // Auto-explode if no cut within 30s
        setTimeout(() => {
            if (bombGames.has(key)) {
                bombGames.delete(key)
                this.client.sendMessage(M.from, {
                    text:
                        `⏱️ *TIME UP!*\n\n` +
                        `💥 *BOOM!!!*\n\n` +
                        `💀 Tera kaam tamam! Wire nahi kata time pe!\n` +
                        `_Safe wire tha: ${WIRE_COLORS[safeIdx]}_`,
                    footer: '💣 RedzeoX Bomb Defuse',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '💣 Try Again', id: `${prefix}bomb` }]
                } as any).catch(() => {})
            }
        }, 30_000)

        // Send animated countdown frame with wire selection list menu
        const sent = await this.client.sendMessage(
            M.from,
            {
                text: buildBombFrame(10, wires),
                footer: '💣 RedzeoX Bomb Defuse',
                buttons: [{
                    text: '✂️ Cut a Wire',
                    sections: [{
                        title: '🔌 Choose Wire to Cut',
                        rows: [
                            { title: '🔴 Red Wire',    id: `${prefix}bomb cut red`,    description: 'Cut the red wire' },
                            { title: '🔵 Blue Wire',   id: `${prefix}bomb cut blue`,   description: 'Cut the blue wire' },
                            { title: '🟢 Green Wire',  id: `${prefix}bomb cut green`,  description: 'Cut the green wire' },
                            { title: '🟡 Yellow Wire', id: `${prefix}bomb cut yellow`, description: 'Cut the yellow wire' },
                            { title: '⚪ White Wire',  id: `${prefix}bomb cut white`,  description: 'Cut the white wire' }
                        ]
                    }]
                }]
            } as any,
            { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
        )
        if (!sent?.key) { bombGames.delete(key); return }

        const edit = (text: string) =>
            this.client.sendMessage(M.from, { text, edit: sent.key } as any)

        // Animate countdown 30 → 21 (show 10-bar)
        for (let t = 9; t >= 0; t--) {
            await sleep(900)
            if (!bombGames.has(key)) return  // already cut
            await edit(buildBombFrame(t, wires))
        }
    }
}
