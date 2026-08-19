import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t, langName } from '../../lib'
import type { Language } from '../../lib'

@Command('lang', {
    description: 'Change the bot language for this group 🌐 (English / Hindi)',
    category: 'moderation',
    usage: 'lang en | lang hi | lang',
    aliases: ['language', 'bhasha'],
    exp: 10,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const currentLang = await this.getLang(M)

        if (M.chat !== 'group' || !M.groupMetadata)
            return void M.reply(t('lang_group_only', currentLang, { p: prefix }))

        const isMod = this.client.config.mods.includes(M.sender.jid)
        if (!M.sender.isAdmin && !isMod)
            return void M.reply(t('lang_no_perm', currentLang, { p: prefix }))

        const input = context.trim().toLowerCase()

        // No input → current status + usage
        if (!input) {
            return void M.reply(
                t('lang_status', currentLang, {
                    p: prefix,
                    line: '─'.repeat(28),
                    current: langName(currentLang)
                })
            )
        }

        if (input !== 'en' && input !== 'hi')
            return void M.reply(t('lang_invalid', currentLang, { p: prefix }))

        const newLang = input as Language

        if (newLang === currentLang)
            return void M.reply(t('lang_already', newLang, { lang: langName(newLang) }))

        await this.client.DB.updateGroup(M.from, 'language' as any, newLang)

        return void M.reply(
            t(newLang === 'hi' ? 'lang_changed_hi' : 'lang_changed_en', newLang, { p: prefix })
        )
    }
}
