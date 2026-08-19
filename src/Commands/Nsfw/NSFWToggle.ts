import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

@Command('nsfw', {
    description: 'Enable or disable NSFW in a group / Show NSFW guide',
    usage: 'nsfw [on | off]',
    category: 'general',
    aliases: ['nsfwtoggle'],
    exp: 5,
    dm: false,
    cooldown: 3
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        const p = this.client.config.prefix
        const arg = context.trim().toLowerCase()

        // ── No argument → show interactive menu ───────────────────────────────
        if (!arg || arg === 'help' || arg === 'status') {
            const { nsfw } = await this.client.DB.getGroup(M.from)
            const caption = t('nsfw_guide', lang, { p, status: nsfw ? '✅ ON' : '📴 OFF' })

            const bannerBuf = this.client.assets.get('nsfw-banner') as Buffer | undefined
            if (bannerBuf) {
                // Send banner GIF + caption + buttons all in one message
                return void await this.client.sendMessage(M.from, {
                    video:       bannerBuf,
                    gifPlayback: true,
                    mimetype:    'video/mp4',
                    caption,
                    footer: '🔞 RedzeoX NSFW',
                    buttons: [{
                        text: '📋 Open Menu',
                        sections: [{
                            title: '🔞 NSFW Controls',
                            rows: [
                                {
                                    title: '✅ NSFW ON',
                                    description: '🔓 Group mein NSFW content enable karo',
                                    id: `${p}nsfw on`
                                },
                                {
                                    title: '📴 NSFW OFF',
                                    description: '🔒 Group mein NSFW content disable karo',
                                    id: `${p}nsfw off`
                                }
                            ]
                        }]
                    }]
                } as any, { quoted: M.message as any })
            }

            return void await this.client.sendMessage(M.from, {
                text: caption,
                footer: '🔞 RedzeoX NSFW',
                buttons: [{
                    text: '📋 Open Menu',
                    sections: [{
                        title: '🔞 NSFW Controls',
                        rows: [
                            {
                                title: '✅ NSFW ON',
                                description: '🔓 Group mein NSFW content enable karo',
                                id: `${p}nsfw on`
                            },
                            {
                                title: '📴 NSFW OFF',
                                description: '🔒 Group mein NSFW content disable karo',
                                id: `${p}nsfw off`
                            }
                        ]
                    }]
                }]
            } as any, { quoted: M.message })
        }

        if (arg !== 'on' && arg !== 'off') {
            return void M.reply(t('nsfw_toggle_usage', lang, { p }))
        }

        const senderJid = this.client.correctJid(M.sender.jid)

        // isAdmin from simplify() + direct groupMetadata fallback (LID format safety)
        const adminJids = (M.groupMetadata?.admins || []).map((j: string) => this.client.correctJid(j))
        const isGroupAdmin = M.sender.isAdmin || adminJids.includes(senderJid)

        const isMod = this.client.config.mods.some(
            (mod) => this.client.correctJid(mod) === senderJid
        )
        if (!isGroupAdmin && !isMod)
            return void M.reply(t('admin_only', lang))

        const enable = arg === 'on'
        const data = await this.client.DB.getGroup(M.from)

        if ((enable && data.nsfw) || (!enable && !data.nsfw))
            return void M.reply(t('nsfw_already', lang, { status: enable ? '✅ ON' : '📴 OFF' }))

        await this.client.DB.updateGroup(M.from, 'nsfw', enable)
        return void M.reply(t('nsfw_toggled', lang, { status: enable ? '✅ ON' : '📴 OFF' }))
    }
}
