import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { studyAI, hasStudyAIKey, NO_AI_MSG, AI_ERROR_MSG } from '../../lib/StudyAI'

const SYSTEM = `You are an expert math and science problem solver. When given a problem:
1. Identify what type of problem it is (algebra, geometry, physics, etc.)
2. List the given information / known values
3. Write the formula or method you will use
4. Show each calculation step clearly, one step per line
5. Box or highlight the final answer at the end with "✅ Final Answer: ..."
Keep steps concise but complete. Use plain text — no markdown headers.
For word problems, extract variables and set up the equation first.`

@Command('solve', {
    description: 'Solve math or science problems with step-by-step explanation 🔢',
    category: 'study',
    usage: 'solve <problem or equation>',
    aliases: ['mathsolve', 'calculate2'],
    cooldown: 10,
    exp: 15,
    dm: true
})
export default class SolveCommand extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const p = this.client.config.prefix
        const problem = context.trim()

        if (!problem)
            return void M.reply(
                `🔢 *SOLVE — Step-by-Step Problem Solver*\n` +
                `${'━'.repeat(28)}\n\n` +
                `❌ Please provide a problem to solve!\n\n` +
                `📢 *How to use:* \`${p}solve <problem>\`\n\n` +
                `💬 *Examples:*\n` +
                `  • \`${p}solve 2x + 5 = 13\`\n` +
                `  • \`${p}solve x² - 9 = 0\`\n` +
                `  • \`${p}solve Find the area of a circle with radius 7cm\`\n` +
                `  • \`${p}solve A train travels 60km/h for 2.5 hours, find distance\``
            )

        if (problem.length > 400)
            return void M.reply(`❌ Problem is too long! Please keep it under 400 characters.`)

        if (!hasStudyAIKey())
            return void M.reply(NO_AI_MSG(p))

        await M.reply('🔢 _Solving step-by-step... please wait!_ ⏳')

        const solution = await studyAI(problem, SYSTEM, 600)

        if (!solution)
            return void M.reply(AI_ERROR_MSG())

        return void M.reply(
            `🔢 *Solution*\n\n` +
            `${solution}\n\n` +
            `_⚡ RedzeoX × Groq_`
        )
    }
}
