import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('swap', {
    description: 'Swap two Pokémon positions in your active party',
    category: 'pokemon',
    usage: 'swap <slot1> <slot2>',
    exp: 10,
    cooldown: 15
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const p = this.client.config.prefix
        const data = await this.client.DB.getUser(M.sender.jid)

        if (M.numbers.length < 2) {
            // No args — show party so they can pick slots
            if (data.party.length === 0)
                return void M.reply(`❌ No Pokémon in your party!`)

            let msg = `🔄 *Swap Party Pokémon*\n━━━━━━━━━━━━━━━━━━━━\n\n`
            data.party.forEach((pk, i) => {
                msg += `*${i + 1}.* ${this.client.utils.capitalize(pk.name)} — Lv. ${pk.level}\n`
            })
            msg += `\n💡 Usage: *${p}swap <slot1> <slot2>*\nExample: *${p}swap 1 3*`

            return void await this.client.sendMessage(M.from, {
                text: msg,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${p}pokegame` }]
            } as any, { quoted: M.message })
        }

        if (
            M.numbers[0] > data.party.length ||
            M.numbers[1] > data.party.length ||
            M.numbers[0] < 1 ||
            M.numbers[1] < 1
        ) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `❌ *Invalid slots!*\n\nYou have *${data.party.length}* Pokémon in your party.\n` +
                    `Pick slots between *1* and *${data.party.length}*.\n\nUse *${p}swap* to see your party.`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [
                    { text: '🔄 View Party', id: `${p}swap`     },
                    { text: '🎮 Pokémon Hub', id: `${p}pokegame` }
                ]
            } as any, { quoted: M.message })
        }

        const s1 = M.numbers[0]
        const s2 = M.numbers[1]
        const t = data.party[s1 - 1]
        data.party[s1 - 1] = data.party[s2 - 1]
        data.party[s2 - 1] = t

        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { party: data.party } })
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        return void await this.client.sendMessage(M.from, {
            text:
                `🔄 *Swapped!*\n\n` +
                `*Slot ${s1}* ↔ *Slot ${s2}*\n\n` +
                `🎐 *Slot ${s1}:* ${this.client.utils.capitalize(data.party[s1 - 1].name)} — Lv. ${data.party[s1 - 1].level}\n` +
                `🎐 *Slot ${s2}:* ${this.client.utils.capitalize(data.party[s2 - 1].name)} — Lv. ${data.party[s2 - 1].level}`,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Manage Party',
                    rows: [
                        { title: '🎒 My Party',        description: 'View updated party',          id: `${p}party`     },
                        { title: '✨ Evolve',           description: 'Evolve a Pokémon',            id: `${p}evolve`    },
                        { title: '🎮 Pokémon Hub',     description: 'Back to main menu',           id: `${p}pokegame`  }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message })
    }
}
