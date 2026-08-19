import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('t2pc', {
    category: 'pokemon',
    description: 'Transfer a Pokémon from your active party to PC storage',
    usage: 't2pc <party_slot>',
    cooldown: 15,
    exp: 35
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const p             = this.client.config.prefix
        const { pc, party } = await this.client.DB.getUser(M.sender.jid)

        if (party.length < 1) {
            return void await this.client.sendMessage(M.from, {
                text: `❌ *Your party is empty!*\n\nCatch some Pokémon first. 🎣`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
            } as any, { quoted: M.message })
        }

        if (M.numbers.length < 2) {
            // Show party so they can pick
            let msg = `↕️ *Transfer Party → PC*\n━━━━━━━━━━━━━━━━━━━━\n\n`
            party.forEach((x, i) => {
                msg += `*${i + 1}.* ${this.client.utils.capitalize(x.name)} — Lv. ${x.level} ⭐ ${x.rarity || 'common'}\n`
            })
            msg += `\n💡 Usage: *${p}t2pc <party_slot>*\nExample: *${p}t2pc 1 3* (party slot 3)`

            return void await this.client.sendMessage(M.from, {
                text: msg,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🎒 My Party',    id: `${p}party`    },
                    { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                ]
            } as any, { quoted: M.message })
        }

        const i = M.numbers[1]
        if (i < 1 || i > party.length) {
            return void M.reply(
                `❌ *Invalid slot!* Your party has *${party.length}* Pokémon.\n\nPick a slot between *1* and *${party.length}*.`
            )
        }

        const pokemon = party[i - 1]
        pc.push(pokemon)
        party.splice(i - 1, 1)
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { pc, party } })
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        return void await this.client.sendMessage(M.from, {
            text:
                `✅ *${this.client.utils.capitalize(pokemon.name)}* transferred to your PC!\n\n` +
                `🎒 *Party:* ${party.length}/6  |  📦 *PC:* ${pc.length} Pokémon`,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Manage Pokémon',
                    rows: [
                        { title: '🎒 My Party',        description: 'View updated party',            id: `${p}party`    },
                        { title: '📦 My PC Box',       description: 'View updated PC box',           id: `${p}pc`       },
                        { title: '↕️ Move to Party',   description: 'Transfer PC → Party',           id: `${p}t2party`  },
                        { title: '🎮 Pokémon Hub',     description: 'Back to main menu',             id: `${p}pokegame` }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message })
    }
}
