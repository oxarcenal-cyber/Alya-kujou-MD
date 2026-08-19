"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalCmds = void 0;
exports.generalCmds = {
    en: {
        // co-mods
        cmd_co_mods_desc: "Displays the bot's co-moderators list",
        cmd_co_mods_usage: 'co-mods',
        // delete
        cmd_delete_desc: 'Deletes the quoted message 🗑️',
        cmd_delete_usage: 'delete [quote a message]',
        // devs
        cmd_devs_desc: "Displays the bot's developers list 👨‍💻",
        cmd_devs_usage: 'devs',
        // hi
        cmd_hi_desc: 'Say hello to the bot 👋',
        cmd_hi_usage: 'hi',
        // info
        cmd_info_desc: "Displays the bot's info and stats 📊",
        cmd_info_usage: 'info',
        // lb
        cmd_lb_desc: 'Shows the top users leaderboard 🏆',
        cmd_lb_usage: 'lb [--group]',
        // mods
        cmd_mods_desc: "Displays the bot's moderators list 🛡️",
        cmd_mods_usage: 'mods',
        // owner
        cmd_owner_desc: "Displays the bot owner's info 👑",
        cmd_owner_usage: 'owner',
        // poll
        cmd_poll_desc: 'Create a native WhatsApp poll in the group 📊',
        cmd_poll_usage: 'poll "Question?" Option1 Option2 Option3 ...',
        // profile
        cmd_profile_desc: "Displays a user's profile card 🪪",
        cmd_profile_usage: 'profile [tag/quote user]',
        // rank
        cmd_rank_desc: "Displays a user's rank card 🏅",
        cmd_rank_usage: 'rank [tag/quote user]',
        // remind
        cmd_remind_desc: 'Set a reminder for yourself ⏰',
        cmd_remind_usage: 'remind <time> <message> | remind list | remind clear',
        // repo
        cmd_repo_desc: "Get the bot's GitHub repository info ⚙️",
        cmd_repo_usage: 'repo',
        // status
        cmd_status_desc: 'Check bot uptime, database and external API health 🩺',
        cmd_status_usage: 'status',
        // support
        cmd_support_desc: 'Get the support group links sent to your DM 🔗',
        cmd_support_usage: 'support',
        // ── Poll inline replies ────────────────────────────────────────────────
        poll_help: `📊 *Poll Command*\n\n` +
            `*Usage:*\n` +
            `\`{prefix}poll "Question?" Option1 Option2 Option3\`\n\n` +
            `*Example:*\n` +
            `\`{prefix}poll "Favourite anime?" Naruto OnePiece Bleach\`\n\n` +
            `📝 _Write question in quotes, separate options with spaces_\n` +
            `⚠️ _Min 2, Max 12 options_`,
        poll_no_question: '❌ Question is required!\n\nExample: `{prefix}poll "Best game?" BGMI FreeFire`',
        poll_min_options: '❌ *At least 2 options required!*\n\nExample: `{prefix}poll "Best game?" BGMI FreeFire COD`',
        poll_max_options: '❌ Maximum 12 options allowed! You gave {count}.',
        poll_error: '❌ Could not create poll. Please try again!',
        // ── Remind inline replies ─────────────────────────────────────────────
        remind_help: `⏰ *REMIND SYSTEM*\n\n` +
            `📢 *How to use:*\n` +
            `  \`{prefix}remind <time> <message>\` → Set a reminder\n` +
            `  \`{prefix}remind list\` → View your reminders\n` +
            `  \`{prefix}remind clear\` → Clear all reminders\n\n` +
            `⏱️ *Time formats:*\n` +
            `  \`30s\` → 30 seconds\n` +
            `  \`5m\`  → 5 minutes\n` +
            `  \`2h\`  → 2 hours\n` +
            `  \`1d\`  → 1 day\n\n` +
            `📢 *Examples:*\n` +
            `  \`{prefix}remind 30m drink water\`\n` +
            `  \`{prefix}remind 2h do homework\`\n` +
            `  \`{prefix}remind 1d friend's birthday\``,
        remind_none: '📋 You have no reminders!\n📢 Set one: `{prefix}remind 5m do something`',
        remind_list_header: '⏰ *Your Reminders ({count}):*',
        remind_list_item: '{idx}. _"{text}"_\n   ⏳ in {time}',
        remind_cleared: '✅ *{count} reminder{s} cleared!*',
        remind_none_clear: '❌ You had no reminders to clear!',
        remind_bad_time: '❌ Invalid time format!\n📢 Examples: `30s`, `5m`, `2h`, `1d`\n📢 Usage: `{prefix}remind 30m do something`',
        remind_no_msg: '❌ Please provide a reminder message!\n📢 Example: `{prefix}remind 30m drink water`',
        remind_min_time: '❌ Minimum reminder time is *5 seconds*!',
        remind_max_time: '❌ Maximum reminder time is *7 days*!',
        remind_limit: '❌ Max *5 reminders* can be set!\n📢 Clear first: `{prefix}remind clear`',
        remind_set: `✅ *Reminder Set!* ⏰\n\n` +
            `📝 Message: _"{message}"_\n` +
            `⏱️ Time: *{time}* from now\n\n` +
            `_I will remind you!_ 🔔`,
        remind_fire: `🔔 ═══ *REMINDER!* ═══ 🔔\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `@{user} you had set a reminder:\n\n` +
            `📝 _"{message}"_\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `⏰ _Set {time} ago_`,
    },
    hi: {
        // co-mods
        cmd_co_mods_desc: "Bot ke co-moderators ki list dekho",
        cmd_co_mods_usage: 'co-mods',
        // delete
        cmd_delete_desc: 'Quoted message ko delete karo 🗑️',
        cmd_delete_usage: 'delete [message quote karo]',
        // devs
        cmd_devs_desc: "Bot ke developers ki list dekho 👨‍💻",
        cmd_devs_usage: 'devs',
        // hi
        cmd_hi_desc: 'Bot ko hello kaho 👋',
        cmd_hi_usage: 'hi',
        // info
        cmd_info_desc: "Bot ki info aur stats dekho 📊",
        cmd_info_usage: 'info',
        // lb
        cmd_lb_desc: 'Top users ka leaderboard dekho 🏆',
        cmd_lb_usage: 'lb [--group]',
        // mods
        cmd_mods_desc: "Bot ke moderators ki list dekho 🛡️",
        cmd_mods_usage: 'mods',
        // owner
        cmd_owner_desc: "Bot owner ki info dekho 👑",
        cmd_owner_usage: 'owner',
        // poll
        cmd_poll_desc: 'Group mein WhatsApp poll banao 📊',
        cmd_poll_usage: 'poll "Question?" Option1 Option2 Option3 ...',
        // profile
        cmd_profile_desc: "Kisi user ka profile card dekho 🪪",
        cmd_profile_usage: 'profile [tag/quote user]',
        // rank
        cmd_rank_desc: "Kisi user ka rank card dekho 🏅",
        cmd_rank_usage: 'rank [tag/quote user]',
        // remind
        cmd_remind_desc: 'Apne liye reminder set karo ⏰',
        cmd_remind_usage: 'remind <time> <message> | remind list | remind clear',
        // repo
        cmd_repo_desc: "Bot ki GitHub repository ki info dekho ⚙️",
        cmd_repo_usage: 'repo',
        // status
        cmd_status_desc: 'Bot uptime, database aur external API health check karo 🩺',
        cmd_status_usage: 'status',
        // support
        cmd_support_desc: 'Support group links apne DM mein pao 🔗',
        cmd_support_usage: 'support',
        // ── Poll inline replies ────────────────────────────────────────────────
        poll_help: `📊 *Poll Command*\n\n` +
            `*Usage:*\n` +
            `\`{prefix}poll "Question?" Option1 Option2 Option3\`\n\n` +
            `*Example:*\n` +
            `\`{prefix}poll "Favourite anime?" Naruto OnePiece Bleach\`\n\n` +
            `📝 _Question quotes mein likho, options space se alag karo_\n` +
            `⚠️ _Min 2, Max 12 options_`,
        poll_no_question: '❌ Question dena zaroori hai!\n\nExample: `{prefix}poll "Best game?" BGMI FreeFire`',
        poll_min_options: '❌ *Kam se kam 2 options chahiye!*\n\nExample: `{prefix}poll "Best game?" BGMI FreeFire COD`',
        poll_max_options: '❌ Maximum 12 options allowed! Tumne {count} diye hain.',
        poll_error: '❌ Poll create karne mein error aaya. Dobara try karo!',
        // ── Remind inline replies ─────────────────────────────────────────────
        remind_help: `⏰ *REMIND SYSTEM*\n\n` +
            `📢 *How to use:*\n` +
            `  \`{prefix}remind <time> <message>\` → Reminder set karo\n` +
            `  \`{prefix}remind list\` → Apne reminders dekho\n` +
            `  \`{prefix}remind clear\` → Sab reminders hata do\n\n` +
            `⏱️ *Time formats:*\n` +
            `  \`30s\` → 30 seconds\n` +
            `  \`5m\`  → 5 minutes\n` +
            `  \`2h\`  → 2 hours\n` +
            `  \`1d\`  → 1 day\n\n` +
            `📢 *Examples:*\n` +
            `  \`{prefix}remind 30m paani peena hai\`\n` +
            `  \`{prefix}remind 2h homework karna hai\`\n` +
            `  \`{prefix}remind 1d birthday hai dost ka\``,
        remind_none: '📋 Tumhare koi reminders nahi hain!\n📢 Set karo: `{prefix}remind 5m kuch karna hai`',
        remind_list_header: '⏰ *Tumhare Reminders ({count}):*',
        remind_list_item: '{idx}. _"{text}"_\n   ⏳ {time} baad',
        remind_cleared: '✅ *{count} reminder{s} hata diye!*',
        remind_none_clear: '❌ Tumhare koi reminders nahi the!',
        remind_bad_time: '❌ Sahi time format batao!\n📢 Examples: `30s`, `5m`, `2h`, `1d`\n📢 Usage: `{prefix}remind 30m kaam karna hai`',
        remind_no_msg: '❌ Reminder message bhi batao!\n📢 Example: `{prefix}remind 30m paani peena`',
        remind_min_time: '❌ Minimum reminder time *5 seconds* hai!',
        remind_max_time: '❌ Maximum reminder time *7 days* hai!',
        remind_limit: '❌ Max *5 reminders* set ho sakte hain!\n📢 Pehle clear karo: `{prefix}remind clear`',
        remind_set: `✅ *Reminder Set!* ⏰\n\n` +
            `📝 Message: _"{message}"_\n` +
            `⏱️ Time: *{time}* baad\n\n` +
            `_Main tumhe remind karunga!_ 🔔`,
        remind_fire: `🔔 ═══ *REMINDER!* ═══ 🔔\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `@{user} tum ne reminder set kiya tha:\n\n` +
            `📝 _"{message}"_\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `⏰ _${'{time}'} pehle set kiya tha_`,
    }
};
