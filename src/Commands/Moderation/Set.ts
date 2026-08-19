import { Message, BaseCommand, Command } from '../../Structures'
import { IArgs, GroupFeatures } from '../../Types'

@Command('set', {
    description: 'Enables/Disables a certain group feature',
    usage: 'set',
    cooldown: 5,
    category: 'moderation',
    exp: 25,
    aliases: ['feature']
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { flags }: IArgs): Promise<void> => {
        const features = Object.keys(GroupFeatures) as (keyof typeof GroupFeatures)[]
        const prefix   = this.client.config.prefix
        if (!flags.length) {
            const caption =
                `✨ Game Settings - 🎮\n` +
                `━━━━━━━━━━━━━━━\n` +
                `🐾 Wild Pokemon — spawns.\n` +
                `🃏 Card Spawn — collectible cards.\n` +
                `🎰 Casino — coinflip, dice, slot.\n` +
                `🎂 Birthday — group announce on birthdays.\n` +
                `━━━━━━━━━━━━━━━\n` +
                `💡 Tap a button below to toggle!`
            const imgBuf = this.client.assets.get('set-menu') as Buffer | undefined
            return void await this.client.sendMessage(M.from, {
                ...(imgBuf ? { image: imgBuf } : { text: caption }),
                caption,
                footer: '⚡ RedzeoX',
                buttons: [
                    {
                        text: '⚙️ Open Settings',
                        sections: [
                            {
                                title: '🐾 Wild Pokemon',
                                rows: [
                                    { title: '✅ Enable',  id: `${prefix}set --wild=true`,   description: '🐾 Wild pokemon spawns ON'  },
                                    { title: '❌ Disable', id: `${prefix}set --wild=false`,  description: '🐾 Wild pokemon spawns OFF' }
                                ]
                            },
                            {
                                title: '🃏 Card Spawn',
                                rows: [
                                    { title: '✅ Enable',  id: `${prefix}set --chara=true`,  description: '🃏 Card spawns ON'  },
                                    { title: '❌ Disable', id: `${prefix}set --chara=false`, description: '🃏 Card spawns OFF' }
                                ]
                            },
                            {
                                title: '🎰 Casino Games',
                                rows: [
                                    { title: '✅ Enable',  id: `${prefix}set --casino=true`,  description: '🎰 Casino games ON'  },
                                    { title: '❌ Disable', id: `${prefix}set --casino=false`, description: '🎰 Casino games OFF' }
                                ]
                            },
                            {
                                title: '🎂 Birthday Announcements',
                                rows: [
                                    { title: '✅ Enable',  id: `${prefix}set --birthday=true`,  description: '🎂 Birthday announce in group ON'  },
                                    { title: '❌ Disable', id: `${prefix}set --birthday=false`, description: '🎂 Birthday announce in group OFF' }
                                ]
                            }
                        ]
                    }
                ]
            } as any, { quoted: M.message })
        } else {
            const options = flags[0].trim().toLowerCase().split('=')
            const feature = options[0].replace('--', '') as keyof typeof GroupFeatures
            const actions = ['true', 'false']
            if (!features.includes(feature))
                return void M.reply(
                    `Invalid feature. Use *${this.client.config.prefix}set* to see all of the available features`
                )
            const action = options[1]
            if (!action || !actions.includes(action))
                return void M.reply(
                    `${
                        action
                            ? `Invalid option. It should be one of them: *${actions
                                  .map(this.client.utils.capitalize)
                                  .join(', ')}*.`
                            : `Provide the option to be set of this feature.`
                    } Example: *${this.client.config.prefix}set --${feature}=true*`
                )
            const data = await this.client.DB.getGroup(M.from)
            if ((action === 'true' && data[feature]) || (action === 'false' && !data[feature]))
                return void M.reply(
                    `🟨 *${this.client.utils.capitalize(feature)} is already ${
                        action === 'true' ? 'Enabled' : 'Disabled'
                    }*`
                )
            await this.client.DB.updateGroup(M.from, feature, action === 'true')

            // Keep in-memory spawn lists in sync
            const enable = action === 'true'
            if (feature === 'chara') {
                if (enable && !this.handler.chara.includes(M.from)) this.handler.chara.push(M.from)
                else if (!enable) this.handler.chara = this.handler.chara.filter((g) => g !== M.from)
            }
            if (feature === 'wild') {
                if (enable && !this.handler.wild.includes(M.from)) this.handler.wild.push(M.from)
                else if (!enable) this.handler.wild = this.handler.wild.filter((g) => g !== M.from)
            }

            return void M.reply(
                `${action === 'true' ? '🟩' : '🟥'} *${this.client.utils.capitalize(feature)} is now ${
                    action === 'true' ? 'Enabled' : 'Disabled'
                }*`
            )
        }
    }
}
