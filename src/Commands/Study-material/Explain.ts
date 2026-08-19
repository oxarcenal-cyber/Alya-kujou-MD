import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { studyAI, hasStudyAIKey, NO_AI_MSG, AI_ERROR_MSG } from '../../lib/StudyAI'

const SYSTEM = `You are a brilliant teacher who explains complex topics in a very simple, engaging way.
When asked to explain a topic:
- Start with a 1-sentence definition.
- Then explain it like the student is 15 years old — use analogies, everyday examples.
- Mention 2-3 key points or facts about the topic.
- End with a real-life application or interesting fact.
- Keep response between 100-180 words. Use plain text with *bold* for key terms.
- No markdown headers. Be conversational and friendly.`

@Command('explain', {
    description: 'Get a simple, clear explanation of any topic 💡',
    category: 'study',
    usage: 'explain <topic>',
    aliases: ['whatis', 'definition2'],
    cooldown: 10,
    exp: 15,
    dm: true
})
export default class ExplainCommand extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const p = this.client.config.prefix
        const topic = context.trim()

        if (!topic)
            return void M.reply(
                `💡 *EXPLAIN — Topic Explainer*\n` +
                `${'━'.repeat(28)}\n\n` +
                `❌ Please provide a topic to explain!\n\n` +
                `📢 *How to use:* \`${p}explain <topic>\`\n\n` +
                `💬 *Examples:*\n` +
                `  • \`${p}explain Black Holes\`\n` +
                `  • \`${p}explain Photosynthesis\`\n` +
                `  • \`${p}explain DNA Replication\`\n` +
                `  • \`${p}explain Supply and Demand\``
            )

        if (topic.length > 200)
            return void M.reply(`❌ Topic name is too long! Please keep it under 200 characters.`)

        if (!hasStudyAIKey())
            return void M.reply(NO_AI_MSG(p))

        await M.reply('💡 _Preparing explanation... please wait!_ ⏳')

        const explanation = await studyAI(`Explain: ${topic}`, SYSTEM, 400)

        if (!explanation)
            return void M.reply(AI_ERROR_MSG())

        return void M.reply(
            `💡 *${topic}*\n\n` +
            `${explanation}\n\n` +
            `_⚡ RedzeoX × Groq_`
        )
    }
}
