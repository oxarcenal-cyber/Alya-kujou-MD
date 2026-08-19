"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devCmds = void 0;
exports.devCmds = {
    en: {
        // ban
        cmd_ban_desc: 'Ban or unban users from using the bot 🚦',
        cmd_ban_usage: 'ban --action=[ban/unban] [tag/quote users]',
        // broadcast
        cmd_broadcast_desc: 'Broadcast a message to all groups 📢',
        cmd_broadcast_usage: 'broadcast [message or reply to media]',
        // chatbot
        cmd_chatbot_desc: 'Enable or disable the private message chatbot feature 🤖',
        cmd_chatbot_usage: 'chatbot enable/disable',
        // eval
        cmd_eval_desc: 'Evaluates JavaScript code 💻',
        cmd_eval_usage: 'eval [JavaScript code]',
        // groups
        cmd_groups_desc: 'List all groups and their wild/chara spawn status — toggle from here 📋',
        cmd_groups_usage: 'groups [wild/chara off <jid>]',
        // join
        cmd_join_desc: 'Join a group via an invite link 🔗',
        cmd_join_usage: 'join [invite link or reply to message with link]',
        // pm
        cmd_pm_desc: 'Promote a tagged user to admin 🏮',
        cmd_pm_usage: 'pm [tag/quote user]',
        // rc
        cmd_rc_desc: 'Reset (set) the gold/crystal balance of a tagged user 💎',
        cmd_rc_usage: 'rc [tag/quote user] [amount]',
        // setcasino
        cmd_setcasino_desc: 'Set the current group as the casino group 🎰',
        cmd_setcasino_usage: 'setcasino [yes]',
        // setprefix
        cmd_setprefix_desc: 'Replace the bot command prefix with a new one 🚥',
        cmd_setprefix_usage: 'setprefix [new_prefix]',
        // settheme
        cmd_settheme_desc: "Switch the bot's global personality/theme (Rias Gremory or Alya Kujou) 🎭",
        cmd_settheme_usage: 'settheme <rias|alya>',
        // spawnctl
        cmd_spawnctl_desc: 'Pause or resume Pokémon and Character spawning globally ⚙️',
        cmd_spawnctl_usage: 'spawnctl <pokemon/chara/all> <on/off>',
        // switch
        cmd_switch_desc: 'Switch which bot is active in the group 🔄',
        cmd_switch_usage: 'switch [bot name / all]',
        // toggle
        cmd_toggle_desc: 'Enable or disable a specific command globally 🔁',
        cmd_toggle_usage: 'toggle --command=[command_name] --state=[disable/enable] | <reason>'
    },
    hi: {
        // ban
        cmd_ban_desc: 'Users ko ban ya unban karo bot se 🚦',
        cmd_ban_usage: 'ban --action=[ban/unban] [tag/quote users]',
        // broadcast
        cmd_broadcast_desc: 'Sabhi groups mein ek message broadcast karo 📢',
        cmd_broadcast_usage: 'broadcast [message ya media reply]',
        // chatbot
        cmd_chatbot_desc: 'Private DM mein chatbot feature enable/disable karo 🤖',
        cmd_chatbot_usage: 'chatbot enable/disable',
        // eval
        cmd_eval_desc: 'JavaScript code evaluate karo 💻',
        cmd_eval_usage: 'eval [JavaScript code]',
        // groups
        cmd_groups_desc: 'Sabhi groups ki list dekho aur wild/chara spawn status toggle karo 📋',
        cmd_groups_usage: 'groups [wild/chara off <jid>]',
        // join
        cmd_join_desc: 'Invite link se group join karo 🔗',
        cmd_join_usage: 'join [invite link ya message reply]',
        // pm
        cmd_pm_desc: 'Tagged user ko admin promote karo 🏮',
        cmd_pm_usage: 'pm [tag/quote user]',
        // rc
        cmd_rc_desc: 'Tagged user ka gold/crystal balance reset (set) karo 💎',
        cmd_rc_usage: 'rc [tag/quote user] [amount]',
        // setcasino
        cmd_setcasino_desc: 'Is group ko casino group set karo 🎰',
        cmd_setcasino_usage: 'setcasino [yes]',
        // setprefix
        cmd_setprefix_desc: 'Bot ka command prefix badlo 🚥',
        cmd_setprefix_usage: 'setprefix [new_prefix]',
        // settheme
        cmd_settheme_desc: 'Bot ki global personality/theme switch karo (Rias Gremory ya Alya Kujou) 🎭',
        cmd_settheme_usage: 'settheme <rias|alya>',
        // spawnctl
        cmd_spawnctl_desc: 'Globally Pokémon aur Character spawning pause ya resume karo ⚙️',
        cmd_spawnctl_usage: 'spawnctl <pokemon/chara/all> <on/off>',
        // switch
        cmd_switch_desc: 'Group mein active bot switch karo 🔄',
        cmd_switch_usage: 'switch [bot name / all]',
        // toggle
        cmd_toggle_desc: 'Kisi bhi command ko globally enable ya disable karo 🔁',
        cmd_toggle_usage: 'toggle --command=[command_name] --state=[disable/enable] | <reason>'
    }
};
