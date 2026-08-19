import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { Rias, askRias, t } from '../../lib'
import botConfig from '../../config'

@Command('chat', {
    description: 'Chat with Rias 🤖',
    category: 'fun',
    usage: 'chat <message>',
    aliases: ['bot'],
    exp: 15,
    cooldown: 3,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const prefix = this.client.config.prefix
        const text = context.trim()

        const lang = await this.getLang(M)

        if (!((botConfig as any).GROQ_API_KEY || botConfig.OPENAI_API_KEY))
            return void M.reply(t('fun_chat_not_configured', lang))

        // Group mein chatbot enabled hai ya nahi check karo
        if (M.chat === 'group') {
            const data = await this.client.DB.getGroup(M.from)
            const enabled = (data as any).groupChatbot as boolean
            if (!enabled)
                return void M.reply(t('fun_chat_disabled_group', lang, { prefix }))
        }

        if (!text)
            return void M.reply(t('fun_chat_prompt', lang, { prefix }))

        try {
            const reply = await askRias(text, M.sender.jid)
            return void M.reply(reply ? Rias.chatReply(reply) : Rias.chatFallback())
        } catch {
            return void M.reply(Rias.chatFallback())
        }
    }
}
