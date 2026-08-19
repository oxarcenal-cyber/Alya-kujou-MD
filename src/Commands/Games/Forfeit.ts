import { BaseCommand, Command, Message } from '../../Structures'

@Command('forfeit', {
    description: 'Forfeit the ongoing quiz in this group 🏳️',
    aliases: ['ff'],
    category: 'games',
    exp: 20,
    cooldown: 15,
    usage: 'forfeit'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const res = this.handler.quiz.quizResponse.get(M.from)
        if (!res)
            return void M.reply(
                `❌ *Koi quiz nahi chal raha is group mein!*\n\n` +
                `📢 *How to use:* \`${prefix}quiz\` → quiz shuru karo\n` +
                `_Sirf quiz creator forfeit kar sakta hai_`
            )

        const creator = this.handler.quiz.creator.get(M.from) || M.sender.jid
        if (creator !== M.sender.jid)
            return void M.reply(
                `❌ *Sirf quiz shuru karne wala forfeit kar sakta hai!*\n\n` +
                `📢 *How to use:* Pehle quiz shuru karo: \`${prefix}quiz\``
            )

        for (const key in this.handler.quiz) {
            this.handler.quiz[key as 'quizResponse'].delete(M.from)
        }

        return void await this.client.sendMessage(M.from, {
            text:
                `🏳️ *QUIZ FORFEITED!*\n\n` +
                `Quiz band kar di gayi.\n\n` +
                `📢 Naya quiz: \`${prefix}quiz\``,
            footer: '🎀 RedzeoX Quiz',
            buttonsFormat: 'buttons',
            buttons: [{ text: '🎀 New Quiz', id: `${prefix}quiz` }]
        } as any, { quoted: M.message })
    }
}
