import { Pokemon } from '../Database'

export interface ITeamRocketRaid {
    victimJid: string
    victimName: string
    stolenPokemon: Pokemon & { rarity?: string }
    totalDamage: number
    requiredDamage: number
    fighters: Map<string, number>   // jid → damage dealt
    expiresAt: number
    rocketMember: IRocketMember
    spawnMsgKey: any | null
    timer: ReturnType<typeof setTimeout> | null
}

export interface IRocketMember {
    name: string
    emoji: string
    taunt: string
    retreat: string
}

export const ROCKET_MEMBERS: IRocketMember[] = [
    {
        name: 'Jessie',
        emoji: '💄',
        taunt: '"Prepare for trouble! Hand over that Pokémon, NOW!"',
        retreat: '"How dare you! We\'ll be back, twerps!"'
    },
    {
        name: 'James',
        emoji: '🌹',
        taunt: '"Make it double! Your Pokémon belongs to Team Rocket!"',
        retreat: '"Oh no! The boss is going to be furious with us..."'
    },
    {
        name: 'Giovanni',
        emoji: '😈',
        taunt: '"Surrender your Pokémon. Team Rocket takes what it wants."',
        retreat: '"Hmph. Consider this a warning. Team Rocket never forgets."'
    },
    {
        name: 'Butch & Cassidy',
        emoji: '🕶️',
        taunt: '"Prepare for trouble, and make it double — Cassidy style!"',
        retreat: '"This isn\'t over! We\'ll steal your whole party next time!"'
    }
]

export const getRocketMember = (): IRocketMember =>
    ROCKET_MEMBERS[Math.floor(Math.random() * ROCKET_MEMBERS.length)]

export const getRaidProgressBar = (current: number, total: number): string => {
    const pct = Math.min(current / total, 1)
    const filled = Math.round(pct * 10)
    const empty = 10 - filled
    return `[` + '▰'.repeat(filled) + '▱'.repeat(empty) + `] ${Math.round(pct * 100)}%`
}
