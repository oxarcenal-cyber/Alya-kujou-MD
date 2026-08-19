/**
 * PokemonEvolution — PokeAPI se evolution chain fetch karo aur check karo
 */

interface EvolutionDetail {
    min_level: number | null
    trigger: { name: string }
    item: { name: string } | null
}

interface EvolutionChainNode {
    species: { name: string; url: string }
    evolution_details: EvolutionDetail[]
    evolves_to: EvolutionChainNode[]
}

interface EvolutionChainResponse {
    chain: EvolutionChainNode
}

export interface EvolutionResult {
    canEvolve: boolean
    evolvedName?: string
    evolvedId?: number
    evolvedImage?: string
    minLevel?: number
    trigger?: string
    reason?: string
}

/** Recursively flatten chain into from→to pairs */
function flattenChain(
    node: EvolutionChainNode,
    pairs: Array<{ from: string; to: string; minLevel: number | null; trigger: string }> = []
): Array<{ from: string; to: string; minLevel: number | null; trigger: string }> {
    for (const next of node.evolves_to) {
        const detail = next.evolution_details[0]
        pairs.push({
            from: node.species.name,
            to:   next.species.name,
            minLevel: detail?.min_level ?? null,
            trigger:  detail?.trigger?.name ?? 'level-up'
        })
        flattenChain(next, pairs)
    }
    return pairs
}

/**
 * Check if a Pokemon can evolve given its current level.
 * Uses PokeAPI species → evolution-chain endpoints.
 */
export async function checkEvolution(
    pokemonName: string,
    currentLevel: number
): Promise<EvolutionResult> {
    try {
        // Step 1: species endpoint → evolution chain URL
        const speciesRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`
        )
        if (!speciesRes.ok) return { canEvolve: false, reason: 'Pokémon not found in database.' }
        const species = await speciesRes.json() as any

        const chainUrl: string | undefined = species.evolution_chain?.url
        if (!chainUrl) return { canEvolve: false, reason: 'No evolution chain found.' }

        // Step 2: fetch evolution chain
        const chainRes = await fetch(chainUrl)
        if (!chainRes.ok) return { canEvolve: false, reason: 'Could not fetch evolution data.' }
        const chainData = await chainRes.json() as EvolutionChainResponse

        // Step 3: find this pokemon's next evolution
        const pairs = flattenChain(chainData.chain)
        const evolution = pairs.find(p => p.from === pokemonName.toLowerCase())

        if (!evolution) return { canEvolve: false, reason: 'This Pokémon has reached its final evolution.' }

        // For trade/stone evolutions — treat as level 36 if no min_level
        const minLevel = evolution.minLevel ?? 36
        const trigger  = evolution.trigger ?? 'level-up'

        if (trigger !== 'level-up' && !evolution.minLevel) {
            // Allow at level 36+ for simplicity (trade/stone → level requirement substitute)
            if (currentLevel < 36)
                return {
                    canEvolve: false,
                    reason: `Normally evolves via *${trigger.replace(/-/g, ' ')}*. In this bot, needs Lv. 36+. (Current: Lv. ${currentLevel})`
                }
        } else if (currentLevel < minLevel) {
            return {
                canEvolve: false,
                reason: `Needs to be at least Lv. *${minLevel}* to evolve. (Current: Lv. ${currentLevel})`
            }
        }

        // Step 4: fetch evolved form data
        const evoRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolution.to}`)
        if (!evoRes.ok) return { canEvolve: false, reason: 'Could not fetch evolved form data.' }
        const evoData = await evoRes.json() as any

        const evolvedImage: string =
            evoData.sprites?.other?.['official-artwork']?.front_default ??
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoData.id}.png`

        return {
            canEvolve:   true,
            evolvedName: evolution.to,
            evolvedId:   evoData.id as number,
            evolvedImage,
            minLevel,
            trigger
        }
    } catch {
        return { canEvolve: false, reason: 'Error connecting to Pokémon database. Try again later.' }
    }
}
