/**
 * LANG — NSFW category reply text
 */

export const nsfw = {
    en: {
        // ── Loli ─────────────────────────────────────────────────────────────
        nsfw_loli_caption:    '*Here you go!* 🔞\n_Use *{p}loli* again for another_',

        // ── NHentai ───────────────────────────────────────────────────────────
        nsfw_nh_no_query:     '🔍 Provide a query for the search',
        nsfw_nh_not_found:    '❌ Couldn\'t find any doujin | *"{query}"*',
        nsfw_nh_no_id:        '🆔 Provide the ID of the doujin you want to download',
        nsfw_nh_invalid_id:   '❌ Invalid Doujin ID | *"{id}"*',
        nsfw_nh_try_again:    '⚠️ *Try Again!*',

        // ── Lewd ──────────────────────────────────────────────────────────────
        nsfw_lewd_caption:    '*Lewd~ 👀🔞*\n_Use *{p}lewd* for more_',

        // ── Danbooru ──────────────────────────────────────────────────────────
        nsfw_fetching:             '🔍 *Fetching...*',
        nsfw_danbooru_usage:
            '🔞 *Danbooru Search*\n\n' +
            '*Usage:* `{p}danbooru [tag/preset]`\n\n' +
            '📌 *Presets:*\n`{presets}`\n\n' +
            '*Example:* `{p}danbooru neko`',
        nsfw_danbooru_no_result:  '❌ No results found for *"{query}"*. Try a different tag.',
        nsfw_danbooru_caption:
            '🎨 *{chars}*  _{copy}_\n' +
            '🆔 `ID: {id}`\n' +
            '_Use *{p}danbooru [tag]* for more_',

        // ── NSFW Toggle ───────────────────────────────────────────────────────
        nsfw_toggle_usage:  '❓ Usage: `{p}nsfw on` or `{p}nsfw off`',
        nsfw_already:       '🟨 NSFW is already *{status}* in this group.',
        nsfw_toggled:       '🔞 NSFW has been set to *{status}* in this group.',
        nsfw_guide:
            '🔞 *NSFW System*\n\n' +
            '⚠️ *Adults Only — 18+*\n' +
            '🚫 Strictly prohibited for minors!\n' +
            '🔐 Only admins can enable or disable.\n\n' +
            '📊 *Status:* {status}\n\n' +
            '🗂️ *Commands:*\n' +
            '🖼️ `{p}loli` · `{p}lewd` · `{p}danbooru` · `{p}nhentai`\n\n' +
            '_Tap the menu below to toggle_ 👇',
    },
    hi: {
        // ── Loli ─────────────────────────────────────────────────────────────
        nsfw_loli_caption:    '*Lo ye lo!* 🔞\n_Ek aur ke liye dobara *{p}loli* use karo_',

        // ── NHentai ───────────────────────────────────────────────────────────
        nsfw_nh_no_query:     '🔍 Search ke liye query do',
        nsfw_nh_not_found:    '❌ Koi doujin nahi mila | *"{query}"*',
        nsfw_nh_no_id:        '🆔 Download karne ke liye doujin ka ID do',
        nsfw_nh_invalid_id:   '❌ Invalid Doujin ID | *"{id}"*',
        nsfw_nh_try_again:    '⚠️ *Dobara try karo!*',

        // ── Lewd ──────────────────────────────────────────────────────────────
        nsfw_lewd_caption:    '*Lewd~ 👀🔞*\n_Aur ke liye *{p}lewd* dobara use karo_',

        // ── Danbooru ──────────────────────────────────────────────────────────
        nsfw_fetching:             '🔍 *Dhoond raha hoon...*',
        nsfw_danbooru_usage:
            '🔞 *Danbooru Search*\n\n' +
            '*Use karo:* `{p}danbooru [tag/preset]`\n\n' +
            '📌 *Presets:*\n`{presets}`\n\n' +
            '*Example:* `{p}danbooru neko`',
        nsfw_danbooru_no_result:  '❌ *"{query}"* ke liye koi result nahi mila. Alag tag try karo.',
        nsfw_danbooru_caption:
            '🎨 *{chars}*  _{copy}_\n' +
            '🆔 `ID: {id}`\n' +
            '_Aur ke liye *{p}danbooru [tag]* use karo_',

        // ── NSFW Toggle ───────────────────────────────────────────────────────
        nsfw_toggle_usage:  '❓ Use karo: `{p}nsfw on` ya `{p}nsfw off`',
        nsfw_already:       '🟨 Is group mein NSFW pehle se *{status}* hai.',
        nsfw_toggled:       '🔞 Is group mein NSFW *{status}* kar diya gaya.',
        nsfw_guide:
            '🔞 *NSFW System*\n\n' +
            '⚠️ *Adults Only — 18+*\n' +
            '🚫 Strictly prohibited for minors!\n' +
            '🔐 Only admins can enable or disable.\n\n' +
            '📊 *Status:* {status}\n\n' +
            '🗂️ *Commands:*\n' +
            '🖼️ `{p}loli` · `{p}lewd` · `{p}danbooru` · `{p}nhentai`\n\n' +
            '_Tap the menu below to toggle_ 👇',
    }
}
