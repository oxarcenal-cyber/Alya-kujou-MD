import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { AnyMessageContent } from '@adiwajshing/baileys'

type HealingStatus = 'Healthy' | 'Injured' | 'Fainted' | 'Paralyzed' | 'Poisoned' | 'Burned' | 'Asleep'

type PartyPokemon = {
    name?: string
    level?: number
    hp?: number
    maxHp?: number
    status?: HealingStatus | string
    [key: string]: unknown
}

const getPokemonName = (pokemon: PartyPokemon, index: number): string => {
    const rawName = pokemon.name ?? pokemon.pokemonName ?? pokemon.species
    return typeof rawName === 'string' && rawName.trim()
        ? rawName.trim()
        : `Pokémon ${index + 1}`
}

const getMaxHp = (pokemon: PartyPokemon): number =>
    Number.isFinite(pokemon.maxHp) && (pokemon.maxHp as number) > 0
        ? pokemon.maxHp as number
        : 100 + Math.max(1, pokemon.level || 1) * 5

const getHp = (pokemon: PartyPokemon): number => {
    const maxHp = getMaxHp(pokemon)
    return Number.isFinite(pokemon.hp)
        ? Math.max(0, Math.min(maxHp, pokemon.hp as number))
        : maxHp
}

const getStatus = (pokemon: PartyPokemon): HealingStatus | string =>
    pokemon.status || (getHp(pokemon) < getMaxHp(pokemon) ? 'Injured' : 'Healthy')

const isHealthy = (pokemon: PartyPokemon): boolean =>
    getHp(pokemon) >= getMaxHp(pokemon) && getStatus(pokemon) === 'Healthy'

@Command('nursejoy', {
    description: 'Visit Nurse Joy to check and heal your Pokémon party',
    usage: 'nursejoy [heal all|heal <slot>|cure all|cure <slot>]',
    category: 'pokemon',
    aliases: ['nurse', 'heal', 'pokemonheal'],
    cooldown: 5,
    exp: 10
})
export default class NurseJoyCommand extends BaseCommand {
    private menu = async (M: Message, party: PartyPokemon[], notice?: string): Promise<void> => {
        const prefix = this.client.config.prefix
        const injured = party.filter((pokemon) => !isHealthy(pokemon)).length
        const lines = party.length
            ? party.map((pokemon, index) => {
                const hp = getHp(pokemon)
                const maxHp = getMaxHp(pokemon)
                const status = getStatus(pokemon)
                const hpRatio = hp / maxHp
                const filled = Math.max(1, Math.min(8, Math.round(hpRatio * 8)))
                const hpBar = '▰'.repeat(filled) + '▱'.repeat(8 - filled)
                const statusIcon = status === 'Healthy' ? '✓' : status === 'Injured' ? '◇' : '!'
                return (
                    `${index + 1}. *${this.client.utils.capitalize(getPokemonName(pokemon, index))}*  ·  Lv.${pokemon.level || 1}\n` +
                    `   HP      ${hpBar}  ${hp}/${maxHp}\n` +
                    `   STATUS  ${statusIcon} ${status}`
                )
            }).join('\n')
            : '_Your party is empty. Catch or choose a Pokémon first._'

        const rows = party.flatMap((pokemon, index) => [
            {
                title: `💚 Heal ${this.client.utils.capitalize(getPokemonName(pokemon, index))}`,
                description: `Restore HP and remove all status effects`,
                id: `${prefix}nursejoy heal ${index + 1}`
            },
            ...(getStatus(pokemon) !== 'Healthy'
                ? [{
                    title: `✨ Cure ${this.client.utils.capitalize(getPokemonName(pokemon, index))}`,
                    description: `Remove ${getStatus(pokemon)}`,
                    id: `${prefix}nursejoy cure ${index + 1}`
                }]
                : [])
        ])

        const body =
            `🏥  *NURSE JOY*  ·  *POKÉMON CENTER*\n\n` +
            `✦ Welcome back, Trainer.\n` +
            `  Your team is safe with us.\n\n` +
            `▸ *YOUR PARTY*  ·  ${party.length}/6 SLOTS\n\n` +
            `${lines}\n\n` +
            `${notice ? `✦ *HEALING UPDATE*\n  ✓ ${notice}\n\n` : ''}` +
            `⚕  *${injured ? `${injured} Pokémon need attention` : 'Your whole team is healthy'}*\n\n` +
            `⌁ Tap *Open Healing Menu* to continue.`

        const buttons = [{
            text: '📋 Open Healing Menu',
            sections: [
                {
                    title: 'Team Healing',
                    rows: [
                        { title: '💚 Heal Complete Team', description: 'Restore HP and cure every status', id: `${prefix}nursejoy heal all` },
                        { title: '✨ Cure All Status Effects', description: 'Remove poison, paralysis, burn and sleep', id: `${prefix}nursejoy cure all` },
                        { title: '📊 Check Team Health', description: 'Refresh your party health report', id: `${prefix}nursejoy status` }
                    ]
                },
                ...(rows.length
                    ? [{ title: 'Individual Care', rows }]
                    : []),
                {
                    title: 'Pokémon Center',
                    rows: [
                        { title: '🎒 My Party', description: 'View your active team', id: `${prefix}party` },
                        { title: '🎮 Pokémon Hub', description: 'Return to the main Pokémon menu', id: `${prefix}pokegame` }
                    ]
                }
            ]
        }]

        const video = this.client.assets.get('nursejoy-background') as Buffer | undefined
        const message = video
            ? {
                video,
                caption: body,
                gifPlayback: true,
                mimetype: 'video/mp4',
                footer: '🏥 Nurse Joy · Pokémon Center',
                buttons
            }
            : {
                text: body,
                footer: '🏥 Nurse Joy · Pokémon Center',
                buttons
            }

        return void await this.client.sendMessage(
            M.from,
            message as unknown as AnyMessageContent,
            { quoted: M.message } as any
        )
    }

    private saveParty = async (M: Message, party: PartyPokemon[]): Promise<void> => {
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { party } })
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)
    }

    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const user = await this.client.DB.getUser(M.sender.jid)
        const party = (Array.isArray(user.party) ? user.party : []) as unknown as PartyPokemon[]
        const args = (context || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
        const action = args[0] || 'status'
        const target = args[1] || ''

        if (!party.length) {
            const prefix = this.client.config.prefix
            const caption =
                `🏥 *Nurse Joy is ready to help!*\n\n` +
                `You do not have any Pokémon in your party yet.\n` +
                `Use *${prefix}choosestarter* or catch a wild Pokémon first.`
            const video = this.client.assets.get('nursejoy-background') as Buffer | undefined
            const message = video
                ? {
                    video,
                    caption,
                    gifPlayback: true,
                    mimetype: 'video/mp4',
                    footer: '🏥 Nurse Joy · Pokémon Center',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${prefix}pokegame` }]
                }
                : {
                    text: caption,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${prefix}pokegame` }]
                }

            return void await this.client.sendMessage(
                M.from,
                message as unknown as AnyMessageContent,
                { quoted: M.message } as any
            )
        }

        if (action === 'status' || action === 'menu' || action === 'check')
            return await this.menu(M, party)

        const heal = action === 'heal' || action === 'restore'
        const cure = action === 'cure' || action === 'statuscure'
        if (!heal && !cure)
            return await this.menu(M, party, `Try *${this.client.config.prefix}nursejoy heal all* to restore your complete team.`)

        const all = target === 'all' || target === 'team' || !target
        const slot = all ? -1 : Number.parseInt(target, 10) - 1
        if (!all && (!Number.isInteger(slot) || slot < 0 || slot >= party.length))
            return await this.menu(M, party, `Choose a valid party slot from 1 to ${party.length}.`)

        const updated = party.map((pokemon, index) => {
            if (!all && index !== slot) return pokemon
            const maxHp = getMaxHp(pokemon)
            return {
                ...pokemon,
                maxHp,
                ...(heal ? { hp: maxHp } : {}),
                ...(heal || cure ? { status: 'Healthy' } : {})
            }
        })

        await this.saveParty(M, updated)
        const selectedNames = all
            ? 'Your complete party'
            : this.client.utils.capitalize(getPokemonName(party[slot], slot))
        const result = heal
            ? `${selectedNames} has been fully healed and is ready for battle!`
            : `${selectedNames} is free from all status effects!`

        return await this.menu(M, updated, result)
    }
}