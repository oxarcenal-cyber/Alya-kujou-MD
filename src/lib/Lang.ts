/**
 * LANGUAGE SYSTEM — Hindi / English
 * Group mein `-lang en` ya `-lang hi` se toggle karo.
 *
 * Strings are split by category into `src/lib/lang/*.ts` so each command
 * area's text stays separate and easy to maintain. This file just merges
 * them and exposes the translator helpers used across the codebase.
 */

import { common } from './lang/common'
import { general } from './lang/general'
import { economy } from './lang/economy'
import { utils } from './lang/utils'
import { pokemon } from './lang/pokemon'
import { cards } from './lang/cards'
import { moderation } from './lang/moderation'
import { dev } from './lang/dev'
import { fun } from './lang/fun'
import { games } from './lang/games'
import { media } from './lang/media'
import { nsfw } from './lang/nsfw'
import { weeb } from './lang/weeb'
import { commandText } from './lang/commands'

export type Language = 'en' | 'hi'

const modules = [
    common, general, economy, utils, pokemon, cards, moderation,
    dev, fun, games, media, nsfw, weeb, commandText
]

const strings: Record<Language, Record<string, string>> = {
    en: Object.assign({}, ...modules.map((m) => m.en)),
    hi: Object.assign({}, ...modules.map((m) => m.hi))
}

// ─── Translator ──────────────────────────────────────────────────────────────

/**
 * Get the translated string for a key.
 * {placeholders} are auto-replaced.
 *
 * @example
 * t('cooldown', 'hi', { time: '3' })  →  "⏳ *3* second(s) ruko phir try karo."
 */
export const t = (
    key: string,
    lang: Language = 'en',
    vars: Record<string, string> = {}
): string => {
    const base = strings[lang]?.[key] ?? strings['en']?.[key] ?? key
    return Object.entries(vars).reduce(
        (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), v),
        base
    )
}

/** Whether a translation key actually exists (in either language) */
export const hasKey = (key: string): boolean =>
    strings.en[key] !== undefined || strings.hi[key] !== undefined

/**
 * Like `t()`, but if the key isn't registered in the language dictionaries
 * it falls back to `fallback` instead of returning the raw key. Used for
 * command metadata (description/usage) so unmigrated commands still work.
 */
export const tOrDefault = (
    key: string,
    lang: Language,
    fallback: string,
    vars: Record<string, string> = {}
): string => (hasKey(key) ? t(key, lang, vars) : fallback)

/** Display language name */
export const langName = (lang: Language): string =>
    lang === 'hi' ? 'हिंदी 🇮🇳' : 'English 🇬🇧'
