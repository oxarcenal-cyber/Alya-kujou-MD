import { Command, BaseCommand, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('party', {
    description: "Displays user's pokemon party",
    usage: 'party',
    category: 'pokemon',
    cooldown: 5,
    exp: 25
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const { party } = await this.client.DB.getUser(M.sender.jid)

        if (party.length < 1) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `❌ *No Pokémon in your party!*\n\n` +
                    `Wait for a wild Pokémon to appear in the group,\n` +
                    `then use *${prefix}catch <name>* to catch it! 🎣`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${prefix}pokegame` }]
            } as any, { quoted: M.message })
        }

        let text = `🎒 *${M.sender.username}'s Party*\n━━━━━━━━━━━━━━━━━━━━\n`
        party.forEach((x, y) =>
            (text += `\n🎐 *#${y + 1}* — ${this.client.utils.capitalize(x.name)}\n` +
                     `　├ 🏮 Level: *${x.level}*\n` +
                     `　└ ⭐ Rarity: *${x.rarity || 'common'}*\n`)
        )
        text += `\n━━━━━━━━━━━━━━━━━━━━\n` +
                `📦 *Slots used:* ${party.length}/6`

        return void await this.client.sendMessage(M.from, {
            text,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Manage Party',
                    rows: [
                        { title: '📦 PC Box',         description: 'View stored Pokémon',         id: `${prefix}pc`        },
                        { title: '🏥 Nurse Joy',       description: 'Heal party Pokémon',           id: `${prefix}nursejoy`  },
                        { title: '✨ Evolve',          description: 'Evolve a party Pokémon',      id: `${prefix}evolve`    },
                        { title: '🍬 Rare Candy',      description: 'Level up (500 coins)',        id: `${prefix}rarecandy` },
                        { title: '🔄 Swap',            description: 'Reorder your party slots',    id: `${prefix}swap`      },
                        { title: '🎮 Pokémon Hub',     description: 'Back to main menu',           id: `${prefix}pokegame`  }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message })
    }
}
