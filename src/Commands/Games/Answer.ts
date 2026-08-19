import { BaseCommand, Command, Message } from '../../Structures'

@Command('answer', {
    description: 'Answer the ongoing quiz question 🎯',
    aliases: ['ans'],
    usage: 'answer <option number>',
    exp: 10,
    cooldown: 5,
    category: 'games'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const res = this.handler.quiz.quizResponse.get(M.from)

        if (!res)
            return void await this.client.sendMessage(M.from, {
                text:
                    `❌ *Is group mein koi quiz nahi chal raha!*\n\n` +
                    `📢 *How to use:* \`${prefix}quiz\` → quiz shuru karo\n` +
                    `Phir: \`${prefix}answer <option number>\``,
                footer: '🎀 RedzeoX Quiz',
                buttonsFormat: 'buttons',
                buttons: [{ text: '🎀 Start Quiz', id: `${prefix}quiz` }]
            } as any, { quoted: M.message })

        const arr = this.handler.quiz.failed.get(M.from) as string[]
        if (arr.includes(M.sender.jid))
            return void M.reply(
                `⏳ *Pehle se try kiya!*\n\n` +
                `Thoda wait karo aur dobara try karo.\n` +
                `📢 *How to use:* \`${prefix}answer <1/2/3/4>\``
            )

        if (!M.numbers.length)
            return void M.reply(
                `❌ Option number daalo!\n\n` +
                `📢 *How to use:* \`${prefix}answer 2\``
            )

        const correctIndex = res.options.indexOf(res.answer) + 1
        if (correctIndex !== M.numbers[0]) {
            arr.push(M.sender.jid)
            this.handler.quiz.failed.set(M.from, arr)
            return void M.reply(
                `❌ *Galat jawab!*\n\n` +
                `Option *${M.numbers[0]}* sahi nahi hai. Dobara try karo!\n` +
                `📢 *How to use:* \`${prefix}answer <1/2/3/4>\``
            )
        }

        // Clear quiz state BEFORE rewarding to prevent repeated-answer exploit
        this.handler.quiz.quizResponse.delete(M.from)
        this.handler.quiz.failed.delete(M.from)
        this.handler.quiz.creator.delete(M.from)

        const exp = Math.floor(Math.random() * 251)
        await this.client.DB.setExp(M.sender.jid, exp)
        return void await this.client.sendMessage(M.from, {
            text:
                `🎉 *SAHI JAWAB!*\n\n` +
                `✅ Correct! Tumne *${exp} experience* kamaya!\n\n` +
                `📢 Aur quiz: \`${prefix}quiz\``,
            footer: '🎀 RedzeoX Quiz',
            buttonsFormat: 'buttons',
            buttons: [{ text: '🎀 New Quiz', id: `${prefix}quiz` }]
        } as any, { quoted: M.message })
    }
}
