/**
 * LANG — Dev category reply text.
 * Populate this as dev commands are migrated to the t() system.
 */

export const dev = {
    en: {
        // setcasino
        setcasino_group_only: '❌ This command can only be used inside a group!',
        setcasino_set_success:
            '🎰 *CASINO GROUP SET!* ✅\n\n📌 *Group:* {groupName}\n🆔 *JID:* `{groupJid}`\n\nCasino commands will now work in this group!\n\n⚠️ _Permanently saved after bot restart (TypeScript rebuild required)._',
        setcasino_set_runtime:
            '✅ *Set at runtime!*\n\n📌 *Group:* {groupName}\n🆔 *JID:* `{groupJid}`\n\n⚠️ _To save permanently, manually update CASINO_GROUP in `src/config.ts`:_\n`{groupJid}`',
        setcasino_already:
            '🎰 *CASINO GROUP INFO*\n{line}\n\n✅ *This group is already the casino group!*\n\n📌 *Group:* {groupName}\n🆔 *JID:* `{groupJid}`\n\n{line}\n_Casino commands only work here._',
        setcasino_prompt:
            '🎰 *CASINO GROUP SETUP*\n{line}\n\n📌 *Current Group:* {groupName}\n🆔 *Group JID:*\n`{groupJid}`\n\n{line}\n🔄 *Current Casino Group:*\n`{currentCasino}`\n\n{line}\n\n❓ *Do you want to set this group as the casino group?*\n\n✅ Yes → `{prefix}setcasino yes`\n❌ No → Do nothing\n\n_Only mods/owner can use this._',
        setcasino_not_set: 'Not set',

        // settheme
        settheme_current:
            '🎭 *Current theme:* {theme}\n\n📢 To switch: `{prefix}settheme rias` or `{prefix}settheme alya`',
        settheme_invalid: '❌ Only *rias* or *alya* can be chosen.\n📢 Example: `{prefix}settheme alya`',
        settheme_already: '🟨 *{theme}* is already active.',
        settheme_switched:
            '🟩 *Theme switched!*\n\n✨ Bot is now *{theme}* — dialogues, chatbot personality and QR login page have all changed.'
    },
    hi: {
        // setcasino
        setcasino_group_only: '❌ Ye command sirf group ke andar use karo!',
        setcasino_set_success:
            '🎰 *CASINO GROUP SET!* ✅\n\n📌 *Group:* {groupName}\n🆔 *JID:* `{groupJid}`\n\nAb is group mein casino commands kaam karenge!\n\n⚠️ _Bot restart ke baad permanently save hoga (TypeScript rebuild zaruri hai)._',
        setcasino_set_runtime:
            '✅ *Runtime mein set ho gaya!*\n\n📌 *Group:* {groupName}\n🆔 *JID:* `{groupJid}`\n\n⚠️ _Permanently save karne ke liye `src/config.ts` mein manually CASINO_GROUP update karo:_\n`{groupJid}`',
        setcasino_already:
            '🎰 *CASINO GROUP INFO*\n{line}\n\n✅ *Ye group already casino group hai!*\n\n📌 *Group:* {groupName}\n🆔 *JID:* `{groupJid}`\n\n{line}\n_Casino commands sirf yahan kaam karte hain._',
        setcasino_prompt:
            '🎰 *CASINO GROUP SETUP*\n{line}\n\n📌 *Current Group:* {groupName}\n🆔 *Group JID:*\n`{groupJid}`\n\n{line}\n🔄 *Current Casino Group:*\n`{currentCasino}`\n\n{line}\n\n❓ *Kya is group ko casino group set karna chahte ho?*\n\n✅ Haan → `{prefix}setcasino yes`\n❌ Nahi → Kuch mat karo\n\n_Sirf mods/owner use kar sakte hain._',
        setcasino_not_set: 'Set nahi hai',

        // settheme
        settheme_current:
            '🎭 *Current theme:* {theme}\n\n📢 Switch karne ke liye: `{prefix}settheme rias` ya `{prefix}settheme alya`',
        settheme_invalid: '❌ Sirf *rias* ya *alya* choose kar sakte ho.\n📢 Example: `{prefix}settheme alya`',
        settheme_already: '🟨 *{theme}* pehle se hi active hai.',
        settheme_switched:
            '🟩 *Theme switched!*\n\n✨ Bot ab *{theme}* ban gaya hai — dialogues, chatbot personality aur QR login page sab badal gaye.'
    }
}
