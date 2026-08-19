/**
 * LANG — Moderation category (ban/mute/kick/warn/settings command text)
 * Populate this as moderation commands are migrated to the t() system.
 */

export const moderation = {
    en: {
        // ── shared / group-only / admin-only ─────────────────────────────
        mod_group_only:         '❌ This command can only be used in groups!',
        mod_admin_only:         '❌ *Only admins can use this!*\n\n📢 *How to use:* `{prefix}{cmd}`',
        mod_tag_or_quote:       '❌ Tag or quote someone!\n\n📢 *How to use:* `{prefix}{cmd}`',

        // ── langlist ─────────────────────────────────────────────────────
        langlist_header:
            '🌐 *LANGUAGE PREVIEW*\n' +
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
            '📌 *Current Language:* {current}\n\n' +
            'Here\'s how key bot messages look in both languages:\n\n',
        langlist_section_en:    '🇬🇧 *ENGLISH*\n─────────────────────',
        langlist_section_hi:    '🇮🇳 *HINDI*\n─────────────────────',
        langlist_footer:
            '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
            '📢 *Switch with:*\n' +
            '  `{p}lang en` → 🇬🇧 English\n' +
            '  `{p}lang hi` → 🇮🇳 Hindi',

        // ── antilink ─────────────────────────────────────────────────────
        antilink_status:
            '🔗 *ANTILINK*\n' +
            '─────────────────────────\n\n' +
            '📌 *Status:* {status}\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}antilink on` → Enable\n' +
            '  `{prefix}antilink off` → Disable\n\n' +
            '_When ON, members sharing group invite links will be auto-removed.\n' +
            '(Bot must be admin)_',
        antilink_invalid:       '❌ Type *on* or *off*!\n\n📢 *How to use:*\n  `{prefix}antilink on`\n  `{prefix}antilink off`',
        antilink_already:       '🟨 Antilink is already *{state}*!',
        antilink_on:
            '🟢 *ANTILINK ON!*\n\n🔗 Group invite links are now banned!\n⚠️ Make the bot admin.\n\n📢 To turn off: `{prefix}antilink off`',
        antilink_off:
            '🔴 *ANTILINK OFF!*\n\nLinks are allowed now.\n\n📢 To turn on: `{prefix}antilink on`',

        // ── autoreact ─────────────────────────────────────────────────────
        autoreact_group_only:   '❌ Use this command in a group!',
        autoreact_admin_only:   '❌ Only *group admins* can use this!\n\n📢 Use: `{prefix}autoreact on/off`',
        autoreact_status:
            '🎭 *AUTO REACT*\n' +
            '────────────────────────────\n\n' +
            '📌 *Status:* {status}\n' +
            '🎨 *Mode:* {modeLabel}\n\n' +
            '📊 *Emoji Count:*\n' +
            '  😄 Regular: {regular}\n' +
            '  🌸 Anime: {anime}\n' +
            '  🎭 Total: {total}\n\n' +
            '────────────────────────────\n' +
            '📢 *Commands:*\n' +
            '  `{prefix}autoreact on` → Enable\n' +
            '  `{prefix}autoreact off` → Disable\n' +
            '  `{prefix}autoreact mode all` → All emojis\n' +
            '  `{prefix}autoreact mode regular` → Regular only\n' +
            '  `{prefix}autoreact mode anime` → Anime style only',
        autoreact_invalid_mode:
            '❌ Valid modes: `all`, `regular`, `anime`\n\n📢 Example: `{prefix}autoreact mode anime`',
        autoreact_mode_changed:
            '✅ *Auto React mode changed!*\n\n🎨 *New Mode:* {modeLabel}\n\n_Emojis from this mode will be used for reactions._',
        autoreact_invalid:
            '❌ Type `on` or `off`!\n\n📢 Use: `{prefix}autoreact on` or `{prefix}autoreact off`',
        autoreact_already:      '🟨 Auto React is already *{state}*!',
        autoreact_on:
            '🟢 *AUTO REACT ON!* 🎭\n\n' +
            'Every message in this group will get a random emoji reaction!\n\n' +
            '🎨 *Current Mode:* {modeLabel}\n' +
            '📊 *Total Emojis:* {total}\n\n' +
            '📢 To change mode: `{prefix}autoreact mode anime`\n' +
            '📢 To turn off: `{prefix}autoreact off`',
        autoreact_off:
            '🔴 *AUTO REACT OFF!*\n\nAuto reactions have been disabled in this group.\n\n📢 To turn on: `{prefix}autoreact on`',

        // ── clearwarn ─────────────────────────────────────────────────────
        clearwarn_done:
            '✅ *WARNINGS CLEARED* ✅\n' +
            '─────────────────────────\n\n' +
            '👤 *User:* @{user}\n' +
            '🧹 *All warnings have been removed!*\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:* `{prefix}clearwarn @user`',

        // ── close ─────────────────────────────────────────────────────────
        close_admin_only:
            '❌ *Only admins can use this!*\n\n📢 *How to use:* `{prefix}close`',
        close_already:
            '⚠️ *Group is already closed!*\n\n📢 To open: `{prefix}open`',
        close_done:
            '🔒 *GROUP CLOSED!*\n\nOnly admins can send messages now.\n\n📢 *How to use:* `{prefix}close`\n_To open: `{prefix}open`_',

        // ── demote ────────────────────────────────────────────────────────
        demote_admin_only:
            '❌ *Only admins can use this!*\n\n📢 *How to use:* `{prefix}demote @user`',
        demote_tag_or_quote:
            '❌ Tag or quote someone!\n\n📢 *How to use:* `{prefix}demote @admin`',
        demote_skip_owner:      '⚠️ Skipped @{user} — they are the group owner',
        demote_skip_not_admin:  '⚠️ Skipped @{user} — not an admin',
        demote_success:         '✅ Demoted @{user}',
        demote_fail:            '❌ @{user} could not be demoted',

        // ── dxdchat ───────────────────────────────────────────────────────
        dxdchat_admin_only:
            '❌ *Only admins can use this!*\n\n📢 *How to use:* `{prefix}dxdchat on/off`',
        dxdchat_status:
            '🐉 *HIGH SCHOOL DxD CHAT*\n' +
            '─────────────────────────\n\n' +
            '📌 *Status:* {status}\n' +
            '👥 *Characters:* {chars}\n' +
            '💬 *Total Dialogues:* {lines}\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}dxdchat on` → Enable\n' +
            '  `{prefix}dxdchat off` → Disable\n\n' +
            '_When ON, every normal message will get a random DxD character reply._\n' +
            '_For a manual quote use `{prefix}dxd [character]` anytime (works regardless of ON/OFF)._',
        dxdchat_invalid:
            '❌ *Type on or off!*\n\n📢 *How to use:*\n  `{prefix}dxdchat on`\n  `{prefix}dxdchat off`',
        dxdchat_already:        '🟨 DxD Chat is already *{state}*!',
        dxdchat_on:
            '🟢 *DxD CHAT ON!* 🐉\n\nAny normal message in this group will get a High School DxD character reply!\n\n📢 To turn off: `{prefix}dxdchat off`',
        dxdchat_off:
            '🔴 *DxD CHAT OFF!*\n\nDxD auto-chat has been disabled in this group.\n\n📢 To turn on: `{prefix}dxdchat on`',

        // ── dxdgreet ──────────────────────────────────────────────────────
        dxdgreet_admin_only:
            '❌ *Only admins can use this!*\n\n📢 *How to use:* `{prefix}dxdgreet on/off`',
        dxdgreet_status:
            '🌙 *DxD AUTO GREETINGS*\n' +
            '─────────────────────────\n\n' +
            '📌 *Status:* {status}\n\n' +
            '⏰ *Greeting schedule:*\n' +
            '  ☀️ Good Morning → ~7:00 AM\n' +
            '  🌤️ Good Afternoon → ~1:00 PM\n' +
            '  🌇 Good Evening → ~6:00 PM\n' +
            '  🌙 Good Night → ~10:00 PM\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}dxdgreet on` → Enable\n' +
            '  `{prefix}dxdgreet off` → Disable\n\n' +
            '_When ON, the bot automatically sends greetings with High School DxD character dialogues — no command needed._',
        dxdgreet_invalid:
            '❌ *Type on or off!*\n\n📢 *How to use:*\n  `{prefix}dxdgreet on`\n  `{prefix}dxdgreet off`',
        dxdgreet_already:       '🟨 DxD Greetings are already *{state}*!',
        dxdgreet_on:
            '🟢 *DxD GREETINGS ON!* 🌙\n\nThe bot will automatically send good morning/afternoon/evening/night greetings — with DxD character dialogues!\n\n📢 To turn off: `{prefix}dxdgreet off`',
        dxdgreet_off:
            '🔴 *DxD GREETINGS OFF!*\n\nAuto greetings have been disabled in this group.\n\n📢 To turn on: `{prefix}dxdgreet on`',

        // ── gchatbot ──────────────────────────────────────────────────────
        gchatbot_admin_only:
            '❌ *Only admins can use this!*\n\n📢 *How to use:* `{prefix}gchatbot on/off`',
        gchatbot_not_configured:
            '❌ *Chatbot is not configured!*\n\nContact the bot owner.\n\n📢 *How to use:* `{prefix}gchatbot on/off`',
        gchatbot_status:
            '🤖 *GROUP CHATBOT*\n' +
            '─────────────────────────\n\n' +
            '📌 *Status:* {status}\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}gchatbot on` → Enable\n' +
            '  `{prefix}gchatbot off` → Disable\n\n' +
            '_When ON, chat with the bot using `{prefix}chat <message>`_',
        gchatbot_invalid:
            '❌ *Type on or off!*\n\n📢 *How to use:*\n  `{prefix}gchatbot on`\n  `{prefix}gchatbot off`',
        gchatbot_already:       '🟨 Group chatbot is already *{state}*!',
        gchatbot_on:
            '🟢 *CHATBOT ON!* 🤖\n\nYou can now chat with the bot in this group using `{prefix}chat <message>`!\n\n📢 To turn off: `{prefix}gchatbot off`',
        gchatbot_off:
            '🔴 *CHATBOT OFF!*\n\nChatbot has been disabled in this group.\n\n📢 To turn on: `{prefix}gchatbot on`',

        // ── modgive ───────────────────────────────────────────────────────
        modgive_who:
            '❓ *Who to give gold to?*\n\n' +
            '💡 *Best:* *Reply* to the target\'s message\n' +
            '💡 *Or:* Select a WhatsApp @mention\n\n' +
            '📢 *Examples:*\n' +
            '• Reply + `{prefix}modgive 50000`\n' +
            '• `{prefix}modgive @user 50000`\n' +
            '• `{prefix}modgive @user 50000 bank`\n' +
            '• `{prefix}modgive @user set 99999`\n' +
            '• `{prefix}modgive @user reset`',
        modgive_set_no_amount:
            '❌ *Provide an amount!*\n\n📢 Usage: `{prefix}modgive @user set <amount> [bank]`',
        modgive_no_amount:
            '❌ *No amount found!*\n\n' +
            '📢 *Usage:*\n' +
            '• `{prefix}modgive @user 50000`          — add to wallet\n' +
            '• `{prefix}modgive @user 50000 bank`     — add to bank\n' +
            '• `{prefix}modgive @user set 99999`      — set exact\n' +
            '• `{prefix}modgive @user reset`          — zero out',

        // ── open ──────────────────────────────────────────────────────────
        open_admin_only:
            '❌ *Only admins can use this!*\n\n📢 *How to use:* `{prefix}open`',
        open_already:
            '⚠️ *Group is already open!*\n\n📢 To close: `{prefix}close`',
        open_done:
            '🔓 *GROUP OPEN!*\n\nAll members can send messages now.\n\n📢 *How to use:* `{prefix}open`\n_To close: `{prefix}close`_',

        // ── promote ───────────────────────────────────────────────────────
        promote_admin_only:
            '❌ *Only admins can use this!*\n\n📢 *How to use:* `{prefix}promote @user`',
        promote_tag_or_quote:
            '❌ Tag or quote someone!\n\n📢 *How to use:* `{prefix}promote @user`',
        promote_skip_already_admin: '⚠️ Skipped @{user} — already an admin',
        promote_success:            '✅ Promoted @{user} to admin',
        promote_fail:               '❌ @{user} could not be promoted',

        // ── remove ────────────────────────────────────────────────────────
        remove_admin_only:
            '❌ *Only admins can use this!*\n\n📢 *How to use:* `{prefix}remove @user`',
        remove_tag_or_quote:
            '❌ Tag or quote someone!\n\n📢 *How to use:* `{prefix}remove @user`',
        remove_skip_owner:  '⚠️ Skipped @{user} — they are the group owner',
        remove_success:     '✅ Removed @{user}',
        remove_fail:        '❌ @{user} could not be removed',

        // ── rules ─────────────────────────────────────────────────────────
        rules_group_only:   '❌ This command can only be used in groups!',
        rules_none:
            '📜 *GROUP RULES*\n' +
            '─────────────────────────\n\n' +
            '⚠️ No rules have been set yet!\n\n' +
            '─────────────────────────\n' +
            '📢 To set rules (admin only):\n' +
            '  `{prefix}setrules <write rules>`',
        rules_show:
            '📜 *GROUP RULES* 📜\n' +
            '─────────────────────────\n\n' +
            '{rules}\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:* `{prefix}rules`\n' +
            '_To update rules (admin): `{prefix}setrules <text>`_',

        // ── setrules ──────────────────────────────────────────────────────
        setrules_group_only:    '❌ This command can only be used in groups!',
        setrules_admin_only:
            '❌ *Only admins can set rules!*\n\n📢 *How to use:* `{prefix}setrules <rules>`',
        setrules_no_content:
            '📝 *SET GROUP RULES*\n\n' +
            'Set the rules for the group!\n\n' +
            '📢 *How to use:*\n' +
            '`{prefix}setrules\n1. No spam\n2. Respect everyone\n3. No NSFW\n4. Links not allowed`\n\n' +
            '_To view rules: `{prefix}rules`_',
        setrules_done:
            '✅ *RULES SET!* ✅\n' +
            '─────────────────────────\n\n' +
            '📜 *Rules:*\n{rules}\n\n' +
            '─────────────────────────\n' +
            '📢 To view rules: `{prefix}rules`',

        // ── tagall ────────────────────────────────────────────────────────
        tagall_group_only:  '❌ This command can only be used in groups!',
        tagall_admin_only:
            '❌ *Only admins can use this!*\n\n📢 *How to use:* `{prefix}tagall [message]`',

        // ── warn ──────────────────────────────────────────────────────────
        warn_group_only:    '❌ This command can only be used in groups!',
        warn_admin_only:
            '❌ *Only admins can use this!*\n\n📢 *How to use:* `{prefix}warn @user [reason]`',
        warn_tag_or_quote:
            '❌ Tag or quote someone!\n\n📢 *How to use:* `{prefix}warn @user reason here`',
        warn_self:          '❌ You cannot warn yourself!',
        warn_mod:           '❌ Cannot warn a mod!',
        warn_admin:         '❌ Cannot warn an admin!',
        warn_at_limit:      '\n\n🚫 *Auto-removed after {max} warnings!*',
        warn_at_limit_fail: '\n\n⚠️ {max} warnings reached! Bot must be admin to auto-remove.',

        // ── warnings ──────────────────────────────────────────────────────
        warnings_group_only:    '❌ This command can only be used in groups!',
        warnings_none:
            '✅ @{user} has no warnings in this group!\n\n📢 *How to use:* `{prefix}warnings @user`',

        // ── welcome ───────────────────────────────────────────────────────
        welcome_status:
            '┌───□ *WELCOME FEATURE* □\n' +
            '├◇ 📌 *Status:* {status}\n' +
            '├◇ 👥 *Group:* {group}\n' +
            '└──────────────────□\n\n' +
            '💡 *Usage:*\n' +
            '  `{prefix}welcome on` → Enable\n' +
            '  `{prefix}welcome off` → Disable\n\n' +
            '📝 _Bot will send a message when someone joins or leaves_',
        welcome_invalid:
            '❌ Invalid option!\n\nUse:\n  `{prefix}welcome on` → Enable\n  `{prefix}welcome off` → Disable',
        welcome_already:    '🟨 Welcome feature is already *{state}* in this group!',
        welcome_on:
            '🟢 *Welcome feature ON!*\n\n' +
            'When someone joins → Welcome message will be sent 🎉\n' +
            'When someone leaves → Farewell message will be sent 👋\n\n' +
            '_To disable:_ `{prefix}welcome off`',
        welcome_off:
            '🔴 *Welcome feature OFF!*\n\nNo message will be sent on join/leave.\n\n_To enable:_ `{prefix}welcome on`',
    },
    hi: {
        // ── shared / group-only / admin-only ─────────────────────────────
        mod_group_only:         '❌ Ye command sirf groups mein use hoti hai!',
        mod_admin_only:         '❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* `{prefix}{cmd}`',
        mod_tag_or_quote:       '❌ Kisi ko tag ya quote karo!\n\n📢 *How to use:* `{prefix}{cmd}`',

        // ── langlist ─────────────────────────────────────────────────────
        langlist_header:
            '🌐 *LANGUAGE PREVIEW / भाषा पूर्वावलोकन*\n' +
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
            '📌 *Current Language:* {current}\n\n' +
            'Dono languages mein bot ke messages kaise dikhte hain:\n\n',
        langlist_section_en:    '🇬🇧 *ENGLISH*\n─────────────────────',
        langlist_section_hi:    '🇮🇳 *HINDI*\n─────────────────────',
        langlist_footer:
            '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
            '📢 *Switch karne ke liye:*\n' +
            '  `{p}lang en` → 🇬🇧 English\n' +
            '  `{p}lang hi` → 🇮🇳 Hindi',

        // ── antilink ─────────────────────────────────────────────────────
        antilink_status:
            '🔗 *ANTILINK*\n' +
            '─────────────────────────\n\n' +
            '📌 *Status:* {status}\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}antilink on` → Enable karo\n' +
            '  `{prefix}antilink off` → Disable karo\n\n' +
            '_Jab ON ho, group invite links share karne par member auto-remove hoga.\n' +
            '(Bot ko admin hona zaroori hai)_',
        antilink_invalid:       '❌ *on* ya *off* likho!\n\n📢 *How to use:*\n  `{prefix}antilink on`\n  `{prefix}antilink off`',
        antilink_already:       '🟨 Antilink already *{state}* hai!',
        antilink_on:
            '🟢 *ANTILINK ON!*\n\n🔗 Ab group invite links share karna banned hai!\n⚠️ Bot ko admin banana zaroori hai.\n\n📢 Off karne ke liye: `{prefix}antilink off`',
        antilink_off:
            '🔴 *ANTILINK OFF!*\n\nLinks allow hain ab.\n\n📢 On karne ke liye: `{prefix}antilink on`',

        // ── autoreact ─────────────────────────────────────────────────────
        autoreact_group_only:   '❌ Ye command sirf group mein use karo!',
        autoreact_admin_only:   '❌ Sirf *group admins* use kar sakte hain!\n\n📢 Use: `{prefix}autoreact on/off`',
        autoreact_status:
            '🎭 *AUTO REACT*\n' +
            '────────────────────────────\n\n' +
            '📌 *Status:* {status}\n' +
            '🎨 *Mode:* {modeLabel}\n\n' +
            '📊 *Emoji Count:*\n' +
            '  😄 Regular: {regular}\n' +
            '  🌸 Anime: {anime}\n' +
            '  🎭 Total: {total}\n\n' +
            '────────────────────────────\n' +
            '📢 *Commands:*\n' +
            '  `{prefix}autoreact on` → Enable\n' +
            '  `{prefix}autoreact off` → Disable\n' +
            '  `{prefix}autoreact mode all` → Sabhi emojis\n' +
            '  `{prefix}autoreact mode regular` → Sirf regular\n' +
            '  `{prefix}autoreact mode anime` → Sirf anime style',
        autoreact_invalid_mode:
            '❌ Valid modes: `all`, `regular`, `anime`\n\n📢 Example: `{prefix}autoreact mode anime`',
        autoreact_mode_changed:
            '✅ *Auto React mode change ho gaya!*\n\n🎨 *New Mode:* {modeLabel}\n\n_Ab is mode ke emojis randomly react karenge._',
        autoreact_invalid:
            '❌ `on` ya `off` likho!\n\n📢 Use: `{prefix}autoreact on` ya `{prefix}autoreact off`',
        autoreact_already:      '🟨 Auto React already *{state}* hai!',
        autoreact_on:
            '🟢 *AUTO REACT ON!* 🎭\n\n' +
            'Ab is group ke har message par random emoji react karega!\n\n' +
            '🎨 *Current Mode:* {modeLabel}\n' +
            '📊 *Total Emojis:* {total}\n\n' +
            '📢 Mode change karne ke liye: `{prefix}autoreact mode anime`\n' +
            '📢 Band karne ke liye: `{prefix}autoreact off`',
        autoreact_off:
            '🔴 *AUTO REACT OFF!*\n\nIs group mein auto reaction disable ho gaya.\n\n📢 On karne ke liye: `{prefix}autoreact on`',

        // ── clearwarn ─────────────────────────────────────────────────────
        clearwarn_done:
            '✅ *WARNINGS CLEARED* ✅\n' +
            '─────────────────────────\n\n' +
            '👤 *User:* @{user}\n' +
            '🧹 *Saari warnings hata di gayi!*\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:* `{prefix}clearwarn @user`',

        // ── close ─────────────────────────────────────────────────────────
        close_admin_only:
            '❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* `{prefix}close`',
        close_already:
            '⚠️ *Group pehle se closed hai!*\n\n📢 Open karne ke liye: `{prefix}open`',
        close_done:
            '🔒 *GROUP CLOSED!*\n\nAb sirf admins message kar sakte hain.\n\n📢 *How to use:* `{prefix}close`\n_Open karne ke liye: `{prefix}open`_',

        // ── demote ────────────────────────────────────────────────────────
        demote_admin_only:
            '❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* `{prefix}demote @user`',
        demote_tag_or_quote:
            '❌ Kisi ko tag ya quote karo!\n\n📢 *How to use:* `{prefix}demote @admin`',
        demote_skip_owner:      '⚠️ Skipped @{user} — group owner hai',
        demote_skip_not_admin:  '⚠️ Skipped @{user} — admin nahi hai',
        demote_success:         '✅ Demoted @{user}',
        demote_fail:            '❌ @{user} demote nahi hua',

        // ── dxdchat ───────────────────────────────────────────────────────
        dxdchat_admin_only:
            '❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* `{prefix}dxdchat on/off`',
        dxdchat_status:
            '🐉 *HIGH SCHOOL DxD CHAT*\n' +
            '─────────────────────────\n\n' +
            '📌 *Status:* {status}\n' +
            '👥 *Characters:* {chars}\n' +
            '💬 *Total Dialogues:* {lines}\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}dxdchat on` → Enable karo\n' +
            '  `{prefix}dxdchat off` → Disable karo\n\n' +
            '_Jab ON ho, group ke har normal message par ek random DxD character reply dega._\n' +
            '_Manually quote mangni ho to `{prefix}dxd [character]` try karo (kabhi bhi, ON/OFF se independent)._',
        dxdchat_invalid:
            '❌ *on* ya *off* likho!\n\n📢 *How to use:*\n  `{prefix}dxdchat on`\n  `{prefix}dxdchat off`',
        dxdchat_already:        '🟨 DxD Chat already *{state}* hai!',
        dxdchat_on:
            '🟢 *DxD CHAT ON!* 🐉\n\nAb is group mein koi bhi normal message bhejo — koi na koi High School DxD character reply dega!\n\n📢 Band karne ke liye: `{prefix}dxdchat off`',
        dxdchat_off:
            '🔴 *DxD CHAT OFF!*\n\nIs group mein DxD auto-chat disable ho gaya.\n\n📢 On karne ke liye: `{prefix}dxdchat on`',

        // ── dxdgreet ──────────────────────────────────────────────────────
        dxdgreet_admin_only:
            '❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* `{prefix}dxdgreet on/off`',
        dxdgreet_status:
            '🌙 *DxD AUTO GREETINGS*\n' +
            '─────────────────────────\n\n' +
            '📌 *Status:* {status}\n\n' +
            '⏰ *Kab bhejta hai:*\n' +
            '  ☀️ Good Morning → ~7:00 AM\n' +
            '  🌤️ Good Afternoon → ~1:00 PM\n' +
            '  🌇 Good Evening → ~6:00 PM\n' +
            '  🌙 Good Night → ~10:00 PM\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}dxdgreet on` → Enable karo\n' +
            '  `{prefix}dxdgreet off` → Disable karo\n\n' +
            '_Jab ON ho, bot khud High School DxD character dialogue ke saath greeting bhejta hai — koi command ki zaroorat nahi._',
        dxdgreet_invalid:
            '❌ *on* ya *off* likho!\n\n📢 *How to use:*\n  `{prefix}dxdgreet on`\n  `{prefix}dxdgreet off`',
        dxdgreet_already:       '🟨 DxD Greetings already *{state}* hai!',
        dxdgreet_on:
            '🟢 *DxD GREETINGS ON!* 🌙\n\nAb bot khud-ba-khud roz good morning/afternoon/evening/night greetings bhejega — DxD character dialogues ke saath!\n\n📢 Band karne ke liye: `{prefix}dxdgreet off`',
        dxdgreet_off:
            '🔴 *DxD GREETINGS OFF!*\n\nAuto greetings band ho gaye is group mein.\n\n📢 On karne ke liye: `{prefix}dxdgreet on`',

        // ── gchatbot ──────────────────────────────────────────────────────
        gchatbot_admin_only:
            '❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* `{prefix}gchatbot on/off`',
        gchatbot_not_configured:
            '❌ *Chatbot configure nahi hai!*\n\nBot owner se contact karo.\n\n📢 *How to use:* `{prefix}gchatbot on/off`',
        gchatbot_status:
            '🤖 *GROUP CHATBOT*\n' +
            '─────────────────────────\n\n' +
            '📌 *Status:* {status}\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:*\n' +
            '  `{prefix}gchatbot on` → Enable karo\n' +
            '  `{prefix}gchatbot off` → Disable karo\n\n' +
            '_Jab ON ho, `{prefix}chat <message>` se bot se baat karo_',
        gchatbot_invalid:
            '❌ *on* ya *off* likho!\n\n📢 *How to use:*\n  `{prefix}gchatbot on`\n  `{prefix}gchatbot off`',
        gchatbot_already:       '🟨 Group chatbot already *{state}* hai!',
        gchatbot_on:
            '🟢 *CHATBOT ON!* 🤖\n\nAb is group mein `{prefix}chat <message>` se bot se baat kar sakte ho!\n\n📢 Band karne ke liye: `{prefix}gchatbot off`',
        gchatbot_off:
            '🔴 *CHATBOT OFF!*\n\nIs group mein chatbot disable ho gaya.\n\n📢 On karne ke liye: `{prefix}gchatbot on`',

        // ── modgive ───────────────────────────────────────────────────────
        modgive_who:
            '❓ *Kise gold dena hai?*\n\n' +
            '💡 *Best:* Target ke message ko *Reply* karo\n' +
            '💡 *Ya:*  WhatsApp @mention select karo\n\n' +
            '📢 *Examples:*\n' +
            '• Reply + `{prefix}modgive 50000`\n' +
            '• `{prefix}modgive @user 50000`\n' +
            '• `{prefix}modgive @user 50000 bank`\n' +
            '• `{prefix}modgive @user set 99999`\n' +
            '• `{prefix}modgive @user reset`',
        modgive_set_no_amount:
            '❌ *Amount likho!*\n\n📢 Usage: `{prefix}modgive @user set <amount> [bank]`',
        modgive_no_amount:
            '❌ *Amount nahi mila!*\n\n' +
            '📢 *Usage:*\n' +
            '• `{prefix}modgive @user 50000`          — wallet mein add\n' +
            '• `{prefix}modgive @user 50000 bank`     — bank mein add\n' +
            '• `{prefix}modgive @user set 99999`      — exact set\n' +
            '• `{prefix}modgive @user reset`          — zero kar do',

        // ── open ──────────────────────────────────────────────────────────
        open_admin_only:
            '❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* `{prefix}open`',
        open_already:
            '⚠️ *Group pehle se open hai!*\n\n📢 Close karne ke liye: `{prefix}close`',
        open_done:
            '🔓 *GROUP OPEN!*\n\nAb sab members message kar sakte hain.\n\n📢 *How to use:* `{prefix}open`\n_Band karne ke liye: `{prefix}close`_',

        // ── promote ───────────────────────────────────────────────────────
        promote_admin_only:
            '❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* `{prefix}promote @user`',
        promote_tag_or_quote:
            '❌ Kisi ko tag ya quote karo!\n\n📢 *How to use:* `{prefix}promote @user`',
        promote_skip_already_admin: '⚠️ Skipped @{user} — pehle se admin hai',
        promote_success:            '✅ Promoted @{user} to admin',
        promote_fail:               '❌ @{user} promote nahi hua',

        // ── remove ────────────────────────────────────────────────────────
        remove_admin_only:
            '❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* `{prefix}remove @user`',
        remove_tag_or_quote:
            '❌ Kisi ko tag ya quote karo!\n\n📢 *How to use:* `{prefix}remove @user`',
        remove_skip_owner:  '⚠️ Skipped @{user} — group owner hai',
        remove_success:     '✅ Removed @{user}',
        remove_fail:        '❌ @{user} remove nahi hua',

        // ── rules ─────────────────────────────────────────────────────────
        rules_group_only:   '❌ Ye command sirf groups mein use hoti hai!',
        rules_none:
            '📜 *GROUP RULES*\n' +
            '─────────────────────────\n\n' +
            '⚠️ Abhi tak koi rules set nahi hain!\n\n' +
            '─────────────────────────\n' +
            '📢 Rules set karne ke liye (admin only):\n' +
            '  `{prefix}setrules <rules likho>`',
        rules_show:
            '📜 *GROUP RULES* 📜\n' +
            '─────────────────────────\n\n' +
            '{rules}\n\n' +
            '─────────────────────────\n' +
            '📢 *How to use:* `{prefix}rules`\n' +
            '_Rules update karne ke liye (admin): `{prefix}setrules <text>`_',

        // ── setrules ──────────────────────────────────────────────────────
        setrules_group_only:    '❌ Ye command sirf groups mein use hoti hai!',
        setrules_admin_only:
            '❌ *Sirf admins rules set kar sakte hain!*\n\n📢 *How to use:* `{prefix}setrules <rules>`',
        setrules_no_content:
            '📝 *SET GROUP RULES*\n\n' +
            'Group ke rules set karo!\n\n' +
            '📢 *How to use:*\n' +
            '`{prefix}setrules\n1. Spam mat karo\n2. Sab ka respect karo\n3. No NSFW\n4. Links allowed nahi`\n\n' +
            '_Rules dekhne ke liye: `{prefix}rules`_',
        setrules_done:
            '✅ *RULES SET!* ✅\n' +
            '─────────────────────────\n\n' +
            '📜 *Rules:*\n{rules}\n\n' +
            '─────────────────────────\n' +
            '📢 Rules dekhne ke liye: `{prefix}rules`',

        // ── tagall ────────────────────────────────────────────────────────
        tagall_group_only:  '❌ Ye command sirf groups mein use hoti hai!',
        tagall_admin_only:
            '❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* `{prefix}tagall [message]`',

        // ── warn ──────────────────────────────────────────────────────────
        warn_group_only:    '❌ Ye command sirf groups mein use hoti hai!',
        warn_admin_only:
            '❌ *Sirf admins use kar sakte hain!*\n\n📢 *How to use:* `{prefix}warn @user [reason]`',
        warn_tag_or_quote:
            '❌ Kisi ko tag ya quote karo!\n\n📢 *How to use:* `{prefix}warn @user spam kar raha tha`',
        warn_self:          '❌ Apne aap ko warn nahi kar sakte!',
        warn_mod:           '❌ Mods ko warn nahi kar sakte!',
        warn_admin:         '❌ Admins ko warn nahi kar sakte!',
        warn_at_limit:      '\n\n🚫 *{max} warnings pe auto-remove kar diya!*',
        warn_at_limit_fail: '\n\n⚠️ {max} warnings ho gayi! Bot admin hona chahiye auto-remove ke liye.',

        // ── warnings ──────────────────────────────────────────────────────
        warnings_group_only:    '❌ Ye command sirf groups mein use hoti hai!',
        warnings_none:
            '✅ @{user} ke koi warnings nahi hain is group mein!\n\n📢 *How to use:* `{prefix}warnings @user`',

        // ── welcome ───────────────────────────────────────────────────────
        welcome_status:
            '┌───□ *WELCOME FEATURE* □\n' +
            '├◇ 📌 *Status:* {status}\n' +
            '├◇ 👥 *Group:* {group}\n' +
            '└──────────────────□\n\n' +
            '💡 *Usage:*\n' +
            '  `{prefix}welcome on` → Enable\n' +
            '  `{prefix}welcome off` → Disable\n\n' +
            '📝 _Jab koi join ya leave karega toh bot message bhejega_',
        welcome_invalid:
            '❌ Invalid option!\n\nUse:\n  `{prefix}welcome on` → Enable\n  `{prefix}welcome off` → Disable',
        welcome_already:    '🟨 Welcome feature is already *{state}* in this group!',
        welcome_on:
            '🟢 *Welcome feature ON!*\n\n' +
            'Ab jab koi group join karega → Welcome message aayega 🎉\n' +
            'Jab koi leave karega → Farewell message aayega 👋\n\n' +
            '_Disable karne ke liye:_ `{prefix}welcome off`',
        welcome_off:
            '🔴 *Welcome feature OFF!*\n\n' +
            'Ab join/leave par koi message nahi aayega.\n\n' +
            '_Enable karne ke liye:_ `{prefix}welcome on`',
    }
}
