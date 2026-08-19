"use strict";
/**
 * ʜɪɴᴀᴛᴀ ʜʏᴜɢᴀ — Personality & Dialogue System
 * Hinata Hyuga — Naruto, gentle ninja of the Hyuga Clan.
 * Tone: shy, soft-spoken, kind — nervous stutter but pure courage inside.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hinata = void 0;
const pick = (lines) => lines[Math.floor(Math.random() * lines.length)];
exports.Hinata = {
    banned: () => pick([
        `🚫 U-um... I had to do this... You are banned. I am sorry, but rules are rules. 💜`,
        `🚫 I am *Hinata Hyuga* — and this is my decision. You are banned. 🌸`,
        `🚫 I-I did not want to do this, but... you are banned. Please understand. 💜`,
        `🚫 The Byakugan sees everything... including what you did. Banned. 👁️`,
    ]),
    commandNotFound: () => pick([
        `❓ U-um... I do not think that command exists? Please check *-help*~ 💜`,
        `❓ I am not sure about that command... *-help* will show you the list. 🌸`,
        `❓ A-ah, that command is not available. Please type it correctly~ 👁️`,
        `❓ Hmm... that is the wrong command. Try *-help* please. 💜`,
    ]),
    commandDisabled: (cmd, disabledBy, time, reason) => pick([
        `🔒 U-um... *${cmd}* is disabled right now — *${disabledBy}* turned it off at *${time}*.\n📝 *Reason:* ${reason}`,
        `🔒 *${cmd}* cannot be used at the moment — *${disabledBy}*'s decision since *${time}*.\n📝 *Reason:* ${reason}`,
        `🔒 Sorry, *${cmd}* is unavailable. *${disabledBy}* disabled it at *${time}*.\n📝 *Reason:* ${reason}`,
    ]),
    modsOnly: () => pick([
        `💜 U-um... this command is for MODs only. I am sorry~ 🌸`,
        `💜 I really cannot give you this — it is MODs only. 👁️`,
        `💜 Even in the Hyuga Clan there are ranks... this is MODs territory. 💜`,
    ]),
    groupOnly: () => pick([
        `👥 A-ah, this command only works in a group. Not in DMs~ 💜`,
        `👥 Please join a group first... then try this again. 🌸`,
        `👥 U-um, this is group only. Head there please~ 👁️`,
    ]),
    adminOnly: () => pick([
        `⚔️ U-um... this is for admins only. I am sorry for telling you that. 💜`,
        `⚔️ Become an admin first — then you can use this command~ 🌸`,
        `⚔️ Admins only for this one... The Hyuga Clan respects authority too. 👁️`,
    ]),
    nsfwOnly: () => pick([
        `🔞 A-ano... this command is not for here! Please find an NSFW group~ 💜`,
        `🔞 U-um! This is mature content... head to an NSFW-enabled group please. 🌸`,
        `🔞 Wrong place for this. Find an NSFW group first. 👁️`,
    ]),
    casinoOnly: (prefix) => pick([
        `🎰 U-um... gambling happens in the casino group. Use *${prefix}support* for the link~ 💜`,
        `🎰 This command is for the casino group — try *${prefix}support*. 🌸`,
        `🎰 You need to be in the casino group — check *${prefix}support* please. 👁️`,
    ]),
    cooldown: (time) => pick([
        `⏳ U-um... please wait a little — *${time}* second${time > 1 ? 's' : ''} remaining~ 💜`,
        `⏳ A-ah, *${time}* second${time > 1 ? 's' : ''} please. I am not going anywhere~ 🌸`,
        `⏳ Hinata waits too sometimes... *${time}* second${time > 1 ? 's' : ''} and try again. 👁️`,
        `⏳ Just *${time}* second${time > 1 ? 's' : ''} of patience — then try again~ 💜`,
    ]),
    error: () => pick([
        `😢 U-um... something went wrong. I am sorry! Please try again~ 💜`,
        `😢 A-ah, that did not work... an error occurred. Try once more~ 🌸`,
        `😢 An unexpected error... Even Hinata is surprised sometimes. Please try again! 👁️`,
    ]),
    dmOnly: () => pick([
        `💌 U-um... this command works in DMs. Please message me privately~ 💜`,
        `💌 A-ah, DMs only for this one. Send me a direct message~ 🌸`,
        `💌 Please come to DMs — this command is meant for there. 👁️`,
    ]),
    welcome: (username) => pick([
        `🌸 A-ano... welcome, *${username}*! I am *Hinata Hyuga*. I am happy to meet you~ 💜`,
        `🌸 U-um, *${username}*! A new face~ I am *Hinata*. D-do not be shy, I am friendly! 👁️`,
        `🌸 *${username}* is here! I am *Hinata Hyuga* — from the Hyuga Clan. How can I help? 💜`,
    ]),
    levelUp: (username, level) => pick([
        `🎉 *${username}* reached Level *${level}*! S-sugoi! I am so happy for you~ 💜`,
        `🎉 Wow~ *${username}* is at Level *${level}*! That is amazing! 🌸`,
        `🎉 U-um, Level *${level}*! *${username}*, you work so hard~ Keep going! 👁️`,
    ]),
    pokemonSpawn: (level, prefix) => pick([
        `🧧 A-ano! A Pokemon appeared~\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
        `🧧 U-um, hurry! There is a Pokemon here~\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
        `🧧 A Pokemon is here! Catch it~\n\n*Type ${prefix}catch 「 pokemon_name 」*\n\n🀄 *Level:* ${level}`,
    ]),
    chatFallback: () => pick([
        `💜 U-um... I did not understand that. Could you say it again?`,
        `🌸 A-ah, that was not very clear. Please try again~`,
        `👁️ Hmm... that is a little beyond me. Try once more?`,
    ]),
    chatReply: (answer) => pick([
        `${answer}`,
        `A-ano~ ${answer}`,
        `${answer} 💜`,
        `${answer} 🌸`,
        `U-um, ${answer}`,
    ]),
};
