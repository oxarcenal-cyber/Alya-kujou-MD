import { BaseCommand, Command, Message } from '../../Structures'
import { Pokemon } from '../../Database'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('trade-confirm', {
    description: 'Confirm a pending Pokémon trade with another user',
    category: 'pokemon',
    usage: 'trade-confirm',
    cooldown: 15,
    aliases: []
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const p = this.client.config.prefix

        if (!this.handler.pokemonTradeResponse.has(M.from)) {
            return void await this.client.sendMessage(M.from, {
                text: `❌ *No active trade offer in this group!*\n\nStart one with *${p}trade <slot> <pokemon>*`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🎒 My Party',    id: `${p}party`    },
                    { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                ]
            } as any, { quoted: M.message })
        }

        const trade = this.handler.pokemonTradeResponse.get(M.from)

        if (trade?.creator === M.sender.jid) {
            return void M.reply(`😅 *You can't confirm your own trade offer!* Wait for someone else to accept it.`)
        }

        const { party } = await this.client.DB.getUser(M.sender.jid)
        const i         = party.findIndex((x) => x.name === (trade?.with as string))

        if (i < 0) {
            return void await this.client.sendMessage(M.from, {
                text: `❌ *You don't have ${this.client.utils.capitalize(trade?.with as string)} in your party!*\n\nThis trade requires that specific Pokémon.`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🎒 My Party',    id: `${p}party`    },
                    { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                ]
            } as any, { quoted: M.message })
        }

        const pkmn                      = trade?.offer as Pokemon
        const pokemon                   = party[i]
        const { party: creatorParty }   = await this.client.DB.getUser(trade?.creator as string)
        const index                     = creatorParty.findIndex((x) => x.name === pkmn.name && x.level === pkmn.level)
        party[i]                        = pkmn
        creatorParty[index]             = pokemon

        await this.client.DB.user.updateOne({ jid: trade?.creator as string }, { $set: { party: creatorParty } })
        await this.client.DB.user.updateOne({ jid: M.sender.jid },             { $set: { party } })
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)
        this.client.DB.cacheInvalidate(`user:${trade?.creator}`)
        this.handler.pokemonTradeResponse.delete(M.from)

        await this.client.sendMessage(M.from, {
            text:
                `🎉 *Trade Complete!*\n\n` +
                `🔄 *@${trade?.creator.split('@')[0]}* gave: *${this.client.utils.capitalize(pkmn.name)}*\n` +
                `🔄 *@${M.sender.jid.split('@')[0]}* gave: *${this.client.utils.capitalize(pokemon.name)}*`,
            mentions: [M.sender.jid, trade?.creator as string]
        }, { quoted: M.message as import('@adiwajshing/baileys').WAMessage })

        return void await this.client.sendMessage(M.from, {
            text: `Check your updated party! 🎒`,
            footer: '🎮 Pokémon Hub',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '🎒 My Party',    id: `${p}party`    },
                { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
            ]
        } as any)
    }
}
