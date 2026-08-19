import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { TRAINER_SPRITES } from '../../lib/PokemonRegions'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('selecttrainer', {
    description: '👤 Choose your trainer character for your Trainer\'s Card',
    category: 'pokemon',
    usage: 'selecttrainer <1-12>',
    cooldown: 10,
    exp: 5,
    aliases: ['st', 'trainerselect', 'character']
})
export default class extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const p = this.client.config.prefix

        // ── No arg: show list with Open Menu button ────────────────────────────
        if (!context?.trim()) {
            let msg = `👤 *Choose Your Trainer Character*\n`
            msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
            TRAINER_SPRITES.forEach(t => {
                msg += `*${t.id}.* ${t.gender} *${t.name}* — ${t.game}\n`
            })
            msg += `\n💡 Tap *Select Trainer* to pick one!`

            return void await this.client.sendMessage(M.from, {
                text: msg,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                    text: '👤 Select Trainer',
                    sections: [{
                        title: '👤 Choose Your Character',
                        rows: TRAINER_SPRITES.map(t => ({
                            title:       `${t.id}. ${t.gender} ${t.name}`,
                            description: `Game: ${t.game}`,
                            id:          `${p}selecttrainer ${t.id}`
                        }))
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message })
        }

        const num = parseInt(context.trim())
        if (isNaN(num) || num < 1 || num > TRAINER_SPRITES.length) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `❌ *Invalid choice!* Pick a number between *1* and *${TRAINER_SPRITES.length}*.\n\n` +
                    `Use *${p}selecttrainer* (no number) to see the full list.`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '👤 Select Trainer', id: `${p}selecttrainer` }]
            } as any, { quoted: M.message })
        }

        const sprite = TRAINER_SPRITES[num - 1]
        await this.client.DB.user.updateOne(
            { jid: M.sender.jid },
            { $set: { trainerSprite: sprite.id, journeyStarted: true } }
        )
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        return void await this.client.sendMessage(M.from, {
            text:
                `✅ *Trainer updated!*\n\n` +
                `👤 You are now *${sprite.gender} ${sprite.name}* (${sprite.game})!\n\n` +
                `🃏 View your updated card with *${p}trainercard*`,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Set Up Your Trainer',
                    rows: [
                        { title: '🃏 Trainer Card',    description: 'View your updated card',          id: `${p}trainercard`    },
                        { title: '🌍 Set Region',      description: 'Choose your adventure region',    id: `${p}setregion`      },
                        { title: '🌱 Choose Starter',  description: 'Pick your starter Pokémon',       id: `${p}choosestarter`  },
                        { title: '🎮 Pokémon Hub',     description: 'Back to main menu',               id: `${p}pokegame`       }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message })
    }
}
