"use strict";
/**
 * GroqFun — Lightweight Groq/OpenAI helper specifically for Fun commands.
 * Returns a plain string or null (on failure/no key). Always safe to call —
 * falls back to null so callers can use their hardcoded fallback lists.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAiKey = exports.askGroq = void 0;
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
const MODEL = () => config_1.default.GROQ_API_KEY ? 'llama-3.1-8b-instant' : 'gpt-4o-mini';
const TIMEOUT_MS = 6000;
/**
 * Ask Groq/OpenAI a simple prompt, return the response string or null.
 * @param prompt  The user prompt to send.
 * @param maxTokens  Max tokens in reply (default 120).
 */
const askGroq = async (prompt, maxTokens = 120) => {
    const client = getClient();
    if (!client)
        return null;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await client.chat.completions.create({
            model: MODEL(),
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens,
            temperature: 0.95
        }, { signal: controller.signal });
        return res.choices[0]?.message?.content?.trim() || null;
    }
    catch {
        return null;
    }
    finally {
        clearTimeout(timer);
    }
};
exports.askGroq = askGroq;
/** Returns true if any AI key is configured. */
const hasAiKey = () => !!(config_1.default.GROQ_API_KEY || config_1.default.OPENAI_API_KEY);
exports.hasAiKey = hasAiKey;
