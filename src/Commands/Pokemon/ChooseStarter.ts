import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { getRegion, REGIONS } from '../../lib/PokemonRegions'
import { replyWithPokemonImage } from '../../lib/PokemonImages'
import { AnyMessageContent } from '@adiwajshing/baileys'

const STARTER_LEVEL  = 5
const STARTER_RARITY = 'rare'

@Command('choosestarter', {
    description: '🌱 Pick your starter Pokémon for your region',
    category: 'pokemon',
    usage: 'choosestarter <1/2/3>',
    cooldown: 5,
    exp: 100,
    aliases: ['starter', 'pickstarter']
})
export default class extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const user      = await this.client.DB.getUser(M.sender.jid)
        const regionKey = (user as any).region || ''
        const p         = this.client.config.prefix

        // ── Must have a region set ────────────────────────────────────────────
        if (!regionKey) {
            return void await this.client.sendMessage(M.from, {
                text:
                    `🌍 *No region selected yet!*\n\n` +
                    `First, pick your region:\n` +
                    `*${p}setregion <name>*\n\n` +
                    `Available: ${REGIONS.map(r => `${r.emoji} ${r.name}`).join(', ')}`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Set Up First',
                        rows: REGIONS.map(r => ({
                            title: `${r.emoji} ${r.name}`,
                            description: r.desc,
                            id: `${p}setregion ${r.name.toLowerCase()}`
                        }))
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message })
        }

        const region = getRegion(regionKey)
        if (!region) {
            return void M.reply(`❌ Region data not found. Use *${p}setregion* to pick a valid region.`)
        }

        // ── Already has a starter ─────────────────────────────────────────────
        if (user.party.length > 0) {
            const first = user.party[0]
            return void await this.client.sendMessage(M.from, {
                text:
                    `🌱 *You already have a starter!*\n\n` +
                    `Your first Pokémon: *${this.client.utils.capitalize(first.name)}* (Lv.${first.level}) 💪\n\n` +
                    `Keep catching & battling to build your team!`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Your Journey',
                        rows: [
                            { title: '🎒 My Party',       description: 'View your Pokémon team',          id: `${p}party`       },
                            { title: '🃏 Trainer Card',   description: 'View your trainer profile',       id: `${p}trainercard` },
                            { title: '✨ Evolve',          description: 'Evolve your starter',             id: `${p}evolve 1`    },
                            { title: '🎮 Pokémon Hub',    description: 'Back to main menu',               id: `${p}pokegame`    }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message })
        }

        // ── No arg: show starters with Open Menu ─────────────────────────────
        if (!context?.trim()) {
            let msg = `🌱 *Choose Your ${region.name} Starter!* ${region.emoji}\n`
            msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
            region.starters.forEach((s, i) => {
                msg += `*${i + 1}.* ${s.emoji} *${s.name}*\n`
                msg += `   🔖 Type: ${s.type} | 🎖️ Rarity: Rare\n\n`
            })
            msg += `💡 Tap Open Menu to pick your starter!`

            return void await this.client.sendMessage(M.from, {
                text: msg,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                    text: '🌱 Pick Starter',
                    sections: [{
                        title: `${region.emoji} ${region.name} Starters`,
                        rows: region.starters.map((s, i) => ({
                            title: `${i + 1}. ${s.emoji} ${s.name}`,
                            description: `Type: ${s.type} · Rarity: Rare`,
                            id: `${p}choosestarter ${i + 1}`
                        }))
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message })
        }

        // ── Parse choice ──────────────────────────────────────────────────────
        const choice = parseInt(context.trim())
        if (isNaN(choice) || choice < 1 || choice > 3) {
            return void M.reply(
                `❌ *Invalid choice!* Pick *1*, *2*, or *3*.\n\n` +
                region.starters.map((s, i) => `*${i + 1}.* ${s.emoji} ${s.name}`).join('\n')
            )
        }

        const starter = region.starters[choice - 1]

        // ── Fetch real data from PokeAPI ──────────────────────────────────────
        let image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${starter.id}.png`
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${starter.id}`)
            if (res.ok) {
                const data = await res.json() as any
                image = data?.sprites?.other?.['official-artwork']?.front_default ?? image
            }
        } catch {}

        const starterPoke = {
            name:   starter.name.toLowerCase(),
            image,
            id:     starter.id,
            level:  STARTER_LEVEL,
            rarity: STARTER_RARITY
        }

        const updatedParty = [...user.party, starterPoke]
        await this.client.DB.user.updateOne(
            { jid: M.sender.jid },
            { $set: { party: updatedParty, journeyStarted: true } }
        )
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        const msg =
            `🎉 *You chose ${starter.emoji} ${starter.name}!*\n\n` +
            `📋 *${starter.name}* has joined your party!\n` +
            `  📊 Level: ${STARTER_LEVEL} | 🔖 Type: ${starter.type} | ⭐ Rarity: Rare\n\n` +
            `🌟 *Your journey in ${region.name} begins!* ${region.emoji}`

        await replyWithPokemonImage(M, 'pokemon', msg)

        return void await this.client.sendMessage(M.from, {
            text: `🏆 Catch Pokémon, beat Gym Leaders & become Champion!`,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'What\'s Next?',
                    rows: [
                        { title: '🎒 My Party',       description: 'See your starter in party',       id: `${p}party`       },
                        { title: '🃏 Trainer Card',   description: 'View your trainer profile',       id: `${p}trainercard` },
                        { title: '🏟️ Challenge Gym',  description: 'Battle the Gym Leader',           id: `${p}challenge`   },
                        { title: '🎮 Pokémon Hub',    description: 'Full game menu',                  id: `${p}pokegame`    }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent)
    }
}
