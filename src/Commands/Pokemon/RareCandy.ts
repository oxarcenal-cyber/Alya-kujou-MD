import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { replyWithPokemonImage } from '../../lib/PokemonImages'
import { AnyMessageContent } from '@adiwajshing/baileys'

const RARE_CANDY_COST = 500  // coins per use
const MAX_LEVEL       = 100

@Command('rarecandy', {
    description: '🍬 Use a Rare Candy to level up a Pokémon in your party (costs 500 coins)',
    usage: 'rarecandy <slot 1-6>',
    category: 'pokemon',
    cooldown: 5,
    exp: 10,
    aliases: ['candy', 'levelup']
})
export default class extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const user = await this.client.DB.getUser(M.sender.jid)
        const { party, wallet } = user
        const p     = this.client.config.prefix

        if (party.length === 0) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `❌ *No Pokémon in party!*\n\n` +
                    `Catch some wild Pokémon first — wait for\n` +
                    `them to spawn in groups! 🎣`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
            } as any, { quoted: M.message })
        }

        // No arg → show party
        if (!context?.trim()) {
            let msg = `🍬 *Rare Candy — Level Up a Pokémon*\n━━━━━━━━━━━━━━━━━━━━\n\n`
            party.forEach((pk, i) => {
                const atMax = pk.level >= MAX_LEVEL
                msg += `*${i + 1}.* ${this.client.utils.capitalize(pk.name)} — Lv. ${pk.level}${atMax ? ' *(MAX)*' : ''}\n`
            })
            msg += `\n💰 *Cost:* ${RARE_CANDY_COST} coins per use\n`
            msg += `👛 *Your wallet:* ${(wallet ?? 0).toLocaleString()} coins\n\n`
            msg += `💡 Usage: *${p}rarecandy <slot>*\nExample: *${p}rarecandy 1*`

            return void await this.client.sendMessage(M.from, {
                text: msg,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Train & Evolve',
                        rows: [
                            { title: '✨ Evolve',           description: 'Evolve a party Pokémon',         id: `${p}evolve`     },
                            { title: '🎒 My Party',         description: 'View active party',              id: `${p}party`      },
                            { title: '🎮 Pokémon Hub',      description: 'Back to main menu',              id: `${p}pokegame`   }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message })
        }

        const slot = parseInt(context.trim())
        if (isNaN(slot) || slot < 1 || slot > party.length)
            return void await this.client.sendMessage(M.from, {
                text: `❌ *Invalid slot!* Pick between *1* and *${party.length}*.\n\nUse *${p}rarecandy* to see your party.`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🍬 View Party', id: `${p}rarecandy`  },
                    { text: '🎮 Pokémon Hub', id: `${p}pokegame`  }
                ]
            } as any, { quoted: M.message })

        const pokemon = party[slot - 1]

        if (pokemon.level >= MAX_LEVEL)
            return void await this.client.sendMessage(M.from, {
                text: `⚠️ *${this.client.utils.capitalize(pokemon.name)}* is already at max level (*Lv. 100*)!`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '✨ Try Evolve',  id: `${p}evolve`    },
                    { text: '🎮 Pokémon Hub', id: `${p}pokegame`  }
                ]
            } as any, { quoted: M.message })

        if ((wallet ?? 0) < RARE_CANDY_COST) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `❌ *Not enough coins!*\n\n` +
                    `🍬 Rare Candy costs: *${RARE_CANDY_COST} coins*\n` +
                    `👛 Your wallet: *${(wallet ?? 0).toLocaleString()} coins*\n\n` +
                    `💡 Earn coins with *${p}daily*, *${p}gamble*, or by winning battles!`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
            } as any, { quoted: M.message })
        }

        // Deduct coins and level up
        await this.client.DB.setCrystal(M.sender.jid, -RARE_CANDY_COST)

        const newLevel     = pokemon.level + 1
        const updatedParty = [...party]
        updatedParty[slot - 1] = { ...pokemon, level: newLevel }

        await this.client.DB.user.updateOne(
            { jid: M.sender.jid },
            { $set: { party: updatedParty } }
        )
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        const isEvoHint = newLevel % 5 === 0  // hint every 5 levels

        const msg =
            `🍬 *RARE CANDY USED!*\n\n` +
            `*${this.client.utils.capitalize(pokemon.name)}* leveled up!\n\n` +
            `📊 *Level:* ${pokemon.level} → *${newLevel}*\n` +
            `💰 *Coins spent:* ${RARE_CANDY_COST}\n` +
            `👛 *Remaining:* ${((wallet ?? 0) - RARE_CANDY_COST).toLocaleString()} coins\n\n` +
            (isEvoHint
                ? `✨ *Tip:* Check if ${this.client.utils.capitalize(pokemon.name)} can evolve! Try *${p}evolve ${slot}*\n\n`
                : '') +
            `Keep training to become Champion! 🏆`

        await replyWithPokemonImage(M, 'win', msg)

        // Button after level-up
        return void await this.client.sendMessage(M.from, {
            text: `Keep leveling up to unlock evolutions! 💪`,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Next Steps',
                    rows: [
                        { title: '✨ Evolve',           description: `Check if ${this.client.utils.capitalize(pokemon.name)} can evolve`, id: `${p}evolve ${slot}` },
                        { title: '🍬 Rare Candy Again', description: 'Level up another Pokémon',               id: `${p}rarecandy`  },
                        { title: '🎒 My Party',         description: 'View updated party',                     id: `${p}party`      },
                        { title: '🎮 Pokémon Hub',      description: 'Back to main menu',                      id: `${p}pokegame`   }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent)
    }
}
