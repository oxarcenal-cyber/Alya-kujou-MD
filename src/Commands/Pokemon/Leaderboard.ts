import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs, IGroup } from '../../Types'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('pokelb', {
    description: 'Shows the top Pokémon trainers leaderboard',
    category: 'pokemon',
    usage: 'pokelb [--group]',
    exp: 10,
    cooldown: 25,
    aliases: ['pokeleaderboard', 'pokemonlb']
})
export default class extends BaseCommand {
    override execute = async (M: Message, { flags }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        let users = await this.client.DB.user.find({})

        if (flags.includes('--group')) {
            if (!M.groupMetadata)
                return void setTimeout(async () => await this.execute(M, { flags, context: '', args: [] }), 3000)
            users = []
            const { participants } = M.groupMetadata as IGroup
            for (const participant of participants) (users as any).push(await this.client.DB.getUser(participant.id))
            flags.splice(flags.indexOf('--group'), 1)
        }

        const ranked = users
            .map((u) => ({ user: u, count: u.party.length + u.pc.length }))
            .filter((u) => u.count > 0)
            .sort((a, b) => b.count - a.count)

        if (ranked.length < 1) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `🌫️ *No trainers found yet!*\n\n` +
                    `Be the first — turn on wild spawns with *${prefix}wild on*\n` +
                    `and catch your first Pokémon! 🎣`,
                footer: '🎮 Pokémon Hub',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎮 Pokémon Hub', id: `${prefix}pokegame` }]
            } as any, { quoted: M.message })
        }

        const medals = ['🥇', '🥈', '🥉']
        const n = Math.min(ranked.length, 10)

        let text = `╭─────────────────╮\n`
        text += `   🏆 *POKÉMON TRAINER LEADERBOARD* 🏆\n`
        text += `╰─────────────────╯\n\n`

        for (let i = 0; i < n; i++) {
            const { username } = this.client.contact.getContact(ranked[i].user.jid)
            const rank = medals[i] ?? `🎖️ #${i + 1}`
            text += `${rank} ✨ *${username}*\n`
            text += `　└ 🐾 *${ranked[i].count}* Pokémon caught\n\n`
        }

        text += `━━━━━━━━━━━━━━━━━━\n`
        text += `💡 _Catch more wild Pokémon to climb the ranks!_`

        return void await this.client.sendMessage(M.from, {
            text,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Keep Playing',
                    rows: [
                        { title: '🎒 My Party',        description: 'View your Pokémon party',   id: `${prefix}party`    },
                        { title: '🃏 Trainer Card',    description: 'View your trainer profile', id: `${prefix}trainercard` },
                        { title: '⚔️ PVP Battle',      description: 'Challenge another trainer', id: `${prefix}pvp`      },
                        { title: '🎮 Pokémon Hub',     description: 'Back to main menu',         id: `${prefix}pokegame` }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent, { quoted: M.message })
    }
}
