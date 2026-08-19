import { BaseCommand, Command, Message } from '../../Structures'
import { t } from '../../lib'

interface NekosLifeResponse {
    url: string
}

@Command('lewd', {
    description: 'Sends a random lewd/ecchi anime image',
    usage: 'lewd',
    category: 'nsfw',
    aliases: ['ecchi', 'lewdneko'],
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const lang = await this.getLang(M)
        const p = this.client.config.prefix

        const data = await this.client.utils
            .fetch<NekosLifeResponse>('https://nekos.life/api/v2/img/lewd')
            .catch(() => null)

        if (!data?.url)
            return void M.reply(t('error', lang))

        return void (await this.client.sendMessage(M.from, {
            image: { url: data.url },
            caption: t('nsfw_lewd_caption', lang, { p })
        }))
    }
}
