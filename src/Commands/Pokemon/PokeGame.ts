import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

/**
 * Pokemon Hub — single entry-point for the entire Pokemon system.
 * Mirrors the CardGame hub pattern so users get a familiar experience.
 */
@Command('pokegame', {
    description: '🎮 Open the Pokémon Game Hub',
    usage: 'pokegame',
    category: 'pokemon',
    aliases: ['pokehub', 'ph', 'pmenu'],
    cooldown: 5,
    exp: 5,
    dm: false
})
export default class PokeGameCommand extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const body =
            `🎮 *POKÉMON GAME HUB* 🎮\n\n` +
            `Catch wild Pokémon, battle trainers,\n` +
            `beat Gym Leaders & become Champion!\n\n` +
            `Tap *Open Menu* to get started. 👇`

        await this.client.sendMessage(
            M.from,
            {
                text: body,
                footer: 'Shortcuts: party · pc · pvp · pokegame',
                title: '🎮 Pokémon Hub',
                buttons: [
                    {
                        text: '📋 Open Menu',
                        sections: [
                            {
                                title: '🌟 Journey',
                                rows: [
                                    { title: '🌟 Start Journey',     description: 'Begin your Pokémon adventure',       id: `${prefix}startjourney`  },
                                    { title: '🃏 Trainer Card',       description: 'View your trainer card & badges',    id: `${prefix}trainercard`   },
                                    { title: '✏️ Trainer Name',       description: 'Set your trainer name',             id: `${prefix}trainername`   },
                                    { title: '🌱 Choose Starter',     description: 'Pick your starter Pokémon',         id: `${prefix}choosestarter` },
                                    { title: '🌍 Set Region',         description: 'Change your adventure region',      id: `${prefix}setregion`     }
                                ]
                            },
                            {
                                title: '⚔️ Battle',
                                rows: [
                                    { title: '⚔️ PVP Battle',         description: 'Challenge another trainer',          id: `${prefix}pvp`           },
                                    { title: '🏟️ Gym Status',         description: 'See active Gym Leader in group',     id: `${prefix}gymstatus`     },
                                    { title: '🎯 Challenge Gym',      description: 'Battle the active Gym Leader',       id: `${prefix}challenge`     },
                                    { title: '🚀 Team Rocket Fight',  description: 'Fight during an active raid',        id: `${prefix}fight`         }
                                ]
                            },
                            {
                                title: '🎒 My Pokémon',
                                rows: [
                                    { title: '🎒 My Party',           description: 'View your active party (6 slots)',   id: `${prefix}party`         },
                                    { title: '🏥 Nurse Joy',           description: 'Heal your Pokémon and cure statuses',  id: `${prefix}nursejoy`      },
                                    { title: '📦 My PC Box',          description: 'View all stored Pokémon',            id: `${prefix}pc`            },
                                    { title: '📖 Pokédex',            description: 'Browse your Pokédex entries',        id: `${prefix}pokedex`       },
                                    { title: '🔄 Swap Party',         description: 'Reorder Pokémon in your party',      id: `${prefix}swap`          }
                                ]
                            },
                            {
                                title: '📈 Train & Evolve',
                                rows: [
                                    { title: '✨ Evolve Pokémon',     description: 'Evolve a Pokémon (level required)',  id: `${prefix}evolve`        },
                                    { title: '🍬 Rare Candy',         description: 'Level up a Pokémon (500 coins)',     id: `${prefix}rarecandy`     }
                                ]
                            },
                            {
                                title: '🔍 Info & Stats',
                                rows: [
                                    { title: '🏆 Leaderboard',        description: 'Top Pokémon trainers ranking',       id: `${prefix}pokelb`        },
                                    { title: '🔍 Pokémon Info',       description: 'Look up any Pokémon by name/ID',    id: `${prefix}pokemon`       },
                                    { title: '🔄 Trade Pokémon',      description: 'Offer a trade in the group',         id: `${prefix}trade`         }
                                ]
                            }
                        ]
                    }
                ]
            } as unknown as AnyMessageContent,
            { quoted: M.message }
        )
    }
}
