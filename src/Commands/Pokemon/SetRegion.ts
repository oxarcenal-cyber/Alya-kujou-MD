import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { REGIONS, getRegion } from '../../lib/PokemonRegions'
import { readFileSync } from 'fs'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('setregion', {
    description: '🌍 Choose your Pokémon adventure region',
    category: 'pokemon',
    usage: 'setregion <region name>',
    cooldown: 10,
    exp: 5,
    aliases: ['region', 'chooseregion']
})
export default class extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const p = this.client.config.prefix

        // ── No arg: show region list with Open Menu ───────────────────────────
        if (!context?.trim()) {
            let msg = `🌍 *Choose Your Adventure Region*\n`
            msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
            REGIONS.forEach((r, i) => {
                msg += `*${i + 1}.* ${r.emoji} *${r.name}*\n`
                msg += `   📝 ${r.desc}\n`
                msg += `   🏅 ${r.badgeCount} Badges | 🌱 ${r.starters.map(s => s.name).join(', ')}\n\n`
            })
            msg += `💡 Tap *Pick Region* to choose!`

            return void await this.client.sendMessage(M.from, {
                text: msg,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                    text: '🌍 Pick Region',
                    sections: [{
                        title: '🌍 Available Regions',
                        rows: REGIONS.map(r => ({
                            title:       `${r.emoji} ${r.name}`,
                            description: `${r.desc} · ${r.badgeCount} Badges`,
                            id:          `${p}setregion ${r.name.toLowerCase()}`
                        }))
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message })
        }

        const key    = context.trim().toLowerCase().split(' ')[0]
        const region = getRegion(key)

        if (!region) {
            const names = REGIONS.map(r => `${r.emoji} ${r.name}`).join(' · ')
            return void await this.client.sendMessage(M.from, {
                text:
                    `❌ *Unknown region!*\n\nAvailable:\n${names}\n\n` +
                    `Example: \`${p}setregion Sinnoh\``,
                footer: '🎮 Pokémon Hub',
                buttons: [{
                    text: '🌍 Pick Region',
                    sections: [{
                        title: '🌍 Available Regions',
                        rows: REGIONS.map(r => ({
                            title:       `${r.emoji} ${r.name}`,
                            description: `${r.badgeCount} Badges · ${r.starters.map(s => s.name).join(', ')}`,
                            id:          `${p}setregion ${r.name.toLowerCase()}`
                        }))
                    }]
                }]
            } as unknown as AnyMessageContent, { quoted: M.message })
        }

        // ── Save region ───────────────────────────────────────────────────────
        await this.client.DB.user.updateOne(
            { jid: M.sender.jid },
            { $set: { region: region.key, journeyStarted: true } }
        )
        this.client.DB.cacheInvalidate(`user:${M.sender.jid}`)

        // ── Build caption ─────────────────────────────────────────────────────
        let caption  = `${region.emoji} *Welcome to ${region.name}!*\n\n`
        caption += `📝 ${region.desc}\n\n`
        caption += `🏅 *Gym Badges to collect:* ${region.badgeCount}\n\n`
        caption += `🌱 *Choose your Starter:*\n`
        region.starters.forEach((s, i) => {
            caption += `  *${i + 1}.* ${s.emoji} *${s.name}* — ${s.type}\n`
        })
        caption += `\n💡 Pick your starter: \`${p}choosestarter <1/2/3>\``

        // ── Send region poster ────────────────────────────────────────────────
        try {
            const imgBuffer = readFileSync(region.image)
            await this.client.sendMessage(M.from, {
                image:    imgBuffer,
                caption,
                mimetype: 'image/jpeg',
            }, { quoted: M.message as import('@adiwajshing/baileys').WAMessage })
        } catch {
            await M.reply(caption)
        }

        // ── Next steps button ─────────────────────────────────────────────────
        return void await this.client.sendMessage(M.from, {
            text: `Next: pick your starter to begin your ${region.name} adventure! 👇`,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Next Steps',
                    rows: [
                        { title: `🌱 Choose Starter`,  description: `Pick your ${region.name} starter`,   id: `${p}choosestarter`  },
                        { title: '👤 Select Trainer',  description: 'Choose your trainer character',      id: `${p}selecttrainer`  },
                        { title: '🃏 Trainer Card',    description: 'View your trainer profile',          id: `${p}trainercard`    },
                        { title: '🎮 Pokémon Hub',     description: 'Back to main menu',                  id: `${p}pokegame`       }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent)
    }
}
