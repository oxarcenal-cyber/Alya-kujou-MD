import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('badges', {
    description: 'Shows the Gym Badges you have collected',
    usage: 'badges',
    category: 'pokemon',
    cooldown: 10,
    exp: 0
})
export default class extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const { badges } = await this.client.DB.getUser(M.sender.jid)

        if (!badges.length) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `🌫️ *No Gym Badges yet!*\n\n` +
                    `Defeat a Gym Leader with *${prefix}challenge*\n` +
                    `and choose the badge reward to start your collection! 🏅`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Earn Badges',
                        rows: [
                            { title: '🏟️ Gym Status',     description: 'See if a Gym Leader is active',  id: `${prefix}gymstatus`   },
                            { title: '⚔️ Challenge Gym',   description: 'Battle the active Gym Leader',   id: `${prefix}challenge`   },
                            { title: '🎒 My Party',        description: 'Check your Pokémon team',        id: `${prefix}party`       },
                            { title: '🎮 Pokémon Hub',     description: 'Back to main menu',              id: `${prefix}pokegame`    }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message })
        }

        let text = `╭─────────────────╮\n   🎖️ *YOUR GYM BADGES* 🎖️\n╰─────────────────╯\n\n`
        badges.forEach((badge, i) => (text += `${i + 1}. 🏅 ${badge}\n`))
        text += `\n✨ *Total:* ${badges.length} badge${badges.length > 1 ? 's' : ''}`

        return void await this.client.sendMessage(M.from, {
            text,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Battle More',
                    rows: [
                        { title: '🏟️ Gym Status',     description: 'See active Gym Leader',          id: `${prefix}gymstatus`   },
                        { title: '⚔️ Challenge Gym',   description: 'Battle for more badges',         id: `${prefix}challenge`   },
                        { title: '🃏 Trainer Card',    description: 'View your full trainer profile', id: `${prefix}trainercard` },
                        { title: '🎮 Pokémon Hub',     description: 'Back to main menu',              id: `${prefix}pokegame`    }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message })
    }
}
