"use strict";
/**
 * ╔══════════════════════════════════════════════════════╗
 * ║           BOT CENTRAL CONFIGURATION FILE             ║
 * ║  Yahan saari values ek jagah set karo —              ║
 * ║  Environment variables ki koi zarurat nahi!          ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * USAGE: Bas niche apni values fill karo aur bot start karo.
 * Kahi bhi deploy karo — sirf ye file change karo, kaam ho gaya.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    // ──────────────────────────────────────────────────
    // BOT BASICS
    // ──────────────────────────────────────────────────
    /** Bot ka naam */
    BOT_NAME: 'Alya MD ✨🍀',
    /** Command prefix (default: -) */
    PREFIX: '-',
    // ──────────────────────────────────────────────────
    // SESSION
    // ──────────────────────────────────────────────────
    /**
     * WhatsApp session ID
     * Pehli baar scan karne ke baad MongoDB mein save hoti hai.
     * Agar naya session chahiye toh yahan nayi unique string rakho (e.g. 'my-bot-session-1')
     */
    SESSION: 'Smi2',
    // ──────────────────────────────────────────────────
    // DATABASE
    // ──────────────────────────────────────────────────
    /**
     * MongoDB connection URI
     * Example: 'mongodb+srv://user:password@cluster.mongodb.net/dbname'
     */
    MONGO_URI: 'mongodb+srv://herrison:wells@cluster0.tqhtuou.mongodb.net/?retryWrites=true&w=majority',
    // ──────────────────────────────────────────────────
    // MOD / ADMIN NUMBERS
    // ──────────────────────────────────────────────────
    /**
     * Bot ke admins/mods ke WhatsApp numbers (country code ke saath, without +)
     * Example: ['919529426293', '911234567890']
     */
    MODS: ['919529426293', '9647807841913'], // apne aur numbers add karne ho toh: ['919529426293', '91XXXXXXXXXX']
    // ──────────────────────────────────────────────────
    // CHATBOT (BrainShop)
    // ──────────────────────────────────────────────────
    /**
     * BrainShop chatbot API URL (optional)
     * Agar use nahi karna toh khali string rakho: ''
     */
    CHAT_BOT_URL: '',
    // ──────────────────────────────────────────────────
    // AI API (Groq — free, fast, OpenAI-compatible)
    // ──────────────────────────────────────────────────
    /**
     * OpenAI API Key (legacy — leave empty if using Groq)
     */
    OPENAI_API_KEY: '',
    /**
     * Groq API Key — free AI (Roxy, Study AI, Chatbot)
     * Get free key at: https://console.groq.com
     * Example: 'gsk_...'
     */
    GROQ_API_KEY: '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',
    // ──────────────────────────────────────────────────
    // SERVER
    // ──────────────────────────────────────────────────
    /** Web server port */
    PORT: 5000,
    // ──────────────────────────────────────────────────
    // FONT & LANGUAGE FEATURES (no config needed)
    // ──────────────────────────────────────────────────
    /**
     * 🔤 FONT CONVERTER — Command: -font
     *   -font list              → sabhi 12 font styles ki list
     *   -font bold Hello World  → bold mein convert
     *   -font cursive <text>    → cursive mein convert
     *   -font all <text>        → ek saath sabhi styles mein preview
     *   -font 3 <text>          → number se bhi select kar sakte ho
     *
     * Available styles: bold, italic, bold_italic, cursive, fraktur,
     *   double, mono, sans, sans_bold, bubble, fullwidth, small_caps
     *
     * 🌐 LANGUAGE TOGGLE — Command: -lang (sirf group admins/mods)
     *   -lang         → current language aur usage dekho
     *   -lang en      → English mode
     *   -lang hi      → हिंदी mode
     *
     * Language setting per-group hai — MongoDB mein save hoti hai.
     * Ek group mein en, doosre mein hi — dono alag kaam karte hain.
     */
    // ──────────────────────────────────────────────────
    // GROUP JIDs (optional)
    // ──────────────────────────────────────────────────
    /**
     * Casino group JID — casino commands (gamble, slots, dice, etc.) sirf is group mein kaam karenge
     * Aasaan tarika: Group mein `-setcasino` command chalao, bot JID dikhayega aur yes/no poochega
     * Ya manually yahan paste karo: '1234567890@g.us'
     */
    CASINO_GROUP: '120363388539951200@g.us',
    /** Admins group JID */
    ADMINS_GROUP: '120363062645637432@g.us',
    /** Support groups JIDs list */
    SUPPORT_GROUPS: [],
    // ──────────────────────────────────────────────────
    // CHANNEL & LINKS
    // ──────────────────────────────────────────────────
    /**
     * WhatsApp Channel invite link
     * Example: 'https://whatsapp.com/channel/0029VaXXXXXXXXXXXXXXXX'
     * Apna channel link yahan paste karo
     */
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029VakPXumLY6383cBT9b3z',
    /**
     * Bot ka GitHub / website link (optional)
     * Khali string rakho agar nahi hai: ''
     */
    BOT_LINK: '',
    /**
     * Support group invite link (optional)
     * Example: 'https://chat.whatsapp.com/XXXXXXXXXX'
     */
    SUPPORT_LINK: '',
    // ──────────────────────────────────────────────────
    // VIDEO API KEY
    // ──────────────────────────────────────────────────
    /**
     * Intro videos ko protect karne wali secret key
     * API endpoints: /api/video/random, /api/video/:name, /api/videos
     * Isko kisi ke saath share mat karna!
     */
    VIDEO_API_KEY: '275c0cae7bf6fe44ea3806b216840383edbd8b2011e360390680efa563259dea'
};
exports.default = config;
