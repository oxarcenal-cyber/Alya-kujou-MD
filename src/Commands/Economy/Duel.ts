import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DuelChallenge {
    challengerJid: string
    challengerName: string
    challengedJid: string
    bet: number
    expiresAt: number          // Date.now() + 60s
}

interface Fighter {
    jid: string
    name: string
    hp: number
    maxHp: number
    emoji: string
}

// ─── State ────────────────────────────────────────────────────────────────────

/** groupJid → pending challenge */
const pendingDuels = new Map<string, DuelChallenge>()
/** fighterJid → true (busy in active battle) */
const activeFighters = new Set<string>()

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_HP      = 100
const sleep       = (ms: number) => new Promise(r => setTimeout(r, ms))

// ─── Helpers ─────────────────────────────────────────────────────────────────

const hpBar = (hp: number, max: number, len = 10): string => {
    const filled = Math.max(0, Math.round((hp / max) * len))
    const bar    = '█'.repeat(filled) + '░'.repeat(len - filled)
    const pct    = Math.max(0, hp)
    const icon   = hp > 60 ? '❤️' : hp > 30 ? '🧡' : hp > 0 ? '💔' : '💀'
    return `${icon} ${bar}  ${pct} HP`
}

const frameHeader = (round: number): string =>
    `⚔️ ═══ *DUEL BATTLE* ═══ ⚔️\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `             ⚡ Round ${round}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

function buildFrame(
    a: Fighter,
    b: Fighter,
    round: number,
    log: string[]
): string {
    const lines = log.slice(-4)   // show last 4 log lines max
    return (
        frameHeader(round) +
        `${a.emoji} *${a.name}*\n${hpBar(a.hp, a.maxHp)}\n\n` +
        `${b.emoji} *${b.name}*\n${hpBar(b.hp, b.maxHp)}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        lines.map(l => `  ${l}`).join('\n')
    )
}

function calcDamage(): { dmg: number; crit: boolean; miss: boolean } {
    const miss = Math.random() < 0.08                          // 8% miss
    if (miss) return { dmg: 0, crit: false, miss: true }
    const crit = Math.random() < 0.18                          // 18% crit
    const base = Math.floor(Math.random() * 18) + 10           // 10–27
    return { dmg: crit ? base * 2 : base, crit, miss: false }
}

const ATTACK_LINES = [
    'lunges forward with a fierce strike',
    'unleashes a blazing combo',
    'channels energy and attacks',
    'dashes and slashes with full force',
    'throws a devastating punch',
    'calls upon dark power and strikes',
    'charges up and releases a shockwave',
    'leaps and delivers a crushing blow',
]

// ─── Battle Engine ────────────────────────────────────────────────────────────

async function runBattle(
    M: Message,
    client: InstanceType<any>,
    attacker: Fighter,
    defender: Fighter,
    bet: number
): Promise<void> {
    const log: string[] = ['⚡ Battle Start!', '']
    let round = 1

    // Initial frame
    const sent = await client.sendMessage(
        M.from,
        { text: buildFrame(attacker, defender, round, log) },
        { quoted: M.message }
    )
    if (!sent?.key) return

    const edit = async (text: string) => {
        await client.sendMessage(M.from, { text, edit: sent.key } as any)
    }

    await sleep(1500)

    // ── Battle loop ──────────────────────────────────────────────────────────
    while (attacker.hp > 0 && defender.hp > 0) {
        // --- Attacker hits defender ---
        const atk1 = calcDamage()
        defender.hp = Math.max(0, defender.hp - atk1.dmg)

        const action1 = ATTACK_LINES[Math.floor(Math.random() * ATTACK_LINES.length)]
        if (atk1.miss) {
            log.push(`🌀 *${attacker.name}* ${action1}... but missed!`)
        } else if (atk1.crit) {
            log.push(`💥 *CRIT!* *${attacker.name}* ${action1}! ‑${atk1.dmg} HP 🔥`)
        } else {
            log.push(`🗡️ *${attacker.name}* ${action1}! ‑${atk1.dmg} HP`)
        }

        await sleep(1200)
        await edit(buildFrame(attacker, defender, round, log))

        if (defender.hp <= 0) break

        await sleep(1000)

        // --- Defender hits attacker ---
        const atk2 = calcDamage()
        attacker.hp = Math.max(0, attacker.hp - atk2.dmg)

        const action2 = ATTACK_LINES[Math.floor(Math.random() * ATTACK_LINES.length)]
        if (atk2.miss) {
            log.push(`🌀 *${defender.name}* ${action2}... but missed!`)
        } else if (atk2.crit) {
            log.push(`💥 *CRIT!* *${defender.name}* ${action2}! ‑${atk2.dmg} HP 🔥`)
        } else {
            log.push(`🗡️ *${defender.name}* ${action2}! ‑${atk2.dmg} HP`)
        }

        await sleep(1200)
        await edit(buildFrame(attacker, defender, round, log))

        round++
        await sleep(900)
    }

    // ── Determine winner ─────────────────────────────────────────────────────
    const winner = attacker.hp > 0 ? attacker : defender
    const loser  = attacker.hp > 0 ? defender : attacker

    const payout = bet * 2
    await client.DB.setCrystal(loser.jid,   -bet)
    await client.DB.setCrystal(winner.jid,   bet)

    await sleep(1200)

    const finalText =
        `⚔️ ═══ *DUEL BATTLE* ═══ ⚔️\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `${winner.emoji} *${winner.name}*\n${hpBar(winner.hp, winner.maxHp)}\n\n` +
        `${loser.emoji} *${loser.name}*\n${hpBar(0, loser.maxHp)}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `🏆 *${winner.name} WINS!* 🏆\n\n` +
        `💰 *+${bet.toLocaleString()} gold* to ${winner.name}\n` +
        `💔 *-${bet.toLocaleString()} gold* from ${loser.name}\n\n` +
        `_Total pot: ${payout.toLocaleString()} gold_`

    await edit(finalText)

    // ── Send loss GIF for the loser ───────────────────────────────────────
    const LOSE_KEYS = ['lose-1','lose-2','lose-3','lose-4','lose-5','lose-6','lose-7','lose-8','lose-9','lose-10','lose-11','lose-12']
    const loseGifKey = LOSE_KEYS[Math.floor(Math.random() * LOSE_KEYS.length)]
    const loseGifBuf = client.assets.get(loseGifKey) as Buffer | undefined
    if (loseGifBuf) client.utils.gifToMp4(loseGifBuf).then(mp4 => client.sendMessage(M.from, { video: mp4, gifPlayback: true, mimetype: 'video/mp4', caption: `💔 *${loser.name} haar gaya!*` })).catch(() => {})

    activeFighters.delete(attacker.jid)
    activeFighters.delete(defender.jid)
}

// ─── Command ─────────────────────────────────────────────────────────────────

const FIGHTER_EMOJIS = ['😈','😤','🔥','⚡','🌪️','💢','🗡️','🏹','🧨','🎯','👊','🦾','🐉','⚔️','💀']
const randEmoji = () => FIGHTER_EMOJIS[Math.floor(Math.random() * FIGHTER_EMOJIS.length)]

@Command('duel', {
    description: 'Kisi ko gold bet pe duel challenge karo ⚔️',
    category: 'economy',
    usage: 'duel @user <amount> | duel accept | duel cancel',
    aliases: ['battle', 'fight'],
    cooldown: 0,
    exp: 20
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { args, context }: IArgs): Promise<void> => {
        const prefix  = this.client.config.prefix
        const input   = context.trim().toLowerCase()
        const fromJid = M.sender.jid
        const group   = M.from

        if (M.chat !== 'group')
            return void M.reply('❌ Duel sirf group mein hota hai!')

        // ── Accept ────────────────────────────────────────────────────────
        if (input === 'accept') {
            const challenge = pendingDuels.get(group)
            if (!challenge)
                return void M.reply(`❌ Is group mein koi pending duel nahi hai!\n📢 Challenge karo: \`${prefix}duel @user 1000\``)

            if (this.client.correctJid(fromJid) !== this.client.correctJid(challenge.challengedJid))
                return void M.reply(`❌ Ye duel tumhare liye nahi hai!\n⚔️ *${challenge.challengerName}* ne kisi aur ko challenge kiya hai.`)

            if (Date.now() > challenge.expiresAt) {
                pendingDuels.delete(group)
                return void M.reply('⏰ Duel challenge expire ho gaya! Dobara challenge bhejo.')
            }

            // Check balances again
            const [cData, dData] = await Promise.all([
                this.client.DB.getUser(challenge.challengerJid),
                this.client.DB.getUser(challenge.challengedJid)
            ])
            if (cData.wallet < challenge.bet)
                return void M.reply(`❌ ${challenge.challengerName} ke paas ab bet ke liye gold nahi hai!`)
            if (dData.wallet < challenge.bet)
                return void M.reply(`❌ Tumhare paas *${challenge.bet.toLocaleString()} gold* nahi hai!`)

            pendingDuels.delete(group)
            activeFighters.add(challenge.challengerJid)
            activeFighters.add(challenge.challengedJid)

            const attackerName  = challenge.challengerName
            const defenderName  = M.sender.username || 'Fighter'

            await M.reply(
                `⚔️ *DUEL ACCEPTED!*\n\n` +
                `😈 *${attackerName}* vs ${randEmoji()} *${defenderName}*\n` +
                `💰 Pot: *${(challenge.bet * 2).toLocaleString()} gold*\n\n` +
                `_Battle shuru ho rahi hai..._`
            )

            await sleep(1500)

            const fighter1: Fighter = {
                jid: challenge.challengerJid,
                name: attackerName,
                hp: MAX_HP,
                maxHp: MAX_HP,
                emoji: randEmoji()
            }
            const fighter2: Fighter = {
                jid: challenge.challengedJid,
                name: defenderName,
                hp: MAX_HP,
                maxHp: MAX_HP,
                emoji: randEmoji()
            }

            return void runBattle(M, this.client, fighter1, fighter2, challenge.bet)
        }

        // ── Cancel ────────────────────────────────────────────────────────
        if (input === 'cancel') {
            const challenge = pendingDuels.get(group)
            if (!challenge)
                return void M.reply('❌ Koi pending duel nahi hai!')
            if (this.client.correctJid(fromJid) !== this.client.correctJid(challenge.challengerJid))
                return void M.reply('❌ Ye duel tumhara nahi hai!')
            pendingDuels.delete(group)
            return void M.reply('🛑 Duel cancel ho gaya!')
        }

        // ── New Challenge ─────────────────────────────────────────────────
        if (M.mentioned.length < 1)
            return void M.reply(
                `⚔️ *DUEL SYSTEM*\n\n` +
                `📢 *Challenge karo:*\n` +
                `\`${prefix}duel @user <amount>\`\n\n` +
                `📢 *Accept karo:*\n` +
                `\`${prefix}duel accept\`\n\n` +
                `📢 *Cancel karo:*\n` +
                `\`${prefix}duel cancel\`\n\n` +
                `⏰ Challenge 60 seconds mein expire hota hai`
            )

        const rawMentioned = M.mentioned[0]                       // raw JID — for mentions[] notification
        const targetJid    = this.client.correctJid(rawMentioned) // normalized — for DB + state maps
        const selfJid      = this.client.correctJid(fromJid)

        if (targetJid === selfJid)
            return void M.reply('❌ Khud se duel nahi kar sakte! 😂')

        const botJid = this.client.correctJid(this.client.user?.id || '')
        if (targetJid === botJid)
            return void M.reply('❌ Bot se duel nahi ho sakta! 🤖')

        if (activeFighters.has(selfJid))
            return void M.reply('❌ Tum pehle se ek duel mein ho!')

        if (activeFighters.has(targetJid))
            return void M.reply('❌ Wo player pehle se ek duel mein hai!')

        if (pendingDuels.has(group))
            return void M.reply(
                `❌ Is group mein pehle se ek duel pending hai!\n` +
                `📢 Pehle wala khatam karo ya \`${prefix}duel cancel\` karo.`
            )

        // Amount parse
        const amountArg = args.find(a => /^\d+$/.test(a))
        const amount    = amountArg ? parseInt(amountArg) : 0
        if (!amount || amount < 100)
            return void M.reply(`❌ Bet amount batao! Minimum *100 gold*\n📢 Example: \`${prefix}duel @user 1000\``)
        if (amount > 50000)
            return void M.reply(`❌ Maximum bet *50,000 gold* hai`)

        const { wallet } = await this.client.DB.getUser(selfJid)
        if (wallet < amount)
            return void M.reply(`❌ Tumhare wallet mein sirf *${wallet.toLocaleString()} gold* hai!`)

        // Get target name from group participants
        const members    = M.groupMetadata?.participants || []
        const targetMeta = members.find(p => this.client.correctJid(p.id) === targetJid)
        const targetName = this.client.contact.getContact(targetJid).username || 'Fighter'

        pendingDuels.set(group, {
            challengerJid:  selfJid,
            challengerName: M.sender.username || 'Challenger',
            challengedJid:  targetJid,
            bet:            amount,
            expiresAt:      Date.now() + 60_000
        })

        // Auto-expire after 60s
        setTimeout(() => {
            const c = pendingDuels.get(group)
            if (c && c.challengerJid === selfJid) pendingDuels.delete(group)
        }, 60_000)

        // mention target in reply
        await this.client.sendMessage(
            M.from,
            {
                text:
                    `⚔️ *DUEL CHALLENGE!* ⚔️\n\n` +
                    `😈 *${M.sender.username || 'Challenger'}* challenges *${targetName}*!\n\n` +
                    `💰 *Bet:* ${amount.toLocaleString()} gold each\n` +
                    `🏆 *Winner gets:* ${(amount * 2).toLocaleString()} gold\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `@${rawMentioned.split('@')[0].split(':')[0]} kya tum accept karte ho? ⚔️\n\n` +
                    `✅ Accept: \`${prefix}duel accept\`\n` +
                    `❌ Ignore karo → 60s baad expire\n` +
                    `🛑 Cancel: \`${prefix}duel cancel\``,
                mentions: [rawMentioned]
            },
            { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
        )
    }
}
