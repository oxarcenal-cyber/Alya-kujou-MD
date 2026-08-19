/**
 * LANG — Common / General-purpose strings shared across many commands
 * (permission errors, cooldowns, the `-lang` system itself, etc.)
 */

export const common = {
    en: {
        banned:          '🚫 You are *banned* from using bot commands.',
        cmd_not_found:   '❓ Command not found. Use *{p}help* to see available commands.',
        mods_only:       '🔱 This command is for *MODs only*.',
        group_only:      '👥 This command can only be used in *groups*.',
        admin_only:      '⚔️ This command is for *group admins* only.',
        nsfw_only:       '🔞 Enable *NSFW* in this group first.',
        casino_only:     '🎰 Casino commands only work in the *casino group*.',
        cooldown:        '⏳ Please wait *{time}* second(s) before using this again.',
        dm_only:         '💬 This command only works in *DM*.',
        success:         '✅ Done!',
        error:           '❌ Something went wrong. Try again.',
        no_permission:   '❌ You don\'t have permission to do this.',

        lang_set_en:     '🌐 *Language set to English!*\nBot will now respond in English.',
        lang_set_hi:     '🌐 *Language switched to Hindi!*\nBot will now respond in Hindi.',
        lang_current:    '🌐 Current language: *{lang}*',
        lang_usage:      '🌐 *Language*\n\nUsage:\n  `{p}lang en` → English\n  `{p}lang hi` → Hindi',
        lang_group_only: '❌ This command can only be used in a *group*!',
        lang_no_perm:    '❌ Only *group admins* or *mods* can change the language.\n\n📢 Use: `{p}lang en` or `{p}lang hi`',
        lang_status:
            '🌐 *LANGUAGE*\n' +
            '{line}\n\n' +
            '📌 *Current Language:* {current}\n\n' +
            '{line}\n' +
            '📢 *To change:*\n' +
            '  `{p}lang en` → 🇬🇧 English\n' +
            '  `{p}lang hi` → 🇮🇳 Hindi\n\n' +
            '_The bot\'s key messages will use the selected language._',
        lang_invalid:    '❌ Only `en` (English) or `hi` (Hindi) is valid.\n\n📢 Use: `{p}lang en` or `{p}lang hi`',
        lang_already:    '🟨 Language is already *{lang}*!',
        lang_changed_hi: '🌐 *Language switched to Hindi!* 🇮🇳\n\nThe bot will now respond in Hindi in this group.\n\n📢 To go back to English: `{p}lang en`',
        lang_changed_en: '🌐 *Language changed to English!* 🇬🇧\n\nThe bot will now respond in English in this group.\n\n📢 For Hindi: `{p}lang hi`',
    },
    hi: {
        banned:          '🚫 Aap *banned* ho — bot commands use nahi kar sakte.',
        cmd_not_found:   '❓ Ye command exist nahi karti. *{p}help* se list dekho.',
        mods_only:       '🔱 Ye command sirf *MODs* ke liye hai.',
        group_only:      '👥 Ye command sirf *groups* mein kaam karti hai.',
        admin_only:      '⚔️ Ye command sirf *group admins* use kar sakte hain.',
        nsfw_only:       '🔞 Pehle is group mein *NSFW* enable karo.',
        casino_only:     '🎰 Casino commands sirf *casino group* mein kaam karti hain.',
        cooldown:        '⏳ *{time}* second(s) ruko phir try karo.',
        dm_only:         '💬 Ye command sirf *DM* mein kaam karti hai.',
        success:         '✅ Ho gaya!',
        error:           '❌ Kuch gadbad ho gayi. Dobara try karo.',
        no_permission:   '❌ Aapke paas ye karne ki permission nahi hai.',

        lang_set_en:     '🌐 *Language set to English!*\nBot ab English mein reply karega.',
        lang_set_hi:     '🌐 *भाषा हिंदी में बदल दी!*\nBot अब हिंदी में जवाब देगा।',
        lang_current:    '🌐 Current language: *{lang}*',
        lang_usage:      '🌐 *Language / भाषा*\n\nUse karo:\n  `{p}lang en` → English\n  `{p}lang hi` → हिंदी',
        lang_group_only: '❌ Ye command sirf group mein use karo!',
        lang_no_perm:    '❌ Sirf *group admins* ya *mods* language change kar sakte hain.\n\n📢 Use: `{p}lang en` ya `{p}lang hi`',
        lang_status:
            '🌐 *LANGUAGE / भाषा*\n' +
            '{line}\n\n' +
            '📌 *Current Language:* {current}\n\n' +
            '{line}\n' +
            '📢 *Change karne ke liye:*\n' +
            '  `{p}lang en` → 🇬🇧 English\n' +
            '  `{p}lang hi` → 🇮🇳 हिंदी\n\n' +
            '_Bot ke key messages selected language mein aayenge._',
        lang_invalid:    '❌ Sirf `en` (English) ya `hi` (Hindi) valid hai.\n\n📢 Use: `{p}lang en` ya `{p}lang hi`',
        lang_already:    '🟨 Language already *{lang}* hai!',
        lang_changed_hi: '🌐 *भाषा हिंदी में बदल दी!* 🇮🇳\n\nAb is group mein bot हिंदी mein respond karega.\n\n📢 Wapas English ke liye: `{p}lang en`',
        lang_changed_en: '🌐 *Language changed to English!* 🇬🇧\n\nBot ab is group mein English mein respond karega.\n\n📢 Hindi ke liye: `{p}lang hi`',
    }
}
