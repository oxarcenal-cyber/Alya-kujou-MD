import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

@Command('qr', {
    description: 'Generate a QR code for any text or link 🔲',
    category: 'utils',
    usage: 'qr <text or link>',
    aliases: ['qrcode', 'qrgen'],
    cooldown: 10,
    exp: 15,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        const prefix = this.client.config.prefix
        if (!context.trim())
            return void M.reply(t('qr_usage', lang, { p: prefix }))

        const text = context.trim()
        try {
            const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=400x400&format=png&margin=15`
            const buffer = await this.client.utils.getBuffer(url)
            return void M.reply(
                buffer,
                'image',
                undefined,
                undefined,
                `🔲 *QR CODE*\n\n📝 *Data:* ${text.length > 60 ? text.substring(0, 60) + '...' : text}\n\n📢 *How to use:* \`${prefix}qr <text/link>\``
            )
        } catch {
            return void M.reply(t('qr_error', lang, { p: prefix }))
        }
    }
}
