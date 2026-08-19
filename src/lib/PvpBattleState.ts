/**
 * PvpBattleState.ts
 * Types, formulas, and move-fetching for the turn-based PvP battle system.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BattleMove {
    name:  string   // e.g. "Fire Blast"
    power: number   // base damage, e.g. 110
    type:  string   // e.g. "fire"
    emoji: string   // e.g. "🔥"
}

export interface BattlePlayer {
    jid:          string
    username:     string
    pokemonName:  string
    pokemonLevel: number
    hp:           number
    maxHp:        number
    moves:        [BattleMove, BattleMove]   // exactly 2 attack moves
    isDefending:  boolean
}

export interface PvpBattle {
    battleId:    string
    groupJid:    string
    p1Jid:       string   // challenger — goes first
    p2Jid:       string   // defender
    players:     Map<string, BattlePlayer>
    currentTurn: string   // JID of whose turn it is
    turnTimer:   ReturnType<typeof setTimeout> | null
}

// ── Type emoji map ────────────────────────────────────────────────────────────

export const TYPE_EMOJI: Record<string, string> = {
    fire:     '🔥', water:    '💧', grass:    '🌿', electric: '⚡',
    psychic:  '🔮', ice:      '❄️', dragon:   '🐉', dark:     '🌑',
    fighting: '👊', poison:   '☠️', ground:   '🌍', rock:     '🪨',
    bug:      '🐛', ghost:    '👻', steel:    '⚙️', fairy:    '🌸',
    normal:   '⭐', flying:   '🌪️',
}

// ── Fallback moves per primary type (used when PokéAPI is unreachable) ────────

const FALLBACK: Record<string, [BattleMove, BattleMove]> = {
    fire:     [{ name: 'Fire Blast',     power: 110, type: 'fire',     emoji: '🔥' }, { name: 'Ember',          power: 40,  type: 'fire',     emoji: '🔥' }],
    water:    [{ name: 'Hydro Pump',     power: 110, type: 'water',    emoji: '💧' }, { name: 'Water Gun',      power: 40,  type: 'water',    emoji: '💧' }],
    grass:    [{ name: 'Solar Beam',     power: 120, type: 'grass',    emoji: '🌿' }, { name: 'Razor Leaf',     power: 55,  type: 'grass',    emoji: '🌿' }],
    electric: [{ name: 'Thunder',        power: 110, type: 'electric', emoji: '⚡' }, { name: 'Thunderbolt',    power: 90,  type: 'electric', emoji: '⚡' }],
    psychic:  [{ name: 'Psychic',        power: 90,  type: 'psychic',  emoji: '🔮' }, { name: 'Confusion',      power: 50,  type: 'psychic',  emoji: '🔮' }],
    ice:      [{ name: 'Blizzard',       power: 110, type: 'ice',      emoji: '❄️' }, { name: 'Ice Beam',       power: 90,  type: 'ice',      emoji: '❄️' }],
    dragon:   [{ name: 'Draco Meteor',   power: 130, type: 'dragon',   emoji: '🐉' }, { name: 'Dragon Pulse',   power: 85,  type: 'dragon',   emoji: '🐉' }],
    dark:     [{ name: 'Dark Pulse',     power: 80,  type: 'dark',     emoji: '🌑' }, { name: 'Bite',           power: 60,  type: 'dark',     emoji: '🌑' }],
    fighting: [{ name: 'Close Combat',   power: 120, type: 'fighting', emoji: '👊' }, { name: 'Karate Chop',    power: 50,  type: 'fighting', emoji: '👊' }],
    poison:   [{ name: 'Sludge Bomb',    power: 90,  type: 'poison',   emoji: '☠️' }, { name: 'Poison Sting',   power: 15,  type: 'poison',   emoji: '☠️' }],
    ground:   [{ name: 'Earthquake',     power: 100, type: 'ground',   emoji: '🌍' }, { name: 'Dig',            power: 80,  type: 'ground',   emoji: '🌍' }],
    rock:     [{ name: 'Rock Slide',     power: 75,  type: 'rock',     emoji: '🪨' }, { name: 'Rock Throw',     power: 50,  type: 'rock',     emoji: '🪨' }],
    ghost:    [{ name: 'Shadow Ball',    power: 80,  type: 'ghost',    emoji: '👻' }, { name: 'Hex',            power: 65,  type: 'ghost',    emoji: '👻' }],
    steel:    [{ name: 'Iron Head',      power: 80,  type: 'steel',    emoji: '⚙️' }, { name: 'Metal Claw',     power: 50,  type: 'steel',    emoji: '⚙️' }],
    fairy:    [{ name: 'Moonblast',      power: 95,  type: 'fairy',    emoji: '🌸' }, { name: 'Dazzling Gleam', power: 80,  type: 'fairy',    emoji: '🌸' }],
    flying:   [{ name: 'Hurricane',      power: 110, type: 'flying',   emoji: '🌪️' }, { name: 'Air Slash',      power: 75,  type: 'flying',   emoji: '🌪️' }],
    normal:   [{ name: 'Hyper Beam',     power: 150, type: 'normal',   emoji: '⭐' }, { name: 'Tackle',         power: 40,  type: 'normal',   emoji: '⭐' }],
    bug:      [{ name: 'Bug Buzz',       power: 90,  type: 'bug',      emoji: '🐛' }, { name: 'X-Scissor',      power: 80,  type: 'bug',      emoji: '🐛' }],
}
const DEFAULT_FALLBACK: [BattleMove, BattleMove] = FALLBACK['normal']

// ── HP tiers (Level-based) ────────────────────────────────────────────────────
// Lv 1-5 → 100 | Lv 6-10 → 150 | Lv 11-20 → 200 | Lv 21-30 → 250 | Lv 31-40 → 300 | Lv 41+ → 350

export function getBattleHp(level: number): number {
    if (level <= 5)  return 100
    if (level <= 10) return 150
    if (level <= 20) return 200
    if (level <= 30) return 250
    if (level <= 40) return 300
    return 350
}

// ── Damage formula ────────────────────────────────────────────────────────────
// base_dmg × level_modifier × RNG, halved if defender used Defend last turn

export function calcDamage(
    move: BattleMove,
    attackerLevel: number,
    defenderIsDefending: boolean
): number {
    const levelMod = 0.4 + (attackerLevel / 50)     // Lv 5 → 0.5×  |  Lv 30 → 1.0×  |  Lv 50 → 1.4×
    const rng      = 0.85 + Math.random() * 0.30    // 0.85 – 1.15
    let dmg = Math.round(move.power * levelMod * rng)
    if (defenderIsDefending) dmg = Math.round(dmg * 0.5)
    return Math.max(5, dmg)
}

// ── Visual HP bar ─────────────────────────────────────────────────────────────

export function hpBar(hp: number, maxHp: number): string {
    const safeHp = Math.max(0, hp)
    const pct    = safeHp / maxHp
    const fill   = Math.round(pct * 10)
    const bar    = '█'.repeat(fill) + '░'.repeat(10 - fill)
    const dot    = pct > 0.5 ? '🟢' : pct > 0.25 ? '🟡' : '🔴'
    return `${dot} [${bar}] ${safeHp}/${maxHp} HP`
}

// ── Fetch 2 attack moves from PokéAPI ─────────────────────────────────────────
// Strategy:
//   1. GET /pokemon/{name} → primary type + first 10 move names
//   2. GET /move/{name} × parallel → filter power > 0, sort desc, take top 2
//   3. Fallback to type-based curated list on any failure

export async function fetchMovesForPokemon(pokemonName: string): Promise<[BattleMove, BattleMove]> {
    const name = pokemonName.toLowerCase()

    try {
        const pokeRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${name}`,
            { signal: AbortSignal.timeout(6000) }
        )
        if (!pokeRes.ok) throw new Error('pokemon not found')
        const pokeData = await pokeRes.json() as any

        const primaryType: string = pokeData.types?.[0]?.type?.name || 'normal'
        const fallback = FALLBACK[primaryType] ?? DEFAULT_FALLBACK

        // Candidate move names from the first 12 entries
        const candidates: string[] = (pokeData.moves as any[])
            ?.slice(0, 12)
            .map((m: any) => (m.move.name as string)) ?? []

        if (!candidates.length) return fallback

        // Fetch all candidates in parallel
        const results = await Promise.allSettled(
            candidates.map((moveName) =>
                fetch(
                    `https://pokeapi.co/api/v2/move/${moveName}`,
                    { signal: AbortSignal.timeout(5000) }
                )
                    .then((r) => r.json())
                    .then((m: any) => {
                        const t: string = m.type?.name || 'normal'
                        const displayName = (m.name as string)
                            .split('-')
                            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ')
                        return {
                            name:  displayName,
                            power: (m.power as number | null) ?? 0,
                            type:  t,
                            emoji: TYPE_EMOJI[t] ?? '⭐',
                        } as BattleMove
                    })
            )
        )

        const attackMoves = results
            .filter((r): r is PromiseFulfilledResult<BattleMove> =>
                r.status === 'fulfilled' && r.value.power > 0
            )
            .map((r) => r.value)
            .sort((a, b) => b.power - a.power)
            .slice(0, 2)

        if (attackMoves.length < 2) return fallback
        return [attackMoves[0], attackMoves[1]]

    } catch {
        // Light fallback: try to get just the type, then use curated list
        try {
            const r = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${name}`,
                { signal: AbortSignal.timeout(3000) }
            )
            const d = await r.json() as any
            const t: string = d.types?.[0]?.type?.name || 'normal'
            return FALLBACK[t] ?? DEFAULT_FALLBACK
        } catch {
            return DEFAULT_FALLBACK
        }
    }
}
