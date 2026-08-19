import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('chatbot', {
    description: 'enable/disable private message chat bot feature.',
    category: 'dev',
    usage: 'chatbot enable/disable',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) {
            const p = this.client.config.prefix
            const text =
                `🤖 *Chatbot Feature*\n\n` +
                `Enable/Disable chatbot in bot's personal DM.\n\n` +
                `📌 *Commands:*\n` +
                `  ▸ \`${p}chatbot enable\`  — Turn ON\n` +
                `  ▸ \`${p}chatbot disable\` — Turn OFF`
            return void M.reply(text)
        }
        const key = context.toLowerCase().trim()
        const action = key === 'enable' ? true : false
        await this.client.DB.updateFeature('chatbot', action)
        return void M.reply(`${action === true ? '🟩' : '🟥'} ${action === true ? 'Enabled' : 'Disabled'}`)
    }
}

interface IRows {
    title: string
    rowId: string
    description?: string
}
