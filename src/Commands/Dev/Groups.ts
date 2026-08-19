import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('groups', {
    description: 'List all groups and their wild/chara status — toggle from here',
    usage: 'groups [wild/chara off <jid>]',
    category: 'dev',
    cooldown: 10,
    exp: 0,
    aliases: ['grouplist']
})
export default class extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const parts = context?.trim().toLowerCase().split(/\s+/)
        const feature = parts?.[0]
        const action = parts?.[1]
        const jid = parts?.[2]

        if (feature && action && jid) {
            const validFeatures = ['wild', 'chara']
            const validActions = ['on', 'off']
            if (!validFeatures.includes(feature) || !validActions.includes(action))
                return void M.reply(`❌ Usage: *${this.client.config.prefix}groups wild off <jid>*`)

            const enable = action === 'on'
            await this.client.DB.group.updateOne({ jid }, { $set: { [feature]: enable } })

            if (feature === 'wild') {
                if (enable && !this.handler.wild.includes(jid)) this.handler.wild.push(jid)
                else if (!enable) this.handler.wild = this.handler.wild.filter((g) => g !== jid)
            }
            if (feature === 'chara') {
                if (enable && !this.handler.chara.includes(jid)) this.handler.chara.push(jid)
                else if (!enable) this.handler.chara = this.handler.chara.filter((g) => g !== jid)
            }

            return void M.reply(
                `✅ *${feature === 'wild' ? 'Pokémon' : 'Character'} spawning* turned *${action.toUpperCase()}* for:\n\`${jid}\``
            )
        }

        const allGroupMeta = await this.client.groupFetchAllParticipating().catch(() => ({})) as Record<string, { subject: string }>
        const dbGroups = await this.client.DB.group.find({ $or: [{ wild: true }, { chara: true }] })

        if (dbGroups.length < 1)
            return void M.reply(`📭 No groups have wild or chara spawning enabled.`)

        const lines = dbGroups.map((g, i) => {
            const meta = allGroupMeta[g.jid]
            const name = meta?.subject ? `*${meta.subject}*` : `Group ${i + 1}`
            const wildStatus = g.wild ? '🐾 Wild ON' : '🐾 Wild OFF'
            const charaStatus = g.chara ? '🎴 Chara ON' : '🎴 Chara OFF'
            return `${i + 1}. ${name}\n   ${wildStatus} · ${charaStatus}\n   \`${g.jid}\``
        })

        return void M.reply(
            `📋 *Active Groups*\n\n${lines.join('\n\n')}\n\n` +
                `💡 *To disable:*\n` +
                `*${this.client.config.prefix}groups wild off <jid>*\n` +
                `*${this.client.config.prefix}groups chara off <jid>*\n` +
                `*${this.client.config.prefix}spawnctl all off* ← pauses ALL instantly`
        )
    }
}
