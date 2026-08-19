import { BaseCommand, Command, Message } from '../../Structures'
import { getPersonaName } from '../../lib'

@Command('hi', {
    description: 'Says hello to the bot',
    category: 'general',
    usage: 'hi',
    aliases: ['hello'],
    exp: 25,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> =>
        void (await M.reply(
            `Hey! 😺 You There 🔖 *${M.sender.username}* I'm ${getPersonaName(this.client.config.persona)} Nice To Meet Yeahh 🎐`
        ))
}
