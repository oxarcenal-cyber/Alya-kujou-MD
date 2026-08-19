import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('trainername', {
    description: '✏️ Set your trainer name shown on your Trainer\'s Card',
    category: 'pokemon',
    usage: 'trainername <name>',
    cooldown: 30,
    exp: 5,
    aliases: ['setname', 'tname']
})
export default class extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const p = this.client.config.prefix

        if (!context?.trim()) {
            const user    = await this.client.DB.getUser(M.sender.jid)
            const current = (user as any).trainerName || '(not set)'

            return void await this.client.sendMessage(M.from, {
                text:
                    `✏️ *Trainer Name*\n\n` +
                    `Current: *${current}*\n\n` +
                    `To change it: *${p}trainername <your name>*\n` +
                    `Example: *${p}trainername Ash*\n\n` +
                    `📝 Max 16 characters, letters & numbers only.`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Trainer Setup',
                        rows: [
                            { title: '🃏 Trainer Card',    description: 'View your current card',         id: `${p}trainercard`    },
                            { title: '👤 Select Trainer',  description: 'Change trainer character',       id: `${p}selecttrainer`  },
                            { title: '🌍 Set Region',      description: 'Change your region',             id: `${p}setregion`      },
                            { title: '🎮 Pokémon Hub',     description: 'Back to main menu',              id: `${p}pokegame`       }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message })
        }

        const raw  = context.trim()
        const name = raw.replace(/[^a-zA-Z0-9 _\-]/g, '').trim().slice(0, 16)

        if (!name) {
            return void M.reply(
                `❌ *Invalid name!* Use only letters, numbers, spaces, underscores, or hyphens. Max 16 characters.`
            )
        }

        await this.client.DB.user.updateOne(
            { jid: M.sender.jid },
            { $set: { trainerName: name, journeyStarted: true } }
        )
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        return void await this.client.sendMessage(M.from, {
            text:
                `✅ *Trainer name set to: ${name}*\n\n` +
                `🃏 View your updated card below!`,
            footer: '🎮 Pokémon Hub',
            buttonsFormat: 'buttons',
            buttons: [
                { text: '🃏 Trainer Card',  id: `${p}trainercard`    },
                { text: '🎮 Pokémon Hub',   id: `${p}pokegame`       }
            ]
        } as any, { quoted: M.message })
    }
}
