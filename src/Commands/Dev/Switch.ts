import { IArgs } from '../../Types'
import { Command, BaseCommand, Message } from '../../Structures'

@Command('switch', {
    description: 'Switch who the bot responds to in a group (all/bots/specific user)',
    usage: 'switch <all | bots | username>',
    cooldown: 10,
    exp: 10,
    category: 'dev'
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const { bot } = await this.client.DB.getGroup(M.from)
        const options = ['all', 'everyone', 'bots']
        let Bot!: string
        if (!context || options.includes(context.trim().toLowerCase().split(' ')[0].trim())) Bot = 'all'
        else Bot = context.trim().split(' ')[0].trim()
        const name = this.client.config.name.split(' ')[0]
        if (Bot === bot)
            return void M.reply(
                `🟨 ${Bot === 'all' ? '*Everyone* is' : Bot === name ? 'I am' : `*${Bot}* is`} already active`
            )
        await this.client.DB.updateGroup(M.from, 'bot', Bot)
        return void M.reply(`🟩 ${Bot === name ? 'I am' : Bot === 'all' ? '*Everyone* is' : `*${Bot}* is`} now active`)
    }
}
