import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { getDxDLine, DXD_CHARACTERS } from '../../lib'

@Command('dxd', {
    description: 'High School DxD character se ek dialogue lo 🐉',
    category: 'fun',
    usage: 'dxd [character name]',
    aliases: ['dxdquote'],
    exp: 10,
    cooldown: 3,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const query = context.trim()

        if (query.toLowerCase() === 'list')
            return void M.reply(
                `🐉 *HIGH SCHOOL DxD — CHARACTERS*\n${'─'.repeat(25)}\n\n` +
                DXD_CHARACTERS.map((c) => `• ${c.name}`).join('\n') +
                `\n\n📢 *How to use:* \`${prefix}dxd Rias\` ya \`${prefix}dxd\` (random)`
            )

        const result = getDxDLine(query)
        if (!result)
            return void M.reply(
                `❌ *Ye character nahi mila!*\n\n` +
                `📢 *How to use:*\n` +
                `  \`${prefix}dxd\` → random character\n` +
                `  \`${prefix}dxd Rias\` → specific character\n` +
                `  \`${prefix}dxd list\` → sabhi characters dekho`
            )

        return void M.reply(`🐉 *${result.character}:*\n"${result.line}"`)
    }
}
