"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_ERROR_MSG = exports.NO_AI_MSG = exports.hasStudyAIKey = exports.studyAI = void 0;
/**
 * StudyAI — Shared OpenAI helper for all Study-material commands.
 * Uses gpt-4o-mini with a neutral, educational system tone.
 */
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
let _client = null;
const getClient = () => {
    const key = config_1.default.GROQ_API_KEY || config_1.default.OPENAI_API_KEY;
    if (!key)
        return null;
    if (!_client)
        _client = new openai_1.default({
            apiKey: key,
            baseURL: config_1.default.GROQ_API_KEY
                ? 'https://api.groq.com/openai/v1'
                : undefined
        });
    return _client;
};
/**
 * Call the AI with a custom system prompt and user prompt.
 * Returns null on failure/timeout/no key so callers can handle gracefully.
 */
const studyAI = async (userPrompt, systemPrompt, maxTokens = 700) => {
    const openai = getClient();
    if (!openai)
        return null;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
        const completion = await openai.chat.completions.create({
            model: config_1.default.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: maxTokens,
            temperature: 0.3
        }, { signal: controller.signal });
        return completion.choices[0]?.message?.content?.trim() || null;
    }
    catch {
        return null;
    }
    finally {
        clearTimeout(timer);
    }
};
exports.studyAI = studyAI;
/** Returns true if any AI key (Groq or OpenAI) is set in config. */
const hasStudyAIKey = () => !!(config_1.default.GROQ_API_KEY || config_1.default.OPENAI_API_KEY);
exports.hasStudyAIKey = hasStudyAIKey;
/** Shown when no AI key is set in config. */
const NO_AI_MSG = (prefix) => `❌ *AI Not Configured!*\n\n` +
    `📢 Bot owner needs to set *GROQ_API_KEY* in \`src/config.ts\` to use this command.\n\n` +
    `💡 Commands like *${prefix}formula*, *${prefix}flashcard*, and *${prefix}studytodo* still work without AI.`;
exports.NO_AI_MSG = NO_AI_MSG;
/** Shown when key IS set but the API call failed (invalid key, timeout, rate limit, etc.) */
const AI_ERROR_MSG = () => `😔 *AI request failed!*\n\n` +
    `Possible reasons:\n` +
    `  • OpenAI API key is *invalid or expired* — update it in \`src/config.ts\`\n` +
    `  • OpenAI servers are temporarily down\n` +
    `  • Request timed out (try a shorter question)\n\n` +
    `Please try again in a moment. 🙏`;
exports.AI_ERROR_MSG = AI_ERROR_MSG;
