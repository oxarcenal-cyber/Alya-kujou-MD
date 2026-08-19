import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('trade-delete', {
    category: 'pokemon',
    description: 'Cancel your pending Pokémon trade offer',
    usage: 'trade-delete',
    cooldown: 10,
    exp: 0,
    aliases: []
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const p = this.client.config.prefix

        if (!this.handler.pokemonTradeResponse.has(M.from)) {
            return void await this.client.sendMessage(M.from, {
                text: `❌ *No active trade to cancel!*`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
            } as any, { quoted: M.message })
        }

        const trade = this.handler.pokemonTradeResponse.get(M.from)

        if (trade?.creator !== M.sender.jid) {
            return void M.reply(`❌ *Only the trade creator can cancel it!*`)
        }

        this.handler.pokemonTradeResponse.delete(M.from)

        return void await this.client.sendMessage(M.from, {
            text: `🚫 *Trade offer cancelled!*`,
            footer: '🎮 Pokémon Hub',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '🎒 My Party',    id: `${p}party`    },
                { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
            ]
        } as any, { quoted: M.message })
    }
}
