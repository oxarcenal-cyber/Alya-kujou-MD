"use strict";
/**
 * RoxyBrain — The core brain behind Roxy, the advanced AI study assistant.
 *
 * Features:
 *  • Per-user profile with student detection, grade, and conversation history
 *  • Auto language detection (Hindi/Hinglish ↔ English)
 *  • OpenAI gpt-4o-mini with dynamic system prompt built from user profile
 *  • Awaiting-state export so Message.ts can intercept non-prefix replies
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRoxyReply = exports.ROXY_ERROR = exports.ROXY_NO_AI = exports.ROXY_NON_STUDENT = exports.ROXY_CONFIRMED_STUDENT = exports.ROXY_ASK_GRADE = exports.ROXY_INTRO = exports.askRoxy = exports.detectLang = exports.resetProfile = exports.updateProfile = exports.getProfile = exports.roxyAwaitingUsers = exports.roxyProfiles = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
// ── OpenAI client (lazy init) ────────────────────────────────────────────────
let _openai = null;
const getOpenAI = () => {
    const key = config_1.default.GROQ_API_KEY || config_1.default.OPENAI_API_KEY;
    if (!key)
        return null;
    if (!_openai)
        _openai = new openai_1.default({
            apiKey: key,
            baseURL: config_1.default.GROQ_API_KEY
                ? 'https://api.groq.com/openai/v1'
                : undefined
        });
    return _openai;
};
// ── Global Maps ──────────────────────────────────────────────────────────────
/** Full profile store — per user JID */
exports.roxyProfiles = new Map();
/**
 * Users currently waiting for a reply to Roxy's question (no prefix needed).
 * Message.ts imports this to intercept raw messages.
 */
exports.roxyAwaitingUsers = new Set();
// ── Profile helpers ──────────────────────────────────────────────────────────
const getProfile = (jid) => {
    if (!exports.roxyProfiles.has(jid)) {
        exports.roxyProfiles.set(jid, {
            state: 'new',
            isStudent: null,
            grade: null,
            name: null,
            subjects: [],
            lang: 'auto',
            history: [],
            totalQ: 0,
            createdAt: Date.now(),
            lastSeen: Date.now()
        });
    }
    return exports.roxyProfiles.get(jid);
};
exports.getProfile = getProfile;
const updateProfile = (jid, patch) => {
    const p = (0, exports.getProfile)(jid);
    Object.assign(p, patch, { lastSeen: Date.now() });
    // Sync awaiting set
    if (patch.state === 'awaiting_student' || patch.state === 'awaiting_grade') {
        exports.roxyAwaitingUsers.add(jid);
    }
    else {
        exports.roxyAwaitingUsers.delete(jid);
    }
};
exports.updateProfile = updateProfile;
const resetProfile = (jid) => {
    exports.roxyProfiles.delete(jid);
    exports.roxyAwaitingUsers.delete(jid);
};
exports.resetProfile = resetProfile;
// ── Language detection ───────────────────────────────────────────────────────
const HINDI_WORDS = /\b(kya|hai|haan|nahi|mujhe|tumhe|aap|tum|mera|tera|yeh|vo|woh|kaise|kab|kahan|kyun|bahut|thoda|accha|theek|bhai|yaar|padh|batao|samjhao|matlab|sirf|abhi|phir|lekin|aur|toh|kar|ho|ek|do|teen|main|hum)\b/i;
const DEVANAGARI = /[\u0900-\u097F]/;
const detectLang = (text) => {
    if (DEVANAGARI.test(text) || HINDI_WORDS.test(text))
        return 'hi';
    return 'en';
};
exports.detectLang = detectLang;
const isYes = (t) => /^(yes|haan|ha|haa|han|yep|yeah|yup|bilkul|zarur|sure|ok|okay)\b/i.test(t.trim());
const isNo = (t) => /^(no|nahi|nope|nah|nahin|mat|never|nhi)\b/i.test(t.trim());
// ── System prompt builder ─────────────────────────────────────────────────────
const buildSystemPrompt = (profile, msgLang) => {
    const langRule = msgLang === 'hi'
        ? `LANGUAGE: The student is writing in Hindi/Hinglish. Respond ONLY in friendly Hinglish (Hindi-English mix, Latin script — like "Haan bilkul! Yeh concept bahut important hai..."). Never use Devanagari script.`
        : `LANGUAGE: Respond in clear, friendly English.`;
    let profileCtx = '';
    if (profile.isStudent && profile.grade)
        profileCtx = `Student grade/level: ${profile.grade}. Tailor explanations to this level.`;
    else if (profile.isStudent)
        profileCtx = `Confirmed student (grade not provided). Use clear, general academic explanations.`;
    else
        profileCtx = `This user is NOT a student. Help briefly with simple queries but gently note your specialty is academic study help.`;
    return `You are "Roxy" — a warm, brilliant, and proactive AI study assistant built into a WhatsApp bot.

═══ IDENTITY ═══
• Name: Roxy (never reveal you are an AI or made by OpenAI — you are always Roxy)
• Purpose: Help students learn, solve problems, and ace their exams
• Vibe: Like that smart senior friend who genuinely loves teaching — encouraging, patient, a little playful

═══ ${langRule} ═══

═══ STUDENT CONTEXT ═══
${profileCtx}

═══ KNOWLEDGE & ANSWERING STYLE ═══
• Expert in ALL school/college subjects: Mathematics, Physics, Chemistry, Biology, History, Geography, English Literature, Economics, Computer Science, Political Science, Psychology, and more
• Math problems → solve STEP-BY-STEP with each calculation shown clearly
• Concepts → 1-sentence definition → simple analogy → real-life example
• Formulas → write formula → define variables → quick example
• Essays/writing → structured: intro, body, conclusion
• Exam prep → key points, mnemonics, memory tricks
• Use bullet points (•) for lists, numbered steps for procedures
• NO markdown headers (##) — this is WhatsApp
• Keep responses focused and complete — not a wall of text, not too short

═══ PERSONALITY ═══
• Start answers warmly but get to the point — don't repeat the question back
• After answering, SOMETIMES (not every time) add ONE friendly follow-up:
  — "Want more detail on any part? 😊"
  — "Shall I give a practice question on this? 📝"  
  — "Is this clear, or want an example? ✨"
• Celebrate great questions occasionally: "Ooh great question! 🌟", "You're thinking like a topper! 💪"
• If something is unclear, ask for clarification rather than guessing
• If you're not sure about something, say "I'm not 100% sure, but..." — never give wrong info confidently
• Keep it real and conversational — WhatsApp, not a textbook`;
};
// ── Core AI call ─────────────────────────────────────────────────────────────
const askRoxy = async (jid, message) => {
    const openai = getOpenAI();
    if (!openai)
        return null;
    const profile = (0, exports.getProfile)(jid);
    const msgLang = (0, exports.detectLang)(message);
    const systemPrompt = buildSystemPrompt(profile, msgLang);
    // Build history (keep last 10 messages = 5 exchanges)
    const history = profile.history.slice(-10);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
        const completion = await openai.chat.completions.create({
            model: config_1.default.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                ...history,
                { role: 'user', content: message }
            ],
            max_tokens: 700,
            temperature: 0.5
        }, { signal: controller.signal });
        const reply = completion.choices[0]?.message?.content?.trim() || null;
        if (reply) {
            // Save exchange to history
            profile.history.push({ role: 'user', content: message });
            profile.history.push({ role: 'assistant', content: reply });
            if (profile.history.length > 14)
                profile.history = profile.history.slice(-14);
            profile.totalQ++;
            profile.lastSeen = Date.now();
        }
        return reply;
    }
    catch {
        return null;
    }
    finally {
        clearTimeout(timer);
    }
};
exports.askRoxy = askRoxy;
// ── Onboarding messages ───────────────────────────────────────────────────────
const ROXY_INTRO = (prefix, lang) => lang === 'hi'
    ? `🌟 *Hey! Main hun Roxy!* 🌟\n` +
        `${'━'.repeat(28)}\n\n` +
        `Main ek smart study assistant hun — tumhari padhai mein help karne ke liye hamesha ready! 📚\n\n` +
        `Main kar sakti hun:\n` +
        `  • ❓ Kisi bhi subject ke questions answer karna\n` +
        `  • 🔢 Math step-by-step solve karna\n` +
        `  • 💡 Koi bhi concept simple tarike se explain karna\n` +
        `  • 📝 Essay likhne mein help karna\n` +
        `  • 📋 Practice MCQs banana\n` +
        `  • aur bahut kuch... ✨\n\n` +
        `${'━'.repeat(28)}\n` +
        `Ek quick sawaal pehle — *Kya tum ek student ho?* 🎓\n\n` +
        `_(Bolo: *haan* ya *nahi*)_`
    : `🌟 *Hey there! I'm Roxy!* 🌟\n` +
        `${'━'.repeat(28)}\n\n` +
        `I'm your personal AI study assistant — always ready to help you learn and grow! 📚\n\n` +
        `I can help with:\n` +
        `  • ❓ Answering questions from any subject\n` +
        `  • 🔢 Solving Math step-by-step\n` +
        `  • 💡 Explaining any concept simply\n` +
        `  • 📝 Writing essays and paragraphs\n` +
        `  • 📋 Creating practice MCQs\n` +
        `  • And a whole lot more... ✨\n\n` +
        `${'━'.repeat(28)}\n` +
        `Quick question first — *Are you a student?* 🎓\n\n` +
        `_(Reply: *yes* or *no*)_`;
exports.ROXY_INTRO = ROXY_INTRO;
const ROXY_ASK_GRADE = (lang) => lang === 'hi'
    ? `🎉 *Welcome, student!* Main bahut khush hun tum se milke! 😊\n\n` +
        `Ek aur sawaal — *Tum konsi class/grade mein ho?* 📖\n` +
        `_(jaise: 10th, 12th, BSc 1st Year, JEE prep, etc.)_\n\n` +
        `_Agar skip karna ho toh "skip" likho._`
    : `🎉 *Welcome aboard, student!* So happy to meet you! 😊\n\n` +
        `One more thing — *Which grade/class are you in?* 📖\n` +
        `_(e.g.: 10th, 12th, BSc 1st Year, JEE prep, etc.)_\n\n` +
        `_Type "skip" to skip this._`;
exports.ROXY_ASK_GRADE = ROXY_ASK_GRADE;
const ROXY_CONFIRMED_STUDENT = (grade, lang) => {
    const gradeStr = grade ? ` (${grade})` : '';
    return lang === 'hi'
        ? `✅ *Perfect!* Ab main teri padhai mein poori tarah help karne ke liye ready hun! 🚀\n\n` +
            `📚 Teri profile set ho gayi hai${gradeStr}.\n\n` +
            `*Ab seedha koi bhi question poochh — koi bhi subject, koi bhi topic!* 😊\n` +
            `_Mujhe use karne ke liye: \`-roxy <tera sawaal>\`_`
        : `✅ *All set!* I'm now fully ready to be your study buddy! 🚀\n\n` +
            `📚 Your profile has been saved${gradeStr}.\n\n` +
            `*Ask me anything — any subject, any topic!* 😊\n` +
            `_To chat with me: \`-roxy <your question>\`_`;
};
exports.ROXY_CONFIRMED_STUDENT = ROXY_CONFIRMED_STUDENT;
const ROXY_NON_STUDENT = (lang) => lang === 'hi'
    ? `😊 *Koi baat nahi!*\n\n` +
        `Main basically students ki padhai ke liye hun, isliye main sirf study related help karti hun.\n\n` +
        `Lekin agar kabhi *kuch bhi seekhna ho, koi topic samajhna ho, ya koi sawaal ho* — bas bolo! Main hamesha hun. 🌟\n\n` +
        `_Sawaal poochne ke liye: \`-roxy <sawaal>\`_`
    : `😊 *No worries!*\n\n` +
        `I'm primarily a study assistant for students, so I focus on academic help.\n\n` +
        `But if you ever want to *learn something, explore a topic, or ask a question* — I'm always here! 🌟\n\n` +
        `_To ask me anything: \`-roxy <question>\`_`;
exports.ROXY_NON_STUDENT = ROXY_NON_STUDENT;
const ROXY_NO_AI = (prefix) => `❌ *Roxy is not configured!*\n\n` +
    `📢 Bot owner needs to set *GROQ_API_KEY* in \`src/config.ts\` for Roxy to work.`;
exports.ROXY_NO_AI = ROXY_NO_AI;
const ROXY_ERROR = (lang) => lang === 'hi'
    ? `😔 *Oops!* Abhi mujhe kuch problem aa rahi hai... thodi der baad try karo? 🙏`
    : `😔 *Oops!* I'm having a little trouble right now... please try again in a moment? 🙏`;
exports.ROXY_ERROR = ROXY_ERROR;
// ── Handle onboarding replies (called from Message.ts for awaiting users) ─────
const handleRoxyReply = async (jid, message, sendReply) => {
    const profile = (0, exports.getProfile)(jid);
    const lang = (0, exports.detectLang)(message);
    const clean = message.trim().toLowerCase();
    // ── Awaiting student yes/no ──────────────────────────────────────────────
    if (profile.state === 'awaiting_student') {
        if (isYes(clean)) {
            (0, exports.updateProfile)(jid, { isStudent: true, state: 'awaiting_grade' });
            return sendReply((0, exports.ROXY_ASK_GRADE)(lang));
        }
        if (isNo(clean)) {
            (0, exports.updateProfile)(jid, { isStudent: false, state: 'active_non_student' });
            return sendReply((0, exports.ROXY_NON_STUDENT)(lang));
        }
        // Unclear reply — ask again
        return sendReply(lang === 'hi'
            ? `🤔 Samajh nahi aaya! Bas *haan* ya *nahi* bolo 😊`
            : `🤔 I didn't catch that! Please reply with *yes* or *no* 😊`);
    }
    // ── Awaiting grade input ──────────────────────────────────────────────────
    if (profile.state === 'awaiting_grade') {
        const grade = clean === 'skip' ? null : message.trim().slice(0, 50);
        (0, exports.updateProfile)(jid, { grade, state: 'active_student' });
        return sendReply((0, exports.ROXY_CONFIRMED_STUDENT)(grade, lang));
    }
};
exports.handleRoxyReply = handleRoxyReply;
