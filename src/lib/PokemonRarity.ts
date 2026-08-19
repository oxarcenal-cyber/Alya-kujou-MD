import { IPokemonAPIResponse } from '../Types'

export type Rarity = 'common' | 'rare' | 'legendary'

export interface IRarityMeta {
    emoji: string
    label: string
    catchChance: number
}

export const RARITY_META: Record<Rarity, IRarityMeta> = {
    common: { emoji: '🟢', label: 'Common', catchChance: 1 },
    rare: { emoji: '🔵', label: 'Rare', catchChance: 0.75 },
    legendary: { emoji: '🟡', label: 'Legendary', catchChance: 0.4 }
}

const LEGENDARY_IDS = new Set<number>([
    144, 145, 146, 150, 151,
    243, 244, 245, 249, 250, 251,
    377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
    480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
    638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
    716, 717, 718, 719, 720, 721,
    772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 807, 808, 809,
    888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898
])

export const getRarity = (data: IPokemonAPIResponse): Rarity => {
    if (LEGENDARY_IDS.has(data.id)) return 'legendary'
    const total = data.stats.reduce((sum, s) => sum + s.base_stat, 0)
    if (total >= 500) return 'rare'
    return 'common'
}
