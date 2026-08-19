import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { studyAI, hasStudyAIKey, NO_AI_MSG, AI_ERROR_MSG } from '../../lib/StudyAI'

const SYSTEM = `You are a professional grammar checker and English teacher.
When given a piece of text:
1. Show the corrected version of the full text first under "✅ Corrected:".
2. Then list the specific mistakes found under "🔍 Mistakes Found:" — number each one.
   Format: "1. [original] → [corrected] — reason"
3. If no mistakes found, say so and give a compliment.
4. Keep your response concise and educational. No markdown headers. Use plain text.`

@Command('grammar', {
    description: 'Check & correct grammar mistakes in your text ✅',
    category: 'study',
    usage: 'grammar <text>  OR  reply to a message with: grammar',
    aliases: ['grammarcheck', 'gc', 'spellcheck'],
    cooldown: 10,
    exp: 15,
    dm: true
})
export default class GrammarCommand extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const p = this.client.config.prefix

        // Support replying to a message
        const quoted = (M.message as any)?.extendedTextMessage?.contextInfo?.quotedMessage
        const quotedText: string =
            quoted?.conversation ||
            quoted?.extendedTextMessage?.text ||
            ''

        const inputText = context.trim() || quotedText.trim()

        if (!inputText)
            return void M.reply(
                `✅ *GRAMMAR CHECKER*\n` +
                `${'━'.repeat(28)}\n\n` +
                `❌ Please provide text to check!\n\n` +
                `📢 *How to use:*\n` +
                `  • \`${p}grammar <your text here>\`\n` +
                `  • Or *reply* to any message and type \`${p}grammar\`\n\n` +
                `💬 *Example:* \`${p}grammar She don't like to goes school\``
            )

        if (inputText.length < 5)
            return void M.reply(`❌ Text is too short! Please provide at least 5 characters.`)

        if (inputText.length > 1500)
            return void M.reply(`❌ Text is too long! Please keep it under 1500 characters.`)

        if (!hasStudyAIKey())
            return void M.reply(NO_AI_MSG(p))

        await M.reply('✅ _Checking grammar... please wait!_ ⏳')

        const result = await studyAI(inputText, SYSTEM, 500)

        if (!result)
            return void M.reply(AI_ERROR_MSG())

        const preview = inputText.length > 80 ? inputText.slice(0, 80) + '...' : inputText

        return void M.reply(
            `✅ *Grammar Check*\n\n` +
            `${result}\n\n` +
            `_Original: "${preview}"_\n` +
            `_⚡ RedzeoX × Groq_`
        )
    }
}
