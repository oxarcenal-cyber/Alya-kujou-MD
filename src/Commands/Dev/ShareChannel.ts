import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('sharechannel', {
    description: 'Share bot WhatsApp channel link 📢',
    aliases: ['channel', 'chanlink'],
    usage: 'sharechannel | sharechannel all',
    cooldown: 10,
    exp: 0,
    category: 'dev',
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const channelLink = this.client.config.channelLink
        const supportLink = this.client.config.supportLink
        const botName     = this.client.config.name

        if (!channelLink)
            return void M.reply('❌ Channel link config mein set nahi hai!\n`CHANNEL_LINK` fill karo `src/config.ts` mein.')

        // ── Message ──────────────────────────────────────────────────────────
        const text =
            `╔══════════════════════╗\n` +
            `║   📢 *${botName}*   ║\n` +
            `║   *Official Channel*   ║\n` +
            `╚══════════════════════╝\n\n` +
            `Hamare *WhatsApp Channel* se judo aur pao:\n\n` +
            `  🎌 Latest anime & manga news\n` +
            `  🤖 Bot updates & new features\n` +
            `  🎁 Giveaways & special events\n` +
            `  🚨 Breaking alerts — sabse pehle!\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📲 *Channel Link:*\n` +
            `${channelLink}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━` +
            (supportLink ? `\n\n👥 *Support Group:*\n${supportLink}` : '') +
            `\n\n_Follow karo aur updates miss mat karo!_ 🌟`

        const sendAll = context.trim().toLowerCase() === 'all'

        if (sendAll) {
            await M.reply('📡 Sabhi groups mein bhej raha hoon... please wait!')
            const groupKeys = await this.client.groupFetchAllParticipating()
            const jids = Object.keys(groupKeys)
            let sent = 0
            for (const jid of jids) {
                try {
                    await this.client.sendMessage(jid, { text })
                    sent++
                    await new Promise(r => setTimeout(r, 800))
                } catch { /* skip failed */ }
            }
            return void M.reply(`✅ *Done!* ${sent}/${jids.length} groups mein channel link bheja!`)
        }

        return void await this.client.sendMessage(M.from, { text })
    }
}
