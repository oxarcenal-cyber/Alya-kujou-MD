import { Command, BaseCommand, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('pc', {
    description: 'View all Pokemon in your PC storage box',
    exp: 10,
    category: 'pokemon',
    cooldown: 10,
    usage: 'pc'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const { pc } = await this.client.DB.getUser(M.sender.jid)

        if (pc.length < 1) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `📦 *Your PC Box is empty!*\n\n` +
                    `Catch more wild Pokémon to fill it up.\n` +
                    `Use *${prefix}catch <name>* when they appear! 🎣`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${prefix}pokegame` }]
            } as any, { quoted: M.message })
        }

        let text = `📦 *${M.sender.username}'s PC Box*\n━━━━━━━━━━━━━━━━━━━━\n`
        pc.forEach((x, y) =>
            (text += `\n*#${y + 1}* — ${this.client.utils.capitalize(x.name)}\n` +
                     `　├ 🏮 Level: *${x.level}*\n` +
                     `　└ ⭐ Rarity: *${x.rarity || 'common'}*\n`)
        )
        text += `\n━━━━━━━━━━━━━━━━━━━━\n` +
                `🗃️ *Total stored:* ${pc.length} Pokémon\n` +
                `_Tip: Use \`${prefix}t2party <slot>\` to move one to your party._`

        return void await this.client.sendMessage(M.from, {
            text,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Manage PC',
                    rows: [
                        { title: '🎒 My Party',        description: 'View active party',           id: `${prefix}party`     },
                        { title: '↕️ Move to Party',   description: 'Transfer PC → Party',         id: `${prefix}t2party`   },
                        { title: '↕️ Move to PC',      description: 'Transfer Party → PC',         id: `${prefix}t2pc`      },
                        { title: '🎮 Pokémon Hub',     description: 'Back to main menu',           id: `${prefix}pokegame`  }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message })
    }
}
