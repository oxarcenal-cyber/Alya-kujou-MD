/**
 * GroqFun — Lightweight Groq/OpenAI helper specifically for Fun commands.
 * Returns a plain string or null (on failure/no key). Always safe to call —
 * falls back to null so callers can use their hardcoded fallback lists.
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

const MODEL = () =>
    (botConfig as any).GROQ_API_KEY ? 'llama-3.1-8b-instant' : 'gpt-4o-mini'

const TIMEOUT_MS = 6_000

/**
 * Ask Groq/OpenAI a simple prompt, return the response string or null.
 * @param prompt  The user prompt to send.
 * @param maxTokens  Max tokens in reply (default 120).
 */
export const askGroq = async (
    prompt: string,
    maxTokens = 120
): Promise<string | null> => {
    const client = getClient()
    if (!client) return null

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
        const res = await client.chat.completions.create(
            {
                model: MODEL(),
                messages: [{ role: 'user', content: prompt }],
                max_tokens: maxTokens,
                temperature: 0.95
            },
            { signal: controller.signal }
        )
        return res.choices[0]?.message?.content?.trim() || null
    } catch {
        return null
    } finally {
        clearTimeout(timer)
    }
}

/** Returns true if any AI key is configured. */
export const hasAiKey = (): boolean =>
    !!((botConfig as any).GROQ_API_KEY || botConfig.OPENAI_API_KEY)
