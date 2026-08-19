"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderationCmds = void 0;
exports.moderationCmds = {
    en: {
        // antilink
        cmd_antilink_desc: 'Enable/disable anti-invite-link feature 🔗',
        cmd_antilink_usage: 'antilink on || antilink off || antilink',
        // autoreact
        cmd_autoreact_desc: 'Auto-react with a random emoji on every message 🎭',
        cmd_autoreact_usage: 'autoreact on | autoreact off | autoreact mode <all/regular/anime>',
        // clearwarn
        cmd_clearwarn_desc: 'Clear all warnings of a user ✅',
        cmd_clearwarn_usage: 'clearwarn [@user / quote user]',
        // close
        cmd_close_desc: 'Close the group — only admins can send messages 🔒',
        cmd_close_usage: 'close',
        // delete
        cmd_delete_desc: 'Delete the quoted message',
        cmd_delete_usage: 'delete [quote the message]',
        // demote
        cmd_demote_desc: 'Demote an admin to regular member 📉',
        cmd_demote_usage: 'demote [@user / quote user]',
        // dxdchat
        cmd_dxdchat_desc: 'Enable/disable High School DxD character auto-chat for this group 🐉',
        cmd_dxdchat_usage: 'dxdchat on || dxdchat off || dxdchat',
        // dxdgreet
        cmd_dxdgreet_desc: 'Enable/disable High School DxD auto good morning/afternoon/evening/night greetings 🌙',
        cmd_dxdgreet_usage: 'dxdgreet on || dxdgreet off || dxdgreet',
        // gchatbot
        cmd_gchatbot_desc: 'Enable/disable chatbot for this group 🤖',
        cmd_gchatbot_usage: 'gchatbot on || gchatbot off || gchatbot',
        // modgive
        cmd_modgive_desc: '[MOD ONLY] Give / set / reset gold for any user',
        cmd_modgive_usage: 'modgive @user <amount> [bank] | modgive @user set <amount> [bank] | modgive @user reset',
        // open
        cmd_open_desc: 'Open the group — everyone can send messages 🔓',
        cmd_open_usage: 'open',
        // ping
        cmd_ping_desc: 'Check the bot response latency',
        cmd_ping_usage: 'ping',
        // promote
        cmd_promote_desc: 'Promote a member to admin 📈',
        cmd_promote_usage: 'promote [@user / quote user]',
        // remove
        cmd_remove_desc: 'Remove a user from the group 🚫',
        cmd_remove_usage: 'remove [@user / quote user]',
        // rules
        cmd_rules_desc: 'Show the group rules 📜',
        cmd_rules_usage: 'rules',
        // setrules
        cmd_setrules_desc: 'Set group rules — admin only 📝',
        cmd_setrules_usage: 'setrules <rules text>',
        // set
        cmd_set_desc: 'Enable/disable a certain group feature',
        cmd_set_usage: 'set',
        // spawn
        cmd_spawn_desc: 'Enable or disable Card / Pokémon spawning for this group',
        cmd_spawn_usage: 'spawn cards on/off | spawn wild on/off | spawn all on/off | spawn status',
        // tagall
        cmd_tagall_desc: 'Tag all members in the group 📢',
        cmd_tagall_usage: 'tagall [message]',
        // warnings
        cmd_warnings_desc: 'Check warnings of a user in the group 📋',
        cmd_warnings_usage: 'warnings [@user / quote user]',
        // warn
        cmd_warn_desc: 'Warn a user in the group ⚠️ (3 warnings = auto-remove)',
        cmd_warn_usage: 'warn [@user / quote user] [reason]',
        // langlist
        cmd_langlist_desc: 'Preview how bot messages look in English and Hindi side-by-side 🌐',
        cmd_langlist_usage: 'langlist',
        // langstats
        cmd_langstats_desc: 'Show Hindi translation coverage for every command category 📊',
        cmd_langstats_usage: 'langstats',
        // welcome
        cmd_welcome_desc: 'Enable or disable welcome/farewell messages for this group',
        cmd_welcome_usage: 'welcome on || welcome off || welcome',
    },
    hi: {
        // antilink
        cmd_antilink_desc: 'Group mein invite link share karne ki feature enable/disable karo 🔗',
        cmd_antilink_usage: 'antilink on || antilink off || antilink',
        // autoreact
        cmd_autoreact_desc: 'Har message par random emoji auto-react lagao 🎭',
        cmd_autoreact_usage: 'autoreact on | autoreact off | autoreact mode <all/regular/anime>',
        // clearwarn
        cmd_clearwarn_desc: 'Kisi user ki saari warnings clear karo ✅',
        cmd_clearwarn_usage: 'clearwarn [@user / user ko quote karo]',
        // close
        cmd_close_desc: 'Group band karo — sirf admins message kar sakte hain 🔒',
        cmd_close_usage: 'close',
        // delete
        cmd_delete_desc: 'Quote kiya hua message delete karo',
        cmd_delete_usage: 'delete [message quote karo]',
        // demote
        cmd_demote_desc: 'Admin ko regular member banana 📉',
        cmd_demote_usage: 'demote [@user / user ko quote karo]',
        // dxdchat
        cmd_dxdchat_desc: 'Is group mein High School DxD character auto-chat enable/disable karo 🐉',
        cmd_dxdchat_usage: 'dxdchat on || dxdchat off || dxdchat',
        // dxdgreet
        cmd_dxdgreet_desc: 'High School DxD style auto good morning/afternoon/evening/night greetings enable/disable karo 🌙',
        cmd_dxdgreet_usage: 'dxdgreet on || dxdgreet off || dxdgreet',
        // gchatbot
        cmd_gchatbot_desc: 'Is group ke liye chatbot enable/disable karo 🤖',
        cmd_gchatbot_usage: 'gchatbot on || gchatbot off || gchatbot',
        // modgive
        cmd_modgive_desc: '[SIRF MOD] Kisi bhi user ko gold do / set karo / reset karo',
        cmd_modgive_usage: 'modgive @user <amount> [bank] | modgive @user set <amount> [bank] | modgive @user reset',
        // open
        cmd_open_desc: 'Group kholo — sab members message kar sakte hain 🔓',
        cmd_open_usage: 'open',
        // ping
        cmd_ping_desc: 'Bot ki response latency check karo',
        cmd_ping_usage: 'ping',
        // promote
        cmd_promote_desc: 'Member ko admin banana 📈',
        cmd_promote_usage: 'promote [@user / user ko quote karo]',
        // remove
        cmd_remove_desc: 'User ko group se remove karo 🚫',
        cmd_remove_usage: 'remove [@user / user ko quote karo]',
        // rules
        cmd_rules_desc: 'Group ke rules dikhao 📜',
        cmd_rules_usage: 'rules',
        // setrules
        cmd_setrules_desc: 'Group rules set karo — sirf admin 📝',
        cmd_setrules_usage: 'setrules <rules text>',
        // set
        cmd_set_desc: 'Group ki koi feature enable/disable karo',
        cmd_set_usage: 'set',
        // spawn
        cmd_spawn_desc: 'Is group mein Card / Pokémon spawning enable ya disable karo',
        cmd_spawn_usage: 'spawn cards on/off | spawn wild on/off | spawn all on/off | spawn status',
        // tagall
        cmd_tagall_desc: 'Group ke sabhi members ko tag karo 📢',
        cmd_tagall_usage: 'tagall [message]',
        // warnings
        cmd_warnings_desc: 'Group mein kisi user ki warnings check karo 📋',
        cmd_warnings_usage: 'warnings [@user / user ko quote karo]',
        // warn
        cmd_warn_desc: 'Group mein kisi user ko warn karo ⚠️ (3 warnings = auto-remove)',
        cmd_warn_usage: 'warn [@user / user ko quote karo] [reason]',
        // langlist
        cmd_langlist_desc: 'Bot ke messages English aur Hindi dono mein side-by-side dekho 🌐',
        cmd_langlist_usage: 'langlist',
        // langstats
        cmd_langstats_desc: 'Har command category mein Hindi translation ka coverage dekho 📊',
        cmd_langstats_usage: 'langstats',
        // welcome
        cmd_welcome_desc: 'Is group mein welcome/farewell messages enable ya disable karo',
        cmd_welcome_usage: 'welcome on || welcome off || welcome',
    }
};
