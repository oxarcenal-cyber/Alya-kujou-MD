import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('groupclean', {
    description: 'Show stale groups in DB (bot not a member) and purge them',
    usage: 'groupclean [purge]',
    category: 'dev',
    cooldown: 10,
    exp: 0,
    aliases: ['gcclean', 'cleangroups']
})
export default class extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const action = context?.trim().toLowerCase()

        await M.reply('⏳ Fetching group data...')

        // Groups bot is currently a member of (live from WA)
        const activeGroupMeta = await this.client.groupFetchAllParticipating().catch(() => ({})) as Record<string, { subject: string }>
        const activeJids = new Set(Object.keys(activeGroupMeta))

        // All groups stored in DB
        const dbGroups = await this.client.DB.group.find({})

        const stale = dbGroups.filter((g) => !activeJids.has(g.jid))
        const active = dbGroups.filter((g) => activeJids.has(g.jid))

        if (action === 'purge') {
            if (stale.length === 0)
                return void M.reply(`✅ *No stale groups found!* DB is already clean.\n\n📊 Total in DB: *${dbGroups.length}* · Active: *${active.length}*`)

            const staleJids = stale.map((g) => g.jid)
            await this.client.DB.group.deleteMany({ jid: { $in: staleJids } })

            // Clear cache for deleted groups
            for (const jid of staleJids) {
                this.client.DB.cacheInvalidate(`group:${jid}`)
            }

            return void M.reply(
                `🗑️ *Purge complete!*\n\n` +
                `❌ Deleted: *${stale.length}* stale group(s)\n` +
                `✅ Remaining: *${active.length}* active group(s)\n\n` +
                `${stale.map((g, i) => `${i + 1}. \`${g.jid}\``).join('\n')}`
            )
        }

        // Default: just show status
        if (stale.length === 0) {
            return void M.reply(
                `✅ *DB is clean!* All stored groups are active.\n\n` +
                `📊 Total in DB: *${dbGroups.length}* · Active: *${active.length}*`
            )
        }

        const staleLines = stale.map((g, i) => {
            const flags: string[] = []
            if (g.wild) flags.push('🐾Wild')
            if (g.chara) flags.push('🎴Chara')
            if (g.newsEnabled) flags.push('📰News')
            if (g.welcome) flags.push('👋Welcome')
            const flagStr = flags.length ? ` [${flags.join(' ')}]` : ''
            return `${i + 1}. \`${g.jid}\`${flagStr}`
        })

        const activeLines = active.map((g, i) => {
            const meta = activeGroupMeta[g.jid]
            return `${i + 1}. *${meta?.subject ?? 'Unknown'}*\n   \`${g.jid}\``
        })

        return void M.reply(
            `📋 *Group DB Report*\n\n` +
            `📊 Total in DB: *${dbGroups.length}* · Active: *${active.length}* · Stale: *${stale.length}*\n\n` +
            `✅ *Active Groups (bot is member):*\n${activeLines.join('\n')}\n\n` +
            `🗑️ *Stale Groups (bot not a member):*\n${staleLines.join('\n')}\n\n` +
            `💡 To delete stale groups:\n*${this.client.config.prefix}groupclean purge*`
        )
    }
}
