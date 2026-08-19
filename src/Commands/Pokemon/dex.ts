import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs, IPokemonAPIResponse } from '../../Types'
import { buildDexOverviewCard, buildDexDetailCard, DexPokemon } from '../../lib/PixelDexGen'
import { AnyMessageContent } from '@adiwajshing/baileys'

interface PokeSpecies {
    flavor_text_entries: { flavor_text: string; language: { name: string } }[]
}

@Command('pokedex', {
    description: 'View your Pokédex in retro pixel art style',
    aliases: ['dex'],
    exp: 20,
    cooldown: 15,
    usage: 'pokedex [pokemon_name|id]',
    category: 'pokemon'
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const p     = this.client.config.prefix
        const query = (context ?? '').trim().toLowerCase()

        // ── DETAIL mode ─────────────────────────────────────────────────────────
        if (query) {
            const { party, pc } = await this.client.DB.getUser(M.sender.jid)
            const allOwned      = [...party, ...pc]

            await M.reply(`🔍 *Scanning Pokédex for* _${query}_...`)

            const raw = await this.client.utils.fetch<IPokemonAPIResponse>(
                `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`
            )
            if (!raw?.name) {
                return void await this.client.sendMessage(M.from, {
                    text: `❌ *"${query}"* not found! Make sure the name is spelled correctly.`,
                    footer: '🎮 Pokémon Hub',
                    buttonsFormat: 'buttons',
                    buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
                } as any, { quoted: M.message })
            }

            const speciesRes = await this.client.utils.fetch<PokeSpecies>(
                `https://pokeapi.co/api/v2/pokemon-species/${raw.id}`
            ).catch(() => null)

            const description = speciesRes?.flavor_text_entries
                ?.find(e => e.language.name === 'en')
                ?.flavor_text
                ?.replace(/\f|\n/g, ' ')
                ?.slice(0, 180) ?? ''

            const ownedEntry = allOwned.find(p => p.name.toLowerCase() === raw.name.toLowerCase())
            const getStat    = (name: string) => raw.stats.find(s => s.stat.name === name)?.base_stat ?? 0

            const buffer = await buildDexDetailCard({
                id:      raw.id,
                name:    raw.name,
                level:   ownedEntry?.level,
                rarity:  ownedEntry?.rarity,
                types:   raw.types.map(t => t.type.name),
                height:  raw.height,
                weight:  raw.weight,
                stats: {
                    hp:      getStat('hp'),
                    attack:  getStat('attack'),
                    defense: getStat('defense'),
                    spAtk:   getStat('special-attack'),
                    spDef:   getStat('special-defense'),
                    speed:   getStat('speed'),
                },
                description,
                isOwned: !!ownedEntry,
            })

            const typeEmoji: Record<string, string> = {
                fire:'🔥', water:'💧', electric:'⚡', grass:'🌿', psychic:'🔮',
                fighting:'🥊', poison:'☠️', ground:'🌍', rock:'🪨', ice:'❄️',
                bug:'🐛', ghost:'👻', dragon:'🐉', dark:'🌑', steel:'⚙️',
                fairy:'✨', flying:'🌪️', normal:'⭐'
            }
            const types  = raw.types.map(t => `${typeEmoji[t.type.name] ?? '❓'} ${this.client.utils.capitalize(t.type.name)}`).join('  ')
            const owned  = ownedEntry ? `\n✅ *Owned!* Lv.${ownedEntry.level} · ${ownedEntry.rarity}` : `\n🔒 Not caught yet`

            const caption =
                `🎮 *POKÉDEX — ${this.client.utils.capitalize(raw.name).toUpperCase()}*\n\n` +
                `📛 *#${String(raw.id).padStart(3, '0')}*  ·  ${types}\n` +
                `📏 *Height:* ${(raw.height / 10).toFixed(1)}m  ·  *Weight:* ${(raw.weight / 10).toFixed(1)}kg` +
                owned

            await M.reply(buffer, 'image', false, 'image/jpeg', caption)

            return void await this.client.sendMessage(M.from, {
                text: `_Generate a TCG card: \`${p}pokecard ${query}\`_`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'More for this Pokémon',
                        rows: [
                            { title: '🃏 TCG Card',         description: `Generate ${this.client.utils.capitalize(raw.name)} card`,  id: `${p}pokecard ${query}`  },
                            { title: '🎒 My Party',         description: 'View your Pokémon team',                                   id: `${p}party`              },
                            { title: '📦 My PC Box',        description: 'View stored Pokémon',                                      id: `${p}pc`                 },
                            { title: '🎮 Pokémon Hub',      description: 'Back to main menu',                                        id: `${p}pokegame`           }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent)
        }

        // ── OVERVIEW mode ────────────────────────────────────────────────────────
        const { party, pc, tag, username } = await this.client.DB.getUser(M.sender.jid)
        const allPokes = [...party, ...pc]

        if (allPokes.length < 1) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `📱 *Pokédex is empty!*\n\n` +
                    `You haven't caught any Pokémon yet.\n` +
                    `Enable *${p}wild on* and use *${p}catch <name>* to start! 🎣`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
            } as any, { quoted: M.message })
        }

        await M.reply(`📱 *Pokédex loading...* ${allPokes.length} Pokémon`)

        const partyDex: DexPokemon[] = party.map(p => ({ name: p.name, id: p.id, level: p.level, rarity: p.rarity }))
        const pcDex:    DexPokemon[] = pc.map(p =>    ({ name: p.name, id: p.id, level: p.level, rarity: p.rarity }))

        const displayName = (username as any)?.name ?? M.sender.username ?? 'Trainer'

        const buffer = await buildDexOverviewCard({
            username: displayName,
            tag:      tag ?? '????',
            party:    partyDex,
            pc:       pcDex,
        })

        const partyNames = party.map(p => `*${this.client.utils.capitalize(p.name)}* Lv.${p.level}`).join('  ·  ')
        const caption =
            `📱 *CELESTIC POKÉDEX*\n\n` +
            `👤 *${displayName}*  #${tag}\n` +
            `🎯 *Party (${party.length}/6):* ${partyNames || 'Empty'}\n` +
            `💾 *PC Box:* ${pc.length} Pokémon\n` +
            `📊 *Total:* ${allPokes.length} Pokémon\n\n` +
            `_Detail: \`${p}pokedex <name>\`_`

        await M.reply(buffer, 'image', false, 'image/jpeg', caption)

        return void await this.client.sendMessage(M.from, {
            text: `Tap a Pokémon name for full stats! 👇`,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Manage Your Pokémon',
                    rows: [
                        { title: '🎒 My Party',        description: 'View active party',               id: `${p}party`     },
                        { title: '📦 My PC Box',       description: 'View stored Pokémon',             id: `${p}pc`        },
                        { title: '✨ Evolve',           description: 'Evolve a Pokémon',               id: `${p}evolve`    },
                        { title: '🎮 Pokémon Hub',     description: 'Back to main menu',               id: `${p}pokegame`  }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent)
    }
}
