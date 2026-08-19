/**
 * Shared in-memory state for the Card Battle system.
 * CardBattle.ts and shortcut-command files all import from here so they
 * share the exact same Map/Set instances (Node module-cache guarantees this).
 */

export type BattleMode = 'friendly' | 'gold' | 'card' | 'ranked'
export type BattlePhase = 'selecting' | 'fighting'

export interface BattleStats {
    wins: number
    losses: number
    rating: number
    streak: number
    cardsWon: number
    cardsLost: number
    protectedCards: string[]
    history: {
        opponent: string
        result: 'win' | 'loss' | 'draw'
        mode: string
        card: string
        reward: string
        date: number
    }[]
}

export interface PendingChallenge {
    group: string
    challengerJid: string
    challengerName: string
    challengedJid: string
    mode: BattleMode
    amount: number
    expiresAt: number
}

export interface Fighter {
    jid: string
    name: string
    card: string
    title: string
    tier: string
    hp: number
    maxHp: number
    attack: number
    defense: number
    speed: number
    defending: boolean
    specialUsed: boolean
}

export interface BattleSession {
    id: string
    group: string
    mode: BattleMode
    amount: number
    challengerJid: string
    challengedJid: string
    challengerName: string
    challengedName: string
    phase: BattlePhase
    selected: Record<string, string | undefined>
    fighters?: Record<string, Fighter>
    turn?: string
    log: string[]
    messageKey?: unknown
    stakeReserved?: boolean
    processing?: boolean
}

export interface RewardChoice {
    group: string
    winnerJid: string
    loserJid: string
    cards: string[]
    expiresAt: number
}

// ─── Shared state maps ─────────────────────────────────────────────────────────
export const pending   = new Map<string, PendingChallenge>()
export const sessions  = new Map<string, BattleSession>()
export const activeUsers = new Set<string>()
export const rewards   = new Map<string, RewardChoice>()

// ─── Shared helpers ────────────────────────────────────────────────────────────
export const rewardKey = (group: string, jid: string): string => `${group}:${jid}`

export const MODES: Record<BattleMode, string> = {
    friendly: 'Friendly — no stakes',
    gold:     'Gold — winner takes the agreed gold',
    card:     'Card — winner chooses one unprotected card',
    ranked:   'Ranked — rating changes, no card loss'
}

export const modeFrom = (value: string): BattleMode | null =>
    (['friendly', 'gold', 'card', 'ranked'] as BattleMode[]).includes(value as BattleMode)
        ? value as BattleMode
        : null

export const normalize = (jid: string): string =>
    `${jid.split('@')[0].split(':')[0]}@s.whatsapp.net`

export const defaultStats = (): BattleStats => ({
    wins: 0, losses: 0, rating: 1000, streak: 0,
    cardsWon: 0, cardsLost: 0, protectedCards: [], history: []
})

export const getStats = (user: any): BattleStats => {
    const raw = user.cardBattle ?? {}
    return {
        ...defaultStats(),
        ...raw,
        protectedCards: Array.isArray(raw.protectedCards) ? raw.protectedCards : [],
        history: Array.isArray(raw.history) ? raw.history : []
    }
}

export const modeLabel = (mode: BattleMode): string => MODES[mode].split(' — ')[0]
