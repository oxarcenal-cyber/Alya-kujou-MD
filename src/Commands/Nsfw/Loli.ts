import { BaseCommand, Command, Message } from '../../Structures'
import { t } from '../../lib'

@Command('loli', {
    description: 'Sends a random nsfw loli image',
    category: 'nsfw',
    usage: 'loli',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const lang = await this.getLang(M)

        return void (await this.client.sendMessage(M.from, {
            image: { url: 'https://loliapi.com/bg' },
            caption: t('nsfw_loli_caption', lang, { p: this.client.config.prefix })
        }))
    }
}
