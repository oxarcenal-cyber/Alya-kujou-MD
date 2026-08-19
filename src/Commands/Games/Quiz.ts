import { Quiz } from 'anime-quiz'
import { Command, BaseCommand, Message } from '../../Structures'

@Command('quiz', {
    description: 'starts a quiz',
    exp: 10,
    cooldown: 60,
    category: 'games',
    usage: 'quiz'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        if (this.handler.quiz.quizResponse.has(M.from)) return void M.reply(`There's a quiz ongoing in this group. Use ${this.client.config.prefix}forfeit to forfeit the quiz.`)
        const quiz = new Quiz().getRandom()
        this.handler.quiz.creator.set(M.from, M.sender.jid)
        this.handler.quiz.quizResponse.set(M.from, quiz)
        this.handler.quiz.failed.set(M.from, [])
        let text = ''
        text += `🎀 *Question: ${quiz.question}*\n\n`
        for (let i = 0; i < quiz.options.length; i++) text += `*${i + 1}) ${quiz.options[i]}*\n`
        text += `\n📒 *Note: You only have 60 seconds to answer.*`
        const prefix = this.client.config.prefix
        await this.client.sendMessage(
            M.from,
            {
                text,
                footer: '🎀 RedzeoX Quiz',
                buttons: [{
                    text: '📝 Choose Answer',
                    sections: [{
                        title: '🎯 Select your answer',
                        rows: quiz.options.map((opt: string, i: number) => ({
                            title: `${i + 1}) ${opt}`,
                            id:    `${prefix}answer ${i + 1}`,
                            description: `Option ${i + 1} choose karo`
                        }))
                    }]
                }]
            } as any,
            { quoted: M.message }
        )
        setTimeout(async () => {
            const res = this.handler.quiz.quizResponse.get(M.from)
            if (!res) return void null
            for (const key in this.handler.quiz) this.handler.quiz[key as 'quizResponse'].delete(M.from)
            return void await this.client.sendMessage(M.from, {
                text: `🕕 Timed out! The correct answer was *${res.options.indexOf(res.answer) + 1}) ${res.answer}.*`,
                footer: '🎀 RedzeoX Quiz',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎀 New Quiz', id: `${prefix}quiz` }]
            } as any)
        }, 60 * 1000)
    }
}
