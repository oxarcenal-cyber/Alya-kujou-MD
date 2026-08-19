import { Command, BaseCommand, Message } from '../../Structures'
import { SMASHBOOM_LINES } from '../../lib/SmashBoomLines'

@Command('surprise', {
    description: 'Sends you a random surprise line! 🫢',
    category: 'fun',
    usage: 'surprise',
    aliases: ['sus'],
    cooldown: 5,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const line = SMASHBOOM_LINES[Math.floor(Math.random() * SMASHBOOM_LINES.length)]
        const username = M.sender.jid.split('@')[0]
        return void await this.client.sendMessage(
            M.from,
            {
                text: `🫢 *Surprise, @${username}!*\n\n💌 ${line}`,
                mentions: [M.sender.jid]
            },
            { quoted: M.message }
        )
    }
}
