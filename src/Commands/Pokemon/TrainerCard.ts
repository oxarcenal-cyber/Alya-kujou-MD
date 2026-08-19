import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { buildTrainerCard } from '../../lib/TrainerCardGen'
import { getTrainerSprite, getRegion, REGIONS } from '../../lib/PokemonRegions'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('trainercard', {
    description: '🃏 View your Pokémon Trainer\'s Card with your party & badges',
    category: 'pokemon',
    usage: 'trainercard',
    cooldown: 15,
    exp: 10,
    aliases: ['tc', 'mycard', 'profile']
})
export default class extends BaseCommand {
    override execute = async (M: Message, _args: IArgs): Promise<void> => {
        const p      = this.client.config.prefix
        const user   = await this.client.DB.getUser(M.sender.jid)

        const trainerName = (user as any).trainerName?.trim() || M.sender.jid.split('@')[0]
        const spriteId    = (user as any).trainerSprite  ?? 7
        const regionKey   = (user as any).region         || 'sinnoh'

        const sprite = getTrainerSprite(spriteId)
        const region = getRegion(regionKey) ?? REGIONS[3]

        const party = (user.party ?? []).slice(0, 6).map(p => ({
            id:     p.id,
            name:   p.name,
            level:  p.level,
            rarity: p.rarity
        }))

        const gymBadges: string[] = user.badges ?? []

        try {
            const cardBuffer = await buildTrainerCard({
                trainerName,
                trainerSprite: sprite.url,
                region:        region.name,
                regionEmoji:   region.emoji,
                party,
                gymBadges,
            })

            await this.client.sendMessage(M.from, {
                image:    cardBuffer,
                caption:  this.buildCaption(trainerName, sprite, region.name, party, gymBadges),
                mimetype: 'image/jpeg',
            }, { quoted: M.message as import('@adiwajshing/baileys').WAMessage })

        } catch {
            return void M.reply(`❌ Couldn't generate your Trainer Card. Try again in a moment!`)
        }

        // Post-card action buttons
        return void await this.client.sendMessage(M.from, {
            text: `Customize your card or check your progress! 👇`,
            footer: '🎮 Pokémon Hub',
            buttons: [{
                text: '📋 Open Menu',
                sections: [{
                    title: 'Customize & Explore',
                    rows: [
                        { title: '👤 Select Trainer',  description: 'Change your trainer character',   id: `${p}selecttrainer`  },
                        { title: '🌍 Set Region',      description: 'Change your region',              id: `${p}setregion`      },
                        { title: '🎖️ My Badges',       description: 'View your gym badge collection',  id: `${p}badges`         },
                        { title: '🎒 My Party',        description: 'View your Pokémon team',          id: `${p}party`          },
                        { title: '🎮 Pokémon Hub',     description: 'Back to main menu',               id: `${p}pokegame`       }
                    ]
                }]
            }]
        } as unknown as AnyMessageContent)
    }

    private buildCaption(
        name: string,
        sprite: ReturnType<typeof getTrainerSprite>,
        region: string,
        party: Array<{ name: string; level: number }>,
        badges: string[]
    ): string {
        let txt = `🃏 *${name}'s Trainer Card*\n`
        txt += `👤 *Character:* ${sprite.gender} ${sprite.name} (${sprite.game})\n`
        txt += `🌍 *Region:* ${region}\n`
        txt += `🎒 *Party:* ${party.length}/6\n`
        if (party.length > 0) {
            txt += party.map((p, i) =>
                `  ${i + 1}. ${p.name.charAt(0).toUpperCase() + p.name.slice(1)} (Lv.${p.level})`
            ).join('\n') + '\n'
        }
        txt += `⚔️ *Badges:* ${badges.length}/8\n`
        if (badges.length > 0) txt += badges.map(b => `  🏅 ${b}`).join('\n') + '\n'
        txt += `\n💡 *Tip:* Catch Pokémon, beat Gym Leaders & become Champion! 🏆`
        return txt
    }
}
