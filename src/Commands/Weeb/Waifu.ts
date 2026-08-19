import axios from 'axios'
import { Command, BaseCommand, Message } from '../../Structures'
import { t } from '../../lib'

const UA = 'AlYaMD/7.0.0'

@Command('waifu', {
    description: 'Sends a random waifu image',
    category: 'weeb',
    usage: 'waifu',
    exp: 10,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const lang = await this.getLang(M)
        const res = await axios.get<{ results: { url: string }[] }>(
            'https://nekos.best/api/v2/waifu',
            { headers: { 'User-Agent': UA }, timeout: 10000 }
        ).catch(() => null)
        if (!res?.data?.results?.[0]?.url) return void (await M.reply(t('weeb_fetch_error', lang)))
        const url = res.data.results[0].url
        const buffer = await this.client.utils.getBuffer(url)
        if (url.toLowerCase().endsWith('.gif')) {
            const mp4 = await this.client.utils.gifToMp4(buffer)
            return void await this.client.sendMessage(M.from, { video: mp4, gifPlayback: true, mimetype: 'video/mp4' } as any)
        }
        return void (await M.reply(buffer, 'image'))
    }
}
