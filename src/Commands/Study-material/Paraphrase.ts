import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { studyAI, hasStudyAIKey, NO_AI_MSG, AI_ERROR_MSG } from '../../lib/StudyAI'

const SYSTEM = `You are an expert paraphrasing assistant. When given a piece of text:
1. Rewrite it completely in fresh words while keeping the exact same meaning.
2. Improve clarity and flow where possible.
3. Keep the same length (don't shorten too much or expand unnecessarily).
4. Output ONLY the paraphrased version — no explanation, no labels, no extra commentary.
Write in clear, natural English. Maintain the original tone (formal stays formal, casual stays casual).`

@Command('paraphrase', {
    description: 'Rewrite any text in fresh words while keeping the same meaning 🔄',
    category: 'study',
    usage: 'paraphrase <text>  OR  reply to a message with: paraphrase',
    aliases: ['rewrite', 'rephrase'],
    cooldown: 10,
    exp: 15,
    dm: true
})
export default class ParaphraseCommand extends BaseCommand {
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
                `🔄 *PARAPHRASE — Text Rewriter*\n` +
                `${'━'.repeat(28)}\n\n` +
                `❌ Please provide text to paraphrase!\n\n` +
                `📢 *How to use:*\n` +
                `  • \`${p}paraphrase <your text here>\`\n` +
                `  • Or *reply* to any message and type \`${p}paraphrase\`\n\n` +
                `💬 *Example:* \`${p}paraphrase The Earth revolves around the Sun taking 365 days to complete one full orbit.\``
            )

        if (inputText.length < 10)
            return void M.reply(`❌ Text is too short! Please provide at least 10 characters.`)

        if (inputText.length > 1500)
            return void M.reply(`❌ Text is too long! Please keep it under 1500 characters.`)

        if (!hasStudyAIKey())
            return void M.reply(NO_AI_MSG(p))

        await M.reply('🔄 _Rewriting your text... please wait!_ ⏳')

        const result = await studyAI(inputText, SYSTEM, 500)

        if (!result)
            return void M.reply(AI_ERROR_MSG())

        const preview = inputText.length > 80 ? inputText.slice(0, 80) + '...' : inputText

        return void M.reply(
            `🔄 *Rewritten*\n\n` +
            `${result}\n\n` +
            `_Original: "${preview}"_\n` +
            `_⚡ RedzeoX × Groq_`
        )
    }
}
