import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { studyAI, hasStudyAIKey, NO_AI_MSG, AI_ERROR_MSG } from '../../lib/StudyAI'

const SYSTEM = `You are an expert essay writer helping students. When given an essay topic:
Write a well-structured short essay with these sections:
1. Introduction (2-3 sentences) — introduce the topic and state your thesis.
2. Body Paragraph 1 — main point with 1-2 supporting sentences.
3. Body Paragraph 2 — second point with 1-2 supporting sentences.
4. Conclusion (2 sentences) — summarize and close.
Label each section clearly like "📌 Introduction:", "📌 Body 1:", "📌 Body 2:", "📌 Conclusion:".
Keep the total essay under 220 words. Write in clear, academic English. No markdown headers.`

@Command('essay', {
    description: 'Generate a structured essay or paragraph on any topic ✍️',
    category: 'study',
    usage: 'essay <topic>',
    aliases: ['writeessay', 'paragraph'],
    cooldown: 15,
    exp: 20,
    dm: true
})
export default class EssayCommand extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const p = this.client.config.prefix
        const topic = context.trim()

        if (!topic)
            return void M.reply(
                `✍️ *ESSAY WRITER*\n` +
                `${'━'.repeat(28)}\n\n` +
                `❌ Please provide a topic for the essay!\n\n` +
                `📢 *How to use:* \`${p}essay <topic>\`\n\n` +
                `💬 *Examples:*\n` +
                `  • \`${p}essay Global Warming\`\n` +
                `  • \`${p}essay The Importance of Education\`\n` +
                `  • \`${p}essay Social Media Pros and Cons\`\n` +
                `  • \`${p}essay Space Exploration Benefits\``
            )

        if (topic.length > 150)
            return void M.reply(`❌ Topic is too long! Please keep it under 150 characters.`)

        if (!hasStudyAIKey())
            return void M.reply(NO_AI_MSG(p))

        await M.reply('✍️ _Writing your essay... please wait!_ ⏳')

        const essay = await studyAI(`Write an essay on: ${topic}`, SYSTEM, 600)

        if (!essay)
            return void M.reply(AI_ERROR_MSG())

        return void M.reply(
            `✍️ *Essay — ${topic}*\n\n` +
            `${essay}\n\n` +
            `_⚡ RedzeoX × Groq_`
        )
    }
}
