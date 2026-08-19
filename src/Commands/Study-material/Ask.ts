import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { studyAI, hasStudyAIKey, NO_AI_MSG, AI_ERROR_MSG } from '../../lib/StudyAI'

const SYSTEM = `You are an expert academic tutor. Answer the student's question clearly and concisely.
- Use simple, easy-to-understand English.
- For factual/science/math questions: give accurate, direct answers.
- Add a short example or analogy if it helps understanding.
- Keep your response under 200 words unless more detail is truly necessary.
- Use bullet points or numbered steps when listing information.
- Do NOT use markdown headers like ## or ***. Use plain text with asterisks for bold (*word*).`

@Command('ask', {
    description: 'Ask any academic question and get an AI-powered answer 🤖',
    category: 'study',
    usage: 'ask <your question>',
    aliases: ['question', 'studyask'],
    cooldown: 10,
    exp: 15,
    dm: true
})
export default class AskCommand extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const p = this.client.config.prefix
        const question = context.trim()

        if (!question)
            return void M.reply(
                `🤖 *ASK — AI Study Assistant*\n` +
                `${'━'.repeat(28)}\n\n` +
                `❓ Please provide a question!\n\n` +
                `📢 *How to use:* \`${p}ask <your question>\`\n\n` +
                `💬 *Examples:*\n` +
                `  • \`${p}ask What is photosynthesis?\`\n` +
                `  • \`${p}ask Explain Newton's 3rd law\`\n` +
                `  • \`${p}ask What causes earthquakes?\``
            )

        if (question.length > 500)
            return void M.reply(`❌ Question is too long! Please keep it under 500 characters.`)

        if (!hasStudyAIKey())
            return void M.reply(NO_AI_MSG(p))

        await M.reply('🤖 _Thinking... please wait a moment!_ ⏳')

        const answer = await studyAI(question, SYSTEM, 500)

        if (!answer)
            return void M.reply(AI_ERROR_MSG())

        return void M.reply(
            `🤖 *Answer*\n\n` +
            `${answer}\n\n` +
            `_⚡ RedzeoX × Groq_`
        )
    }
}
