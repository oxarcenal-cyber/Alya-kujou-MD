/**
 * StudyAI — Shared OpenAI helper for all Study-material commands.
 * Uses gpt-4o-mini with a neutral, educational system tone.
 */
import OpenAI from 'openai'
import botConfig from '../config'

let _client: OpenAI | null = null

const getClient = (): OpenAI | null => {
    const key = (botConfig as any).GROQ_API_KEY || botConfig.OPENAI_API_KEY
    if (!key) return null
    if (!_client) _client = new OpenAI({
        apiKey: key,
        baseURL: (botConfig as any).GROQ_API_KEY
            ? 'https://api.groq.com/openai/v1'
            : undefined
    })
    return _client
}

/**
 * Call the AI with a custom system prompt and user prompt.
 * Returns null on failure/timeout/no key so callers can handle gracefully.
 */
export const studyAI = async (
    userPrompt: string,
    systemPrompt: string,
    maxTokens = 700
): Promise<string | null> => {
    const openai = getClient()
    if (!openai) return null

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 25_000)

    try {
        const completion = await openai.chat.completions.create(
            {
                model: (botConfig as any).GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user',   content: userPrompt  }
                ],
                max_tokens:  maxTokens,
                temperature: 0.3
            },
            { signal: controller.signal }
        )
        return completion.choices[0]?.message?.content?.trim() || null
    } catch {
        return null
    } finally {
        clearTimeout(timer)
    }
}

/** Returns true if any AI key (Groq or OpenAI) is set in config. */
export const hasStudyAIKey = (): boolean =>
    !!((botConfig as any).GROQ_API_KEY || botConfig.OPENAI_API_KEY)

/** Shown when no AI key is set in config. */
export const NO_AI_MSG = (prefix: string): string =>
    `❌ *AI Not Configured!*\n\n` +
    `📢 Bot owner needs to set *GROQ_API_KEY* in \`src/config.ts\` to use this command.\n\n` +
    `💡 Commands like *${prefix}formula*, *${prefix}flashcard*, and *${prefix}studytodo* still work without AI.`

/** Shown when key IS set but the API call failed (invalid key, timeout, rate limit, etc.) */
export const AI_ERROR_MSG = (): string =>
    `😔 *AI request failed!*\n\n` +
    `Possible reasons:\n` +
    `  • OpenAI API key is *invalid or expired* — update it in \`src/config.ts\`\n` +
    `  • OpenAI servers are temporarily down\n` +
    `  • Request timed out (try a shorter question)\n\n` +
    `Please try again in a moment. 🙏`
