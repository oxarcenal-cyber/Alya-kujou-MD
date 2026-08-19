import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs, IPokemonAPIResponse } from '../../Types'
import { buildPokemonCard, derivePokemonCardData, RawPokeData } from '../../lib/PokemonCardGen'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('pokecard', {
    description: 'Generate a premium Pokemon TCG-style card for any Pokémon',
    usage: 'pokecard <name|id> [ex]',
    category: 'pokemon',
    cooldown: 20,
    exp: 15,
    aliases: ['pkcard', 'tcgcard', 'pcard']
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const p      = this.client.config.prefix
        const parts  = (context ?? '').trim().toLowerCase().split(/\s+/)
        const query  = parts[0]
        const isEx   = parts.includes('ex')

        if (!query) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `🃏 *Pokemon Card Generator*\n\n` +
                    `Usage: *${p}pokecard <name or id> [ex]*\n\n` +
                    `Examples:\n` +
                    `▸ \`${p}pokecard pikachu\`\n` +
                    `▸ \`${p}pokecard charizard ex\`\n` +
                    `▸ \`${p}pokecard 25\`\n\n` +
                    `_Add \`ex\` at the end to generate an EX card with boosted HP!_`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
            } as any, { quoted: M.message })
        }

        await M.reply(`✨ Generating your *${isEx ? 'EX ' : ''}Pokémon card*... Please wait!`)

        const raw = await this.client.utils.fetch<IPokemonAPIResponse>(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`
        )

        if (!raw || !raw.name) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `❌ *"${query}"* not found!\n\n` +
                    `Make sure the Pokémon name is spelled correctly.\n` +
                    `Example: \`${p}pokecard mewtwo\``,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
            } as any, { quoted: M.message })
        }

        const cardData = derivePokemonCardData(raw as unknown as RawPokeData, isEx)
        const buffer   = await buildPokemonCard(cardData)

        const typeEmoji: Record<string, string> = {
            fire:'🔥', water:'💧', electric:'⚡', grass:'🌿', psychic:'🔮',
            fighting:'🥊', poison:'☠️', ground:'🌍', rock:'🪨', ice:'❄️',
            bug:'🐛', ghost:'👻', dragon:'🐉', dark:'🌑', steel:'⚙️',
            fairy:'✨', flying:'🌪️', normal:'⭐'
        }
        const typeIcon = typeEmoji[cardData.type] ?? '⭐'

        const caption =
            `${isEx ? '💎 *EX CARD* 💎' : '🃏 *Pokemon TCG Card*'}\n\n` +
            `🐾 *${cardData.displayName}${isEx ? ' ex' : ''}*\n` +
            `${typeIcon} *Type:* ${cardData.type.charAt(0).toUpperCase() + cardData.type.slice(1)}\n` +
            `❤️ *HP:* ${cardData.hp}\n` +
            `⚔️ *${cardData.attack1.name}:* ${cardData.attack1.damage} dmg\n` +
            `📌 *#${String(cardData.pokedexNum).padStart(3, '0')} / 898*`

        await M.reply(buffer, 'image', false, 'image/jpeg', caption)

        return void await this.client.sendMessage(M.from, {
            text: `_Add \`ex\` for an EX version: \`${p}pokecard ${query} ex\`_`,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'More Actions',
                    rows: [
                        { title: '🃏 Another Card',    description: 'Generate another Pokémon card',    id: `${p}pokecard`     },
                        { title: '📖 Pokédex',         description: 'View Pokédex entry',               id: `${p}pokedex ${query}` },
                        { title: '🎒 My Party',        description: 'View your Pokémon team',           id: `${p}party`        },
                        { title: '🎮 Pokémon Hub',     description: 'Back to main menu',                id: `${p}pokegame`     }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent)
    }
}
