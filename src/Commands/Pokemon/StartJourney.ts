import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { REGIONS, TRAINER_SPRITES } from '../../lib/PokemonRegions'
import { replyWithPokemonImage } from '../../lib/PokemonImages'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('startjourney', {
    description: '🌟 Begin your Pokémon adventure — choose your trainer, region & starter!',
    category: 'pokemon',
    usage: 'startjourney',
    cooldown: 5,
    exp: 50,
    aliases: ['journey', 'adventure']
})
export default class extends BaseCommand {
    override execute = async (M: Message, _args: IArgs): Promise<void> => {
        const user = await this.client.DB.getUser(M.sender.jid)
        const p = this.client.config.prefix

        if ((user as any).journeyStarted) {
            const regionKey    = (user as any).region      || ''
            const trainerName  = (user as any).trainerName || M.sender.jid.split('@')[0]
            const regionInfo   = REGIONS.find(r => r.key === regionKey)

            return void await this.client.sendMessage(M.from, {
                text:
                    `🌟 *Journey Already Started!*\n\n` +
                    `You're already on your adventure, *${trainerName}*! 🎒\n` +
                    `📍 *Region:* ${regionInfo ? `${regionInfo.emoji} ${regionInfo.name}` : 'Not set yet'}\n\n` +
                    `Tap *Open Menu* to continue your adventure!`,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: 'Your Journey',
                        rows: [
                            { title: '🃏 Trainer Card',     description: 'View your Trainer\'s Card',    id: `${p}trainercard`    },
                            { title: '🎒 My Party',         description: 'View your Pokémon party',      id: `${p}party`          },
                            { title: '🌍 Change Region',    description: 'Switch your adventure region', id: `${p}setregion`      },
                            { title: '👤 Change Trainer',   description: 'Choose a new character',       id: `${p}selecttrainer`  },
                            { title: '🌱 Choose Starter',   description: 'Pick your starter Pokémon',    id: `${p}choosestarter`  },
                            { title: '🎮 Pokémon Hub',      description: 'Full menu',                    id: `${p}pokegame`       }
                        ]
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message })
        }

        // ── Mark journey as started ───────────────────────────────────────────
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { journeyStarted: true } })
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        // ── Welcome message ───────────────────────────────────────────────────
        let msg = `🌟 *Your Pokémon Journey Begins!* 🌟\n`
        msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
        msg += `A world of adventure awaits you, Trainer! 🎒\n\n`

        msg += `📝 *STEP 1 — Set Your Name*\n`
        msg += `\`${p}trainername <name>\` → Shown on your Trainer's Card\n\n`

        msg += `👤 *STEP 2 — Choose Trainer Character*\n`
        msg += `\`${p}selecttrainer <1-12>\`\n`
        TRAINER_SPRITES.forEach(t => {
            msg += `  *${t.id}.* ${t.gender} ${t.name} (${t.game})\n`
        })
        msg += `\n`

        msg += `🌍 *STEP 3 — Choose Your Region*\n`
        msg += `\`${p}setregion <name>\` → Sends region poster!\n`
        REGIONS.forEach(r => {
            msg += `  ${r.emoji} *${r.name}* — ${r.starters.map(s => s.name).join(', ')}\n`
        })
        msg += `\n`

        msg += `🌱 *STEP 4 — Pick Your Starter*\n`
        msg += `\`${p}choosestarter <1/2/3>\` → After picking a region\n\n`

        msg += `━━━━━━━━━━━━━━━━━━━━━━\n`
        msg += `⚔️ Catch Pokémon, defeat Gym Leaders & become Champion! 🏆`

        await replyWithPokemonImage(M, 'welcome', msg)

        // Setup guide buttons
        return void await this.client.sendMessage(M.from, {
            text: `Complete these 4 steps to set up your trainer! 👇`,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Setup Steps',
                sections: [{
                    title: 'Setup Your Trainer',
                    rows: [
                        { title: '✏️ Step 1 — Trainer Name',    description: 'Set your display name',       id: `${p}trainername`    },
                        { title: '👤 Step 2 — Choose Character', description: 'Pick your trainer sprite',   id: `${p}selecttrainer`  },
                        { title: '🌍 Step 3 — Set Region',       description: 'Choose your home region',    id: `${p}setregion`      },
                        { title: '🌱 Step 4 — Choose Starter',   description: 'Pick your first Pokémon',   id: `${p}choosestarter`  },
                        { title: '🎮 Pokémon Hub',               description: 'Full game menu',             id: `${p}pokegame`       }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent)
    }
}
