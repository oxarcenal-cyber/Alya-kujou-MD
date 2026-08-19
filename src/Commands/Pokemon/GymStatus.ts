import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('gymstatus', {
    description: 'Shows the currently active Gym Leader in this group, if any',
    usage: 'gymstatus',
    category: 'pokemon',
    cooldown: 5,
    exp: 0,
    aliases: ['gym']
})
export default class extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix

        if (M.chat !== 'group') return void M.reply('Gym challenges only happen in groups!')

        const gym = this.handler.gymChallenge.get(M.from)
        if (!gym || gym.expiresAt < Date.now()) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `🌫️ *No Gym Leader active right now.*\n\n` +
                    `Make sure *${prefix}wild on* is enabled.\n` +
                    `A Gym Leader appears roughly every 2–3 hours.\n\n` +
                    `Type *${prefix}challenge info* for full rules.`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${prefix}pokegame` }]
            } as any, { quoted: M.message })
        }

        const remainingMs = gym.expiresAt - Date.now()
        const minutes = Math.floor(remainingMs / 60000)
        const seconds = Math.floor((remainingMs % 60000) / 1000)

        return void await this.client.sendMessage(M.from, {
            text:
                `🏟️ *GYM LEADER ACTIVE!* 🏟️\n\n` +
                `${gym.type.emoji} *Type:* ${gym.type.type}\n` +
                `🐉 *Pokémon:* ${this.client.utils.capitalize(gym.name)}\n` +
                `🀄 *Level:* ${gym.level}\n` +
                `⏳ *Time left:* ${minutes}m ${seconds}s\n\n` +
                `⚔️ Use *${prefix}challenge* to battle it now!`,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Battle Options',
                    rows: [
                        { title: '⚔️ Challenge Gym',   description: 'Battle the active Gym Leader', id: `${prefix}challenge`  },
                        { title: '🎒 My Party',         description: 'Check your Pokémon party',     id: `${prefix}party`      },
                        { title: '⚔️ PVP Battle',       description: 'Challenge another trainer',    id: `${prefix}pvp`        },
                        { title: '🎮 Pokémon Hub',      description: 'Back to main menu',            id: `${prefix}pokegame`   }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message })
    }
}
