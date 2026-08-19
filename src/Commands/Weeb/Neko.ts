import { BaseCommand, Command, Message } from '../../Structures'
import { t } from '../../lib'

@Command('neko', {
    description: 'Sends a random neko image',
    category: 'weeb',
    usage: 'neko',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const lang = await this.getLang(M)
        const data = await this.client.utils.fetch<{ url: string }>('https://nekos.life/api/v2/img/neko')
        if (!data?.url) return void (await M.reply(t('weeb_fetch_error', lang)))
        const url = data.url
        const buffer = await this.client.utils.getBuffer(url)
        if (url.toLowerCase().endsWith('.gif')) {
            const mp4 = await this.client.utils.gifToMp4(buffer)
            return void await this.client.sendMessage(M.from, { video: mp4, gifPlayback: true, mimetype: 'video/mp4' } as any)
        }
        return void (await M.reply(buffer, 'image'))
    }
}
