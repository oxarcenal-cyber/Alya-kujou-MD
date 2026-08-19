import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { parseCard, TIER_EMOJI } from '../../lib/CardData'
import {
    BattleMode, BattleSession, Fighter, BattleStats, RewardChoice,
    pending, sessions, activeUsers, rewards,
    rewardKey, modeFrom, normalize, defaultStats, getStats, modeLabel
} from '../../lib/CardBattleState'
import { incrementMission } from './CardMissions'

const hpBar = (hp: number, max: number): string => {
    const length = 10
    const filled = Math.max(0, Math.round((hp / max) * length))
    const icon = hp > max * 0.6 ? '❤️' : hp > max * 0.3 ? '🧡' : hp > 0 ? '💔' : '💀'
    return `${icon} ${'█'.repeat(filled)}${'░'.repeat(length - filled)} ${Math.max(0, hp)} HP`
}

/**
 * Stats are deterministic from the card identity, so the same card is always
 * balanced the same way even when it came from the external spawn API.
 */
const cardStats = (card: string): {
    title: string; tier: string; hp: number; attack: number; defense: number; speed: number
} => {
    const { title, tier } = parseCard(card)
    const base: Record<string, number> = { '1': 42, '2': 50, '3': 58, '4': 66, '5': 75, '6': 84, S: 94 }
    let hash = 0
    for (const char of title) hash = (hash * 31 + char.charCodeAt(0)) % 997
    const power = base[tier] ?? 42
    return {
        title,
        tier,
        hp: power + 35 + hash % 12,
        attack: Math.floor(power * 0.55) + hash % 8,
        defense: Math.floor(power * 0.32) + (hash >> 2) % 7,
        speed: Math.floor(power * 0.28) + (hash >> 3) % 9
    }
}

const createFighter = (jid: string, name: string, card: string): Fighter => {
    const stats = cardStats(card)
    return {
        jid, name, card, title: stats.title, tier: stats.tier,
        hp: stats.hp, maxHp: stats.hp, attack: stats.attack,
        defense: stats.defense, speed: stats.speed,
        defending: false, specialUsed: false
    }
}

const shortCard = (card: string): string => {
    const { title, tier } = parseCard(card)
    return `${(TIER_EMOJI as any)[tier] ?? '🃏'} ${title} (T${tier})`
}

const allCards = (user: any): string[] => [
    ...(Array.isArray(user.deck) ? user.deck : []),
    ...(Array.isArray(user.cardCollection) ? user.cardCollection : [])
]

const isProtected = (stats: BattleStats, card: string): boolean => stats.protectedCards.includes(card)


@Command('cardbattle', {
    description: 'Battle with real cards using menus and buttons',
    usage: 'cardbattle @user [friendly|gold|card|ranked] [amount]',
    category: 'cards',
    aliases: ['cbattle', 'cpvp'],
    cooldown: 0,
    exp: 20,
    dm: false
})
export default class CardBattleCommand extends BaseCommand {
    public override execute = async (M: Message, { args, context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const input = context.trim().toLowerCase()
        const self = normalize(M.sender.jid)
        const group = M.from

        if (M.chat !== 'group')
            return void M.reply(`❌ Card battles are available in groups only.\nUse \`${prefix}cardbattle help\`.`)

        if (!input || ['help', 'menu'].includes(input))
            return void M.reply(this.helpText(prefix))

        if (input === 'stats' || input.startsWith('stats ')) return void this.showStats(M, input)
        if (input === 'history') return void this.showHistory(M)
        if (input === 'leaderboard' || input === 'lb') return void this.showLeaderboard(M)
        if (input === 'protected') return void this.showProtected(M)
        if (input === 'missions') return void M.reply(
            `🎯 *CARD MISSIONS*\n\n` +
            `Missions are prepared for the next card update.\n` +
            `For now, battle to earn wins, rating, and history.`
        )
        if (input.startsWith('protect ')) return void this.protectCard(M, parseInt(input.split(/\s+/)[1]) - 1)
        if (input.startsWith('unprotect ')) return void this.unprotectCard(M, parseInt(input.split(/\s+/)[1]) - 1)

        if (input === 'accept') return void this.accept(M)
        if (input === 'decline' || input === 'reject') return void this.decline(M)
        if (input === 'cancel') return void this.cancel(M)
        if (input.startsWith('pick ')) return void this.pickCard(M, parseInt(input.split(/\s+/)[1]) - 1)
        if (['attack', 'defend', 'special'].includes(input)) return void this.action(M, input as 'attack' | 'defend' | 'special')
        if (input.startsWith('claim ')) return void this.claimReward(M, parseInt(input.split(/\s+/)[1]) - 1)

        if (M.mentioned.length < 1)
            return void M.reply(`❌ Tag a player.\nExample: \`${prefix}cardbattle @user card\``)

        const rawTarget = M.mentioned[0]                 // raw JID — for mentions[] notification
        const target    = normalize(rawTarget)            // normalized — for DB + state maps
        if (target === self) return void M.reply(`❌ You cannot battle yourself.`)
        if (target === normalize(this.client.user?.id || '')) return void M.reply(`❌ You cannot battle the bot.`)
        if (activeUsers.has(self) || activeUsers.has(target))
            return void M.reply(`❌ One of the players is already in a battle.`)
        if (pending.has(group) || sessions.has(group))
            return void M.reply(`❌ This group already has a pending or active card battle.`)

        const mode = args.map(x => x.toLowerCase()).map(modeFrom).find(Boolean) ?? 'friendly'
        const amountArg = args.find(x => /^\d+$/.test(x))
        const amount = amountArg ? parseInt(amountArg) : 0
        if (mode === 'gold' && (amount < 100 || amount > 50000))
            return void M.reply(`❌ Gold mode needs an amount from 100 to 50,000.\nExample: \`${prefix}cardbattle @user gold 500\``)

        const challenger = await this.client.DB.getUser(self)
        if ((challenger.deck ?? []).length === 0)
            return void M.reply(`❌ You need at least one card in your deck. Use \`${prefix}deck\`.`)
        if (mode === 'gold' && challenger.wallet < amount)
            return void M.reply(`❌ You do not have ${amount.toLocaleString()} gold in your wallet.`)

        const targetName = this.client.contact.getContact(target).username || 'Player'
        pending.set(group, {
            group, challengerJid: self, challengerName: M.sender.username || 'Player',
            challengedJid: target, mode, amount, expiresAt: Date.now() + 60_000
        })
        setTimeout(() => {
            const challenge = pending.get(group)
            if (challenge?.challengerJid === self) pending.delete(group)
        }, 60_000)

        await this.client.sendMessage(
            group,
            {
                text:
                    `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                    `  🌸✿ᰰ  *Card Battle!*  ✿ᰰ🌸\n` +
                    `      𐚁 ⚔️ 𝑩𝒂𝒕𝒕𝒍𝒆 𝑪𝒉𝒂𝒍𝒍𝒆𝒏𝒈𝒆 ⚔️ 𐚁\n\n` +
                    `  ‧₊˚ 🗡️  𝑪𝒉𝒂𝒍𝒍𝒆𝒏𝒈𝒆𝒓  ·❀·  ${M.sender.username || 'Player'}\n` +
                    `  ‧₊˚ 🎯 𝑻𝒂𝒓𝒈𝒆𝒕      ·❀·  ${targetName}\n` +
                    `  ‧₊˚ 🏅 𝑴𝒐𝒅𝒆        ·❀·  ${modeLabel(mode)}${mode === 'gold' ? ` · ${amount.toLocaleString()} gold` : ''}\n\n` +
                    `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
                    `  𖤐 *@${rawTarget.split('@')[0].split(':')[0]}* — Reply in 60s! 𖤐\n` +
                    `  🍃 ⁺. 60 secs left! .⁺ 🍃\n\n` +
                    `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𖥻ִֶָ`,
                mentions: [rawTarget],
                footer: 'Use the buttons or cardbattle accept/decline.',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '✅ Accept', id: `${prefix}cardbattle accept` },
                    { text: '❌ Decline', id: `${prefix}cardbattle decline` }
                ]
            } as any,
            { quoted: M.message as any }
        )
    }

    private helpText(prefix: string): string {
        return (
            `🃏 *CARD BATTLE — QUICK GUIDE*\n\n` +
            `Challenge: \`${prefix}cardbattle @user [mode] [amount]\`\n` +
            `Modes: friendly, gold, card, ranked\n\n` +
            `✅ Accept · ❌ Decline · ⚔️ Attack · 🛡️ Defend · ✨ Special\n` +
            `Card mode: winner chooses 1 unprotected card.\n` +
            `Ranked changes rating; friendly has no stakes.\n\n` +
            `Protect: \`${prefix}cardbattle protect <index>\`\n` +
            `Stats: \`${prefix}cardbattle stats\` · History: \`${prefix}cardbattle history\`\n` +
            `Top players: \`${prefix}cardbattle leaderboard\`\n\n` +
            `Open hub: \`${prefix}cardgame\``
        )
    }

    private accept = async (M: Message): Promise<void> => {
        const challenge = pending.get(M.from)
        const self = normalize(M.sender.jid)
        if (!challenge) return void M.reply(`❌ No pending card battle in this group.`)
        if (challenge.challengedJid !== self)
            return void M.reply(`❌ This challenge is not for you.`)
        if (Date.now() > challenge.expiresAt) {
            pending.delete(M.from)
            return void M.reply(`⏰ This challenge has expired.`)
        }

        const [challenger, challenged] = await Promise.all([
            this.client.DB.getUser(challenge.challengerJid),
            this.client.DB.getUser(challenge.challengedJid)
        ])
        if ((challenger.deck ?? []).length === 0 || (challenged.deck ?? []).length === 0)
            return void M.reply(`❌ Both players need at least one card in their deck.`)
        if (challenge.mode === 'gold' &&
            (challenger.wallet < challenge.amount || challenged.wallet < challenge.amount))
            return void M.reply(`❌ Both players must have the gold stake available.`)

        pending.delete(M.from)
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const session: BattleSession = {
            id, group: M.from, mode: challenge.mode, amount: challenge.amount,
            challengerJid: challenge.challengerJid, challengedJid: challenge.challengedJid,
            challengerName: challenge.challengerName, challengedName: M.sender.username || 'Player',
            phase: 'selecting', selected: {}, log: []
        }
        if (challenge.mode === 'gold') {
            await Promise.all([
                this.client.DB.setCrystal(challenge.challengerJid, -challenge.amount),
                this.client.DB.setCrystal(challenge.challengedJid, -challenge.amount)
            ])
            session.stakeReserved = true
        }
        sessions.set(M.from, session)
        activeUsers.add(challenge.challengerJid)
        activeUsers.add(challenge.challengedJid)
        await this.sendCardPicker(M, session, `Choose a card for *${session.challengerName}*.`, session.challengerJid)
        await this.sendCardPicker(M, session, `Choose a card for *${session.challengedName}*.`, session.challengedJid)
        setTimeout(() => this.expireSession(session.group, session.id), 90_000)
    }

    private decline = async (M: Message): Promise<void> => {
        const challenge = pending.get(M.from)
        if (!challenge || challenge.challengedJid !== normalize(M.sender.jid))
            return void M.reply(`❌ No card battle challenge for you.`)
        pending.delete(M.from)
        return void M.reply(`🛑 Card battle declined.`)
    }

    private cancel = async (M: Message): Promise<void> => {
        const challenge = pending.get(M.from)
        if (!challenge) return void M.reply(`❌ No pending card battle.`)
        if (challenge.challengerJid !== normalize(M.sender.jid) && !M.sender.isAdmin)
            return void M.reply(`❌ Only the challenger or a group admin can cancel it.`)
        pending.delete(M.from)
        return void M.reply(`🛑 Card battle cancelled.`)
    }

    private sendCardPicker = async (
        M: Message,
        session: BattleSession,
        note: string,
        playerJid: string
    ): Promise<void> => {
        const user = await this.client.DB.getUser(playerJid)
        const deck: string[] = user.deck ?? []
        const prefix = this.client.config.prefix
        const rows = deck.slice(0, 12).map((card, i) => {
            const stats = cardStats(card)
            return {
                title: `${(TIER_EMOJI as any)[stats.tier] ?? '🃏'} ${stats.title}`,
                description: `T${stats.tier} · HP ${stats.hp} · ATK ${stats.attack} · Slot ${i + 1}`,
                id: `${prefix}cardbattle pick ${i + 1}`
            }
        })
        await this.client.sendMessage(
            M.from,
            {
                text: `🃏 *CHOOSE YOUR BATTLE CARD*\n\n${note}\nMode: *${modeLabel(session.mode)}*`,
                footer: 'Choose a slot from your own deck. The card locks after selection.',
                title: '📋 Open Deck',
                buttons: [{ text: '📋 Open Menu', sections: [{ title: 'Your Deck', rows }] }]
            } as any,
            { quoted: M.message as any }
        )
    }

    private pickCard = async (M: Message, index: number): Promise<void> => {
        const session = sessions.get(M.from)
        const self = normalize(M.sender.jid)
        if (!session || session.phase !== 'selecting')
            return void M.reply(`❌ No card selection is active.`)
        if (![session.challengerJid, session.challengedJid].includes(self))
            return void M.reply(`❌ You are not part of this battle.`)
        if (session.selected[self])
            return void M.reply(`✅ Your card is already locked. Wait for the other player.`)
        const user = await this.client.DB.getUser(self)
        const deck: string[] = user.deck ?? []
        if (index < 0 || index >= deck.length)
            return void M.reply(`❌ Invalid deck slot.`)
        session.selected[self] = deck[index]
        const ready = session.selected[session.challengerJid] && session.selected[session.challengedJid]
        if (!ready) return void M.reply(`✅ Card locked. Waiting for the other player.`)

        const first = createFighter(session.challengerJid, session.challengerName, session.selected[session.challengerJid]!)
        const second = createFighter(session.challengedJid, session.challengedName, session.selected[session.challengedJid]!)
        session.fighters = { [first.jid]: first, [second.jid]: second }
        session.phase = 'fighting'
        session.turn = first.speed >= second.speed ? first.jid : second.jid
        session.log = [`⚡ ${first.name} vs ${second.name}`, `Mode: ${modeLabel(session.mode)}`]
        await this.sendBattleFrame(M, session)
    }

    private action = async (M: Message, action: 'attack' | 'defend' | 'special'): Promise<void> => {
        const session = sessions.get(M.from)
        const self = normalize(M.sender.jid)
        if (!session || session.phase !== 'fighting' || !session.fighters)
            return void M.reply(`❌ No active card battle.`)
        if (session.turn !== self) return void M.reply(`⏳ Wait for your turn.`)
        if (session.processing) return void M.reply(`⏳ Your previous action is still processing.`)
        const me = session.fighters[self]
        const opponent = Object.values(session.fighters).find(f => f.jid !== self)!
        if (action === 'special' && me.specialUsed)
            return void M.reply(`❌ Your Special has already been used.`)
        session.processing = true
        try {
            if (action === 'defend') {
                me.defending = true
                session.log.push(`🛡️ ${me.name} is defending.`)
            } else {
                const special = action === 'special'
                if (special) {
                    me.specialUsed = true
                    incrementMission(this.client.DB, self, 'use_special').catch(() => {})
                }
                let damage = special ? Math.floor(me.attack * 1.65) : me.attack
                if (!special) damage += Math.floor(Math.random() * 8) - 3
                if (Math.random() < 0.15 && !special) {
                    damage *= 2
                    session.log.push(`💥 Critical hit!`)
                }
                if (opponent.defending) {
                    damage = Math.max(1, Math.floor(damage * 0.55))
                    opponent.defending = false
                    session.log.push(`🛡️ ${opponent.name}'s defense reduced the damage.`)
                }
                const dealt = Math.max(1, damage - Math.floor(opponent.defense * 0.25))
                opponent.hp = Math.max(0, opponent.hp - dealt)
                session.log.push(`${special ? '✨' : '⚔️'} ${me.name} dealt ${dealt} damage.`)
            }

            if (opponent.hp <= 0) return void (await this.finishBattle(M, session, me, opponent))
            session.turn = opponent.jid
            await this.sendBattleFrame(M, session)
        } finally {
            if (sessions.get(session.group) === session) session.processing = false
        }
    }

    private sendBattleFrame = async (M: Message, session: BattleSession): Promise<void> => {
        const fighters = Object.values(session.fighters ?? {})
        const current = fighters.find(f => f.jid === session.turn)
        const text =
            `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
            `  🌸✿ᰰ  *Card Battle*  ✿ᰰ🌸\n` +
            `      𐚁 ⚔️ ${modeLabel(session.mode)} ⚔️ 𐚁\n\n` +
            fighters.map(f =>
                `  ‧₊˚ ${(TIER_EMOJI as any)[f.tier] ?? '🃏'} *${f.name}*  ·❀·  ${f.title} (T${f.tier})\n` +
                `  ${hpBar(f.hp, f.maxHp)}\n`
            ).join('\n') +
            `\n    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n\n` +
            `  ${session.log.slice(-2).join('\n  ')}\n\n` +
            `  🍃 ⁺. Turn: *${current?.name}* .⁺ 🍃\n\n` +
            `  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑩𝒂𝒕𝒕𝒍𝒊𝒏𝒈 𖥻ִֶָ`
        const payload: any = {
            text,
            footer: 'Choose one action.',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '⚔️ Attack', id: `${this.client.config.prefix}cardbattle attack` },
                { text: '🛡️ Defend', id: `${this.client.config.prefix}cardbattle defend` },
                { text: '✨ Special', id: `${this.client.config.prefix}cardbattle special` }
            ]
        }
        const sent = session.messageKey
            ? await this.client.sendMessage(M.from, { ...payload, edit: session.messageKey } as any)
            : await this.client.sendMessage(M.from, payload, { quoted: M.message as any })
        if (sent?.key) session.messageKey = sent.key
    }

    private finishBattle = async (M: Message, session: BattleSession, winner: Fighter, loser: Fighter): Promise<void> => {
        const winnerUser = await this.client.DB.getUser(winner.jid)
        const loserUser = await this.client.DB.getUser(loser.jid)
        const winnerStats = getStats(winnerUser)
        const loserStats = getStats(loserUser)
        winnerStats.wins++
        winnerStats.streak++
        loserStats.losses++
        loserStats.streak = 0
        if (session.mode === 'ranked') {
            winnerStats.rating += 20
            loserStats.rating = Math.max(0, loserStats.rating - 15)
        }
        const winnerCard = winner.card
        winnerStats.history.unshift({ opponent: loser.name, result: 'win', mode: session.mode, card: winnerCard, reward: '', date: Date.now() })
        loserStats.history.unshift({ opponent: winner.name, result: 'loss', mode: session.mode, card: loser.card, reward: '', date: Date.now() })
        winnerStats.history = winnerStats.history.slice(0, 10)
        loserStats.history = loserStats.history.slice(0, 10)
        if (session.mode === 'gold') {
            // Stakes were reserved when the challenge was accepted.
            // Pay the complete pot once, rather than charging the loser again.
            await this.client.DB.setCrystal(winner.jid, session.amount * 2)
        }
        await this.client.DB.updateUser(winner.jid, 'cardBattle', 'set', winnerStats as any)
        await this.client.DB.updateUser(loser.jid, 'cardBattle', 'set', loserStats as any)
        activeUsers.delete(winner.jid)
        activeUsers.delete(loser.jid)
        sessions.delete(session.group)

        // ── Mission tracking ────────────────────────────────────────────────
        const db = this.client.DB
        await Promise.all([
            incrementMission(db, winner.jid, 'play_battles'),
            incrementMission(db, loser.jid, 'play_battles'),
            incrementMission(db, winner.jid, 'win_battles'),
            session.mode === 'ranked' ? incrementMission(db, winner.jid, 'win_ranked') : Promise.resolve(),
            session.mode === 'card'   ? incrementMission(db, winner.jid, 'win_card_mode') : Promise.resolve(),
            winnerStats.streak >= 2   ? incrementMission(db, winner.jid, 'win_streak') : Promise.resolve(),
        ])

        const rewardCards = session.mode === 'card'
            ? allCards(loserUser).filter(card => !isProtected(loserStats, card))
            : []
        let rewardText = session.mode === 'card'
            ? `\n🎁 Choose one unprotected card below.`
            : session.mode === 'gold'
                ? `\n💰 Winner received ${session.amount.toLocaleString()} gold.`
                : ''

        await this.client.sendMessage(
            M.from,
            {
                text:
                    `˚✧. ୭ৎ 𝒍𝒍.𝑶'𝑶𝒅𝒚𝒔𝒔𝒆𝒚 ୭ৎ .✧˚\n\n` +
                    `  🌸✿ᰰ  *Battle Over!*  ✿ᰰ🌸\n` +
                    `      𐚁 🏆 𝑩𝒂𝒕𝒕𝒍𝒆 𝑪𝒐𝒎𝒑𝒍𝒆𝒕𝒆 🏆 𐚁\n\n` +
                    `  ‧₊˚ 🏆 𝑾𝒊𝒏𝒏𝒆𝒓  ·❀·  ${winner.name}\n` +
                    `  ‧₊˚ 🃏 𝑪𝒂𝒓𝒅    ·❀·  ${shortCard(winner.card)}\n` +
                    `  ‧₊˚ 💔 𝑳𝒐𝒔𝒆𝒓   ·❀·  ${loser.name}\n` +
                    `  ‧₊˚ 🏅 𝑴𝒐𝒅𝒆    ·❀·  ${modeLabel(session.mode)}\n\n` +
                    `    ─ ─ 🌸⋆͛⇢༊🌸 ─ ─\n` +
                    rewardText +
                    `\n  🌀 ִֶָ𖥻 𝑺𝒕𝒂𝒕𝒖𝒔 · 𝑭𝒊𝒏𝒊𝒔𝒉𝒆𝒅 𖥻ִֶָ`,
                footer: session.mode === 'ranked' ? 'Rating updated.' : 'Use cardgame to continue.',
                buttons: [{ text: '📊 View Stats', id: `${this.client.config.prefix}cardbattle stats` }]
            } as any,
            { quoted: M.message as any }
        )

        if (rewardCards.length > 0) {
            rewards.set(rewardKey(M.from, winner.jid), {
                group: M.from, winnerJid: winner.jid, loserJid: loser.jid,
                cards: rewardCards, expiresAt: Date.now() + 60_000
            })
            const rows = rewardCards.slice(0, 12).map((card, i) => ({
                title: shortCard(card),
                description: `Reward card ${i + 1}`,
                id: `${this.client.config.prefix}cardbattle claim ${i + 1}`
            }))
            await this.client.sendMessage(M.from, {
                text: `🎁 *CHOOSE YOUR CARD REWARD*\nWinner: @${winner.jid.split('@')[0].split(':')[0]}`,
                mentions: [winner.jid],
                title: '📋 Available Rewards',
                buttons: [{ text: '📋 Open Menu', sections: [{ title: 'Unprotected Cards', rows }] }]
            } as any)
            setTimeout(() => rewards.delete(rewardKey(M.from, winner.jid)), 60_000)
        } else if (session.mode === 'card') {
            await this.client.sendMessage(M.from, { text: `🛡️ No unprotected card was available. No card changed hands.` } as any)
        }
    }

    private claimReward = async (M: Message, index: number): Promise<void> => {
        const self = normalize(M.sender.jid)
        const key = rewardKey(M.from, self)
        const reward = rewards.get(key)
        if (!reward || reward.group !== M.from || Date.now() > reward.expiresAt)
            return void M.reply(`❌ No card reward is waiting for you.`)
        if (index < 0 || index >= reward.cards.length)
            return void M.reply(`❌ Invalid reward choice.`)
        const card = reward.cards[index]
        const loser = await this.client.DB.getUser(reward.loserJid)
        const winner = await this.client.DB.getUser(reward.winnerJid)
        const source = (loser.deck ?? []).indexOf(card)
        if (source >= 0) loser.deck.splice(source, 1)
        else {
            const collectionIndex = (loser.cardCollection ?? []).indexOf(card)
            if (collectionIndex < 0) return void M.reply(`❌ That reward card is no longer available.`)
            loser.cardCollection.splice(collectionIndex, 1)
        }
        const destination = (winner.deck ?? []).length < 12 ? 'deck' : 'collection'
        if (destination === 'deck') winner.deck.push(card)
        else winner.cardCollection.push(card)
        const winnerStats = getStats(winner)
        const loserStats = getStats(loser)
        winnerStats.cardsWon++
        loserStats.cardsLost++
        winnerStats.history[0] && (winnerStats.history[0].reward = card)
        loserStats.history[0] && (loserStats.history[0].reward = card)
        await this.client.DB.updateUser(loser.jid, 'deck', 'set', loser.deck)
        await this.client.DB.updateUser(loser.jid, 'cardCollection', 'set', loser.cardCollection)
        await this.client.DB.updateUser(winner.jid, 'deck', 'set', winner.deck)
        await this.client.DB.updateUser(winner.jid, 'cardCollection', 'set', winner.cardCollection)
        await this.client.DB.updateUser(winner.jid, 'cardBattle', 'set', winnerStats as any)
        await this.client.DB.updateUser(loser.jid, 'cardBattle', 'set', loserStats as any)
        rewards.delete(key)
        return void M.reply(`🎁 You claimed *${shortCard(card)}*.\nThe card was added to your ${destination}.`)
    }

    private expireSession = async (group: string, id: string): Promise<void> => {
        const session = sessions.get(group)
        if (!session || session.id !== id) return
        sessions.delete(group)
        activeUsers.delete(session.challengerJid)
        activeUsers.delete(session.challengedJid)
        if (session.stakeReserved && session.mode === 'gold') {
            await Promise.all([
                this.client.DB.setCrystal(session.challengerJid, session.amount),
                this.client.DB.setCrystal(session.challengedJid, session.amount)
            ])
        }
        await this.client.sendMessage(group, {
            text: `⏰ *CARD BATTLE EXPIRED*\nNo card selection or action was received in time. Players were unlocked${session.stakeReserved ? ' and gold stakes were refunded' : ''}.`
        } as any).catch(() => {})
    }

    private protectCard = async (M: Message, index: number): Promise<void> => {
        const user = await this.client.DB.getUser(normalize(M.sender.jid))
        const cards = allCards(user)
        if (index < 0 || index >= cards.length) return void M.reply(`❌ Invalid card index. Use \`${this.client.config.prefix}cards\`.`)
        const stats = getStats(user)
        if (stats.protectedCards.includes(cards[index])) return void M.reply(`🛡️ That card is already protected.`)
        if (stats.protectedCards.length >= 3) return void M.reply(`❌ You can protect up to 3 cards.`)
        stats.protectedCards.push(cards[index])
        await this.client.DB.updateUser(user.jid, 'cardBattle', 'set', stats as any)
        return void M.reply(`🛡️ Protected *${shortCard(cards[index])}*.\nIt cannot be claimed in card mode.`)
    }

    private unprotectCard = async (M: Message, index: number): Promise<void> => {
        const user = await this.client.DB.getUser(normalize(M.sender.jid))
        const stats = getStats(user)
        if (index < 0 || index >= stats.protectedCards.length) return void M.reply(`❌ Invalid protected-card index.`)
        const [card] = stats.protectedCards.splice(index, 1)
        await this.client.DB.updateUser(user.jid, 'cardBattle', 'set', stats as any)
        return void M.reply(`🔓 Unprotected *${shortCard(card)}*.`)
    }

    private showProtected = async (M: Message): Promise<void> => {
        const user = await this.client.DB.getUser(normalize(M.sender.jid))
        const protectedCards = getStats(user).protectedCards
        if (protectedCards.length === 0) return void M.reply(`🛡️ No protected cards.\nProtect one with \`${this.client.config.prefix}cardbattle protect <card index>\`.`)
        return void M.reply(`🛡️ *PROTECTED CARDS*\n\n${protectedCards.map((card, i) => `${i + 1}. ${shortCard(card)}`).join('\n')}\n\nUnprotect: \`${this.client.config.prefix}cardbattle unprotect <index>\``)
    }

    private showStats = async (M: Message, input: string): Promise<void> => {
        const user = await this.client.DB.getUser(normalize(M.sender.jid))
        const stats = getStats(user)
        return void M.reply(
            `📊 *CARD BATTLE STATS*\n\n` +
            `Wins: *${stats.wins}* · Losses: *${stats.losses}*\n` +
            `Rating: *${stats.rating}* · Streak: *${stats.streak}*\n` +
            `Cards won: *${stats.cardsWon}* · Cards lost: *${stats.cardsLost}*\n` +
            `Protected: *${stats.protectedCards.length}/3*`
        )
    }

    private showHistory = async (M: Message): Promise<void> => {
        const user = await this.client.DB.getUser(normalize(M.sender.jid))
        const history = getStats(user).history
        if (!history.length) return void M.reply(`📜 No card battles yet.`)
        return void M.reply(`📜 *BATTLE HISTORY*\n\n${history.slice(0, 8).map((x, i) =>
            `${i + 1}. ${x.result === 'win' ? '✅' : '❌'} ${x.result.toUpperCase()} vs ${x.opponent} · ${modeLabel((x.mode as BattleMode))}`
        ).join('\n')}`)
    }

    private showLeaderboard = async (M: Message): Promise<void> => {
        const users = await this.client.DB.user.find({}).sort({ 'cardBattle.rating': -1 }).limit(10).lean()
        if (!users.length) return void M.reply(`🏆 No ranked players yet.`)
        return void M.reply(`🏆 *CARD BATTLE LEADERBOARD*\n\n${users.map((user: any, i: number) => {
            const stats = getStats(user)
            return `${i + 1}. *${user.username?.name || user.jid.split('@')[0]}* — ${stats.rating} rating · ${stats.wins}W`
        }).join('\n')}`)
    }
}
