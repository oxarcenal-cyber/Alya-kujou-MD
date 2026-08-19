import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'
import * as fs from 'fs'
import * as path from 'path'

@Command('setcasino', {
    description: 'Is group ko casino group set karo 🎰',
    category: 'moderation',
    usage: 'setcasino',
    aliases: ['casinogroup', 'casinojid'],
    exp: 0,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const lang = await this.getLang(M)
        const line = '─'.repeat(28)

        if (M.chat !== 'group' || !M.groupMetadata)
            return void M.reply(t('setcasino_group_only', lang))

        const groupJid = M.from
        const groupName = M.groupMetadata.subject || 'This Group'
        const currentCasino = this.client.config.casinoGroup

        if (context.trim().toLowerCase() === 'yes') {
            const configPath = path.join(__dirname, '..', '..', '..', 'src', 'config.ts')
            try {
                let configContent = fs.readFileSync(configPath, 'utf8')
                configContent = configContent.replace(
                    /CASINO_GROUP:\s*'[^']*'/,
                    `CASINO_GROUP: '${groupJid}'`
                )
                fs.writeFileSync(configPath, configContent, 'utf8')

                this.client.config.casinoGroup = groupJid

                return void M.reply(t('setcasino_set_success', lang, { groupName, groupJid }))
            } catch {
                return void M.reply(t('setcasino_set_runtime', lang, { groupName, groupJid }))
            }
        }

        if (currentCasino === groupJid) {
            return void M.reply(t('setcasino_already', lang, { line, groupName, groupJid }))
        }

        return void M.reply(
            t('setcasino_prompt', lang, {
                line,
                groupName,
                groupJid,
                currentCasino: currentCasino || t('setcasino_not_set', lang),
                prefix
            })
        )
    }
}
