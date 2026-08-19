"use strict";
/**
 * LANG — Fun category reply text.
 * Populate this as fun commands are migrated to the t() system.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fun = void 0;
exports.fun = {
    en: {
        // chat
        fun_chat_not_configured: '❌ *Chat Bot is not configured!*\n\n📢 Bot owner needs to set OPENAI_API_KEY in src/config.ts.',
        fun_chat_disabled_group: '❌ *Chatbot is off in this group!*\n\n📢 Ask an admin to enable it:\n  `{prefix}gchatbot on`',
        fun_chat_prompt: '🤖 *CHAT BOT*\n\nAsk me anything — I\'ll reply!\n\n📢 *How to use:*\n  `{prefix}chat hello`\n  `{prefix}chat what is your name?`\n  `{prefix}chat tell me a joke`',
        // compliment
        fun_compliment_footer: '_For a roast: `{prefix}roast @user`_',
        // dare
        fun_dare_footer: '📢 *How to use:* `{prefix}dare` | `{prefix}truth`',
        // dxd
        fun_dxd_list_footer: '📢 *How to use:* `{prefix}dxd Rias` or `{prefix}dxd` (random)',
        fun_dxd_not_found: '❌ *Character not found!*\n\n📢 *How to use:*\n  `{prefix}dxd` → random character\n  `{prefix}dxd Rias` → specific character\n  `{prefix}dxd list` → see all characters',
        // 8ball
        fun_8ball_prompt: '🎱 *MAGIC 8-BALL*\n\nAsk any yes/no question!\n\n📢 *How to use:* `{prefix}8ball will I be lucky today?`',
        fun_8ball_footer: '📢 *How to use:* `{prefix}8ball <question>`',
        // joke
        fun_joke_not_found: '❌ Joke not found. Try again!',
        fun_joke_fetch_failed: '❌ Could not fetch joke. Try again later!',
        fun_joke_footer: '_Also try: `{prefix}meme` | `{prefix}fact` | `{prefix}roast @user`_',
        // meme
        fun_meme_not_found: '❌ Meme not found. Try again!',
        fun_meme_nsfw: '❌ NSFW meme received, skipping! Try again.',
        fun_meme_fetch_failed: '❌ Could not fetch meme. Try again later!',
        // quote
        fun_quote_not_found: '❌ Quote not found. Try again!',
        fun_quote_fetch_failed: '❌ Could not fetch quote. Try again later!',
        fun_quote_footer: '_Also try: `{prefix}fact` | `{prefix}joke`_',
        // fact
        fun_fact_not_found: '❌ Fact not found. Try again!',
        fun_fact_fetch_failed: '❌ Could not fetch fact. Try again later!',
        fun_fact_menu_new: 'Get a new random fact',
        fun_fact_menu_joke: 'Hear a funny joke',
        fun_fact_menu_quote: 'Read an inspiring quote',
        // roast
        fun_roast_footer: '_For a compliment: `{prefix}compliment @user`_',
        // roastbattle
        fun_rb_group_only: '❌ Roast Battle is only available in groups!',
        fun_rb_no_pending: '❌ No pending roast battle!\n📢 Challenge: `{prefix}rb @user`',
        fun_rb_not_for_you: '❌ This battle is not for you!\n⚔️ *{challenger}* challenged someone else.',
        fun_rb_expired: '⏰ Battle challenge has expired!',
        fun_rb_battle_starting: '_Battle is starting... 3 rounds!_',
        fun_rb_no_pending_cancel: '❌ No pending battle!',
        fun_rb_only_challenger_cancel: '❌ Only the challenger can cancel!',
        fun_rb_cancelled: '🛑 Roast Battle cancelled!',
        fun_rb_tag_someone: '❌ Tag someone!\n📢 Example: `{prefix}rb @user`',
        fun_rb_already_pending: '❌ A battle is already pending!\n📢 Cancel: `{prefix}rb cancel`',
        fun_rb_self: '❌ Roast battle with yourself? Either way you\'d get roasted on both sides 😂',
        fun_rb_bot: '❌ Can\'t roast battle with the bot! 🤖',
        fun_rb_accept_question: 'Do you accept? 🎭',
        fun_rb_ignore_note: '❌ Ignore → expires in 60s',
        // wouldyourather
        fun_wyr_reply_prompt: 'A or B? Reply below! 👇',
    },
    hi: {
        // chat
        fun_chat_not_configured: '❌ *Chat Bot abhi configure nahi hai!*\n\n📢 Bot owner ko src/config.ts mein OPENAI_API_KEY set karni hogi.',
        fun_chat_disabled_group: '❌ *Is group mein chatbot off hai!*\n\n📢 Admin se kehdo enable karne ke liye:\n  `{prefix}gchatbot on`',
        fun_chat_prompt: '🤖 *CHAT BOT*\n\nKuch bhi pucho — main jawab dungi!\n\n📢 *How to use:*\n  `{prefix}chat hello`\n  `{prefix}chat what is your name?`\n  `{prefix}chat tell me a joke`',
        // compliment
        fun_compliment_footer: '_Roast ke liye: `{prefix}roast @user`_',
        // dare
        fun_dare_footer: '📢 *How to use:* `{prefix}dare` | `{prefix}truth`',
        // dxd
        fun_dxd_list_footer: '📢 *How to use:* `{prefix}dxd Rias` ya `{prefix}dxd` (random)',
        fun_dxd_not_found: '❌ *Ye character nahi mila!*\n\n📢 *How to use:*\n  `{prefix}dxd` → random character\n  `{prefix}dxd Rias` → specific character\n  `{prefix}dxd list` → sabhi characters dekho',
        // 8ball
        fun_8ball_prompt: '🎱 *MAGIC 8-BALL*\n\nKoi bhi yes/no sawaal pucho!\n\n📢 *How to use:* `{prefix}8ball kya aaj meri luck achi hai?`',
        fun_8ball_footer: '📢 *How to use:* `{prefix}8ball <sawaal>`',
        // joke
        fun_joke_not_found: '❌ Joke nahi mila. Try again!',
        fun_joke_fetch_failed: '❌ Joke fetch nahi hua. Try again later!',
        fun_joke_footer: '_Aur try karo: `{prefix}meme` | `{prefix}fact` | `{prefix}roast @user`_',
        // meme
        fun_meme_not_found: '❌ Meme nahi mila. Try again!',
        fun_meme_nsfw: '❌ NSFW meme mila, skip! Try again.',
        fun_meme_fetch_failed: '❌ Meme fetch nahi hua. Try again later!',
        // quote
        fun_quote_not_found: '❌ Quote nahi mila. Try again!',
        fun_quote_fetch_failed: '❌ Quote fetch nahi hua. Try again later!',
        fun_quote_footer: '_Aur try karo: `{prefix}fact` | `{prefix}joke`_',
        // fact
        fun_fact_not_found: '❌ Fact nahi mila. Try again!',
        fun_fact_fetch_failed: '❌ Fact fetch nahi hua. Try again later!',
        fun_fact_menu_new: 'Naya Fact laao',
        fun_fact_menu_joke: 'Ek mazedar joke suno',
        fun_fact_menu_quote: 'Ek inspiring quote padho',
        // roast
        fun_roast_footer: '_Compliment ke liye: `{prefix}compliment @user`_',
        // roastbattle
        fun_rb_group_only: '❌ Roast Battle sirf group mein hoti hai!',
        fun_rb_no_pending: '❌ Koi pending roast battle nahi!\n📢 Challenge: `{prefix}rb @user`',
        fun_rb_not_for_you: '❌ Ye battle tumhare liye nahi!\n⚔️ *{challenger}* ne kisi aur ko challenge kiya.',
        fun_rb_expired: '⏰ Battle challenge expire ho gaya!',
        fun_rb_battle_starting: '_Battle shuru ho rahi hai... 3 rounds!_',
        fun_rb_no_pending_cancel: '❌ Koi pending battle nahi!',
        fun_rb_only_challenger_cancel: '❌ Sirf challenger cancel kar sakta hai!',
        fun_rb_cancelled: '🛑 Roast Battle cancel!',
        fun_rb_tag_someone: '❌ Kisi ko tag karo!\n📢 Example: `{prefix}rb @user`',
        fun_rb_already_pending: '❌ Pehle se ek battle pending hai!\n📢 Cancel: `{prefix}rb cancel`',
        fun_rb_self: '❌ Khud se roast battle? Waise bhi tujhe dono sides ka roast milega 😂',
        fun_rb_bot: '❌ Bot se roast battle nahi hoti! 🤖',
        fun_rb_accept_question: 'kya tum accept karte ho? 🎭',
        fun_rb_ignore_note: '❌ Ignore → 60s baad expire',
        // wouldyourather
        fun_wyr_reply_prompt: 'A ya B? Reply karo! 👇',
    }
};
