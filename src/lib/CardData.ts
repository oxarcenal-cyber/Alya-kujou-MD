import { join } from 'path'

export interface CardEntry {
    tier: string
    title: string
    url: string
}

// ─── S-tier cards only (local) — used by CardInfo + CardSpawn S/Event ─────────
export const ALL_CARDS: CardEntry[] = require(join(process.cwd(), 'src/Helpers/s_cards.json'))

export const TIER_PRICES: Record<string, [number, number]> = {
    '1': [2000, 4000],
    '2': [4000, 5000],
    '3': [4000, 5000],
    '4': [8000, 10000],
    '5': [25000, 40000],
    '6': [70000, 90000],
    'S': [100000, 500000]
}

export const TIER_EMOJI: Record<string, string> = {
    '1': '⚪',
    '2': '💧',
    '3': '🌿',
    '4': '⚡',
    '5': '🔥',
    '6': '🌊',
    'S': '👑'
}

export const TIER_NAME: Record<string, string> = {
    '1': 'Common',
    '2': 'Uncommon',
    '3': 'Rare',
    '4': 'Epic',
    '5': 'Legendary',
    '6': 'Ultra Rare ✨',
    'S': 'GOD TIER 💎'
}

export function getCardPrice(tier: string): number {
    const range = TIER_PRICES[tier] ?? [1000, 3000]
    return Math.floor(Math.random() * (range[1] - range[0]) + range[0])
}

export function findCard(title: string, tier: string): CardEntry | undefined {
    return ALL_CARDS.find(c => c.title === title && c.tier === tier)
}

export function parseCard(cardStr: string): { title: string; tier: string } {
    const lastDash = cardStr.lastIndexOf('-')
    return {
        title: cardStr.substring(0, lastDash),
        tier: cardStr.substring(lastDash + 1)
    }
}

export function formatCard(title: string, tier: string): string {
    return `${title}-${tier}`
}

// S-tier only random pick — for CardSpawn dev command
export function getRandomCard(): CardEntry {
    return ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)]
}

export function isGif(url: string): boolean {
    return url.toLowerCase().endsWith('.gif')
}

// ─── Shoob.gg API — fetch one random card for auto-spawn ──────────────────────
export interface ApiCardResult {
    title: string
    imageUrl: string
    tier: number | string
    series?: string
    price?: number
    detailUrl?: string
}

const CARD_API_URL = 'https://shoob-cards-api.onrender.com/api/cards?mode=spawn&key=Hellraizen'

/**
 * Maps API numeric tier → bot's string tier key.
 * shoob.gg uses 1–6 + 'S'. API returns number or string.
 */
export function normalizeTier(raw: number | string): string {
    const s = String(raw)
    if (['1','2','3','4','5','6','S'].includes(s)) return s
    return '1' // fallback
}

/**
 * Fetch one random card from the Shoob.gg API.
 * Returns null on failure so callers can fall back to local.
 */
export async function fetchSpawnCard(): Promise<{
    title:  string
    url:    string
    tier:   string
    series: string
    price:  number
} | null> {
    try {
        const res  = await fetch(CARD_API_URL, { signal: AbortSignal.timeout(8000) })
        if (!res.ok) return null
        const json = await res.json() as { status: boolean; result: ApiCardResult }
        if (!json.status || !json.result) return null

        const r     = json.result
        const tier  = normalizeTier(r.tier)
        const price = (typeof r.price === 'number' && r.price > 0)
            ? r.price
            : getCardPrice(tier)

        return {
            title:  r.title,
            url:    r.imageUrl,
            tier,
            series: r.series ?? '',
            price
        }
    } catch {
        return null
    }
}

// ─── In-memory sale / auction state (resets on bot restart) ────────────────
export interface SaleEntry {
    seller: string
    cardIdx: number
    price: number
    cardTitle: string
    cardTier: string
    shopId: number
}

export interface AuctionEntry {
    seller: string
    senderJid: string
    cardIdx: number
    startPrice: number
    currentBid: number
    highestBidder: string | null
    cardTitle: string
    cardTier: string
}

export const cardSales     = new Map<string, SaleEntry>()
export const cardAuctions  = new Map<string, AuctionEntry>()
