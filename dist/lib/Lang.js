"use strict";
/**
 * LANGUAGE SYSTEM — Hindi / English
 * Group mein `-lang en` ya `-lang hi` se toggle karo.
 *
 * Strings are split by category into `src/lib/lang/*.ts` so each command
 * area's text stays separate and easy to maintain. This file just merges
 * them and exposes the translator helpers used across the codebase.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.langName = exports.tOrDefault = exports.hasKey = exports.t = void 0;
const common_1 = require("./lang/common");
const general_1 = require("./lang/general");
const economy_1 = require("./lang/economy");
const utils_1 = require("./lang/utils");
const pokemon_1 = require("./lang/pokemon");
const cards_1 = require("./lang/cards");
const moderation_1 = require("./lang/moderation");
const dev_1 = require("./lang/dev");
const fun_1 = require("./lang/fun");
const games_1 = require("./lang/games");
const media_1 = require("./lang/media");
const nsfw_1 = require("./lang/nsfw");
const weeb_1 = require("./lang/weeb");
const commands_1 = require("./lang/commands");
const modules = [
    common_1.common, general_1.general, economy_1.economy, utils_1.utils, pokemon_1.pokemon, cards_1.cards, moderation_1.moderation,
    dev_1.dev, fun_1.fun, games_1.games, media_1.media, nsfw_1.nsfw, weeb_1.weeb, commands_1.commandText
];
const strings = {
    en: Object.assign({}, ...modules.map((m) => m.en)),
    hi: Object.assign({}, ...modules.map((m) => m.hi))
};
// ─── Translator ──────────────────────────────────────────────────────────────
/**
 * Get the translated string for a key.
 * {placeholders} are auto-replaced.
 *
 * @example
 * t('cooldown', 'hi', { time: '3' })  →  "⏳ *3* second(s) ruko phir try karo."
 */
const t = (key, lang = 'en', vars = {}) => {
    const base = strings[lang]?.[key] ?? strings['en']?.[key] ?? key;
    return Object.entries(vars).reduce((str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), v), base);
};
exports.t = t;
/** Whether a translation key actually exists (in either language) */
const hasKey = (key) => strings.en[key] !== undefined || strings.hi[key] !== undefined;
exports.hasKey = hasKey;
/**
 * Like `t()`, but if the key isn't registered in the language dictionaries
 * it falls back to `fallback` instead of returning the raw key. Used for
 * command metadata (description/usage) so unmigrated commands still work.
 */
const tOrDefault = (key, lang, fallback, vars = {}) => ((0, exports.hasKey)(key) ? (0, exports.t)(key, lang, vars) : fallback);
exports.tOrDefault = tOrDefault;
/** Display language name */
const langName = (lang) => lang === 'hi' ? 'हिंदी 🇮🇳' : 'English 🇬🇧';
exports.langName = langName;
