import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

// ─── Card Definitions ─────────────────────────────────────────────────────────

interface CardDef {
    name: string
    emoji: string
    atk: number
    def: number
    hp: number
    ability: string
    abilityDesc: string
}

const ALL_CARDS: CardDef[] = [
    { name: 'Dragon Lord',    emoji: '🐉', atk: 35, def: 10, hp: 80,  ability: 'inferno',  abilityDesc: 'All enemies ko 20 damage' },
    { name: 'Shadow Ninja',   emoji: '🥷', atk: 40, def: 5,  hp: 60,  ability: 'vanish',   abilityDesc: '50% miss chance 1 turn' },
    { name: 'Iron Golem',     emoji: '🤖', atk: 15, def: 30, hp: 120, ability: 'fortress', abilityDesc: 'Def +20 next turn' },
    { name: 'Phoenix',        emoji: '🔥', atk: 30, def: 15, hp: 70,  ability: 'rebirth',  abilityDesc: 'Ek baar 30 HP recover' },
    { name: 'Thunder God',    emoji: '⚡', atk: 45, def: 8,  hp: 65,  ability: 'lightning',abilityDesc: 'Opponent skip kare next turn' },
    { name: 'Frost Queen',    emoji: '❄️', atk: 25, def: 20, hp: 90,  ability: 'freeze',   abilityDesc: 'Opponent ATK -15 next turn' },
    { name: 'Dark Sorcerer',  emoji: '🧙', atk: 38, def: 12, hp: 75,  ability: 'curse',    abilityDesc: 'Opponent har turn -8 HP' },
    { name: 'Holy Paladin',   emoji: '⚔️', atk: 20, def: 25, hp: 100, ability: 'heal',     abilityDesc: '+25 HP restore' },
    { name: 'Assassin',       emoji: '🗡️', atk: 50, def: 5,  hp: 55,  ability: 'execute',  abilityDesc: '50% HP se niche ho toh 2x damage' },
    { name: 'Sea Serpent',    emoji: '🐍', atk: 28, def: 18, hp: 95,  ability: 'poison',   abilityDesc: 'Opponent -10 HP per turn 3 turns' },
    { name: 'War Titan',      emoji: '👹', atk: 32, def: 22, hp: 110, ability: 'smash',    abilityDesc: 'Def ignore kar ke hit' },
    { name: 'Void Wraith',    emoji: '👻', atk: 42, def: 8,  hp: 68,  ability: 'drain',    abilityDesc: 'Damage ka 50% apna HP badhao' },
]

// ─── State ────────────────────────────────────────────────────────────────────

interface Fighter {
    jid: string
    name: string
    card: CardDef
    currentHp: number
    defBuff: number
    atkDebuff: number
    skipTurn: boolean
    poisonTurns: number
    rebirthUsed: boolean
    abilityUsed: boolean
}

interface CDSession {
    challengerJid: string
    challengerName: string
    challengedJid: string
    bet: number
    expiresAt: number
    // set when accepted
    f1?: Fighter
    f2?: Fighter
}

const pending   = new Map<string, CDSession>()
const activeCDs = new Set<string>()
const sleep     = (ms: number) => new Promise(r => setTimeout(r, ms))

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dealHand(count = 4): CardDef[] {
    const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
}

function hpBar(hp: number, max: number): string {
    const len    = 10
    const filled = Math.max(0, Math.round((hp / max) * len))
    const icon   = hp > 60 ? '❤️' : hp > 30 ? '🧡' : hp > 0 ? '💔' : '💀'
    return `${icon} ${'█'.repeat(filled)}${'░'.repeat(len - filled)} ${Math.max(0, hp)}HP`
}

function renderFrame(f1: Fighter, f2: Fighter, round: number, log: string[]): string {
    return (
        `🃏 ═══ *CARD DUEL* ═══ 🃏\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `⚡ Round ${round}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `${f1.card.emoji} *${f1.name}* — ${f1.card.name}\n${hpBar(f1.currentHp, f1.card.hp)}\n` +
        `ATK:${f1.card.atk + (f1.defBuff > 0 ? 0 : 0)} DEF:${f1.card.def + f1.defBuff}\n\n` +
        `${f2.card.emoji} *${f2.name}* — ${f2.card.name}\n${hpBar(f2.currentHp, f2.card.hp)}\n` +
        `ATK:${f2.card.atk} DEF:${f2.card.def + f2.defBuff}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        log.slice(-4).map(l => `  ${l}`).join('\n')
    )
}

function applyAttack(attacker: Fighter, defender: Fighter, log: string[]): void {
    if (attacker.skipTurn) {
        log.push(`⚡ *${attacker.name}* stunned — skip!`)
        attacker.skipTurn = false
        return
    }

    let dmg = Math.max(0, attacker.card.atk - attacker.atkDebuff - (defender.card.def + defender.defBuff))
    attacker.atkDebuff = 0
    defender.defBuff   = 0

    // Ability: smash — ignore DEF
    if (attacker.card.ability === 'smash') {
        dmg = attacker.card.atk - attacker.atkDebuff
    }
    // Ability: execute — 2x if target < 50% HP
    if (attacker.card.ability === 'execute' && !attacker.abilityUsed && defender.currentHp < defender.card.hp * 0.5) {
        dmg *= 2
        attacker.abilityUsed = true
        log.push(`☠️ *EXECUTE!* 2x damage!`)
    }
    // Ability: drain
    if (attacker.card.ability === 'drain') {
        attacker.currentHp = Math.min(attacker.card.hp, attacker.currentHp + Math.floor(dmg * 0.5))
    }

    dmg = Math.max(1, dmg)
    defender.currentHp -= dmg
    log.push(`🗡️ *${attacker.name}* attacks *${defender.name}* ‑${dmg}HP`)

    // Ability effects on defender
    if (attacker.card.ability === 'curse' && !attacker.abilityUsed) {
        defender.poisonTurns = 3
        attacker.abilityUsed = true
        log.push(`🧙 *CURSE!* ${defender.name} -8HP/turn x3`)
    }
    if (attacker.card.ability === 'poison' && !attacker.abilityUsed) {
        defender.poisonTurns = 3
        attacker.abilityUsed = true
        log.push(`🐍 *POISON!* ${defender.name} -10HP/turn x3`)
    }
    if (attacker.card.ability === 'freeze' && !attacker.abilityUsed) {
        defender.atkDebuff += 15
        attacker.abilityUsed = true
        log.push(`❄️ *FREEZE!* ${defender.name} ATK ‑15`)
    }
    if (attacker.card.ability === 'lightning' && !attacker.abilityUsed) {
        defender.skipTurn = true
        attacker.abilityUsed = true
        log.push(`⚡ *LIGHTNING!* ${defender.name} next turn skip!`)
    }

    // Poison tick
    if (defender.poisonTurns > 0) {
        const poisonDmg = attacker.card.ability === 'curse' ? 8 : 10
        defender.currentHp -= poisonDmg
        defender.poisonTurns--
        log.push(`☠️ Poison ‑${poisonDmg}HP (${defender.poisonTurns} left)`)
    }

    // Phoenix rebirth
    if (defender.currentHp <= 0 && !defender.rebirthUsed && defender.card.ability === 'rebirth') {
        defender.currentHp   = 30
        defender.rebirthUsed = true
        log.push(`🔥 *REBIRTH!* ${defender.name} revived at 30HP!`)
    }
}

function applyPassive(f: Fighter, log: string[]): void {
    if (f.card.ability === 'fortress' && !f.abilityUsed) {
        f.defBuff += 20
        f.abilityUsed = true
        log.push(`🤖 *FORTRESS!* ${f.name} DEF +20`)
    }
    if (f.card.ability === 'heal' && !f.abilityUsed && f.currentHp < f.card.hp * 0.5) {
        f.currentHp   = Math.min(f.card.hp, f.currentHp + 25)
        f.abilityUsed = true
        log.push(`⚔️ *HOLY HEAL!* ${f.name} +25HP`)
    }
    if (f.card.ability === 'inferno' && !f.abilityUsed) {
        f.abilityUsed = true
        // Inferno: handled in attack phase — splash not applicable 1v1 but logged
        log.push(`🐉 *INFERNO!* Dragon's fire rages!`)
    }
}

// ─── Command ─────────────────────────────────────────────────────────────────

@Command('cardduel', {
    description: 'Random card choose ho — abilities ke saath duel karo! 🃏',
    category: 'games',
    usage: 'cardduel @user <amount> | cardduel accept | cardduel cancel',
    aliases: ['cd', 'cduel', 'cardgame'],
    cooldown: 0,
    exp: 30
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { args, context }: IArgs): Promise<void> => {
        const prefix  = this.client.config.prefix
        const input   = context.trim().toLowerCase()
        const group   = M.from
        const fromJid = this.client.correctJid(M.sender.jid)

        if (M.chat !== 'group')
            return void M.reply('❌ Card Duel sirf group mein hoti hai!')

        // ── Help ──────────────────────────────────────────────────────────
        if (!input && M.mentioned.length === 0)
            return void await this.client.sendMessage(M.from, {
                text:
                    `🃏 *CARD DUEL*\n\n` +
                    `📢 *How to use:*\n` +
                    `  \`${prefix}cd @user <amount>\` → Challenge karo\n` +
                    `  \`${prefix}cd accept\` → Challenge accept karo\n` +
                    `  \`${prefix}cd cancel\` → Cancel karo\n\n` +
                    `⚡ *How it works:*\n` +
                    `  🃏 Dono ko random card milta hai\n` +
                    `  ⚔️ Cards mein ATK, DEF, HP aur special ability hoti hai\n` +
                    `  🔄 Auto-battle — HP 0 hone tak fight hoti hai\n` +
                    `  🏆 Winner ka gold double!\n\n` +
                    `🃏 *Available Cards:*\n` +
                    ALL_CARDS.map(c => `  ${c.emoji} *${c.name}* ATK:${c.atk} DEF:${c.def} HP:${c.hp}\n     💡 ${c.abilityDesc}`).join('\n') +
                    `\n\n📢 *Example:* \`${prefix}cd @user 1000\``,
                footer: '🃏 RedzeoX Card Duel',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Card Duel Actions',
                        rows: [
                            { title: '✅ Accept Duel',  description: 'Accept a pending challenge',   id: `${prefix}cd accept`  },
                            { title: '❌ Cancel Duel',  description: 'Cancel a pending challenge',   id: `${prefix}cd cancel`  },
                        ]
                    }]
                }]
            } as any, { quoted: M.message })

        // ── Accept ────────────────────────────────────────────────────────
        if (input === 'accept') {
            const session = pending.get(group)
            if (!session) return void M.reply(`❌ Koi pending card duel nahi!\n📢 Challenge: \`${prefix}cd @user 1000\``)
            if (this.client.correctJid(fromJid) !== session.challengedJid)
                return void M.reply(`❌ Ye duel tumhare liye nahi!\n⚔️ *${session.challengerName}* ne kisi aur ko challenge kiya.`)
            if (Date.now() > session.expiresAt) {
                pending.delete(group)
                return void M.reply('⏰ Challenge expire ho gaya!')
            }

            const [cData, dData] = await Promise.all([
                this.client.DB.getUser(session.challengerJid),
                this.client.DB.getUser(session.challengedJid)
            ])
            if (cData.wallet < session.bet) return void M.reply(`❌ Challenger ke paas gold nahi!`)
            if (dData.wallet < session.bet) return void M.reply(`❌ Tumhare paas *${session.bet.toLocaleString()} gold* nahi!`)

            pending.delete(group)
            activeCDs.add(session.challengerJid)
            activeCDs.add(session.challengedJid)

            // Deal cards
            const card1 = ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)]
            const card2 = ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)]
            const name2 = M.sender.username || 'Fighter'

            const f1: Fighter = {
                jid: session.challengerJid, name: session.challengerName,
                card: card1, currentHp: card1.hp,
                defBuff: 0, atkDebuff: 0, skipTurn: false,
                poisonTurns: 0, rebirthUsed: false, abilityUsed: false
            }
            const f2: Fighter = {
                jid: session.challengedJid, name: name2,
                card: card2, currentHp: card2.hp,
                defBuff: 0, atkDebuff: 0, skipTurn: false,
                poisonTurns: 0, rebirthUsed: false, abilityUsed: false
            }

            // Show card draw
            await M.reply(
                `🃏 *CARD DUEL ACCEPTED!*\n\n` +
                `${f1.card.emoji} *${f1.name}* draws: *${f1.card.name}*\n` +
                `  ATK:${f1.card.atk} DEF:${f1.card.def} HP:${f1.card.hp}\n` +
                `  💡 ${f1.card.abilityDesc}\n\n` +
                `${f2.card.emoji} *${f2.name}* draws: *${f2.card.name}*\n` +
                `  ATK:${f2.card.atk} DEF:${f2.card.def} HP:${f2.card.hp}\n` +
                `  💡 ${f2.card.abilityDesc}\n\n` +
                `💰 Pot: *${(session.bet * 2).toLocaleString()} gold*\n\n` +
                `_Battle shuru ho rahi hai..._`
            )

            await sleep(2000)

            // Battle
            const log: string[] = ['⚡ Battle Start!']
            const sent = await this.client.sendMessage(
                M.from,
                { text: renderFrame(f1, f2, 1, log) },
                { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
            )
            if (!sent?.key) {
                activeCDs.delete(f1.jid); activeCDs.delete(f2.jid)
                return
            }

            const edit = (t: string) => this.client.sendMessage(M.from, { text: t, edit: sent.key } as any)

            let round = 1
            while (f1.currentHp > 0 && f2.currentHp > 0 && round <= 30) {
                // Passive abilities
                applyPassive(f1, log)
                applyPassive(f2, log)

                // Attacker order by ATK
                const [first, second] = f1.card.atk >= f2.card.atk ? [f1, f2] : [f2, f1]
                applyAttack(first, second, log)
                await sleep(1000); await edit(renderFrame(f1, f2, round, log))
                if (second.currentHp <= 0) break

                applyAttack(second, first, log)
                round++
                await sleep(1000); await edit(renderFrame(f1, f2, round, log))
            }

            const winner = f1.currentHp > 0 ? f1 : f2
            const loser  = f1.currentHp > 0 ? f2 : f1

            await this.client.DB.setCrystal(loser.jid,  -session.bet)
            await this.client.DB.setCrystal(winner.jid,  session.bet)
            activeCDs.delete(f1.jid); activeCDs.delete(f2.jid)

            await sleep(800)
            await edit(
                `🃏 ═══ *CARD DUEL OVER!* ═══ 🃏\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `${winner.card.emoji} *${winner.name}* — ${winner.card.name}\n${hpBar(winner.currentHp, winner.card.hp)}\n\n` +
                `${loser.card.emoji} *${loser.name}* — ${loser.card.name}\n${hpBar(0, loser.card.hp)}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `🏆 *${winner.name} WINS!* 🏆\n\n` +
                `💰 *+${session.bet.toLocaleString()} gold* to ${winner.name}\n` +
                `💔 *-${session.bet.toLocaleString()} gold* from ${loser.name}`
            )

            // ── Send loss GIF for the loser ───────────────────────────────
            const LOSE_KEYS = ['lose-1','lose-2','lose-3','lose-4','lose-5','lose-6','lose-7','lose-8','lose-9','lose-10','lose-11','lose-12']
            const loseGifKey = LOSE_KEYS[Math.floor(Math.random() * LOSE_KEYS.length)]
            const loseGifBuf = this.client.assets.get(loseGifKey) as Buffer | undefined
            if (loseGifBuf) this.client.utils.gifToMp4(loseGifBuf).then(mp4 => this.client.sendMessage(M.from, { video: mp4, gifPlayback: true, mimetype: 'video/mp4', caption: `💔 *${loser.name} haar gaya!*` })).catch(() => {})
            return
        }

        // ── Cancel ────────────────────────────────────────────────────────
        if (input === 'cancel') {
            const session = pending.get(group)
            if (!session) return void M.reply('❌ Koi pending duel nahi!')
            if (session.challengerJid !== fromJid && !M.sender.isAdmin)
                return void M.reply('❌ Sirf challenger cancel kar sakta hai!')
            pending.delete(group)
            return void M.reply('🛑 Card Duel cancel!')
        }

        // ── New Challenge ─────────────────────────────────────────────────
        if (M.mentioned.length < 1)
            return void M.reply(`❌ Kisi ko tag karo!\n📢 Example: \`${prefix}cd @user 1000\``)

        if (pending.has(group))
            return void M.reply(`❌ Pehle se ek duel pending hai!\n📢 Cancel: \`${prefix}cd cancel\``)

        const rawMentioned = M.mentioned[0]                       // raw JID — for mentions[] notification
        const targetJid    = this.client.correctJid(rawMentioned) // normalized — for DB + state maps
        const selfJid      = this.client.correctJid(fromJid)

        if (targetJid === selfJid) return void M.reply('❌ Khud se duel nahi!')
        const botJid = this.client.correctJid(this.client.user?.id || '')
        if (targetJid === botJid) return void M.reply('❌ Bot se nahi!')

        if (activeCDs.has(selfJid))   return void M.reply('❌ Tum pehle se ek duel mein ho!')
        if (activeCDs.has(targetJid)) return void M.reply('❌ Wo player pehle se ek duel mein hai!')

        const amountArg = args.find(a => /^\d+$/.test(a))
        const amount    = amountArg ? parseInt(amountArg) : 0
        if (!amount || amount < 100) return void M.reply(`❌ Bet amount batao! Min *100 gold*`)
        if (amount > 50_000)         return void M.reply(`❌ Max bet *50,000 gold*`)

        const { wallet } = await this.client.DB.getUser(selfJid)
        if (wallet < amount) return void M.reply(`❌ Wallet mein sirf *${wallet.toLocaleString()} gold* hai!`)

        const targetName = this.client.contact.getContact(targetJid).username || 'Fighter'
        pending.set(group, {
            challengerJid:  selfJid,
            challengerName: M.sender.username || 'Challenger',
            challengedJid:  targetJid,
            bet: amount,
            expiresAt: Date.now() + 60_000
        })

        setTimeout(() => {
            const s = pending.get(group)
            if (s && s.challengerJid === selfJid) pending.delete(group)
        }, 60_000)

        await this.client.sendMessage(
            M.from,
            {
                text:
                    `🃏 *CARD DUEL CHALLENGE!* 🃏\n\n` +
                    `${M.sender.username || 'Challenger'} challenges *${targetName}*!\n\n` +
                    `💰 *Bet:* ${amount.toLocaleString()} gold each\n` +
                    `🏆 *Winner gets:* ${(amount * 2).toLocaleString()} gold\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `@${rawMentioned.split('@')[0].split(':')[0]} accept karoge? 🃏\n\n` +
                    `❌ Ignore → 60s baad expire`,
                mentions:      [rawMentioned],
                footer:        '⚡ RedzeoX',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '✅ Accept Duel', id: `${prefix}cd accept` },
                    { text: '❌ Cancel',       id: `${prefix}cd cancel` }
                ]
            } as any,
            { quoted: M.message as import('@adiwajshing/baileys').WAMessage }
        )
    }
}
